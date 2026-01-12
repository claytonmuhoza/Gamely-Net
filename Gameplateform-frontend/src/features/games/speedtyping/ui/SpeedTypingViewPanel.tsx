import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Typography,
    Avatar
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { SpeedTypingStateDto } from '../model/types'

function formatMs(ms: number) {
    const s = Math.floor(ms / 1000)
    const rem = ms % 1000
    return `${s}.${String(rem).padStart(3, '0')}s`
}

function getRankEmoji(rank: number | null): string {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
}

export function SpeedTypingViewPanel(props: {
    state: SpeedTypingStateDto
    subtitle?: string
    highlightClientId?: string | null
}) {
    const { t } = useTranslation()
    const { state, highlightClientId } = props
    const finished = state.phase === 'Finished' || !!state.endedAtUnixMs

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
                            whiteSpace: 'pre-wrap',
                            bgcolor: 'grey.50'
                        }}
                    >
                        {state.text}
                    </Box>

                    <Divider />

                    <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {t('game.ranking')}
                        </Typography>

                        {state.runners.map((r) => {
                            const done = r.finishedAtUnixMs != null
                            const time =
                                done && state.startedAtUnixMs
                                    ? formatMs(r.finishedAtUnixMs! - state.startedAtUnixMs)
                                    : null

                            const percent = state.text.length > 0 ? Math.floor((r.correctChars / state.text.length) * 100) : 0
                            const isActor = highlightClientId != null && r.clientId === highlightClientId

                            return (
                                <Box
                                    key={r.clientId}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        border: '2px solid',
                                        borderColor: isActor ? 'primary.main' : 'divider',
                                        bgcolor: done ? 'success.50' : isActor ? 'primary.50' : 'transparent'
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    r.rank === 1 && done
                                                        ? 'warning.main'
                                                        : r.rank === 2 && done
                                                            ? 'grey.400'
                                                            : r.rank === 3 && done
                                                                ? '#cd7f32'
                                                                : 'primary.main',
                                                fontWeight: 700,
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {done && r.rank && r.rank <= 3 ? getRankEmoji(r.rank) : `#${r.rank ?? '?'}`}
                                        </Avatar>

                                        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                <Typography sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                    {r.pseudo}
                                                </Typography>
                                                {isActor && <Chip size="small" color="primary" label={t('game.actor')} />}
                                                {done && <Chip size="small" label={t('game.finished')} color="success" />}
                                            </Stack>

                                            <Stack direction="row" spacing={2}>
                                                {done ? (
                                                    <>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ⏱️ {time}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ⚡ {r.wpm.toFixed(0)} WPM
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            🎯 {r.accuracy.toFixed(1)}%
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography variant="body2" color="text.secondary">
                                                            📊 {percent}% ({r.correctChars}/{state.text.length})
                                                        </Typography>
                                                        {r.errorCount > 0 && (
                                                            <Typography variant="body2" color="error.main">
                                                                ✗ {r.errorCount}
                                                            </Typography>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>

                                            {!done && <LinearProgress variant="determinate" value={percent} sx={{ mt: 1 }} />}
                                        </Stack>

                                        <Chip
                                            size="small"
                                            label={done ? `${r.wpm.toFixed(0)} WPM` : `${percent}%`}
                                            color={done ? 'success' : 'default'}
                                            sx={{ fontWeight: 600 }}
                                        />
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