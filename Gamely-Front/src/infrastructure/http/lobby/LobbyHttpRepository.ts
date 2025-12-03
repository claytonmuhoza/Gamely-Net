import type { LobbyRepository, CreateLobbyInput, JoinLobbyInput } from "../../../application/lobby/ports/LobbyRepository";
import { httpClient } from "../axiosHttpClient";
import { Lobby } from "../../../domain/lobby/lobby";

export class LobbyHttpRepository implements LobbyRepository {
    async create(input: CreateLobbyInput): Promise<Lobby> {
        const response = await httpClient.post("/api/lobby", {
            hostPlayerId: input.hostPlayerId,
            gameType: input.gameType,
            isPrivate: input.isPrivate,
            password: input.password
        });
        return Lobby.fromDto(response.data);
    }

    async listOpen(): Promise<Lobby[]> {
        const response = await httpClient.get("/api/lobby/open");
        return response.data.map((dto: any) => Lobby.fromDto(dto));
    }

    async join(input: JoinLobbyInput): Promise<Lobby> {
        const response = await httpClient.post(`/api/lobby/${input.lobbyId}/join`, {
            playerId: input.playerId,
            password: input.password
        });
        return Lobby.fromDto(response.data);
    }

    async getById(lobbyId: string): Promise<Lobby> {
        const response = await httpClient.get(`/api/lobby/${lobbyId}`);
        return Lobby.fromDto(response.data);
    }
}