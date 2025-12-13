export class UpdateProgressUseCase {
    constructor(private readonly repo: SpeedTypingRepository) {}

    async execute(gameId: string, playerId: string, typedText: string): Promise<SpeedTypingGame> {
        if (!gameId || !playerId) {
            throw new Error("GameId et PlayerId obligatoires");
        }

        return this.repo.updateProgress({
            gameId,
            playerId,
            typedText
        });
    }
}