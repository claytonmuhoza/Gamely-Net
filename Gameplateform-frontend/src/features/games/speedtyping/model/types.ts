export type SpeedTypingRunnerDto = {
    clientId: string
    pseudo: string
    typedText: string
    correctChars: number
    errorCount: number
    wpm: number
    accuracy: number
    finishedAtUnixMs: number | null
    rank: number | null
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
    typedText: string
}
