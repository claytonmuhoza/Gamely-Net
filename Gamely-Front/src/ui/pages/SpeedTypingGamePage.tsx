import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { SpeedTypingBoard } from '../components/speedtyping/SpeedTypingBoard';
import { PlayerProgressList } from '../components/speedtyping/PlayerProgressList';
import { GameResults } from '../components/speedtyping/GameResults';
import {
    SpeedTypingStatus,
    TextDifficulty,
    type PlayerProgress,
    type PlayerResult,
    type SpeedTypingGame
} from '../../domain/speedtyping/speedtyping';
import {speedTypingRepository} from "../../app/compositionRoot.ts";
import {useCurrentPlayer} from "../../app/hook/useCurrentPlayer.ts";


export const SpeedTypingGamePage: React.FC= () => {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const { player } = useCurrentPlayer();
    const currentPlayerId = player?.id!;
    const navigate = useNavigate();
    const repository = speedTypingRepository;
    const [game, setGame] = useState<SpeedTypingGame | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    // Initialize game
    useEffect(() => {
        const initGame = async () => {
            if (!lobbyId) return;

            try {
                setLoading(true);

                // Get or create game
                let existingGame = await repository.getGameByLobbyId(lobbyId);

                if (!existingGame) {
                    // Create new game (à adapter selon votre logique de création)
                    const createDto = {
                        lobbyId,
                        textDifficulty: TextDifficulty.Medium,
                        playerIds: [currentPlayerId], // À compléter avec les joueurs du lobby
                        durationSeconds: 60
                    };
                    existingGame = await repository.createGame(createDto);
                }

                setGame(existingGame);
                setTimeRemaining(existingGame.durationSeconds);

                // Join SignalR
                await repository.joinGame(existingGame.id);

                // Setup listeners
                setupSignalRListeners();

            } catch (err: any) {
                setError(err.message || 'Erreur lors du chargement du jeu');
            } finally {
                setLoading(false);
            }
        };

        initGame();

        return () => {
            if (game) {
                repository.leaveGame(game.id);
            }
        };
    }, [lobbyId]);

    const setupSignalRListeners = useCallback(() => {
        repository.onGameStarted((data) => {
            setGame(prev => prev ? { ...prev, status: SpeedTypingStatus.InProgress, startedAt: data.startedAt } : null);
            setTimeRemaining(data.durationSeconds);
        });

        repository.onPlayerProgressUpdated((progress: PlayerProgress) => {
            setGame(prev => {
                if (!prev) return null;
                const updatedProgresses = prev.playerProgresses.map(p =>
                    p.playerId === progress.playerId ? progress : p
                );
                return { ...prev, playerProgresses: updatedProgresses };
            });
        });

        repository.onPlayerFinished((data) => {
            console.log('Player finished:', data);
        });

        repository.onGameResults((results: PlayerResult[]) => {
            setGame(prev => prev ? { ...prev, status: SpeedTypingStatus.Finished, results } : null);
        });

        repository.onTimeUp((data) => {
            setGame(prev => prev ? { ...prev, status: SpeedTypingStatus.Finished, results: data.results } : null);
        });

        repository.onError((error) => {
            setError(error.message);
        });
    }, [repository]);

    // Timer
    useEffect(() => {
        if (game?.status !== SpeedTypingStatus.InProgress) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [game?.status]);

    const handleStartGame = async () => {
        if (!game) return;
        try {
            await repository.startGame(game.id);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleTextChange = async (text: string) => {
        if (!game || game.status !== SpeedTypingStatus.InProgress) return;

        try {
            await repository.updateProgress(game.id, currentPlayerId, text);
        } catch (err: any) {
            console.error('Error updating progress:', err);
        }
    };

    const handlePlayAgain = () => {
        navigate(`/lobby/${lobbyId}`);
    };

    const handleBackToLobby = () => {
        navigate(`/lobby/${lobbyId}`);
    };

    if (loading) {
        return (
            <Container className="flex items-center justify-center min-h-screen">
                <CircularProgress size={60} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-8">
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!game) {
        return (
            <Container className="py-8">
                <Alert severity="warning">Jeu introuvable</Alert>
            </Container>
        );
    }

    const currentProgress = game.playerProgresses.find(p => p.playerId === currentPlayerId);

    return (
        <Container maxWidth="xl" className="py-8">
            <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Game Area */}
                <Box className="lg:col-span-2 space-y-6">
                    <Paper className="p-6">
                        <Typography variant="h4" className="mb-6 font-bold text-center">
                            ⌨️ Speed Typing
                        </Typography>

                        {game.status === SpeedTypingStatus.WaitingToStart && (
                            <Box className="text-center space-y-4">
                                <Typography variant="h6">En attente du démarrage...</Typography>
                                {isHost && (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleStartGame}
                                        color="primary"
                                    >
                                        Démarrer la partie
                                    </Button>
                                )}
                            </Box>
                        )}

                        {game.status === SpeedTypingStatus.InProgress && currentProgress && (
                            <SpeedTypingBoard
                                text={game.text}
                                currentProgress={currentProgress}
                                onTextChange={handleTextChange}
                                isGameStarted={true}
                                timeRemaining={timeRemaining}
                                totalTime={game.durationSeconds}
                            />
                        )}

                        {game.status === SpeedTypingStatus.Finished && (
                            <GameResults
                                results={game.results}
                                onPlayAgain={handlePlayAgain}
                                onBackToLobby={handleBackToLobby}
                            />
                        )}
                    </Paper>
                </Box>

                {/* Players Sidebar */}
                <Box className="space-y-4">
                    <Paper className="p-4">
                        <Typography variant="h6" className="mb-4 font-bold">
                            Joueurs ({game.playerProgresses.length})
                        </Typography>
                        <PlayerProgressList
                            progresses={game.playerProgresses}
                            currentPlayerId={currentPlayerId}
                        />
                    </Paper>

                    {game.status === SpeedTypingStatus.InProgress && (
                        <Paper className="p-4 bg-blue-50">
                            <Typography variant="h6" className="text-center font-bold text-blue-800">
                                ⏱️ {timeRemaining}s
                            </Typography>
                            <Typography variant="body2" className="text-center text-blue-600">
                                Temps restant
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Container>
    );
};