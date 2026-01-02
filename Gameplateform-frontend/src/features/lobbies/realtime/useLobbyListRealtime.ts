import { useEffect, useRef, useState } from 'react'
import { getLobbyConnection } from '../../../shared/realtime/connection'
import type { LobbyListItemDto } from '../model/types'

const EVENT_LOBBY_LIST_UPDATED = 'LobbyListUpdated'

export function useLobbyListRealtime(initial: LobbyListItemDto[] = []) {
    const [lobbies, setLobbies] = useState<LobbyListItemDto[]>(initial)

    // ✅ empêche double subscribe en dev StrictMode
    const subscribedRef = useRef(false)

    useEffect(() => {
        let disposed = false
        let conn: Awaited<ReturnType<typeof getLobbyConnection>> | null = null

        async function run() {
            if (subscribedRef.current) return
            subscribedRef.current = true

            conn = await getLobbyConnection()
            if (disposed) return

            const handler = (payload: LobbyListItemDto[]) => {
                if (disposed) return
                setLobbies(payload)
            }

            conn.on(EVENT_LOBBY_LIST_UPDATED, handler)

            // Subscribe groupe
            await conn.invoke('SubscribeLobbyList')

            // Cleanup correct
            return async () => {
                conn?.off(EVENT_LOBBY_LIST_UPDATED, handler)
                try {
                    await conn?.invoke('UnsubscribeLobbyList')
                } catch {
                    // ignore (disconnect/navigation)
                }
            }
        }

        let cleanup: (() => Promise<void>) | null = null

        run().then((c) => {
            cleanup = c ?? null
        })

        return () => {
            disposed = true
            // permet de resubscribe si vous revenez plus tard sur la page
            subscribedRef.current = false
            if (cleanup) void cleanup()
        }
    }, [])

    return { lobbies, setLobbies }
}
