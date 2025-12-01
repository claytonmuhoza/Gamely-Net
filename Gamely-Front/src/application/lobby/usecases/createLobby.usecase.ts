import type { Lobby } from "../../../domain/lobby/lobby";
import type { LobbyRepository, CreateLobbyInput } from "../ports/LobbyRepository";

export class CreateLobbyUseCase {
  constructor(private readonly repo: LobbyRepository) {}

  async execute(input: CreateLobbyInput): Promise<Lobby> {
    // ici tu peux ajouter des règles "UI" (ex: normaliser password)
    return this.repo.create(input);
  }
}