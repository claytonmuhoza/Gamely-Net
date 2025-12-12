import type { PuissanceRepository } from "../ports/PuissanceRepository";
import type {PuissanceGame} from "../../../domain/puissance/puissance.ts";

export class StartPuissanceGameUseCase {
  constructor(private readonly repo: PuissanceRepository) {}

  async execute(lobbyId: string): Promise<PuissanceGame> {
    if (!lobbyId) throw new Error("LobbyId obligatoire");
    return this.repo.start(lobbyId);
  }
}