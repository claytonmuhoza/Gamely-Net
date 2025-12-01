import * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "../signalRConnectionFactory";
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

type GameUpdatedHandler = (game: MorpionGame) => void;
type ErrorHandler = (error: Error) => void;

export class MorpionSignalRClient {
  private connection: signalR.HubConnection;
  private gameUpdatedHandlers: GameUpdatedHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private handlersRegistered = false;

  constructor() {
    this.connection = createSignalRConnection("/hubs/morpion");
  }

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

  onGameUpdated(handler: GameUpdatedHandler) {
    this.gameUpdatedHandlers.push(handler);
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler);
  }

  private registerHandlers() {
    if (this.handlersRegistered) return;
    this.handlersRegistered = true;

    this.connection.on("GameUpdated", (dto: MorpionGameDto) => {
      console.log("[MorpionSignalR] GameUpdated reçu", dto);
      const game = this.map(dto);
      this.gameUpdatedHandlers.forEach((h) => h(game));
    });

    this.connection.on("GameState", (dto: MorpionGameDto) => {
      console.log("[MorpionSignalR] GameState reçu", dto);
      const game = this.map(dto);
      this.gameUpdatedHandlers.forEach((h) => h(game));
    });

    this.connection.on("Error", (err) => {
      console.error("[MorpionSignalR] Error event", err);
      this.errorHandlers.forEach((h) => h(err));
    });
  }

  async start(): Promise<void> {
    if (
      this.connection.state === signalR.HubConnectionState.Connected ||
      this.connection.state === signalR.HubConnectionState.Connecting
    ) {
      return;
    }

    this.registerHandlers();

    try {
      await this.connection.start();
      console.log("[MorpionSignalR] Connection started");
    } catch (err) {
      console.error("[MorpionSignalR] Failed to start", err);
      this.errorHandlers.forEach((h) => h(err as Error));
      throw err;
    }
  }

  async stop(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) return;
    await this.connection.stop();
  }

  async joinGame(gameId: string, playerId: string): Promise<void> {
    await this.start();
    console.log("[MorpionSignalR] JoinGame invoke", gameId, playerId);
    await this.connection.invoke("JoinGame", gameId, playerId);
  }

  async playMove(gameId: string, playerId: string, row: number, col: number): Promise<void> {
    await this.start();
    console.log("[MorpionSignalR] PlayMove invoke", gameId, playerId, row, col);
    await this.connection.invoke("PlayMove", gameId, playerId, row, col);
  }
}
