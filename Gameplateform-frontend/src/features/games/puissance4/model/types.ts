export type Puissance4PlayerDto = {
    clientId: string
    pseudo: string
    color: string // "R" | "Y"
}

export type Puissance4StateDto = {
    lobbyId: string
    phase: string // "Running" | "Finished"
    players: Puissance4PlayerDto[]
    currentPlayerId: string
    grid: string[][] // 7 colonnes, chaque colonne 6 cellules: "", "R", "Y"
    winnerClientId: string | null
    isDraw: boolean
}

export type DropPuissance4DiscRequest = {
    clientId: string
    column: number // 0..6
}
