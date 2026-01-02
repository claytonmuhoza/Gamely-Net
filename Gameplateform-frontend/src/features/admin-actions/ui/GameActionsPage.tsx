import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    Slider,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
    Box,
    IconButton,
    Paper
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowBack, Search, SkipPrevious, SkipNext, History, MovieFilter } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../../shared/api/http'
import { getGameActions } from '../api/actionsApi'
import type { GameActionLogDto } from '../model/types'
import { extractStateSnapshots } from '../replay/snapshots'

import { isMorpionStateDto } from '../../games/morpion/model/guards'
import { isPuissance4StateDto } from '../../games/puissance4/model/guards'
import { isSpeedTypingStateDto } from '../../games/speedtyping/model/guards'

import { MorpionViewPanel } from '../../games/morpion/ui/MorpionViewPanel'
import { Puissance4ViewPanel } from '../../games/puissance4/ui/Puissance4ViewPanel'
import { SpeedTypingViewPanel } from '../../games/speedtyping/ui/SpeedTypingViewPanel'

function tryParseJson(json: string): any | null {
    try {
        return JSON.parse(json)
    } catch {
        return null
    }
}


function getSummary(actionType: string, payloadJson: string) {
    const p = tryParseJson(payloadJson)
    if (!p || typeof p !== 'object') return ''

    const index = p.index ?? p.Index
    const column = p.column ?? p.Column
    const gameId = p.gameId ?? p.GameId
    const progress = p.progress ?? p.Progress

    switch (actionType) {
        case 'START_GAME':
            return `game=${gameId ?? '?'}`
        case 'MORPION_MOVE':
            return `index=${index ?? '?'}`
        case 'P4_DROP':
            return `column=${column ?? '?'}`
        case 'SPEED_PROGRESS':
            return `progress=${progress ?? '?'}`
        case 'STATE_SNAPSHOT':
            return 'snapshot'
        default:
            return ''
    }
}

