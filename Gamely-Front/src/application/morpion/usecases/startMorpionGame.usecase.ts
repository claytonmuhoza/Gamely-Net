import type { MorpionRepository } from "../ports/MorpionRepository";
import type { MorpionGame } from "../../../domain/morpion/morpion";

export class StartMorpionGameUseCase {
  constructor(private readonly repo: MorpionRepository) {}

  async execute(lobbyId: string): Promise<MorpionGame> {
    if (!lobbyId) throw new Error("LobbyId obligatoire");
    return this.repo.start(lobbyId);
  }
}
