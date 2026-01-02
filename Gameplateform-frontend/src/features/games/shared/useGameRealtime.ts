import { useEffect, useRef, useState } from 'react'
import { getGameConnection } from '../../../shared/realtime/connection'

const EVENT_GAME_STATE_UPDATED = 'GameStateUpdated'
const EVENT_COMMAND_REJECTED = 'CommandRejected'

export function useGameRealtime<TState>(lobbyId: string) {
    const [state, setState] = useState<TState | null>(null)
    const [rejected, setRejected] = useState<string | null>(null)

    const subscribedRef = useRef(false)

    useEffect(() => {
        let disposed = false
        let conn: Awaited<ReturnType<typeof getGameConnection>> | null = null
        let cleanup: (() => Promise<void>) | null = null

        async function run() {
            if (subscribedRef.current) return
            subscribedRef.current = true

            conn = await getGameConnection()
            if (disposed) return

            const onState = (payload: TState) => {
                if (disposed) return
                setState(payload)
            }

            const onRejected = (payload: unknown) => {
                if (disposed) return
                if (typeof payload === 'string') {
                    setRejected(payload)
                    return
                }
                if (payload && typeof payload === 'object' && 'reason' in payload) {
                    setRejected(String((payload as any).reason))
                    return
                }
                setRejected('Commande rejetée')
            }

            conn.on(EVENT_GAME_STATE_UPDATED, onState)
            conn.on(EVENT_COMMAND_REJECTED, onRejected)

            await conn.invoke('SubscribeGame', lobbyId)

            cleanup = async () => {
                conn?.off(EVENT_GAME_STATE_UPDATED, onState)
                conn?.off(EVENT_COMMAND_REJECTED, onRejected)
                try {
                    await conn?.invoke('UnsubscribeGame', lobbyId)
                } catch {
                    // ignore
                }
            }
        }

        void run()

        return () => {
            disposed = true
            subscribedRef.current = false
            if (cleanup) void cleanup()
        }
    }, [lobbyId])

    return { state, setState, rejected, setRejected }
}
