import type { SpeedTypingRepository } from "../ports/SpeedTypingRepository";
import type { SpeedTypingGame } from "../../../domain/speedtyping/speedtyping";

export class StartSpeedTypingGameUseCase {
    constructor(private readonly repo: SpeedTypingRepository) {}

    async execute(lobbyId: string): Promise<SpeedTypingGame> {
        if (!lobbyId) throw new Error("LobbyId obligatoire");
        return this.repo.start(lobbyId);
    }
}