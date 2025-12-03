import type {
    SpeedTypingGame
} from "../../../domain/speedtyping/speedtyping.ts";

export interface SpeedTypingRepository {
    start(lobbyId: string): Promise<SpeedTypingGame>;
    get(gameId: string): Promise<SpeedTypingGame>;
}