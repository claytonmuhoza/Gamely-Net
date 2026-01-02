import { Alert, Box, Card, CardContent, Chip, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { SpeedTypingStateDto } from '../model/types'

function formatMs(ms: number) {
    const s = Math.floor(ms / 1000)
    const rem = ms % 1000
    return `${s}.${String(rem).padStart(3, '0')}s`
}

export function SpeedTypingViewPanel(props: {
    state: SpeedTypingStateDto
    subtitle?: string
    highlightClientId?: string | null
}) {
    const { t } = useTranslation()
    const { state, highlightClientId } = props
    const finished = state.phase === 'Finished' || !!state.endedAtUnixMs

    const sorted = [...state.runners].sort((a, b) => {
        const af = a.finishedAtUnixMs != null
        const bf = b.finishedAtUnixMs != null
        if (af && bf) return (a.finishedAtUnixMs ?? 0) - (b.finishedAtUnixMs ?? 0)
        if (af) return -1
        if (bf) return 1
        return b.progress - a.progress
    })

    const statusText = finished ? t('game.raceFinished') : t('game.inProgress', { percent: '' }).replace(': %', '')

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={0.5}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {t('games.speedtyping.name')}
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

                    <Alert severity={finished ? 'info' : 'success'} sx={{ borderRadius: 2 }}>
                        <Typography sx={{ fontWeight: 700 }}>{statusText}</Typography>
                    </Alert>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {state.text}
                    </Box>

                    <Divider />

                    <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {t('game.ranking')}
                        </Typography>

                        {sorted.map((r, idx) => {
                            const done = r.finishedAtUnixMs != null
                            const time =
                                done && state.startedAtUnixMs
                                    ? formatMs(r.finishedAtUnixMs! - state.startedAtUnixMs)
                                    : null

                            const percent = state.text.length > 0 ? Math.floor((r.progress / state.text.length) * 100) : 0
                            const isActor = highlightClientId != null && r.clientId === highlightClientId

                            return (
                                <Box
                                    key={r.clientId}
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: isActor ? 'primary.main' : 'divider'
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                    #{idx + 1} {r.pseudo}
                                                </Typography>
                                                {isActor && <Chip size="small" color="primary" label={t('game.actor')} />}
                                                {done && <Chip size="small" label={t('game.finished')} />}
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary">
                                                {done
                                                    ? t('game.finishedIn', { time })
                                                    : t('game.progress') + `: ${percent}%`
                                                }
                                            </Typography>

                                            {!done && <LinearProgress variant="determinate" value={percent} />}
                                        </Stack>

                                        <Chip size="small" label={done ? time ?? t('game.finished') : `${percent}%`} />
                                    </Stack>
                                </Box>
                            )
                        })}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}