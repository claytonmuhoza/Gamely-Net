// src/components/UI/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Zap, Menu as MenuIcon, User } from 'lucide-react';
import PseudoModal from "./PseudoModal.tsx";
import { Link as RouterLink } from 'react-router-dom';

const routes = [
  { path: '/', label: 'Accueil' },
    {path: '/lobbies', label: 'Lobbies' },
  { path: '/jeux', label: 'Jeux' },
];

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [userPseudo, setUserPseudo] = useState('');

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmitPseudo = (pseudo: string) => {
    setUserPseudo(pseudo);
    console.log('Pseudo enregistré:', pseudo);
    setModalOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(to bottom right, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <Zap color="white" size={22} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            Gamely
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'right', flexGrow: 1 }}>
            {routes.map((route) => (
              <Button
                key={route.path}
                component={RouterLink}
                to={route.path}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': { color: '#a855f7' },
                  textTransform: 'none',
                }}
              >
                {route.label}
              </Button>
            ))}
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                '&:hover': { background: 'linear-gradient(to right, #a855f7, #f472b6)' },
                py: '6px',
                px: '14px',
                borderRadius: 2,
                boxShadow: 'none',
                '& .lucide': { display: 'inline-flex' },
                transition: 'transform 120ms, box-shadow 120ms',
                '&:active': { transform: 'translateY(1px)' },
              }}
              startIcon={<User size={18} />}
            >
              {userPseudo || 'Connexion'}
            </Button>
          </Box>
        )}

        {isMobile && (
          <>
            <IconButton sx={{ color: 'white' }} onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#0f172a',
                  color: 'white',
                  minWidth: 200,
                },
              }}
            >
              {routes.map((route) => (
                <MenuItem
                  key={route.path}
                  component={RouterLink}
                  to={route.path}
                  onClick={handleMenuClose}
                  sx={{
                    '&:hover': { color: '#a855f7', backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  {route.label}
                </MenuItem>
              ))}
              <MenuItem>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleOpenModal}
                  sx={{
                    mt: 1,
                    background: 'linear-gradient(to right, #9333ea, #ec4899)',
                    textTransform: 'none',
                  }}
                >
                  {userPseudo || 'Connexion'}
                </Button>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>

      <PseudoModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmitPseudo} />
    </AppBar>
  );
};

export default Header;