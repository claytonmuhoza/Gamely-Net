import type { PuissanceRepository, PlayMoveInput } from "../../../application/puissance/ports/PuissanceRepository";

import { httpClient } from "../axiosHttpClient";
import { PuissanceGame } from "../../../domain/puissance/puissance";

interface puissanceGmaeDto {
    id: string;
    lobbyId: string;
    board: string;
    playerOneId: string;
    playerTwoId: string;
    currentPlayerId: string;
    winnerPlayerId?: string | null;
    isFinished: boolean;
    isDraw: boolean;
}

export class PuissanceHttpRepository implements PuissanceRepository {
    private map(dto: puissanceGmaeDto): PuissanceGame {
        return new PuissanceGame(
            dto.id,
            dto.lobbyId,
            dto.board,
            dto.playerOneId,
            dto.playerTwoId,
            dto.currentPlayerId,
            dto.winnerPlayerId ?? null,
            dto.isFinished,
            dto.isDraw
        );
    }

    async start(lobbyId: string): Promise<PuissanceGame> {
        const response = await httpClient.post<puissanceGmaeDto>(`/api/puissance/start/${lobbyId}`);
        return this.map(response.data);
    }

    async get(gameId: string): Promise<PuissanceGame> {
        const response = await httpClient.get<puissanceGmaeDto>(`/api/puissance/${gameId}`);
        return this.map(response.data);

    }
    async playMove(input: PlayMoveInput): Promise<PuissanceGame> {
        const response = await httpClient.post<puissanceGmaeDto>(`/api/puissance/${input.gameId}/move`, {
            playerId: input.playerId,
            column: input.column,
        });
        return this.map(response.data);
    }


}