import type { Lobby } from "../../../domain/lobby/lobby";
import type { LobbyRepository } from "../ports/LobbyRepository";

export class ListOpenLobbiesUseCase {
    constructor(private readonly repo: LobbyRepository) {}

    async execute(): Promise<Lobby[]> {
        return this.repo.listOpen();
    }
}