import type { SpeedTypingRepository } from "../../../application/speedtyping/ports/SpeedTypingRepository";
import { httpClient } from "../axiosHttpClient";
import { SpeedTypingGame } from "../../../domain/speedtyping/speedtyping";

export class SpeedTypingHttpRepository implements SpeedTypingRepository {
    async start(lobbyId: string): Promise<SpeedTypingGame> {
        const response = await httpClient.post(`/api/speedtyping/start/${lobbyId}`);
        return SpeedTypingGame.fromDto(response.data);
    }

    async get(gameId: string): Promise<SpeedTypingGame> {
        const response = await httpClient.get(`/api/speedtyping/${gameId}`);
        return SpeedTypingGame.fromDto(response.data);
    }
}