import { useEffect, useState } from 'react'
import { getLobbyConnection } from '../../../shared/realtime/connection'
import type { LobbyDetailsDto } from '../model/types'

const EVENT_LOBBY_UPDATED = 'LobbyUpdated'
const EVENT_LOBBY_DELETED = 'LobbyDeleted'

export function useLobbyRealtime(lobbyId: string, onLobbyDeleted?: () => void) {
    const [lobby, setLobby] = useState<LobbyDetailsDto | null>(null)

    useEffect(() => {
        let mounted = true

        async function run() {
            const conn = await getLobbyConnection()

            const updateHandler = (payload: LobbyDetailsDto) => {
                if (!mounted) return
                setLobby(payload)
            }

            const deleteHandler = (deletedLobbyId: string) => {
                if (!mounted) return
                if (deletedLobbyId === lobbyId) {
                    onLobbyDeleted?.()
                }
            }

            conn.on(EVENT_LOBBY_UPDATED, updateHandler)
            conn.on(EVENT_LOBBY_DELETED, deleteHandler)
            await conn.invoke('SubscribeLobby', lobbyId)

            return async () => {
                conn.off(EVENT_LOBBY_UPDATED, updateHandler)
                conn.off(EVENT_LOBBY_DELETED, deleteHandler)
                try {
                    await conn.invoke('UnsubscribeLobby', lobbyId)
                } catch {
                    // ignore
                }
            }
        }

        let cleanup: (() => Promise<void>) | null = null
        run().then((c) => (cleanup = c ?? null))

        return () => {
            mounted = false
            if (cleanup) void cleanup()
        }
    }, [lobbyId, onLobbyDeleted])

    return { lobby, setLobby }
}