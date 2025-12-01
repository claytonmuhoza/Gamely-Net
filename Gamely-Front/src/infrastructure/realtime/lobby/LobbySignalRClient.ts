import type * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "../signalRConnectionFactory";
import type { Lobby } from "../../../domain/lobby/lobby";

type LobbyUpdatedHandler = (lobby: Lobby) => void;
type ErrorHandler = (error: Error) => void;

export class LobbySignalRClient {
  private connection: signalR.HubConnection;
  private lobbyUpdatedHandlers: LobbyUpdatedHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];

  constructor() {
    this.connection = createSignalRConnection("/hubs/lobby");
  }

  onLobbyUpdated(handler: LobbyUpdatedHandler) {
    this.lobbyUpdatedHandlers.push(handler);
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler);
  }

  async start(): Promise<void> {
    if (this.connection.state === "Connected" || this.connection.state === "Connecting") {
      return;
    }

    this.connection.on("LobbyUpdated", (dto: Lobby) => {
      this.lobbyUpdatedHandlers.forEach((h) => h(dto));
    });

    this.connection.on("Error", (err) => {
      this.errorHandlers.forEach((h) => h(err));
    });

    await this.connection.start();
  }

  async stop(): Promise<void> {
    if (this.connection.state === "Disconnected") return;
    await this.connection.stop();
  }

  async joinLobby(lobbyId: string, playerId: string): Promise<void> {
    await this.start();
    await this.connection.invoke("JoinLobby", lobbyId, playerId);
  }
}
