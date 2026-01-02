import { Alert, Card, CardContent, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Puissance4StateDto } from '../model/types'
import { Puissance4Board } from './Puissance4Board'

function pseudoOf(state: Puissance4StateDto, clientId: string) {
    return state.players.find((p) => p.clientId === clientId)?.pseudo ?? 'Joueur'
}

export function Puissance4ViewPanel(props: {
    state: Puissance4StateDto
    subtitle?: string
    highlightClientId?: string | null // actor du snapshot
}) {
    const { t } = useTranslation()
    const { state, highlightClientId } = props

    const finished = state.phase === 'Finished' || !!state.winnerClientId || state.isDraw
    const currentPseudo = pseudoOf(state, state.currentPlayerId)
    const winnerPseudo = state.winnerClientId ? pseudoOf(state, state.winnerClientId) : null

    const statusText = finished
        ? state.isDraw
            ? t('game.draw')
            : winnerPseudo
                ? t('game.victory', { player: winnerPseudo })
                : t('game.finished')
        : t('game.turnOf', { player: currentPseudo })

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {t('games.puissance4.name')}
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
                            color={finished ? 'default' : 'primary'}
                            variant={finished ? 'outlined' : 'filled'}
                        />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        {state.players.map((p) => {
                            const isActor = highlightClientId != null && p.clientId === highlightClientId
                            const isCurrent = p.clientId === state.currentPlayerId
                            return (
                                <Paper
                                    key={p.clientId}
                                    variant="outlined"
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 2,
                                        flex: 1,
                                        borderColor: isActor ? 'primary.main' : 'divider'
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{ fontWeight: 700 }}>{p.color}</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>{p.pseudo}</Typography>
                                            {isCurrent && <Chip size="small" label={t('game.turn')} />}
                                            {isActor && <Chip size="small" color="primary" label={t('game.actor')} />}
                                        </Stack>
                                    </Stack>
                                </Paper>
                            )
                        })}
                    </Stack>

                    <Divider />

                    <Alert severity={finished ? 'info' : 'warning'} sx={{ borderRadius: 2 }}>
                        <Typography sx={{ fontWeight: 700 }}>{statusText}</Typography>
                    </Alert>

                    <Stack alignItems="center">
                        <Puissance4Board grid={state.grid} disabled onDrop={() => {}} />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}