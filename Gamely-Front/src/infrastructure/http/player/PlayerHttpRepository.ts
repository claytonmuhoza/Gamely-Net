import type { PlayerRepository } from "../../../application/player/ports/PlayerRepository";
import { Player } from "../../../domain/player/player";
import { httpClient } from "../axiosHttpClient";

interface PlayerDto {
  id: string;
  pseudo: string;
}

export class PlayerHttpRepository implements PlayerRepository {
  async register(pseudo: string): Promise<Player> {
    const response = await httpClient.post<PlayerDto>("/api/player/register", { pseudo });
    const dto = response.data;
    return new Player(dto.id, dto.pseudo);
  }
}
