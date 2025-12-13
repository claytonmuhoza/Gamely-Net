import {GetPuissanceGameUseCase} from "../application/puissance/usecases/getPuissanceGame.usecase";
import {StartPuissanceGameUseCase} from "../application/puissance/usecases/StartPuissanceGame.usecase";
import {PlayPuissanceUsecase} from "../application/puissance/usecases/PlayPuissance.usecase";
import {PuissanceHttpRepository} from "../infrastructure/http/puissance/PuissanceHttpRepository";
import {LobbyHttpRepository} from "../infrastructure/http/lobby/LobbyHttpRepository";
import {PlayerHttpRepository} from "../infrastructure/http/player/PlayerHttpRepository";
import {MorpionHttpRepository} from "../infrastructure/http/morpion/MorpionHttpRepository";
import {SpeedTypingHttpRepository} from "../infrastructure/http/speedTyping/SpeedTypingHttpRepository";

import {RegisterPlayerUseCase} from "../application/player/usecases/registerPlayer.usecase";
import {CreateLobbyUseCase} from "../application/lobby/usecases/createLobby.usecase";
import {ListOpenLobbiesUseCase} from "../application/lobby/usecases/listOpenLobbies.usecase";
import {JoinLobbyUseCase} from "../application/lobby/usecases/joinLobby.usecase";

import {StartMorpionGameUseCase} from "../application/morpion/usecases/startMorpionGame.usecase";
import {GetMorpionGameUseCase} from "../application/morpion/usecases/getMorpionGame.usecase";
import {PlayMorpionMoveUseCase} from "../application/morpion/usecases/playMorpionMove.usecase";

import {StartSpeedTypingGameUseCase} from "../application/speedTyping/usecases/startSpeedTypingGame.usecase";
import {GetSpeedTypingGameUseCase} from "../application/speedTyping/usecases/getSpeedTypingGame.usecase";
import {UpdateProgressUseCase} from "../application/speedTyping/usecases/updateProgress.usecase";

// Repositories
const playerRepository = new PlayerHttpRepository();
const lobbyRepository = new LobbyHttpRepository();
const morpionRepository = new MorpionHttpRepository();
const puissanceRepository = new PuissanceHttpRepository();
const speedTypingRepository = new SpeedTypingHttpRepository();

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
    puissance: {
        start: new StartPuissanceGameUseCase(puissanceRepository),
        get: new GetPuissanceGameUseCase(puissanceRepository),
        playMove: new PlayPuissanceUsecase(puissanceRepository),
    },
    speedTyping: {
        start: new StartSpeedTypingGameUseCase(speedTypingRepository),
        get: new GetSpeedTypingGameUseCase(speedTypingRepository),
        updateProgress: new UpdateProgressUseCase(speedTypingRepository),
    }
};