import * as signalR from "@microsoft/signalr";
import {createSignalRConnection} from "../signalRConnectionFactory.ts";
import type {PlayerProgress, PlayerResult, SpeedTypingGame} from "../../../domain/speedtyping/speedtyping.ts";

export class SpeedTypingSignalRClient {
  private connection: signalR.HubConnection;
  private isConnected = false;

  constructor() {
    this.connection = createSignalRConnection('/hubs/speedtyping');
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    await this.connection.start();
    this.isConnected = true;
    console.log('SpeedTyping SignalR connected');
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    await this.connection.stop();
    this.isConnected = false;
    console.log('SpeedTyping SignalR disconnected');
  }

  async joinGame(gameId: string): Promise<void> {
    await this.connection.invoke('JoinGame', gameId);
  }

  async leaveGame(gameId: string): Promise<void> {
    await this.connection.invoke('LeaveGame', gameId);
  }

  async startGame(gameId: string): Promise<void> {
    await this.connection.invoke('StartGame', gameId);
  }

  async updateProgress(gameId: string, playerId: string, typedText: string): Promise<void> {
    await this.connection.invoke('UpdateProgress', gameId, playerId, typedText);
  }

  async getResults(gameId: string): Promise<void> {
    await this.connection.invoke('GetResults', gameId);
  }

  onGameStarted(callback: (data: any) => void): void {
    this.connection.on('GameStarted', callback);
  }

  onPlayerProgressUpdated(callback: (progress: PlayerProgress) => void): void {
    this.connection.on('PlayerProgressUpdated', callback);
  }

  onPlayerFinished(callback: (data: any) => void): void {
    this.connection.on('PlayerFinished', callback);
  }

  onGameResults(callback: (results: PlayerResult[]) => void): void {
    this.connection.on('GameResults', callback);
  }

  onTimeUp(callback: (data: any) => void): void {
    this.connection.on('TimeUp', callback);
  }

  onError(callback: (error: any) => void): void {
    this.connection.on('Error', callback);
  }

  onGameState(callback: (game: SpeedTypingGame) => void): void {
    this.connection.on('GameState', callback);
  }
}