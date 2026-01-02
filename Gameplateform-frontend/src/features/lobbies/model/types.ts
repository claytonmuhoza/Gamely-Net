export type LobbyListItemDto = {
    lobbyId: string
    gameId: string
    status: string
    isPrivate: boolean
    playersCount: number
    createdAt: string
    hostPseudo: string
}


export type CreateLobbyRequest = {
    clientId: string
    pseudo: string
    gameId: string
    isPrivate: boolean
    password?: string | null
}

export type CreateLobbyResponse = {
    lobbyId: string
    joinLink: string
}
export type LobbyPlayerDto = {
    clientId: string
    pseudo: string
}

export type LobbyDetailsDto = {
    lobbyId: string
    gameId: string
    status: string
    isPrivate: boolean
    hostClientId: string
    players: LobbyPlayerDto[]
    createdAt: string
}

export type JoinLobbyRequest = {
    clientId: string
    pseudo: string
    password?: string | null
}

export type LeaveLobbyRequest = {
    clientId: string
}

export type StartGameRequest = {
    clientId: string
}
