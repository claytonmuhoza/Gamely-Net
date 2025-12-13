import type { PuissanceRepository } from "../ports/PuissanceRepository";
import type { PuissanceGame } from "../../../domain/puissance/puissance";

export class GetPuissanceGameUseCase {
  constructor(private readonly repo: PuissanceRepository) {}

  async execute(gameId: string): Promise<PuissanceGame> {
    if (!gameId) throw new Error("GameId obligatoire");
    return this.repo.get(gameId);
  }
}