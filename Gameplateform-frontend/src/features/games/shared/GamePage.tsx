import { Alert, Card, CardContent, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getErrorMessage, http } from '../../../shared/api/http'
import { getOrCreateClientId } from '../../../shared/session/clientId'
import { getPseudo } from '../../../shared/session/pseudo'
import { useGameRealtime } from './useGameRealtime'

import { isMorpionStateDto } from '../morpion/model/guards'
import { MorpionGamePanel } from '../morpion/ui/MorpionGamePanel'
import { playMorpionMove } from '../morpion/api/morpionApi'

import { isPuissance4StateDto } from '../puissance4/model/guards'
import { dropPuissance4Disc } from '../puissance4/api/puissance4Api'

import { isSpeedTypingStateDto } from '../speedtyping/model/guards'
import { updateSpeedTypingProgress } from '../speedtyping/api/speedTypingApi'

import { Puissance4GamePanel } from '../puissance4/ui/Puissance4GamePanel'
import { SpeedTypingGamePanel } from '../speedtyping/ui/SpeedTypingGamePanel'

export function GamePage() {
    const { lobbyId } = useParams()
    if (!lobbyId) return <Alert severity="error">LobbyId manquant</Alert>
    return <GamePageInner lobbyId={lobbyId} />
}

function GamePageInner({ lobbyId }: { lobbyId: string }) {
    const { t } = useTranslation()
    const nav = useNavigate()
    const pseudo = getPseudo()
    const clientId = getOrCreateClientId()

    const [error, setError] = useState<string | null>(null)

    const { state, setState, rejected, setRejected } = useGameRealtime<any>(lobbyId)

    useEffect(() => {
        if (!pseudo) {
            nav('/enter')
            return
        }

        ;(async () => {
            try {
                setError(null)
                const res = await http.get(`/api/games/${lobbyId}/state`)
                setState(res.data)
            } catch (e) {
                setError(getErrorMessage(e))
            }
        })()
    }, [lobbyId, nav, pseudo, setState])

    async function onPlayMorpion(index: number) {
        try {
            setError(null)
            setRejected(null)
            await playMorpionMove(lobbyId, { clientId, index })
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    if (!state) {
        return (
            <Card>
                <CardContent>
                    <Typography>{t('common.loading')}</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                </CardContent>
            </Card>
        )
    }

    // Switch par "shape"
    if (isMorpionStateDto(state)) {
        return (
            <MorpionGamePanel
                lobbyId={lobbyId}
                clientId={clientId}
                state={state}
                rejected={rejected}
                error={error}
                onPlay={onPlayMorpion}
                onBackLobby={() => nav(`/lobbies/${lobbyId}`)}
                onHome={() => nav('/')}
                onReplay={() => nav(`/admin/actions/${lobbyId}?tab=replay`)}
            />
        )
    }

    if (isPuissance4StateDto(state)) {
        async function onDrop(col: number) {
            try {
                setError(null)
                setRejected(null)
                await dropPuissance4Disc(lobbyId, { clientId, column: col })
            } catch (e) {
                setError(getErrorMessage(e))
            }
        }

        return (
            <Puissance4GamePanel
                lobbyId={lobbyId}
                clientId={clientId}
                state={state}
                rejected={rejected}
                error={error}
                onDrop={onDrop}
                onBackLobby={() => nav(`/lobbies/${lobbyId}`)}
                onHome={() => nav('/')}
                onReplay={() => nav(`/admin/actions/${lobbyId}?tab=replay`)}
            />
        )
    }

    if (isSpeedTypingStateDto(state)) {
        //  CORRECTION: typedText au lieu de progress
        async function onProgress(typedText: string) {
            try {
                setError(null)
                setRejected(null)
                await updateSpeedTypingProgress(lobbyId, { clientId, typedText })
            } catch (e) {
                setError(getErrorMessage(e))
            }
        }

        return (
            <SpeedTypingGamePanel
                lobbyId={lobbyId}
                clientId={clientId}
                state={state}
                rejected={rejected}
                error={error}
                onProgress={onProgress}
                onBackLobby={() => nav(`/lobbies/${lobbyId}`)}
                onHome={() => nav('/')}
                onReplay={() => nav(`/admin/actions/${lobbyId}?tab=replay`)}
            />
        )
    }

    return (
        <Card>
            <CardContent>
                <Stack spacing={1}>
                    <Alert severity="warning">{t('admin.snapshotUnknown')}</Alert>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(state, null, 2)}</pre>
                </Stack>
            </CardContent>
        </Card>
    )
}