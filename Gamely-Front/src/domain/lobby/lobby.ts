import { Player } from "../player/player";
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

export class Lobby {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly gameType: GameType,
    public readonly isPrivate: boolean,
    public readonly hasStarted: boolean,
    public readonly hostPlayerId: string,
    public readonly playerIds: string[],
    public readonly minPlayers: number,
    public readonly maxPlayers: number
  ) {
    if (!id) throw new Error("Lobby.id is required");
    if (!code) throw new Error("Lobby.code is required");
    if (!hostPlayerId) throw new Error("Lobby.hostPlayerId is required");
    if (minPlayers <= 0 || maxPlayers <= 0 || minPlayers > maxPlayers) {
      throw new Error("Lobby player limits are invalid");
    }
  }

  /** Nombre actuel de joueurs */
  get playerCount(): number {
    return this.playerIds.length;
  }

  /** Est-ce que le lobby est plein ? */
  isFull(): boolean {
    return this.playerCount >= this.maxPlayers;
  }

  /** Est-ce que ce playerId est l'hôte du lobby ? */
  isHost(playerId: string | Player | null | undefined): boolean {
    if (!playerId) return false;
    const id = typeof playerId === "string" ? playerId : playerId.id;
    return this.hostPlayerId === id;
  }

  /** Est-ce que ce joueur est déjà dans le lobby ? */
  isInLobby(playerId: string | Player | null | undefined): boolean {
    if (!playerId) return false;
    const id = typeof playerId === "string" ? playerId : playerId.id;
    return this.playerIds.includes(id);
  }

  /** Peut-il rejoindre ce lobby (côté UI) ? */
  canJoin(playerId: string | Player | null | undefined): boolean {
    if (!playerId) return false;
    if (this.isInLobby(playerId)) return false;
    if (this.isFull()) return false;
    return true;
  }

  /** Peut-il démarrer la partie ? */
  canStartGame(playerId: string | Player | null | undefined): boolean {
    if (!playerId) return false;
    if (!this.isHost(playerId)) return false;
    if (this.hasStarted) return false;
    if (this.playerCount < this.minPlayers) return false;
    return true;
  }

  /** Label pratique pour la liste */
  getPlayerCountLabel(): string {
    return `${this.playerCount}/${this.maxPlayers}`;
  }

  /** Factory depuis un DTO API brut */
  static fromDto(dto: {
    id: string;
    code: string;
    gameType: GameType;
    isPrivate: boolean;
    hasStarted: boolean;
    hostPlayerId: string;
    playerIds: string[];
    minPlayers: number;
    maxPlayers: number;
  }): Lobby {
    return new Lobby(
      dto.id,
      dto.code,
      dto.gameType,
      dto.isPrivate,
      dto.hasStarted,
      dto.hostPlayerId,
      dto.playerIds,
      dto.minPlayers,
      dto.maxPlayers
    );
  }
}
