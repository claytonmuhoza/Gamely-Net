import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel
} from '@microsoft/signalr'
import { env } from '../config/env'

let lobbyConn: HubConnection | null = null
let gameConn: HubConnection | null = null

let lobbyStartPromise: Promise<void> | null = null
let gameStartPromise: Promise<void> | null = null

async function ensureStarted(conn: HubConnection, getPromise: () => Promise<void> | null, setPromise: (p: Promise<void> | null) => void) {
    // déjà connecté
    if (conn.state === HubConnectionState.Connected) return

    // un start est déjà en cours -> on attend
    const existing = getPromise()
    if (existing) {
        await existing
        return
    }

    // on ne start que si Disconnected
    if (conn.state === HubConnectionState.Disconnected) {
        const p = conn.start().finally(() => setPromise(null))
        setPromise(p)
        await p
        return
    }

    // Connecting / Reconnecting / Disconnecting -> on attend et on retente
    await new Promise((r) => setTimeout(r, 100))
    return ensureStarted(conn, getPromise, setPromise)
}

export async function getLobbyConnection(): Promise<HubConnection> {
    if (!lobbyConn) {
        lobbyConn = new HubConnectionBuilder()
            .withUrl(`${env.apiBaseUrl}${env.hubs.lobby}`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build()
    }

    await ensureStarted(
        lobbyConn,
        () => lobbyStartPromise,
        (p) => (lobbyStartPromise = p)
    )

    return lobbyConn
}

export async function getGameConnection(): Promise<HubConnection> {
    if (!gameConn) {
        gameConn = new HubConnectionBuilder()
            .withUrl(`${env.apiBaseUrl}${env.hubs.game}`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build()
    }

    await ensureStarted(
        gameConn,
        () => gameStartPromise,
        (p) => (gameStartPromise = p)
    )

    return gameConn
}
