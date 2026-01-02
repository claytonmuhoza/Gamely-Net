import { Alert, Box, Button, Card, CardContent, Chip, LinearProgress, Stack, TextField, Typography, IconButton, Avatar } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Home, ArrowBack, MovieFilter, Timer, EmojiEvents } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { SpeedTypingStateDto } from '../model/types'

function computeProgress(text: string, input: string) {
    const n = Math.min(text.length, input.length)
    let i = 0
    for (; i < n; i++) {
        if (text[i] !== input[i]) break
    }
    return i
}

function formatMs(ms: number) {
    const s = Math.floor(ms / 1000)
    const rem = ms % 1000
    return `${s}.${String(rem).padStart(3, '0')}s`
}

export function SpeedTypingGamePanel(props: {
    lobbyId: string
    clientId: string
    state: SpeedTypingStateDto
    rejected: string | null
    error: string | null
    onProgress: (progress: number) => Promise<void>
    onBackLobby: () => void
    onHome: () => void
    onReplay: () => void
}) {
    const { t } = useTranslation()
    const { state, clientId } = props

    const me = state.runners.find((r) => r.clientId === clientId) ?? null
    const finished = state.phase === 'Finished' || !!state.endedAtUnixMs

    const [input, setInput] = useState('')
    const lastSentRef = useRef(0)
    const pendingRef = useRef<number | null>(null)

    const myProgress = useMemo(() => computeProgress(state.text, input), [state.text, input])
    const percent = state.text.length > 0 ? Math.floor((myProgress / state.text.length) * 100) : 0

    useEffect(() => {
        setInput('')
    }, [state.textId])

    useEffect(() => {
        if (finished) return

        const now = Date.now()
        const minInterval = 120

        const send = async (p: number) => {
            try {
                await props.onProgress(p)
            } catch {}
        }

        if (myProgress >= state.text.length && state.text.length > 0) {
            void send(myProgress)
            return
        }

        if (now - lastSentRef.current >= minInterval) {
            lastSentRef.current = now
            void send(myProgress)
            return
        }

        if (pendingRef.current) window.clearTimeout(pendingRef.current)
        pendingRef.current = window.setTimeout(() => {
            lastSentRef.current = Date.now()
            void send(myProgress)
            pendingRef.current = null
        }, minInterval - (now - lastSentRef.current))
    }, [myProgress, finished, state.text.length]) // eslint-disable-line react-hooks/exhaustive-deps

    const sorted = useMemo(() => {
        return [...state.runners].sort((a, b) => {
            const af = a.finishedAtUnixMs != null
            const bf = b.finishedAtUnixMs != null
            if (af && bf) return (a.finishedAtUnixMs ?? 0) - (b.finishedAtUnixMs ?? 0)
            if (af) return -1
            if (bf) return 1
            return b.progress - a.progress
        })
    }, [state.runners])

    const statusText = finished
        ? t('game.raceFinished')
        : me
            ? t('game.typeTextFast')
            : t('lobby.spectator')

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={props.onBackLobby} size="large">
                    <ArrowBack />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        ⌨️ {t('games.speedtyping.name')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {me ? t('common.join') : t('lobby.spectator')}
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
                        {/* Statut */}
                        <Alert
                            severity={finished ? 'info' : 'success'}
                            icon={<Timer />}
                            sx={{ borderRadius: 2 }}
                        >
                            <Typography sx={{ fontWeight: 700 }}>{statusText}</Typography>
                        </Alert>

                        {/* Texte à taper */}
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                                border: '2px solid',
                                borderColor: 'divider',
                                fontFamily: 'monospace',
                                fontSize: '1rem',
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {state.text}
                        </Box>

                        {/* Progress personnel */}
                        {me && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'primary.50',
                                    border: '1px solid',
                                    borderColor: 'primary.main'
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        {t('game.yourProgress')}
                                    </Typography>
                                    <Chip
                                        label={`${percent}%`}
                                        size="small"
                                        color="primary"
                                        sx={{ fontWeight: 700 }}
                                    />
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={percent}
                                    sx={{
                                        height: 8,
                                        borderRadius: 1,
                                        bgcolor: 'white'
                                    }}
                                />
                            </Box>
                        )}

                        {/* Input */}
                        {me && !finished && (
                            <TextField
                                label={t('game.typeText')}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                autoFocus
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontFamily: 'monospace'
                                    }
                                }}
                            />
                        )}

                        {/* Classement */}
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <EmojiEvents color="action" />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {t('game.ranking')}
                                </Typography>
                            </Stack>

                            <Stack spacing={1.5}>
                                {sorted.map((r, idx) => {
                                    const isMe = r.clientId === clientId
                                    const done = r.finishedAtUnixMs != null
                                    const time = done && state.startedAtUnixMs
                                        ? formatMs(r.finishedAtUnixMs! - state.startedAtUnixMs)
                                        : null
                                    const p = state.text.length > 0 ? Math.floor((r.progress / state.text.length) * 100) : 0

                                    return (
                                        <Box
                                            key={r.clientId}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                border: '2px solid',
                                                borderColor: isMe ? 'primary.main' : 'divider',
                                                bgcolor: isMe ? 'primary.50' : 'transparent'
                                            }}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    sx={{
                                                        bgcolor: idx === 0 && done ? 'warning.main' : 'primary.main',
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {idx === 0 && done ? '🏆' : `#${idx + 1}`}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: 700,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {r.pseudo}
                                                        </Typography>
                                                        {isMe && <Chip label={t('lobby.you')} size="small" />}
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {done
                                                            ? t('game.finishedIn', { time })
                                                            : t('game.inProgress', { percent: p })
                                                        }
                                                    </Typography>
                                                    {!done && (
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={p}
                                                            sx={{ mt: 1, height: 6, borderRadius: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                                <Chip
                                                    label={done ? time : `${p}%`}
                                                    size="small"
                                                    color={done ? 'success' : 'default'}
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Stack>
                                        </Box>
                                    )
                                })}
                            </Stack>
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