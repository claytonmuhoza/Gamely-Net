import type { Lobby, GameType } from "../../../domain/lobby/lobby";

export interface CreateLobbyInput {
  hostPlayerId: string;
  gameType: GameType;
  isPrivate: boolean;
  password?: string | null;
}

export interface JoinLobbyInput {
  lobbyId: string;
  playerId: string;
  password?: string | null;
}

export interface LobbyRepository {
  create(input: CreateLobbyInput): Promise<Lobby>;
  join(input: JoinLobbyInput): Promise<Lobby>;
  listOpen(): Promise<Lobby[]>;
}
