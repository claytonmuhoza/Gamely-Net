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

export type LobbyListItemDto = {
    lobbyId: string
    gameId: string
    status: string
    isPrivate: boolean
    playersCount: number
    createdAt: string
    hostPseudo: string
}

