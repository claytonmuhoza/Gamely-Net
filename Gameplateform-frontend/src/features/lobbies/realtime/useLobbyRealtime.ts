import { useEffect, useState } from 'react'
import { getLobbyConnection } from '../../../shared/realtime/connection'
import type { LobbyDetailsDto } from '../model/types'

const EVENT_LOBBY_UPDATED = 'LobbyUpdated'

export function useLobbyRealtime(lobbyId: string) {
    const [lobby, setLobby] = useState<LobbyDetailsDto | null>(null)

    useEffect(() => {
        let mounted = true

        async function run() {
            const conn = await getLobbyConnection()

            const handler = (payload: LobbyDetailsDto) => {
                if (!mounted) return
                setLobby(payload)
            }

            conn.on(EVENT_LOBBY_UPDATED, handler)
            await conn.invoke('SubscribeLobby', lobbyId)

            return async () => {
                conn.off(EVENT_LOBBY_UPDATED, handler)
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
    }, [lobbyId])

    return { lobby, setLobby }
}
