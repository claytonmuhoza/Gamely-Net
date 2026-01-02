import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Box,
    IconButton
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Close } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export type CreateLobbyForm = {
    gameId: 'Morpion' | 'Puissance4' | 'SpeedTyping'
    isPrivate: boolean
    password: string
}

export function CreateLobbyDialog(props: {
    open: boolean
    onClose: () => void
    onSubmit: (form: CreateLobbyForm) => Promise<void>
}) {
    const { t } = useTranslation()
    const [gameId, setGameId] = useState<CreateLobbyForm['gameId']>('Morpion')
    const [isPrivate, setIsPrivate] = useState(false)
    const [password, setPassword] = useState('')

    const games = useMemo(() => [
        { id: 'Morpion' as const, label: t('games.morpion.name'), icon: '⚔️', desc: t('games.morpion.desc') },
        { id: 'Puissance4' as const, label: t('games.puissance4.name'), icon: '🔴', desc: t('games.puissance4.desc') },
        { id: 'SpeedTyping' as const, label: t('games.speedtyping.name'), icon: '⌨️', desc: t('games.speedtyping.desc') }
    ], [t])

    const canSubmit = useMemo(() => {
        if (!isPrivate) return true
        return password.trim().length >= 4
    }, [isPrivate, password])

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {t('lobby.createTitle')}
                    </Typography>
                    <IconButton onClick={props.onClose} size="small">
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}
                        >
                            {t('games.chooseGame')}
                        </Typography>
                        <ToggleButtonGroup
                            value={gameId}
                            exclusive
                            onChange={(_, value) => value && setGameId(value)}
                            fullWidth
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 1,
                                '& .MuiToggleButton-root': {
                                    borderRadius: 2,
                                    border: '2px solid',
                                    borderColor: 'divider',
                                    textTransform: 'none',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                    py: 2,
                                    '&.Mui-selected': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'primary.50'
                                    }
                                }
                            }}
                        >
                            {games.map((game) => (
                                <ToggleButton key={game.id} value={game.id}>
                                    <Typography sx={{ fontSize: 32, lineHeight: 1 }}>
                                        {game.icon}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {game.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {game.desc}
                                    </Typography>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: isPrivate ? 'action.hover' : 'transparent'
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                            }
                            label={
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {t('games.privateToggle')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {t('games.privateDesc')}
                                    </Typography>
                                </Stack>
                            }
                        />

                        {isPrivate && (
                            <TextField
                                label={t('lobby.passwordLabel')}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                helperText={t('lobby.minPassword', { min: 4 })}
                                fullWidth
                                sx={{
                                    mt: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        )}
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={props.onClose}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    variant="contained"
                    disabled={!canSubmit}
                    onClick={() => props.onSubmit({ gameId, isPrivate, password })}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {t('lobby.createLobby')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}