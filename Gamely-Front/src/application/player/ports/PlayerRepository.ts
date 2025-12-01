import type { Player } from "../../../domain/player/player";

export interface PlayerRepository {
  register(pseudo: string): Promise<Player>;
}