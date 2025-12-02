import type {CreateSpeedTypingGameDto, PlayerResult, SpeedTypingGame} from "../../../domain/speedtyping/speedtyping.ts";
import {httpClient} from "../axiosHttpClient.ts";

export class SpeedTypingHttpRepository {
    async createGame(dto: CreateSpeedTypingGameDto): Promise<SpeedTypingGame> {
        const response = await httpClient.post<SpeedTypingGame>(`/games`, dto);
        return response.data;
    }

    async getGameById(gameId: string): Promise<SpeedTypingGame> {
        const response = await httpClient.get<SpeedTypingGame>(`/games/${gameId}`);
        return response.data;
    }

    async getGameByLobbyId(lobbyId: string): Promise<SpeedTypingGame | null> {
        try {
            const response = await httpClient.get<SpeedTypingGame>(`/games/lobby/${lobbyId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            throw error;
        }
    }

    async startGame(gameId: string): Promise<void> {
        await httpClient.post<void>(`/games/${gameId}/start`);
    }

    async getResults(gameId: string): Promise<PlayerResult[]> {
        const response = await httpClient.get<PlayerResult[]>(`/games/${gameId}/results`);
        return response.data;
    }
}