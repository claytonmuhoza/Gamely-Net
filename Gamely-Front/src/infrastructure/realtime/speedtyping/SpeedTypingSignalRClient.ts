
import * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "../signalRConnectionFactory";
import { SpeedTypingGame } from "../../../domain/speedtyping/speedtyping";

type GameUpdatedHandler = (game: SpeedTypingGame) => void;
type ErrorHandler = (error: any) => void;

export class SpeedTypingSignalRClient {
    private connection: signalR.HubConnection;
    private gameUpdatedHandlers: GameUpdatedHandler[] = [];
    private errorHandlers: ErrorHandler[] = [];
    private handlersRegistered = false;

    constructor() {
        this.connection = createSignalRConnection("/hubs/speedtyping");
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

        this.connection.on("GameUpdated", (dto: any) => {
            console.log("[SpeedTypingSignalR] GameUpdated reçu", dto);
            const game = SpeedTypingGame.fromDto(dto);
            this.gameUpdatedHandlers.forEach((h) => h(game));
        });

        this.connection.on("GameState", (dto: any) => {
            console.log("[SpeedTypingSignalR] GameState reçu", dto);
            const game = SpeedTypingGame.fromDto(dto);
            this.gameUpdatedHandlers.forEach((h) => h(game));
        });

        this.connection.on("GameStarted", (dto: any) => {
            console.log("[SpeedTypingSignalR] GameStarted reçu", dto);
            const game = SpeedTypingGame.fromDto(dto);
            this.gameUpdatedHandlers.forEach((h) => h(game));
        });

        this.connection.on("Error", (err) => {
            console.error("[SpeedTypingSignalR] Error event", err);
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
            console.log("[SpeedTypingSignalR] Connection started");
        } catch (err) {
            console.error("[SpeedTypingSignalR] Failed to start", err);
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
        console.log("[SpeedTypingSignalR] JoinGame invoke", gameId, playerId);
        await this.connection.invoke("JoinGame", gameId, playerId);
    }

    async startGame(gameId: string): Promise<void> {
        await this.start();
        console.log("[SpeedTypingSignalR] StartGame invoke", gameId);
        await this.connection.invoke("StartGame", gameId);
    }

    async updateProgress(gameId: string, playerId: string, typedText: string): Promise<void> {
        await this.start();
        await this.connection.invoke("UpdateProgress", gameId, playerId, typedText);
    }
}