import type {SpeedTypingRepository} from "../ports/SpeedTypingRepository.ts";
import type {SpeedTypingGame} from "../../../domain/speedtyping/speedtyping.ts";

export const getSpeedTypingGameUseCase = async (
    repository: SpeedTypingRepository,
    gameId: string
): Promise<SpeedTypingGame> => {
    return await repository.getGameById(gameId);
};