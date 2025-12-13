import type {LobbyRepository} from "../ports/LobbyRepository.ts";
import type {Lobby} from "../../../domain/lobby/lobby.ts";

export class GetLobbyUseCase {
    constructor(private readonly repo: LobbyRepository) {}

    async execute(lobbyId: string): Promise<Lobby> {
        if (!lobbyId) throw new Error("LobbyId obligatoire");
        return this.repo.getById(lobbyId);
    }
}