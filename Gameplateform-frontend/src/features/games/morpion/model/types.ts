export type MorpionPlayerDto = {
    clientId: string
    pseudo: string
    symbol: string // "X" | "O"
}

export type MorpionStateDto = {
    lobbyId: string
    phase: string // "Running" | "Finished"
    players: MorpionPlayerDto[]
    currentPlayerId: string
    board: string[] // "", "X", "O" (len 9)
    winnerClientId: string | null
    isDraw: boolean
}

export type PlayMorpionMoveRequest = {
    clientId: string
    index: number
}
