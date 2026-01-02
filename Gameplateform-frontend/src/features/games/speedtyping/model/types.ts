export type SpeedTypingRunnerDto = {
    clientId: string
    pseudo: string
    progress: number
    finishedAtUnixMs: number | null
}

export type SpeedTypingStateDto = {
    lobbyId: string
    phase: string // "Running" | "Finished"
    textId: string
    text: string
    startedAtUnixMs: number
    endedAtUnixMs: number | null
    runners: SpeedTypingRunnerDto[]
}

export type UpdateSpeedTypingProgressRequest = {
    clientId: string
    progress: number
}
