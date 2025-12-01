import type { Lobby } from "../../../domain/lobby/lobby";
import type { LobbyRepository, JoinLobbyInput } from "../ports/LobbyRepository";

export class JoinLobbyUseCase {
  constructor(private readonly repo: LobbyRepository) {}

  async execute(input: JoinLobbyInput): Promise<Lobby> {
    return this.repo.join(input);
  }
}