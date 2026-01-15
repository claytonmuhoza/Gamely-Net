import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
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
    Typography
} from '@mui/material'
import {useEffect, useMemo, useState} from 'react'
import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
import {ArrowBack, History, MovieFilter, Refresh, Search, SkipNext, SkipPrevious, Visibility} from '@mui/icons-material'
import {useTranslation} from 'react-i18next'
import {getErrorMessage } from '../../../shared/api/http'
import { getAllLobbies, getGameActions } from '../api/actionsApi'
import type {GameActionLogDto} from '../model/types'
import type {LobbyListItemDto} from '../../lobbies/model/types'
import {extractStateSnapshots} from '../replay/snapshots'

import {isMorpionStateDto} from '../../games/morpion/model/guards'
import {isPuissance4StateDto} from '../../games/puissance4/model/guards'
import {isSpeedTypingStateDto} from '../../games/speedtyping/model/guards'

import {MorpionViewPanel} from '../../games/morpion/ui/MorpionViewPanel'
import {Puissance4ViewPanel} from '../../games/puissance4/ui/Puissance4ViewPanel'
import {SpeedTypingViewPanel} from '../../games/speedtyping/ui/SpeedTypingViewPanel'

function tryParseJson(json: string): unknown | null {
    try {
        return JSON.parse(json)
    } catch {
        return null
    }
}

function getSummary(actionType: string, payloadJson: string) {
    const p = tryParseJson(payloadJson)
    if (!p || typeof p !== 'object' || p === null) return ''

    const obj = p as Record<string, unknown>
    const index = obj['index'] ?? obj['Index']
    const column = obj['column'] ?? obj['Column']
    const gameId = obj['gameId'] ?? obj['GameId']
    const progress = obj['progress'] ?? obj['Progress']

    switch (actionType) {
        case 'START_GAME':
            return `game=${String(gameId ?? '?')}`
        case 'MORPION_MOVE':
            return `index=${String(index ?? '?')}`
        case 'P4_DROP':
            return `column=${String(column ?? '?')}`
        case 'SPEED_PROGRESS':
            return `progress=${String(progress ?? '?')}`
        case 'STATE_SNAPSHOT':
            return 'snapshot'
        default:
            return ''
    }
}

