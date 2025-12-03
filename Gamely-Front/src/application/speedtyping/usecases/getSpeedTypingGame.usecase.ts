import type {SpeedTypingRepository} from "../ports/SpeedTypingRepository.ts";
import type {SpeedTypingGame} from "../../../domain/speedtyping/speedtyping.ts";

export class GetSpeedTypingGameUseCase {
    constructor(private readonly repo: SpeedTypingRepository) {}

    async execute(gameId: string): Promise<SpeedTypingGame> {
        if (!gameId) throw new Error("GameId obligatoire");
        return this.repo.get(gameId);
    }
}
