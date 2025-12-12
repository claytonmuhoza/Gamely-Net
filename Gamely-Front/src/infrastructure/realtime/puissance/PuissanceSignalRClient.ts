import * as signalR from "@microsoft/signalr";
import { createSignalRConnection } from "../signalRConnectionFactory";

import { PuissanceGame } from "../../../domain/puissance/puissance";

interface PuissanceGameDto {
    id: string;
    lobbyId: string;
    board: string;
    playerOneId: string;
    playerTwoId: string;
    currentPlayerId: string;
    winnerPlayerId?: string | null;
    isFinished: boolean;
    isDraw: boolean;
}

type GameUpdatedHandler = (game: PuissanceGame) => void;
type ErrorHandler = (error: Error) => void;

export class PuissanceSignalRClient {
    private connection: signalR.HubConnection;
    private gameUpdatedHandlers: GameUpdatedHandler[] = [];
    private errorHandlers: ErrorHandler[] = [];
    private handlersRegistered = false;

    constructor() {
        this.connection = createSignalRConnection("/hubs/puissance");
    }

    private map(dto: PuissanceGameDto): PuissanceGame {
        return new PuissanceGame(
            dto.id,
            dto.lobbyId,
            dto.board,
            dto.playerOneId,
            dto.playerTwoId,
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

        this.connection.on("Error", (message: string) => {
            const error = new Error(message);
            this.errorHandlers.forEach((h) => h(error));
        });
    }

    async startConnection() {
        this.registerHandlers();
        if (this.connection.state === signalR.HubConnectionState.Disconnected ) {
            await this.connection.start();
            console.log("[PuissanceSignalR] Connexion démarrée");
        }
    }

    async stopConnection() {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.stop();
            console.log("[PuissanceSignalR] Connexion arrêtée");
        }
    }
}