export function GameActionsPage() {
    const {t} = useTranslation()
    const nav = useNavigate()
    const params = useParams()
    const [searchParams] = useSearchParams()

    // Récupérer le lobbyId depuis l'URL si présent
    const urlLobbyId = params.lobbyId
    // Récupérer le tab depuis les query params (ex: ?tab=replay)
    const urlTab = searchParams.get('tab')

    const [tab, setTab] = useState<number>(urlTab === 'replay' ? 0 : 1)
    const [step, setStep] = useState<number>(0)
    const [filter, setFilter] = useState<string>('')
    const [lobbyFilter, setLobbyFilter] = useState<string>('')

    // États pour la liste des lobbies
    const [lobbies, setLobbies] = useState<LobbyListItemDto[]>([])
    const [lobbiesLoading, setLobbiesLoading] = useState<boolean>(true)
    const [lobbiesError, setLobbiesError] = useState<string | null>(null)

    // États pour le lobby sélectionné
    const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(urlLobbyId ?? null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [items, setItems] = useState<GameActionLogDto[]>([])

    const snapshots = useMemo(() => extractStateSnapshots(items), [items])

    // Calculer l'étape initiale : commence à 1 si disponible, sinon 0
    const initialStep = useMemo(() => {
        return snapshots.length > 1 ? 1 : 0
    }, [snapshots.length])

    // Réinitialiser step à l'étape initiale quand les snapshots changent
    useEffect(() => {
        setStep(initialStep)
    }, [initialStep])

    // Charger la liste des lobbies au montage
    useEffect(() => {
        void loadLobbies()
    }, [])

    // Charger automatiquement les actions si lobbyId est dans l'URL
    useEffect(() => {
        if (urlLobbyId) {
            void loadGameActions(urlLobbyId)
        }
    }, [urlLobbyId])

    // Basculer automatiquement sur l'onglet replay si demandé
    useEffect(() => {
        if (urlTab === 'replay') {
            setTab(0)
        }
    }, [urlTab])

    async function loadLobbies() {
        try {
            setLobbiesLoading(true)
            setLobbiesError(null)
            const res = await getAllLobbies()
            setLobbies(res)
        } catch (e) {
            setLobbiesError(getErrorMessage(e))
        } finally {
            setLobbiesLoading(false)
        }
    }

    const filteredLobbies = useMemo(() => {
        const f = lobbyFilter.trim().toLowerCase()
        if (!f) return lobbies
        return lobbies.filter((x) =>
            x.lobbyId.toLowerCase().includes(f) ||
            x.hostPseudo.toLowerCase().includes(f) ||
            x.status.toLowerCase().includes(f)
        )
    }, [lobbies, lobbyFilter])

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

    async function loadGameActions(id: string) {
        try {
            setLoading(true)
            setError(null)
            const res = await getGameActions(id)
            setItems(res)
            // Ne change le tab que si on n'a pas de paramètre URL spécifique
            if (!urlTab) {
                setTab(1)
            }
        } catch (e) {
            setError(getErrorMessage(e))
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    function handleSelectLobby(id: string) {
        setSelectedLobbyId(id)
        void loadGameActions(id)
    }

    function handleBack() {
        setSelectedLobbyId(null)
        setItems([])
        setError(null)
        nav('/admin/actions')
    }

    function renderSnapshotPanel() {
        if (snapshots.length === 0) return null
        const current = snapshots[step]
        if (!current) return null

        const state = current.state

        if (isMorpionStateDto(state)) {
            return <MorpionViewPanel state={state} />
        }

        if (isPuissance4StateDto(state)) {
            return <Puissance4ViewPanel state={state} />
        }

        if (isSpeedTypingStateDto(state)) {
            return <SpeedTypingViewPanel state={state} />
        }

        return (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                {t('admin.snapshotUnknown')}
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
                    {JSON.stringify(state, null, 2)}
                </pre>
            </Alert>
        )
    }

    // Si aucun lobby sélectionné => afficher la liste des lobbies
    if (!selectedLobbyId) {
        return (
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: 800, mb: 1}}>
                        {t('admin.gameActions')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('admin.selectLobby')}
                    </Typography>
                </Box>

                <Card sx={{borderRadius: 3}}>
                    <CardContent sx={{p: {xs: 2, sm: 3}}}>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    placeholder={t('admin.searchLobby')}
                                    value={lobbyFilter}
                                    onChange={(e) => setLobbyFilter(e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <Search sx={{mr: 1, color: 'text.secondary'}}/>,
                                    }}
                                    sx={{'& .MuiOutlinedInput-root': {borderRadius: 2}}}
                                />
                                <IconButton onClick={loadLobbies} size="large">
                                    <Refresh/>
                                </IconButton>
                            </Stack>

                            {lobbiesError && (
                                <Alert severity="error" sx={{borderRadius: 2}}>
                                    {lobbiesError}
                                </Alert>
                            )}

                            {lobbiesLoading ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                                    <CircularProgress/>
                                </Box>
                            ) : filteredLobbies.length === 0 ? (
                                <Alert severity="info" sx={{borderRadius: 2}}>
                                    {t('admin.noLobbies')}
                                </Alert>
                            ) : (
                                <TableContainer component={Paper} variant="outlined" sx={{borderRadius: 2}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{fontWeight: 700}}>{t('admin.lobbyId')}</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>{t('scores.game')}</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>{t('admin.host')}</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>{t('admin.status')}</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>{t('admin.players')}</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>{t('admin.createdAt')}</TableCell>
                                                <TableCell sx={{fontWeight: 700}}>{t('admin.actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredLobbies.map((lobby) => (
                                                <TableRow key={lobby.lobbyId} hover>
                                                    <TableCell sx={{fontFamily: 'monospace', fontSize: '0.875rem'}}>
                                                        {lobby.lobbyId.slice(0, 12)}...
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="small" label={lobby.gameId}/>
                                                    </TableCell>
                                                    <TableCell>{lobby.hostPseudo}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            size="small"
                                                            label={lobby.status}
                                                            color={lobby.status === 'FINISHED' ? 'success' : lobby.status === 'PLAYING' ? 'primary' : 'default'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{lobby.playersCount}</TableCell>
                                                    <TableCell sx={{whiteSpace: 'nowrap', fontSize: '0.875rem'}}>
                                                        {new Date(lobby.createdAt).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            startIcon={<Visibility/>}
                                                            onClick={() => handleSelectLobby(lobby.lobbyId)}
                                                            sx={{textTransform: 'none'}}
                                                        >
                                                            {t('admin.view')}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        )
    }

    // Vue détail du lobby sélectionné
    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={handleBack} size="large">
                    <ArrowBack/>
                </IconButton>
                <Box sx={{flexGrow: 1}}>
                    <Typography variant="h4" sx={{fontWeight: 800, mb: 0.5}}>
                        {t('admin.lobbyDetails')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{fontFamily: 'monospace'}}>
                        {selectedLobbyId}
                    </Typography>
                </Box>
            </Stack>

            <Card sx={{borderRadius: 3}}>
                <CardContent sx={{p: {xs: 2, sm: 3}}}>
                    <Stack spacing={3}>
                        {error && (
                            <Alert severity="error" sx={{borderRadius: 2}}>
                                {error}
                            </Alert>
                        )}

                        {loading && (
                            <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                                <CircularProgress/>
                            </Box>
                        )}

                        {items.length > 0 && !loading && (
                            <>
                                <TextField
                                    label={t('admin.filterActions')}
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder={t('admin.filterPlaceholder')}
                                    fullWidth
                                    sx={{'& .MuiOutlinedInput-root': {borderRadius: 2}}}
                                />

                                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                                        <Tab icon={<MovieFilter/>} iconPosition="start"
                                             label={`${t('admin.replay')} (${snapshots.length})`}
                                             sx={{textTransform: 'none', fontWeight: 600}}/>
                                        <Tab icon={<History/>} iconPosition="start"
                                             label={`${t('admin.history')} (${filtered.length})`}
                                             sx={{textTransform: 'none', fontWeight: 600}}/>
                                    </Tabs>
                                </Box>

                                {tab === 0 && (
                                    <Stack spacing={3}>
                                        {snapshots.length === 0 ? (
                                            <Alert severity="info"
                                                   sx={{borderRadius: 2}}>{t('admin.noSnapshots')}</Alert>
                                        ) : (
                                            <>
                                                <Box sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'grey.50',
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}>
                                                    <Stack spacing={2}>
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <IconButton
                                                                onClick={() => setStep((s) => Math.max(0, s - 1))}
                                                                disabled={step <= 0}
                                                                size="large"><SkipPrevious/></IconButton>
                                                            <Box sx={{flexGrow: 1}}>
                                                                <Slider value={step} min={0}
                                                                        max={Math.max(0, snapshots.length - 1)} step={1}
                                                                        onChange={(_, v) => setStep(v as number)}
                                                                        valueLabelDisplay="auto" sx={{mx: 2}}/>
                                                            </Box>
                                                            <IconButton
                                                                onClick={() => setStep((s) => Math.min(snapshots.length - 1, s + 1))}
                                                                disabled={step >= snapshots.length - 1}
                                                                size="large"><SkipNext/></IconButton>
                                                        </Stack>
                                                        <Stack direction="row" spacing={2}
                                                               justifyContent="space-between">
                                                            <Typography variant="body2"
                                                                        color="text.secondary">{t('admin.step', {
                                                                current: step,
                                                                total: snapshots.length - 1
                                                            })}</Typography>
                                                            <Typography variant="body2"
                                                                        color="text.secondary">{new Date(snapshots[step].at).toLocaleString()}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                                {renderSnapshotPanel()}
                                                {step === 0 && snapshots.length > 1 && (
                                                    <Alert severity="info" sx={{borderRadius: 2}}>
                                                        {t('admin.step0Warning')}
                                                        <Button
                                                            size="small"
                                                            onClick={() => setStep(1)}
                                                            sx={{ml: 1}}
                                                        >
                                                            {t('admin.goToStep1')}
                                                        </Button>
                                                    </Alert>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                )}

                                {tab === 1 && (
                                    filtered.length === 0 ? (
                                        <Alert severity="info" sx={{borderRadius: 2}}>{t('admin.noActions')}</Alert>
                                    ) : (
                                        <TableContainer component={Paper} variant="outlined" sx={{borderRadius: 2}}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{fontWeight: 700}}>{t('admin.time')}</TableCell>
                                                        <TableCell sx={{fontWeight: 700}}>{t('scores.game')}</TableCell>
                                                        <TableCell
                                                            sx={{fontWeight: 700}}>{t('admin.action')}</TableCell>
                                                        <TableCell sx={{fontWeight: 700}}>{t('admin.actor')}</TableCell>
                                                        <TableCell
                                                            sx={{fontWeight: 700}}>{t('admin.summary')}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filtered.map((x) => (
                                                        <TableRow key={x.id} hover>
                                                            <TableCell sx={{
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '0.875rem'
                                                            }}>{new Date(x.at).toLocaleTimeString()}</TableCell>
                                                            <TableCell><Chip size="small" label={x.gameId}/></TableCell>
                                                            <TableCell><Chip size="small" label={x.actionType}
                                                                             variant="outlined"/></TableCell>
                                                            <TableCell sx={{
                                                                fontFamily: 'monospace',
                                                                fontSize: '0.75rem'
                                                            }}>{x.actorClientId?.slice(0, 8) ?? '—'}</TableCell>
                                                            <TableCell><Typography variant="body2"
                                                                                   color="text.secondary">{getSummary(x.actionType, x.payloadJson) || '—'}</Typography></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )
                                )}
                            </>
                        )}

                        {!loading && items.length === 0 && !error && (
                            <Alert severity="info" sx={{borderRadius: 2}}>{t('admin.noActions')}</Alert>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}