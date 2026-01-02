import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography, Avatar, IconButton } from '@mui/material'
import { useMemo } from 'react'
import { Home, ArrowBack, MovieFilter, EmojiEvents } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { MorpionStateDto } from "../model/types.ts"
import { getPlayerBySymbol, getPseudo, getWinnerPseudo } from "./morpionView.ts"
import { MorpionBoard } from "./MorpionBoard.tsx"

export function MorpionGamePanel(props: {
    lobbyId: string
    clientId: string
    state: MorpionStateDto
    rejected: string | null
    error: string | null
    onPlay: (index: number) => void
    onBackLobby: () => void
    onHome: () => void
    onReplay: () => void
}) {
    const { t } = useTranslation()
    const { state, clientId } = props

    const x = getPlayerBySymbol(state, 'X')
    const o = getPlayerBySymbol(state, 'O')

    const currentPseudo = state.currentPlayerId ? getPseudo(state, state.currentPlayerId) : '—'
    const winnerPseudo = getWinnerPseudo(state)

    const you = useMemo(() => state.players.find((p) => p.clientId === clientId) ?? null, [state, clientId])
    const yourTurn = state.currentPlayerId === clientId
    const finished = state.phase === 'Finished' || !!state.winnerClientId || state.isDraw

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
            {/* Header avec navigation */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={props.onBackLobby} size="large">
                    <ArrowBack />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        ⚔️ {t('games.morpion.name')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {you ? t('game.youPlay', { symbol: you.symbol }) : t('lobby.spectator')}
                    </Typography>
                </Box>
                <Chip
                    label={state.phase}
                    color={finished ? 'default' : 'success'}
                    sx={{ fontWeight: 600 }}
                />
            </Stack>

            {props.error && (
                <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => {}}>
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
                        <Stack direction="row" spacing={2}>
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '2px solid',
                                    borderColor: state.currentPlayerId === x?.clientId ? 'primary.main' : 'divider',
                                    bgcolor: state.currentPlayerId === x?.clientId ? 'primary.50' : 'transparent',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 48,
                                            height: 48,
                                            fontSize: '1.5rem',
                                            fontWeight: 900
                                        }}
                                    >
                                        X
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                            {t('game.playerX')}
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
                                            {x?.pseudo ?? '—'}
                                        </Typography>
                                        {x?.clientId === clientId && (
                                            <Chip label={t('lobby.you')} size="small" sx={{ mt: 0.5, height: 20 }} />
                                        )}
                                    </Box>
                                </Stack>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '2px solid',
                                    borderColor: state.currentPlayerId === o?.clientId ? 'primary.main' : 'divider',
                                    bgcolor: state.currentPlayerId === o?.clientId ? 'primary.50' : 'transparent',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        sx={{
                                            bgcolor: 'secondary.main',
                                            width: 48,
                                            height: 48,
                                            fontSize: '1.5rem',
                                            fontWeight: 900
                                        }}
                                    >
                                        O
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                            {t('game.playerO')}
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
                                            {o?.pseudo ?? '—'}
                                        </Typography>
                                        {o?.clientId === clientId && (
                                            <Chip label={t('lobby.you')} size="small" sx={{ mt: 0.5, height: 20 }} />
                                        )}
                                    </Box>
                                </Stack>
                            </Box>
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
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <MorpionBoard
                                board={state.board}
                                onCellClick={(i) => {
                                    if (finished || !yourTurn) return
                                    if (state.board[i] !== '') return
                                    props.onPlay(i)
                                }}
                                disabled={!yourTurn || finished}
                            />
                        </Box>

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