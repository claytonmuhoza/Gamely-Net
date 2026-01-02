export type GameActionLogDto = {
    id: string
    lobbyId: string
    gameSessionId: string
    gameId: string
    actionType: string
    payloadJson: string
    actorClientId: string | null
    at: string // ISO
}
