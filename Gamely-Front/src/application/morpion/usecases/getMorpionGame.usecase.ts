import type { MorpionRepository } from "../ports/MorpionRepository";
import type { MorpionGame } from "../../../domain/morpion/morpion";

export class GetMorpionGameUseCase {
  constructor(private readonly repo: MorpionRepository) {}

  async execute(gameId: string): Promise<MorpionGame> {
    if (!gameId) throw new Error("GameId obligatoire");
    return this.repo.get(gameId);
  }
}
