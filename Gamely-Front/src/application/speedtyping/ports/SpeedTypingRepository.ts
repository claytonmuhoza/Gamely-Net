import type {
    CreateSpeedTypingGameDto,
    PlayerProgress,
    PlayerResult,
    SpeedTypingGame
} from "../../../domain/speedtyping/speedtyping.ts";

export interface SpeedTypingRepository {
    createGame(dto: CreateSpeedTypingGameDto): Promise<SpeedTypingGame>;
    getGameById(gameId: string): Promise<SpeedTypingGame>;
    getGameByLobbyId(lobbyId: string): Promise<SpeedTypingGame | null>;
    startGame(gameId: string): Promise<void>;
    updateProgress(gameId: string, playerId: string, typedText: string): Promise<void>;
    getResults(gameId: string): Promise<PlayerResult[]>;

    // SignalR methods
    joinGame(gameId: string): Promise<void>;
    leaveGame(gameId: string): Promise<void>;
    onGameStarted(callback: (data: any) => void): void;
    onPlayerProgressUpdated(callback: (progress: PlayerProgress) => void): void;
    onPlayerFinished(callback: (data: any) => void): void;
    onGameResults(callback: (results: PlayerResult[]) => void): void;
    onTimeUp(callback: (data: any) => void): void;
    onError(callback: (error: any) => void): void;
}