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
import {StartSpeedTypingGameUseCase} from "../application/speedtyping/usecases/startSpeedTypingGame.usecase.ts";
import {GetSpeedTypingGameUseCase} from "../application/speedtyping/usecases/getSpeedTypingGame.usecase.ts";

import {GetPuissanceGameUseCase} from "../application/puissance/usecases/getPuissanceGame.usecase";
import {StartPuissanceGameUseCase} from "../application/puissance/usecases/StartPuissanceGame.usecase";
import {PlayPuissanceUsecase} from "../application/puissance/usecases/PlayPuissance.usecase";
import {PuissanceHttpRepository} from "../infrastructure/http/puissance/PuissanceHttpRepository";

// Repositories
const playerRepository = new PlayerHttpRepository();
const lobbyRepository = new LobbyHttpRepository();
const morpionRepository = new MorpionHttpRepository();
const speedtypingRepository = new SpeedTypingHttpRepository();
const puissanceRepository = new PuissanceHttpRepository();
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
  speedtyping: {
    start: new StartSpeedTypingGameUseCase(speedtypingRepository),
    get: new GetSpeedTypingGameUseCase(speedtypingRepository),
  },
  puissance: {
     start: new StartPuissanceGameUseCase(puissanceRepository),
     get: new GetPuissanceGameUseCase(puissanceRepository),
     playMove: new PlayPuissanceUsecase(puissanceRepository),
  }
};
