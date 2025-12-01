import type { MorpionRepository, PlayMoveInput } from "../../../application/morpion/ports/MorpionRepository";
import { httpClient } from "../axiosHttpClient";
import { MorpionGame } from "../../../domain/morpion/morpion";

interface MorpionGameDto {
  id: string;
  lobbyId: string;
  board: string;
  playerXId: string;
  playerOId: string;
  currentPlayerId: string;
  winnerPlayerId?: string | null;
  isFinished: boolean;
  isDraw: boolean;
}

export class MorpionHttpRepository implements MorpionRepository {
  private map(dto: MorpionGameDto): MorpionGame {
    return new MorpionGame(
      dto.id,
      dto.lobbyId,
      dto.board,
      dto.playerXId,
      dto.playerOId,
      dto.currentPlayerId,
      dto.winnerPlayerId ?? null,
      dto.isFinished,
      dto.isDraw
    );
  }

  async start(lobbyId: string): Promise<MorpionGame> {
    const response = await httpClient.post<MorpionGameDto>(`/api/morpion/start/${lobbyId}`);
    return this.map(response.data);
  }

  async get(gameId: string): Promise<MorpionGame> {
    const response = await httpClient.get<MorpionGameDto>(`/api/morpion/${gameId}`);
    return this.map(response.data);
  }

  async playMove(input: PlayMoveInput): Promise<MorpionGame> {
    const response = await httpClient.post<MorpionGameDto>(`/api/morpion/${input.gameId}/move`, {
      playerId: input.playerId,
      row: input.row,
      col: input.col,
    });
    return this.map(response.data);
  }
}
