// typescript
import * as SignalR from "@microsoft/signalr";
import { createSignalRConnection } from "../signalRConnectionFactory";
import { PuissanceGame } from '../../../domain/puissance/puissance';
import * as signalR from "@microsoft/signalr";

interface PuissanceGameDto {
    id: string;
    lobbyId: string;
    board: string;
    playerRedId: string;
    playerYellowId: string;
    currentPlayerId: string;
    winnerPlayerId?: string | null;
    isFinished: boolean;
    isDraw: boolean;
}
type GameUpdatedHandler = (game: PuissanceGame) => void;
type ErrorHandler = (error: any) => void;

export class PuissanceSignalRClient {
    private connection: SignalR.HubConnection;
    private gameUpdatedHandlers: GameUpdatedHandler[] = [];
    private errorHandlers: ErrorHandler[] = [];
    private handlersRegistered = false;

    constructor() {
        this.connection = createSignalRConnection('/hubs/puissance');
    }

    private map(dto: PuissanceGameDto): PuissanceGame {
        return new PuissanceGame(
            dto.id,
            dto.lobbyId,
            dto.board,
            dto.playerRedId,
            dto.playerYellowId,
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

        this.connection.on("GameUpdated", (dto: PuissanceGameDto) => {
            console.log("[PuissanceSignalR] GameUpdated reçu", dto);
            const game = this.map(dto);
            this.gameUpdatedHandlers.forEach((h) => h(game));
        });

        this.connection.on("GameState", (dto: PuissanceGameDto) => {
            console.log("[PuissanceSignalR] GameState reçu", dto);
            const game = this.map(dto);
            this.gameUpdatedHandlers.forEach((h) => h(game));
        });

        this.connection.on("Error", (err) => {
            console.error("[PuissanceSignalR] Error event", err);
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
            console.log("[PuissanceSignalR] Connection started");
        } catch (err) {
            console.error("[PuissanceSignalR] Failed to start", err);
            this.errorHandlers.forEach((h) => h(err as Error));
            throw err;
        }
    }
    
    async stop(): Promise<void> {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) return;
        await this.connection.stop();
    }

    async joinGame(gameId: string, playerId: string): Promise<void> {
        //await this.start();
        console.log("[PuissanceSignalR] JoinGame invoke", gameId, playerId);
        await this.connection.invoke("JoinGame", gameId, playerId);
    }

    async playMove(gameId: string, playerId: string, column: number): Promise<void> {

        //await this.start();
        console.log("[PuissanceSignalR] PlayMove invoke", gameId, playerId,column );
        await this.connection.invoke("PlayMove", gameId, playerId,column);
    }
}