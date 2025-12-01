import type { MorpionGame } from "../../../domain/morpion/morpion";

export interface PlayMoveInput {
  gameId: string;
  playerId: string;
  row: number;
  col: number;
}

export interface MorpionRepository {
  start(lobbyId: string): Promise<MorpionGame>;
  get(gameId: string): Promise<MorpionGame>;
  playMove(input: PlayMoveInput): Promise<MorpionGame>;
}
