import { Alert, Button, Card, CardContent, Chip, Stack, Typography, Box, Avatar, IconButton } from '@mui/material'
import { Home, ArrowBack, MovieFilter, EmojiEvents } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { Puissance4StateDto } from '../model/types'
import { Puissance4Board } from './Puissance4Board'

function pseudoOf(state: Puissance4StateDto, clientId: string) {
    return state.players.find((p) => p.clientId === clientId)?.pseudo ?? 'Joueur'
}

export function Puissance4GamePanel(props: {
    lobbyId: string
    clientId: string
    state: Puissance4StateDto
    rejected: string | null
    error: string | null
    onDrop: (col: number) => void
    onBackLobby: () => void
    onHome: () => void
    onReplay: () => void
}) {
    const { t } = useTranslation()
    const { state, clientId } = props

    const me = state.players.find((p) => p.clientId === clientId) ?? null
    const yourTurn = state.currentPlayerId === clientId
    const finished = state.phase === 'Finished' || !!state.winnerClientId || state.isDraw

    const currentPseudo = pseudoOf(state, state.currentPlayerId)
    const winnerPseudo = state.winnerClientId ? pseudoOf(state, state.winnerClientId) : null

    const statusText = finished
        ? state.isDraw
            ? t('game.draw')
            : winnerPseudo
                ? t('game.winner', { player: winnerPseudo })
                : t('game.finished')
        : yourTurn
            ? t('game.yourTurn')
            : t('game.turnOf', { player: currentPseudo })

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={props.onBackLobby} size="large">
                    <ArrowBack />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        🔴 {t('games.puissance4.name')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {me ? t('game.youPlay', { symbol: me.color }) : t('lobby.spectator')}
                    </Typography>
                </Box>
                <Chip
                    label={state.phase}
                    color={finished ? 'default' : 'success'}
                    sx={{ fontWeight: 600 }}
                />
            </Stack>

            {props.error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {props.error}
                </Alert>
            )}
            {props.rejected && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    {props.rejected}
                </Alert>
            )}

            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={3}>
                        {/* Joueurs */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            {state.players.map((p) => {
                                const isCurrentPlayer = p.clientId === state.currentPlayerId
                                const isMe = p.clientId === clientId
                                const colorEmoji = p.color === 'R' ? '🔴' : '🟡'

                                return (
                                    <Box
                                        key={p.clientId}
                                        sx={{
                                            flex: 1,
                                            p: 2,
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: isCurrentPlayer ? 'primary.main' : 'divider',
                                            bgcolor: isCurrentPlayer ? 'primary.50' : 'transparent',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    bgcolor: p.color === 'R' ? 'error.main' : 'warning.main',
                                                    width: 48,
                                                    height: 48,
                                                    fontSize: '1.5rem'
                                                }}
                                            >
                                                {colorEmoji}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                    {t('game.player', { color: p.color })}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {p.pseudo}
                                                </Typography>
                                                {isMe && (
                                                    <Chip label={t('lobby.you')} size="small" sx={{ mt: 0.5, height: 20 }} />
                                                )}
                                            </Box>
                                        </Stack>
                                    </Box>
                                )
                            })}
                        </Stack>

                        {/* Statut */}
                        <Alert
                            severity={finished ? 'info' : yourTurn ? 'success' : 'warning'}
                            icon={finished && winnerPseudo ? <EmojiEvents /> : undefined}
                            sx={{ borderRadius: 2 }}
                        >
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                {statusText}
                            </Typography>
                        </Alert>

                        {/* Plateau */}
                        <Stack alignItems="center" sx={{ py: 2 }}>
                            <Puissance4Board
                                grid={state.grid}
                                disabled={!yourTurn || finished || !me}
                                onDrop={(col) => {
                                    if (!yourTurn || finished || !me) return
                                    props.onDrop(col)
                                }}
                            />
                        </Stack>

                        {/* Actions */}
                        {finished ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={props.onBackLobby}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {t('game.backToLobby')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<MovieFilter />}
                                    onClick={props.onReplay}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {t('game.viewReplay')}
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Home />}
                                    onClick={props.onHome}
                                    fullWidth
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {t('common.home')}
                                </Button>
                            </Stack>
                        ) : (
                            <Stack direction="row" justifyContent="center">
                                <Button
                                    variant="text"
                                    onClick={props.onBackLobby}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {t('game.viewLobby')}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}