import { LobbyHttpRepository } from "../infrastructure/http/lobby/LobbyHttpRepository";
import { PlayerHttpRepository } from "../infrastructure/http/player/PlayerHttpRepository";

import { RegisterPlayerUseCase } from "../application/player/usecases/registerPlayer.usecase";
import { CreateLobbyUseCase } from "../application/lobby/usecases/createLobby.usecase";
import { ListOpenLobbiesUseCase } from "../application/lobby/usecases/listOpenLobbies.usecase";
import { StartMorpionGameUseCase } from "../application/morpion/usecases/startMorpionGame.usecase";
import { GetMorpionGameUseCase } from "../application/morpion/usecases/getMorpionGame.usecase";
import { PlayMorpionMoveUseCase } from "../application/morpion/usecases/playMorpionMove.usecase";
import { MorpionHttpRepository } from "../infrastructure/http/morpion/MorpionHttpRepository";
import { JoinLobbyUseCase } from "../application/lobby/usecases/joinLobby.usecase";
import {SpeedTypingHttpRepository} from "../infrastructure/http/speedtyping/SpeedTypingHttpRepository.ts";
import {SpeedTypingSignalRClient} from "../infrastructure/realtime/speedtyping/SpeedTypingSignalRClient.ts";
import {SpeedTypingRepositoryImpl} from "../infrastructure/implementation/SpeedTypingRepositoryImpl.ts";
// Repositories
const playerRepository = new PlayerHttpRepository();
const lobbyRepository = new LobbyHttpRepository();
const morpionRepository = new MorpionHttpRepository();
const speedTypingHttpRepository = new SpeedTypingHttpRepository();
const speedTypingSignalRClient = new SpeedTypingSignalRClient();
// Use cases
export const useCases = {
  player: {
    register: new RegisterPlayerUseCase(playerRepository),
  },
  lobby: {
    create: new CreateLobbyUseCase(lobbyRepository),
    listOpen: new ListOpenLobbiesUseCase(lobbyRepository),
    join: new JoinLobbyUseCase(lobbyRepository),
  },
  morpion: {
    start: new StartMorpionGameUseCase(morpionRepository),
    get: new GetMorpionGameUseCase(morpionRepository),
    playMove: new PlayMorpionMoveUseCase(morpionRepository),
  },
};


export const speedTypingRepository = new SpeedTypingRepositoryImpl(
    speedTypingHttpRepository,
    speedTypingSignalRClient
);

