import {Alert, Box, Button, Card, CardContent, Chip, Grid, Paper, Skeleton, Stack, Typography} from '@mui/material'
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Add, Lock, LockOpen, People, SportsEsports} from '@mui/icons-material'
import {useTranslation} from 'react-i18next'
import {getErrorMessage} from '../../../shared/api/http'
import {getOrCreateClientId} from '../../../shared/session/clientId'
import {getPseudo} from '../../../shared/session/pseudo'
import {createLobby, listWaitingLobbies} from '../api/lobbiesApi'
import {useLobbyListRealtime} from '../realtime/useLobbyListRealtime'
import type {LobbyListItemDto} from '../model/types'
import {CreateLobbyDialog, type CreateLobbyForm} from './CreateLobbyDialog'

const gameIcons: Record<string, string> = {
    Morpion: '⚔️',
    Puissance4: '🔴',
    SpeedTyping: '⌨️'
}

export function LobbyListPage() {
    const {t} = useTranslation()
    const nav = useNavigate()
    const pseudo = getPseudo()
    const clientId = getOrCreateClientId()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const {lobbies, setLobbies} = useLobbyListRealtime([])

    useEffect(() => {
        if (!pseudo) {
            nav('/enter')
            return
        }

        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const initial = await listWaitingLobbies()
                setLobbies(initial)
            } catch (e) {
                setError(getErrorMessage(e))
            } finally {
                setLoading(false)
            }
        })()
    }, [nav, pseudo, setLobbies])

    async function onCreate(form: CreateLobbyForm) {
        if (!pseudo) return
        try {
            setError(null)
            const res = await createLobby({
                clientId,
                pseudo,
                gameId: form.gameId,
                isPrivate: form.isPrivate,
                password: form.isPrivate ? form.password : null
            })
            setDialogOpen(false)
            nav(`/lobbies/${res.lobbyId}`)
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    return (
        <Stack spacing={4}>
            {/* Hero Section */}
            <Box>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                        fontSize: {xs: '2rem', md: '3rem'}
                    }}
                >
                    {t('welcome.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                    {t('welcome.subtitle')}
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Add/>}
                    onClick={() => setDialogOpen(true)}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem'
                    }}
                >
                    {t('lobby.create')}
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{borderRadius: 2}}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* Lobbies Section */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 2}}>
                    <SportsEsports sx={{color: 'text.secondary'}}/>
                    <Typography variant="h5" sx={{fontWeight: 700}}>
                        {t('lobby.title')}
                    </Typography>
                    <Chip
                        label={loading ? '...' : lobbies.length}
                        size="small"
                        sx={{fontWeight: 600}}
                    />
                </Stack>

                {loading ? (
                    <Grid container spacing={2}>
                        {[1, 2, 3].map((i) => (
                            <Grid size={{xs: 12, sm: 6, md: 4}} key={i}>
                                <Card sx={{borderRadius: 3}}>
                                    <CardContent>
                                        <Skeleton variant="text" width="60%" height={32}/>
                                        <Skeleton variant="text" width="40%"/>
                                        <Skeleton variant="rectangular" width="100%" height={40}
                                                  sx={{mt: 2, borderRadius: 2}}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : lobbies.length === 0 ? (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 3,
                            border: '2px dashed',
                            borderColor: 'divider',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <SportsEsports sx={{fontSize: 64, color: 'text.disabled', mb: 2}}/>
                        <Typography variant="h6" color="text.secondary" sx={{mb: 1}}>
                            {t('lobby.noLobbies')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('lobby.beFirst')}
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {lobbies.map((lobby: LobbyListItemDto) => (
                            <Grid size={{xs: 12, sm: 6, md: 4}} key={lobby.lobbyId}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        }
                                    }}
                                    onClick={() => nav(`/lobbies/${lobby.lobbyId}`)}
                                >
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Stack direction="row" justifyContent="space-between"
                                                   alignItems="flex-start">
                                                <Box>
                                                    <Stack direction="row" spacing={1} alignItems="center"
                                                           sx={{mb: 0.5}}>
                                                        <Typography variant="h6" sx={{fontWeight: 700}}>
                                                            {gameIcons[lobby.gameId]} {lobby.gameId}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {t('lobby.by')} {lobby.hostPseudo}
                                                    </Typography>
                                                </Box>

                                                {lobby.isPrivate ? (
                                                    <Lock fontSize="small" color="action"/>
                                                ) : (
                                                    <LockOpen fontSize="small" color="action"/>
                                                )}
                                            </Stack>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <People fontSize="small" color="action"/>
                                                <Typography variant="body2" color="text.secondary">
                                                    {t('lobby.players', {count: lobby.playersCount})}
                                                </Typography>
                                            </Stack>

                                            <Button
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {t('common.join')}
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <CreateLobbyDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={onCreate}
            />
        </Stack>
    )
}