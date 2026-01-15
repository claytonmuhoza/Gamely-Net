import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    TextField,
    Typography,
    Box,
    Avatar,
    Paper,
    IconButton
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowBack, PlayArrow, Person, Lock, LockOpen, ExitToApp, ContentCopy } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../../shared/api/http'
import { getOrCreateClientId } from '../../../shared/session/clientId'
import { getPseudo } from '../../../shared/session/pseudo'
import { getLobbyDetails, joinLobby, leaveLobby, startLobbyGame } from '../api/lobbiesApi'
import { useLobbyRealtime } from '../realtime/useLobbyRealtime'

const gameIcons: Record<string, string> = {
    Morpion: '⚔️',
    Puissance4: '🔴',
    SpeedTyping: '⌨️'
}

export function LobbyRoomPage() {
    const { lobbyId } = useParams()

    if (!lobbyId) {
        return <Alert severity="error">LobbyId manquant</Alert>
    }

    return <LobbyRoomPageInner lobbyId={lobbyId} />
}

function LobbyRoomPageInner({ lobbyId }: { lobbyId: string }) {
    const { t } = useTranslation()
    const nav = useNavigate()
    const pseudo = getPseudo()
    const clientId = getOrCreateClientId()
    const didAutoJoin = useRef(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [password, setPassword] = useState('')
    const [copied, setCopied] = useState(false)
    const [lobbyNotFound, setLobbyNotFound] = useState(false)

    const { lobby, setLobby } = useLobbyRealtime(lobbyId, () => {
        // Callback appelé quand le lobby est supprimé via realtime
        setLobbyNotFound(true)
    })

    const isInLobby = useMemo(
        () => lobby?.players.some((p) => p.clientId === clientId) ?? false,
        [lobby, clientId]
    )

    const isHost = useMemo(() => lobby?.hostClientId === clientId, [lobby, clientId])

    useEffect(() => {
        if (!pseudo) {
            nav('/enter')
            return
        }

        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                setLobbyNotFound(false)

                const details = await getLobbyDetails(lobbyId)
                setLobby(details)

                if (!didAutoJoin.current) {
                    didAutoJoin.current = true

                    if (!details.players.some((p) => p.clientId === clientId) && !details.isPrivate) {
                        await joinLobby(lobbyId, { clientId, pseudo, password: null })
                        // Récupérer les détails mis à jour après avoir rejoint
                        const updatedDetails = await getLobbyDetails(lobbyId)
                        setLobby(updatedDetails)
                    }
                }
            } catch (e: any) {
                // Vérifier si c'est une erreur 404 (lobby not found)
                if (e?.response?.status === 404 || e?.status === 404) {
                    setLobbyNotFound(true)
                } else {
                    setError(getErrorMessage(e))
                }
            } finally {
                setLoading(false)
            }
        })()
    }, [lobbyId, pseudo, clientId, nav, setLobby])

    useEffect(() => {
        if (lobby?.status === 'InGame') {
            nav(`/games/${lobbyId}`)
        }
    }, [lobby?.status, lobbyId, nav])

    async function onJoin() {
        if (!pseudo) return
        try {
            setError(null)
            await joinLobby(lobbyId, {
                clientId,
                pseudo,
                password: lobby?.isPrivate ? password : null
            })
        } catch (e: any) {
            // Vérifier si c'est une erreur 401 (mauvais mot de passe)
            if (e?.response?.status === 401 || e?.status === 401) {
                setError(t('lobby.incorrectPassword'))
            } else {
                setError(getErrorMessage(e))
            }
        }
    }

    async function onLeave() {
        try {
            setError(null)
            await leaveLobby(lobbyId, { clientId })
            nav('/')
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    async function onStart() {
        try {
            setError(null)
            await startLobbyGame(lobbyId, { clientId })
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    function copyLobbyId() {
        const fullUrl = `${window.location.origin}/lobbies/${lobbyId}`
        navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Rediriger vers la page 404 si le lobby n'existe pas
    if (lobbyNotFound) {
        nav('/404', { replace: true })
        return null
    }

    if (loading || !lobby) {
        return (
            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography>{t('common.loading')}</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => nav('/')} size="large">
                    <ArrowBack />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {gameIcons[lobby.gameId]} {lobby.gameId}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {lobbyId.slice(0, 8)}...
                        </Typography>
                        <IconButton size="small" onClick={copyLobbyId}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                        {copied && (
                            <Chip label={t('common.copied')} size="small" color="success" />
                        )}
                    </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Chip
                        icon={lobby.isPrivate ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                        label={lobby.isPrivate ? t('lobby.private') : t('lobby.public')}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={lobby.status}
                        color={lobby.status === 'Waiting' ? 'warning' : 'success'}
                        size="small"
                    />
                </Stack>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Person color="action" />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {t('lobby.playersCount', { count: lobby.players.length })}
                                </Typography>
                            </Stack>

                            <Stack spacing={1.5}>
                                {lobby.players.map((p, idx) => (
                                    <Paper
                                        key={p.clientId}
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: p.clientId === clientId ? 'action.selected' : 'transparent'
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                                                {idx + 1}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {p.pseudo}
                                                </Typography>
                                                <Stack direction="row" spacing={1}>
                                                    {p.clientId === lobby.hostClientId && (
                                                        <Chip label={t('lobby.host')} size="small" color="primary" />
                                                    )}
                                                    {p.clientId === clientId && (
                                                        <Chip label={t('lobby.you')} size="small" variant="outlined" />
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>

                        {!isInLobby ? (
                            <Stack spacing={2}>
                                {lobby.isPrivate && (
                                    <TextField
                                        label={t('lobby.passwordRequired')}
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                )}
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={onJoin}
                                    disabled={lobby.isPrivate && password.trim().length < 4}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1rem'
                                    }}
                                >
                                    {t('lobby.joinGame')}
                                </Button>
                            </Stack>
                        ) : (
                            <Stack spacing={2}>
                                {lobby.players.length < 2 && (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        {t('lobby.waitingForPlayers')}
                                    </Alert>
                                )}

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<ExitToApp />}
                                        onClick={onLeave}
                                        fullWidth
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        {t('lobby.quitGame')}
                                    </Button>

                                    {isHost && (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PlayArrow />}
                                            onClick={onStart}
                                            disabled={lobby.players.length < 2}
                                            fullWidth
                                            sx={{
                                                borderRadius: 2,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {t('common.start')}
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}