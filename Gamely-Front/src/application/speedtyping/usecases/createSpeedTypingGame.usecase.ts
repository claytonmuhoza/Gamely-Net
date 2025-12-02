import type {CreateSpeedTypingGameDto, SpeedTypingGame} from "../../../domain/speedtyping/speedtyping.ts";
import type {SpeedTypingRepository} from "../ports/SpeedTypingRepository.ts";

export const createSpeedTypingGameUseCase = async (
    repository: SpeedTypingRepository,
    dto: CreateSpeedTypingGameDto
): Promise<SpeedTypingGame> => {
    return await repository.createGame(dto);
};