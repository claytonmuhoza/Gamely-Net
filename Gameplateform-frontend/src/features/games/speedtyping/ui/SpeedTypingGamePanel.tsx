import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    TextField,
    Typography,
    IconButton,
    Avatar
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Home, ArrowBack, MovieFilter, Timer, EmojiEvents, Speed, CheckCircle, Error as ErrorIcon } from '@mui/icons-material'
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

export function SpeedTypingGamePanel(props: {
    lobbyId: string
    clientId: string
    state: SpeedTypingStateDto
    rejected: string | null
    error: string | null
    onProgress: (typedText: string) => Promise<void>
    onBackLobby: () => void
    onHome: () => void
    onReplay: () => void
}) {
    const { t } = useTranslation()
    const { state, clientId } = props

    const me = state.runners.find((r) => r.clientId === clientId) ?? null
    const finished = state.phase === 'Finished' || !!state.endedAtUnixMs

    const [inputState, setInputState] = useState({ value: '', textId: state.textId })
    const lastSentRef = useRef('')
    const pendingRef = useRef<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [currentTime, setCurrentTime] = useState(() => Date.now())

    // Reset input when text changes (derived state pattern)
    if (inputState.textId !== state.textId) {
        setInputState({ value: '', textId: state.textId })
    }

    const input = inputState.value
    const setInput = (value: string) => setInputState({ value, textId: state.textId })

    // Reset lastSentRef when textId changes
    useEffect(() => {
        lastSentRef.current = ''
    }, [state.textId])

    // Auto-focus input on start
    useEffect(() => {
        if (!finished && me && inputRef.current) {
            inputRef.current.focus()
        }
    }, [finished, me])

    // Update current time every second
    useEffect(() => {
        if (finished) return

        const interval = setInterval(() => {
            setCurrentTime(Date.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [finished])

    // Send updates to server with debouncing
    useEffect(() => {
        if (finished) return
        if (!me) return

        const minInterval = 150

        const send = async (text: string) => {
            if (text === lastSentRef.current) return
            lastSentRef.current = text

            try {
                await props.onProgress(text)
            } catch (err) {
                console.error('Failed to send progress:', err)
            }
        }

        if (input.length >= state.text.length) {
            void send(input)
            return
        }

        if (pendingRef.current) window.clearTimeout(pendingRef.current)
        pendingRef.current = window.setTimeout(() => {
            void send(input)
            pendingRef.current = null
        }, minInterval)

        return () => {
            if (pendingRef.current) window.clearTimeout(pendingRef.current)
        }
    }, [input, finished, me, state.text.length, clientId]) // eslint-disable-line react-hooks/exhaustive-deps

    // ✅ ANTI-TRICHE: Empêcher le copier-coller
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        console.log('❌ Copier-coller désactivé')
    }

    // ✅ ANTI-TRICHE: Empêcher la sélection du texte cible
    const handleTextMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
    }

    // ✅ ANTI-TRICHE: Empêcher le copier (Ctrl+C)
    const handleCopy = (e: React.ClipboardEvent) => {
        e.preventDefault()
    }

    // ✅ ANTI-TRICHE: Empêcher le couper (Ctrl+X)
    const handleCut = (e: React.ClipboardEvent) => {
        e.preventDefault()
    }

    // Render text with character-by-character coloring
    const renderColoredText = () => {
        return state.text.split('').map((char, idx) => {
            let color = '#999'
            let bgColor = 'transparent'
            let fontWeight = 400

            if (idx < input.length) {
                if (input[idx] === char) {
                    color = '#2e7d32'
                    fontWeight = 600
                } else {
                    color = '#d32f2f'
                    bgColor = '#ffebee'
                    fontWeight = 600
                }
            } else if (idx === input.length) {
                bgColor = '#e3f2fd'
            }

            return (
                <span
                    key={idx}
                    style={{
                        color,
                        backgroundColor: bgColor,
                        fontWeight,
                        padding: '2px 0'
                    }}
                >
                    {char}
                </span>
            )
        })
    }

    // Calculate elapsed time
    const elapsedSeconds = useMemo(() => {
        if (!state.startedAtUnixMs) return 0
        const now = finished && state.endedAtUnixMs ? state.endedAtUnixMs : currentTime
        return Math.floor((now - state.startedAtUnixMs) / 1000)
    }, [state.startedAtUnixMs, state.endedAtUnixMs, finished, currentTime])

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
                <Chip label={state.phase} color={finished ? 'default' : 'success'} sx={{ fontWeight: 600 }} />
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
                        {/* Status */}
                        <Alert severity={finished ? 'info' : 'success'} icon={<Timer />} sx={{ borderRadius: 2 }}>
                            <Typography sx={{ fontWeight: 700 }}>{statusText}</Typography>
                        </Alert>

                        {/* Personal Stats (if playing) */}
                        {me && (
                            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'primary.50',
                                        textAlign: 'center',
                                        flex: '1 1 150px',
                                        minWidth: 120
                                    }}
                                >
                                    <Timer color="primary" sx={{ mb: 0.5 }} />
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {t('game.time')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {elapsedSeconds}s
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'success.50',
                                        textAlign: 'center',
                                        flex: '1 1 150px',
                                        minWidth: 120
                                    }}
                                >
                                    <CheckCircle color="success" sx={{ mb: 0.5 }} />
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {t('game.correct')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                                        {me.correctChars}/{state.text.length}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'error.50',
                                        textAlign: 'center',
                                        flex: '1 1 150px',
                                        minWidth: 120
                                    }}
                                >
                                    <ErrorIcon color="error" sx={{ mb: 0.5 }} />
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {t('game.errors')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                                        {me.errorCount}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'info.50',
                                        textAlign: 'center',
                                        flex: '1 1 150px',
                                        minWidth: 120
                                    }}
                                >
                                    <Speed color="info" sx={{ mb: 0.5 }} />
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {t('game.precision')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                                        {me.accuracy.toFixed(1)}%
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        {/* Text to type with coloring */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                                {t('game.textToType')}
                            </Typography>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'grey.50',
                                    border: '2px solid',
                                    borderColor: 'divider',
                                    fontFamily: 'monospace',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.8,
                                    whiteSpace: 'pre-wrap',
                                    minHeight: 80,
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    MozUserSelect: 'none',
                                    msUserSelect: 'none'
                                }}
                                onMouseDown={handleTextMouseDown}
                                onCopy={handleCopy}
                            >
                                {me ? renderColoredText() : state.text}
                            </Box>
                        </Box>

                        {/* Input field */}
                        {me && !finished && (
                            <TextField
                                inputRef={inputRef}
                                label={t('game.typeText')}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onPaste={handlePaste}
                                onCopy={handleCopy}
                                onCut={handleCut}
                                fullWidth
                                multiline
                                rows={3}
                                autoFocus
                                placeholder={t('game.startTyping')}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontFamily: 'monospace',
                                        fontSize: '1rem'
                                    }
                                }}
                            />
                        )}

                        {/* Ranking */}
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <EmojiEvents color="action" />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {t('game.ranking')}
                                </Typography>
                            </Stack>

                            <Stack spacing={1.5}>
                                {state.runners.map((r) => {
                                    const isMe = r.clientId === clientId
                                    const done = r.finishedAtUnixMs != null
                                    const time =
                                        done && state.startedAtUnixMs
                                            ? formatMs(r.finishedAtUnixMs! - state.startedAtUnixMs)
                                            : null
                                    const percent =
                                        state.text.length > 0
                                            ? Math.floor((r.correctChars / state.text.length) * 100)
                                            : 0

                                    return (
                                        <Box
                                            key={r.clientId}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                border: '2px solid',
                                                borderColor: isMe ? 'primary.main' : 'divider',
                                                bgcolor: isMe ? 'primary.50' : done ? 'success.50' : 'transparent'
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
                                                        width: 48,
                                                        height: 48
                                                    }}
                                                >
                                                    {done && r.rank && r.rank <= 3
                                                        ? getRankEmoji(r.rank)
                                                        : `#${r.rank ?? '?'}`}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
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
                                                        {isMe && <Chip label={t('lobby.you')} size="small" color="primary" />}
                                                        {done && <Chip label={t('game.finished')} size="small" color="success" />}
                                                    </Stack>

                                                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                        {done ? (
                                                            <>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    ⏱️ {time}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    ⚡ {r.wpm.toFixed(0)} {t('game.wpm')}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    🎯 {r.accuracy.toFixed(1)}%
                                                                </Typography>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    📊 {percent}%
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    ✓ {r.correctChars}/{state.text.length}
                                                                </Typography>
                                                                {r.errorCount > 0 && (
                                                                    <Typography variant="body2" color="error.main">
                                                                        ✗ {r.errorCount}
                                                                    </Typography>
                                                                )}
                                                            </>
                                                        )}
                                                    </Stack>

                                                    {!done && (
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={percent}
                                                            sx={{ mt: 1, height: 6, borderRadius: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    {done && r.wpm > 0 && (
                                                        <Chip
                                                            label={`${r.wpm.toFixed(0)} ${t('game.wpm')}`}
                                                            size="small"
                                                            color="success"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    )}
                                                    {!done && (
                                                        <Chip
                                                            label={`${percent}%`}
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    )}
                                                </Box>
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