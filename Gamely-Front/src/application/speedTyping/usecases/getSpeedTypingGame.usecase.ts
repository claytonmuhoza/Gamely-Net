export class GetSpeedTypingGameUseCase {
    constructor(private readonly repo: SpeedTypingRepository) {}

    async execute(gameId: string): Promise<SpeedTypingGame> {
        if (!gameId) throw new Error("GameId obligatoire");
        return this.repo.get(gameId);
    }
}