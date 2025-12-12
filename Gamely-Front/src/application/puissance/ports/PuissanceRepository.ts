import type { PuissanceGame } from "../../../domain/puissance/puissance";

export interface PlayMoveInput {
  gameId: string;
  playerId: string;
  column: number;
}

export interface PuissanceRepository {
  start(lobbyId: string): Promise<PuissanceGame>;
  get(gameId: string): Promise<PuissanceGame>;
  playMove(input: PlayMoveInput): Promise<PuissanceGame>;
}

