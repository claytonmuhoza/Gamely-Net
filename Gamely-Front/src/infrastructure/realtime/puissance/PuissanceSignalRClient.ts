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

    async start() {
        if (this.connection.state === signalR.HubConnectionState.Disconnected ) {
            this.registerHandlers();
            try{
                await this.connection.start();
                console.log("[PuissanceSignalR] Connexion démarrée");
            }catch (e) {
                console.error("[PuissanceSignalR] Erreur de connexion", e);
                throw e;
            }

        }
    }

    async stop() {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.stop();
            console.log("[PuissanceSignalR] Connexion arrêtée");
        }
    }

    async joinGame(gameId: string, playerId: string) {
        await this.start();
        try {
            await this.connection.invoke("JoinGame", gameId, playerId);
            console.log("[PuissanceSignalR] Rejoint le jeu", gameId);
        } catch (e) {
            console.error("[PuissanceSignalR] Erreur en rejoignant le jeu", e);
            throw e;
        }
    }

    async playMove(gameId: string, playerId: string, columnIndex: number) {
        try {
            await this.connection.invoke("PlayMove", gameId, playerId, columnIndex);
            console.log("[PuissanceSignalR] Move joué", { gameId, playerId, columnIndex });
        } catch (e) {
            console.error("[PuissanceSignalR] Erreur en jouant le move", e);
            throw e;
        }
    }
}
