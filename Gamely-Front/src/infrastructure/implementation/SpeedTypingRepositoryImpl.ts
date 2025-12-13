import type {
    CreateSpeedTypingGameDto,
    PlayerProgress,
    PlayerResult,
    SpeedTypingGame
} from "../../domain/speedtyping/speedtyping.ts";
import type {SpeedTypingSignalRClient} from "../realtime/speedtyping/SpeedTypingSignalRClient.ts";
import type {SpeedTypingHttpRepository} from "../http/speedtyping/SpeedTypingHttpRepository.ts";
import type {SpeedTypingRepository} from "../../application/speedtyping/ports/SpeedTypingRepository.ts";

export class SpeedTypingRepositoryImpl implements SpeedTypingRepository {
  constructor(
    private httpRepository: SpeedTypingHttpRepository,
    private signalRClient: SpeedTypingSignalRClient
  ) {}

  async createGame(dto: CreateSpeedTypingGameDto): Promise<SpeedTypingGame> {
    return await this.httpRepository.createGame(dto);
  }

  async getGameById(gameId: string): Promise<SpeedTypingGame> {
    return await this.httpRepository.getGameById(gameId);
  }

  async getGameByLobbyId(lobbyId: string): Promise<SpeedTypingGame | null> {
    return await this.httpRepository.getGameByLobbyId(lobbyId);
  }

  async startGame(gameId: string): Promise<void> {
    await this.signalRClient.startGame(gameId);
  }

  async updateProgress(gameId: string, playerId: string, typedText: string): Promise<void> {
    await this.signalRClient.updateProgress(gameId, playerId, typedText);
  }

  async getResults(gameId: string): Promise<PlayerResult[]> {
    return await this.httpRepository.getResults(gameId);
  }

  async joinGame(gameId: string): Promise<void> {
    await this.signalRClient.connect();
    await this.signalRClient.joinGame(gameId);
  }

  async leaveGame(gameId: string): Promise<void> {
    await this.signalRClient.leaveGame(gameId);
    await this.signalRClient.disconnect();
  }

  onGameStarted(callback: (data: any) => void): void {
    this.signalRClient.onGameStarted(callback);
  }

  onPlayerProgressUpdated(callback: (progress: PlayerProgress) => void): void {
    this.signalRClient.onPlayerProgressUpdated(callback);
  }

  onPlayerFinished(callback: (data: any) => void): void {
    this.signalRClient.onPlayerFinished(callback);
  }

  onGameResults(callback: (results: PlayerResult[]) => void): void {
    this.signalRClient.onGameResults(callback);
  }

  onTimeUp(callback: (data: any) => void): void {
    this.signalRClient.onTimeUp(callback);
  }

  onError(callback: (error: any) => void): void {
    this.signalRClient.onError(callback);
  }
}