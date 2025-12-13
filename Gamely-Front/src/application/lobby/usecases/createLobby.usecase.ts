import type { Lobby } from "../../../domain/lobby/lobby";
import type { LobbyRepository, CreateLobbyInput } from "../ports/LobbyRepository";

export class CreateLobbyUseCase {
    constructor(private readonly repo: LobbyRepository) {}

    async execute(input: CreateLobbyInput): Promise<Lobby> {
        if (!input.hostPlayerId) throw new Error("HostPlayerId obligatoire");
        if (input.isPrivate && !input.password?.trim()) {
            throw new Error("Un mot de passe est requis pour un lobby privé");
        }
        return this.repo.create(input);
    }
}