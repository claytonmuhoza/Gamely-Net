import type { Lobby } from "../../../domain/lobby/lobby";
import type { GameType } from "../../../domain/lobby/lobby";

export interface CreateLobbyInput {
    hostPlayerId: string;
    gameType: GameType;
    isPrivate: boolean;
    password?: string;
}

export interface JoinLobbyInput {
    lobbyId: string;
    playerId: string;
    password?: string;
}

export interface LobbyRepository {
    create(input: CreateLobbyInput): Promise<Lobby>;

    listOpen(): Promise<Lobby[]>;

    join(input: JoinLobbyInput): Promise<Lobby>;

    getById(lobbyId: string): Promise<Lobby>;
}