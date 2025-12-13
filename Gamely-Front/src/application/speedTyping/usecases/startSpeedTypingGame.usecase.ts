import type { SpeedTypingRepository, StartSpeedTypingGameInput } from "../ports/SpeedTypingRepository";
import type { SpeedTypingGame } from "../../../domain/speedTyping/speedTyping";

export class StartSpeedTypingGameUseCase {
    constructor(private readonly repo: SpeedTypingRepository) {}

    async execute(lobbyId: string, textDifficulty?: string, durationSeconds?: number): Promise<SpeedTypingGame> {
        if (!lobbyId) throw new Error("LobbyId obligatoire");

        return this.repo.start({
            lobbyId,
            textDifficulty: textDifficulty || "Medium",
            durationSeconds: durationSeconds || 60
        });
    }
}