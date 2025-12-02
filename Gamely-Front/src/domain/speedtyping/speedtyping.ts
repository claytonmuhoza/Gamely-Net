export enum TextDifficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

export enum SpeedTypingStatus {
    WaitingToStart = 'WaitingToStart',
    InProgress = 'InProgress',
    Finished = 'Finished'
}

export interface TypingText {
    id: string;
    content: string;
    difficulty: TextDifficulty;
    wordCount: number;
    language: string;
}

export interface PlayerProgress {
    playerId: string;
    playerPseudo: string;
    currentTypedText: string;
    correctCharacters: number;
    totalCharacters: number;
    errorCount: number;
    accuracy: number;
    currentWPM: number;
    hasFinished: boolean;
    finishedAt?: string;
    completionTime?: string;
}

export interface PlayerResult {
    playerId: string;
    playerPseudo: string;
    rank: number;
    completionTime: string;
    accuracy: number;
    wpm: number;
    errorCount: number;
    score: number;
}

export interface SpeedTypingGame {
    id: string;
    lobbyId: string;
    text: TypingText;
    status: SpeedTypingStatus;
    startedAt?: string;
    finishedAt?: string;
    durationSeconds: number;
    playerProgresses: PlayerProgress[];
    results: PlayerResult[];
}

export interface CreateSpeedTypingGameDto {
    lobbyId: string;
    textDifficulty: TextDifficulty;
    playerIds: string[];
    durationSeconds?: number;
}