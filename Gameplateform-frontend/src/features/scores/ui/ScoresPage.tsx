import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../../shared/api/http'
import { getTopScores } from '../api/scoresApi'
import type { ScoreEntryDto } from '../model/types'

function formatMs(ms: number) {
    const s = Math.floor(ms / 1000)
    const rem = ms % 1000
    return `${s}.${String(rem).padStart(3, '0')}s`
}

export function ScoresPage() {
    const { t } = useTranslation()
    const nav = useNavigate()

    const [gameId, setGameId] = useState('SpeedTyping')
    const [limit, setLimit] = useState(10)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [items, setItems] = useState<ScoreEntryDto[]>([])

    const isTimeGame = useMemo(() => gameId.toLowerCase() === 'speedtyping', [gameId])

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await getTopScores(gameId, limit)
                setItems(res)
            } catch (e) {
                setError(getErrorMessage(e))
            } finally {
                setLoading(false)
            }
        })()
    }, [gameId, limit])

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {t('scores.title')}
                </Typography>
                <Button variant="outlined" onClick={() => nav('/')}>
                    {t('common.home')}
                </Button>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                select
                                label={t('scores.game')}
                                value={gameId}
                                onChange={(e) => setGameId(e.target.value)}
                                sx={{ minWidth: 220 }}
                            >
                                <MenuItem value="Morpion">{t('games.morpion.name')}</MenuItem>
                                <MenuItem value="Puissance4">{t('games.puissance4.name')}</MenuItem>
                                <MenuItem value="SpeedTyping">{t('games.speedtyping.name')}</MenuItem>
                            </TextField>

                            <TextField
                                label={t('common.filter')}
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(Math.max(1, Math.min(100, Number(e.target.value))))}
                                sx={{ width: 140 }}
                                inputProps={{ min: 1, max: 100 }}
                            />
                        </Stack>

                        {loading ? (
                            <Typography>{t('common.loading')}</Typography>
                        ) : items.length === 0 ? (
                            <Alert severity="info">{t('scores.noScores')}</Alert>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>{t('scores.player')}</TableCell>
                                        <TableCell>{isTimeGame ? t('admin.time') : 'Score'}</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((s, i) => (
                                        <TableRow key={`${s.clientId}-${s.achievedAt}-${i}`}>
                                            <TableCell>
                                                <Chip size="small" label={i + 1} />
                                            </TableCell>
                                            <TableCell>{s.pseudo}</TableCell>
                                            <TableCell>
                                                {isTimeGame ? formatMs(s.value) : s.value}
                                            </TableCell>
                                            <TableCell>{new Date(s.achievedAt).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}