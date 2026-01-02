import { AppBar, Box, Container, Toolbar, Typography, Button, Stack, IconButton, Drawer, List, ListItemButton, ListItemText, useMediaQuery, useTheme, Chip } from '@mui/material'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu as MenuIcon, Home, EmojiEvents, History, Gamepad } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { getPseudo } from '../../shared/session/pseudo'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AppShell() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [drawerOpen, setDrawerOpen] = useState(false)

    const pseudo = getPseudo()

    const navItems = [
        { label: t('nav.home'), path: '/', icon: <Home fontSize="small" /> },
        { label: t('nav.scores'), path: '/scores', icon: <EmojiEvents fontSize="small" /> },
        { label: t('nav.history'), path: '/admin/actions', icon: <History fontSize="small" /> },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider'
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ gap: 2, px: { xs: 0 } }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <Gamepad sx={{ color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                GameLy
                            </Typography>
                        </Stack>

                        <Box sx={{ flexGrow: 1 }} />

                        {!isMobile && (
                            <Stack direction="row" spacing={1}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        startIcon={item.icon}
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                                            fontWeight: isActive(item.path) ? 600 : 400,
                                            borderRadius: 2,
                                            px: 2,
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Stack>
                        )}

                        {/* Sélecteur de langue */}
                        <LanguageSwitcher />

                        {pseudo && (
                            <Chip
                                label={pseudo}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    display: { xs: 'none', sm: 'flex' }
                                }}
                            />
                        )}

                        {isMobile && (
                            <IconButton
                                onClick={() => setDrawerOpen(true)}
                                sx={{ color: 'text.primary' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 250, pt: 2 }}>
                    {pseudo && (
                        <Box sx={{ px: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="body2" color="text.secondary">
                                {t('lobby.you')}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {pseudo}
                            </Typography>
                        </Box>
                    )}
                    <List>
                        {navItems.map((item) => (
                            <ListItemButton
                                key={item.path}
                                selected={isActive(item.path)}
                                onClick={() => {
                                    navigate(item.path)
                                    setDrawerOpen(false)
                                }}
                            >
                                <Box sx={{ mr: 2, display: 'flex', color: 'inherit' }}>
                                    {item.icon}
                                </Box>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Outlet />
            </Container>
        </Box>
    )
}