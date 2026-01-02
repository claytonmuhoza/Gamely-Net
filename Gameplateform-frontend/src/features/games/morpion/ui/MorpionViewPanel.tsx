import { Alert, Card, CardContent, Chip, Stack, Typography, Box, Avatar, Paper } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { MorpionStateDto } from '../model/types'

export function MorpionViewPanel(props: {
    state: MorpionStateDto
    title?: string
    subtitle?: string
    highlightClientId?: string | null
}) {
    const { t } = useTranslation()
    const { state, highlightClientId } = props

    const x = state.players.find((p) => p.symbol === 'X')
    const o = state.players.find((p) => p.symbol === 'O')
    const current = state.players.find((p) => p.clientId === state.currentPlayerId)
    const winner = state.winnerClientId ? state.players.find((p) => p.clientId === state.winnerClientId) : null
    const finished = state.phase === 'Finished' || !!state.winnerClientId || state.isDraw

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={3}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {props.title ?? `⚔️ ${t('games.morpion.name')}`}
                            </Typography>
                            {props.subtitle && (
                                <Typography variant="body2" color="text.secondary">
                                    {props.subtitle}
                                </Typography>
                            )}
                        </Stack>
                        <Chip
                            label={state.phase}
                            size="small"
                            color={finished ? 'default' : 'success'}
                        />
                    </Stack>

                    {/* Joueurs */}
                    <Stack direction="row" spacing={2}>
                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                p: 2,
                                borderRadius: 2,
                                borderWidth: 2,
                                borderColor: highlightClientId === x?.clientId
                                    ? 'primary.main'
                                    : state.currentPlayerId === x?.clientId
                                        ? 'primary.light'
                                        : 'divider',
                                bgcolor: state.currentPlayerId === x?.clientId ? 'primary.50' : 'transparent'
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: 40,
                                        height: 40,
                                        fontSize: '1.25rem',
                                        fontWeight: 900
                                    }}
                                >
                                    X
                                </Avatar>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        {t('game.playerX')}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {x?.pseudo ?? '—'}
                                    </Typography>
                                </Box>
                                {highlightClientId === x?.clientId && (
                                    <Chip label={t('game.actor')} size="small" color="primary" />
                                )}
                            </Stack>
                        </Paper>

                        <Paper
                            variant="outlined"
                            sx={{
                                flex: 1,
                                p: 2,
                                borderRadius: 2,
                                borderWidth: 2,
                                borderColor: highlightClientId === o?.clientId
                                    ? 'primary.main'
                                    : state.currentPlayerId === o?.clientId
                                        ? 'secondary.light'
                                        : 'divider',
                                bgcolor: state.currentPlayerId === o?.clientId ? 'secondary.50' : 'transparent'
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        width: 40,
                                        height: 40,
                                        fontSize: '1.25rem',
                                        fontWeight: 900
                                    }}
                                >
                                    O
                                </Avatar>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        {t('game.playerO')}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {o?.pseudo ?? '—'}
                                    </Typography>
                                </Box>
                                {highlightClientId === o?.clientId && (
                                    <Chip label={t('game.actor')} size="small" color="primary" />
                                )}
                            </Stack>
                        </Paper>
                    </Stack>

                    {/* Statut */}
                    {!finished && current && (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                                {t('game.turnOf', { player: `${current.pseudo} (${current.symbol})` })}
                            </Typography>
                        </Alert>
                    )}

                    {winner && (
                        <Alert severity="success" icon={<EmojiEvents />} sx={{ borderRadius: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                                {t('game.winner', { player: winner.pseudo })}
                            </Typography>
                        </Alert>
                    )}

                    {state.isDraw && (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>{t('game.draw')}</Typography>
                        </Alert>
                    )}

                    {/* Plateau */}
                    <Stack alignItems="center">
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 80px)',
                                gap: 1.5,
                                width: 'fit-content'
                            }}
                        >
                            {state.board.map((cell, i) => {
                                const isEmpty = cell === ''
                                const isX = cell === 'X'
                                const isO = cell === 'O'

                                return (
                                    <Paper
                                        key={i}
                                        elevation={0}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: isEmpty ? 'divider' : 'transparent',
                                            bgcolor: isEmpty
                                                ? 'background.paper'
                                                : isX
                                                    ? 'primary.50'
                                                    : 'secondary.50',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2.5rem',
                                            fontWeight: 900,
                                            color: isX ? 'primary.main' : isO ? 'secondary.main' : 'transparent'
                                        }}
                                    >
                                        {cell || '·'}
                                    </Paper>
                                )
                            })}
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}