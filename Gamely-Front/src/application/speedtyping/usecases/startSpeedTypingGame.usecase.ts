import type {SpeedTypingRepository} from "../ports/SpeedTypingRepository.ts";

export const startSpeedTypingGameUseCase = async (
    repository: SpeedTypingRepository,
    gameId: string
): Promise<void> => {
    await repository.startGame(gameId);
};