export function GameActionsPage() {
    const { t } = useTranslation()
    const nav = useNavigate()
    const params = useParams()
    const [searchParams] = useSearchParams()

    const lobbyIdParam = params.lobbyId
    const openReplay = searchParams.get('tab') === 'replay'

    const [tab, setTab] = useState<number>(openReplay ? 0 : 1)
    const [step, setStep] = useState<number>(1)
    const [lobbyId, setLobbyId] = useState<string>(lobbyIdParam ?? '')
    const [filter, setFilter] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [items, setItems] = useState<GameActionLogDto[]>([])

    const snapshots = useMemo(() => extractStateSnapshots(items), [items])

    useEffect(() => {
        setStep(1)
    }, [snapshots.length])

    useEffect(() => {
        if (!lobbyIdParam) return
        setLobbyId(lobbyIdParam)
    }, [lobbyIdParam])

    const filtered = useMemo(() => {
        const f = filter.trim().toLowerCase()
        if (!f) return items
        return items.filter((x) => {
            return (
                x.actionType.toLowerCase().includes(f) ||
                x.gameId.toLowerCase().includes(f) ||
                (x.actorClientId ?? '').toLowerCase().includes(f) ||
                x.payloadJson.toLowerCase().includes(f)
            )
        })
    }, [items, filter])

    async function load(idArg?: string, openReplayTab?: boolean) {
        const id = (idArg ?? lobbyId).trim()
        if (!id) return

        try {
            setLoading(true)
            setError(null)

            const res = await getGameActions(id)
            setItems(res)

            if (openReplayTab) setTab(0)
            else setTab(1)
        } catch (e) {
            setError(getErrorMessage(e))
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!lobbyIdParam) return
        void load(lobbyIdParam, openReplay)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyIdParam, openReplay])

    function renderSnapshotPanel() {
        if (snapshots.length === 0) {
            return (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    {t('admin.noSnapshots')}
                </Alert>
            )
        }

        const safeStep = Math.min(Math.max(step, 0), snapshots.length - 1)
        const snap = snapshots[safeStep]
        const subtitle = `${t('lobby.lobbyId')}: ${snap.state?.lobbyId ?? '?'} • ${new Date(snap.at).toLocaleString()}`

        if (isMorpionStateDto(snap.state)) {
            return <MorpionViewPanel state={snap.state} subtitle={subtitle} highlightClientId={snap.actorClientId} />
        }
        if (isPuissance4StateDto(snap.state)) {
            return <Puissance4ViewPanel state={snap.state} subtitle={subtitle} highlightClientId={snap.actorClientId} />
        }
        if (isSpeedTypingStateDto(snap.state)) {
            return <SpeedTypingViewPanel state={snap.state} subtitle={subtitle} highlightClientId={snap.actorClientId} />
        }

        return <Alert severity="warning" sx={{ borderRadius: 2 }}>{t('admin.snapshotUnknown')}</Alert>
    }

    const showLobbyField = !lobbyIdParam

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => nav('/')} size="large">
                    <ArrowBack />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {t('admin.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('admin.subtitle')}
                    </Typography>
                </Box>
            </Stack>

            <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={3}>
                        {/* Recherche lobby */}
                        {showLobbyField && (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    label={t('admin.lobbyIdLabel')}
                                    value={lobbyId}
                                    onChange={(e) => setLobbyId(e.target.value)}
                                    placeholder="a4f479bd-0a13-475d-b2ee-76108b9f807b"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<Search />}
                                    onClick={() => load(undefined, tab === 0)}
                                    disabled={loading || lobbyId.trim().length < 10}
                                    sx={{
                                        borderRadius: 2,
                                        minWidth: 140,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {t('admin.load')}
                                </Button>
                            </Stack>
                        )}

                        {/* Filtre */}
                        <TextField
                            label={t('admin.filterActions')}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder={t('admin.filterPlaceholder')}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                                <Tab
                                    icon={<MovieFilter />}
                                    iconPosition="start"
                                    label={`${t('admin.replay')} (${snapshots.length})`}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                />
                                <Tab
                                    icon={<History />}
                                    iconPosition="start"
                                    label={`${t('admin.history')} (${filtered.length})`}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                />
                            </Tabs>
                        </Box>

                        {/* Contenu Replay */}
                        {tab === 0 && (
                            <Stack spacing={3}>
                                {snapshots.length === 0 ? (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        {t('admin.loadFirst')}
                                    </Alert>
                                ) : (
                                    <>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <Stack spacing={2}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <IconButton
                                                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                                                        disabled={step <= 1}
                                                        size="large"
                                                    >
                                                        <SkipPrevious />
                                                    </IconButton>

                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Slider
                                                            value={step}
                                                            min={1}
                                                            max={snapshots.length - 1}
                                                            step={1}
                                                            onChange={(_, v) => setStep(v as number)}
                                                            valueLabelDisplay="auto"
                                                            sx={{ mx: 2 }}
                                                        />
                                                    </Box>

                                                    <IconButton
                                                        onClick={() => setStep((s) => Math.min(snapshots.length - 1, s + 1))}
                                                        disabled={step >= snapshots.length - 1}
                                                        size="large"
                                                    >
                                                        <SkipNext />
                                                    </IconButton>
                                                </Stack>

                                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {t('admin.step', { current: step, total: snapshots.length - 1 })}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date(snapshots[step].at).toLocaleString()}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>

                                        {renderSnapshotPanel()}
                                    </>
                                )}
                            </Stack>
                        )}

                        {/* Contenu Historique */}
                        {tab === 1 && (
                            <>
                                {loading ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography>{t('common.loading')}</Typography>
                                    </Box>
                                ) : filtered.length === 0 ? (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        {t('admin.noActions')}
                                    </Alert>
                                ) : (
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.time')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('scores.game')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.action')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.actor')}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>{t('admin.summary')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filtered.map((x) => (
                                                    <TableRow key={x.id} hover>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                                                            {new Date(x.at).toLocaleTimeString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip size="small" label={x.gameId} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                size="small"
                                                                label={x.actionType}
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                            {x.actorClientId?.slice(0, 8) ?? '—'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {getSummary(x.actionType, x.payloadJson) || '—'}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}