import type {
  LobbyRepository,
  CreateLobbyInput,
  JoinLobbyInput,
} from "../../../application/lobby/ports/LobbyRepository";
import { Lobby, GameType } from "../../../domain/lobby/lobby";
import { httpClient } from "../axiosHttpClient";

interface LobbyDto {
  id: string;
  code: string;
  gameType: GameType;
  isPrivate: boolean;
  hasStarted: boolean;
  hostPlayerId: string;
  playerIds: string[];
  minPlayers: number;
  maxPlayers: number;
}

export class LobbyHttpRepository implements LobbyRepository {
  private map(dto: LobbyDto): Lobby {
    return Lobby.fromDto(dto);
  }

  async create(input: CreateLobbyInput): Promise<Lobby> {
    const response = await httpClient.post<LobbyDto>("/api/lobby", {
      hostPlayerId: input.hostPlayerId,
      gameType: input.gameType,
      isPrivate: input.isPrivate,
      password: input.password,
    });
    return this.map(response.data);
  }

  async join(input: JoinLobbyInput): Promise<Lobby> {
    const response = await httpClient.post<LobbyDto>(`/api/lobby/${input.lobbyId}/join`, {
      playerId: input.playerId,
      password: input.password,
    });
    return this.map(response.data);
  }

  async listOpen(): Promise<Lobby[]> {
    const response = await httpClient.get<LobbyDto[]>("/api/lobby/open");
    return response.data.map((dto) => this.map(dto));
  }
}
