import { api } from "./client";

export enum GameType {
    SpeedTyping = 0,
    Puissance4 = 1,
    Morpion = 2,
    Mastermind = 3,
    TicTacBoom = 4,
    BatailleNavale = 5,
    PetitBac = 6,
    Labyrinthe = 7,
}

export type LobbyDto = {
    id: string;
    code: string;
    gameType: GameType;
    isPrivate: boolean;
    hasStarted: boolean;
    hostPlayerId: string;
    playerIds: string[];
    minPlayers: number;
    maxPlayers: number;
};

export type CreateLobbyCommand = {
    hostPlayerId: string;
    gameType: GameType;
    isPrivate: boolean;
    password?: string | null;
};

export type JoinLobbyCommand = {
    playerId: string;
    password?: string | null;
};

export async function createLobby(cmd: CreateLobbyCommand): Promise<LobbyDto> {
    const response = await api.post<LobbyDto>("/api/lobby", cmd);
    return response.data;
}

export async function joinLobby(lobbyId: string, cmd: JoinLobbyCommand): Promise<LobbyDto> {
    const response = await api.post<LobbyDto>(`/api/lobby/${lobbyId}/join`, cmd);
    return response.data;
}

export async function getOpenLobbies(): Promise<LobbyDto[]> {
    const response = await api.get<LobbyDto[]>("/api/lobby/open");
    return response.data;
}
