import type {
    SpeedTypingRepository,
    StartSpeedTypingGameInput,
    UpdateProgressInput
} from "../../../application/speedTyping/ports/SpeedTypingRepository";
import { httpClient } from "../axiosHttpClient";
import { SpeedTypingGame } from "../../../domain/speedTyping/speedTyping";

interface SpeedTypingGameDto {
    id: string;
    lobbyId: string;
    text: {
        id: string;
        content: string;
        difficulty: string;
        wordCount: number;
        language: string;
    };
    status: string;
    startedAt: string | null;
    finishedAt: string | null;
    durationSeconds: number;
    playerProgresses: any[];
    results: any[];
}

export class SpeedTypingHttpRepository implements SpeedTypingRepository {
    private map(dto: SpeedTypingGameDto): SpeedTypingGame {
        return SpeedTypingGame.fromDto(dto);
    }

    async start(input: StartSpeedTypingGameInput): Promise<SpeedTypingGame> {
        const response = await httpClient.post<SpeedTypingGameDto>(
            `/api/speedtyping/start/${input.lobbyId}`,
            {
                lobbyId: input.lobbyId,
                textDifficulty: input.textDifficulty || "Medium",
                durationSeconds: input.durationSeconds || 60
            }
        );
        return this.map(response.data);
    }

    async get(gameId: string): Promise<SpeedTypingGame> {
        const response = await httpClient.get<SpeedTypingGameDto>(`/api/speedtyping/${gameId}`);
        return this.map(response.data);
    }

    async updateProgress(input: UpdateProgressInput): Promise<SpeedTypingGame> {
        // Cette méthode REST n'est pas utilisée car on passe par SignalR
        // Mais on la garde pour la cohérence de l'architecture
        const response = await httpClient.post<SpeedTypingGameDto>(
            `/api/speedtyping/${input.gameId}/progress`,
            {
                playerId: input.playerId,
                typedText: input.typedText
            }
        );
        return this.map(response.data);
    }
}