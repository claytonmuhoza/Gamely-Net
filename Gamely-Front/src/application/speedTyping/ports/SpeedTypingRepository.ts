import type { SpeedTypingGame } from "../../../domain/speedTyping/speedTyping";

export interface StartSpeedTypingGameInput {
    lobbyId: string;
    textDifficulty?: string;
    durationSeconds?: number;
}

export interface UpdateProgressInput {
    gameId: string;
    playerId: string;
    typedText: string;
}

export interface SpeedTypingRepository {
    /** Créer et démarrer une nouvelle partie */
    start(input: StartSpeedTypingGameInput): Promise<SpeedTypingGame>;

    /** Récupérer une partie par son ID */
    get(gameId: string): Promise<SpeedTypingGame>;

    /** Mettre à jour la progression (via REST, pas SignalR) */
    updateProgress(input: UpdateProgressInput): Promise<SpeedTypingGame>;
}
