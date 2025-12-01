import type { Player } from "../../../domain/player/player";
import type { PlayerRepository } from "../ports/PlayerRepository";

export class RegisterPlayerUseCase {
    
  constructor(private readonly repo: PlayerRepository) {}

  async execute(pseudo: string): Promise<Player> {
    if (!pseudo.trim()) {
      throw new Error("Le pseudo est obligatoire");
    }

    return this.repo.register(pseudo.trim());
  }
}
