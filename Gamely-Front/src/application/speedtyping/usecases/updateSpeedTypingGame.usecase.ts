import type {SpeedTypingRepository} from "../ports/SpeedTypingRepository.ts";

export const updateSpeedTypingProgressUseCase = async (
    repository: SpeedTypingRepository,
    gameId: string,
    playerId: string,
    typedText: string
): Promise<void> => {
    await repository.updateProgress(gameId, playerId, typedText);
};
