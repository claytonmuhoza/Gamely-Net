import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stack, Typography, Button, CircularProgress, Alert, Paper, Box } from "@mui/material";
import { useCases } from "../../app/compositionRoot";
import type { SpeedTypingGame } from "../../domain/speedtyping/speedtyping";
import { SpeedTypingBoard } from "../components/speedtyping/SpeedTypingBoard";
import { PlayerProgressList } from "../components/speedtyping/PlayerProgressList";
import { GameResults } from "../components/speedtyping/GameResults";
import { useCurrentPlayer } from "../../app/hook/useCurrentPlayer";
import { SpeedTypingSignalRClient } from "../../infrastructure/realtime/speedtyping/SpeedTypingSignalRClient";
import { SpeedTypingStatus } from "../../domain/speedtyping/speedtyping";

export function SpeedTypingGamePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const { player } = useCurrentPlayer();
    const navigate = useNavigate();

    const [game, setGame] = useState<SpeedTypingGame | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const signalRClientRef = useRef<SpeedTypingSignalRClient | null>(null);

    // Charger l'état initial via REST
    useEffect(() => {
        if (!gameId || !player) return;

        const load = async () => {
            try {
                setLoading(true);
                const g = await useCases.speedtyping.get.execute(gameId);
                setGame(g);
                setTimeRemaining(g.getTimeRemaining());
            } catch (err) {
                setError("Erreur lors du chargement de la partie");
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [gameId, player]);

    // Connexion SignalR + join du hub
    useEffect(() => {
        if (!gameId || !player) return;

        const client = new SpeedTypingSignalRClient();
        signalRClientRef.current = client;

        client.onGameUpdated((updatedGame) => {
            console.log("[SpeedTypingGamePage] Game mis à jour via SignalR", updatedGame);
            setGame(updatedGame);
            setTimeRemaining(updatedGame.getTimeRemaining());
        });

        client.onError((err) => {
            console.log("SpeedTypingHub error", err);
            setError(typeof err === "string" ? err : err?.message ?? "Erreur temps réel");
        });

        (async () => {
            try {
                await client.joinGame(gameId, player.id);
            } catch (err) {
                console.log("joinGame error", err);
                setError("Erreur lors de la connexion temps réel");
            }
        })();

        return () => {
            client.stop().catch(() => {});
            signalRClientRef.current = null;
        };
    }, [gameId, player]);

    // Timer
    useEffect(() => {
        if (!game || game.status !== SpeedTypingStatus.InProgress) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
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
        if (!gameId) return;
        const client = signalRClientRef.current;
        if (!client) return;

        try {
            await client.startGame(gameId);
        } catch (err) {
            console.log("startGame error", err);
            setError("Erreur lors du démarrage");
        }
    };

    const handleTextChange = async (text: string) => {
        if (!gameId || !player || !game || !game.isInProgress) return;
        const client = signalRClientRef.current;
        if (!client) return;

        try {
            await client.updateProgress(gameId, player.id, text);
        } catch (err) {
            console.log("updateProgress error", err);
        }
    };

    if (!player) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", padding: "16px" }}>
                <Alert severity="warning">Veuillez d&apos;abord choisir un pseudo.</Alert>
            </div>
        );
    }

    if (loading || !game) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", gap: "16px" }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">Chargement de la partie...</Typography>
            </div>
        );
    }

    const currentProgress = game.getPlayerProgress(player.id);
    const isHost = game.lobbyId; // À adapter selon votre logique

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", padding: "32px 16px" }}>
            <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
                    {/* Main Game Area */}
                    <Stack spacing={3}>
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                        )}

                        <Paper sx={{ p: 4, backgroundColor: "#121212" }}>
                            <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
                                ⌨️ Speed Typing
                            </Typography>

                            {game.isWaiting && (
                                <Stack spacing={3} alignItems="center">
                                    <Typography variant="h6">En attente du démarrage...</Typography>
                                    {isHost && (
                                        <Button variant="contained" size="large" onClick={handleStartGame}>
                                            Démarrer la partie
                                        </Button>
                                    )}
                                </Stack>
                            )}

                            {game.isInProgress && currentProgress && (
                                <SpeedTypingBoard
                                    text={game.text}
                                    currentProgress={currentProgress}
                                    onTextChange={handleTextChange}
                                    isGameStarted={true}
                                    timeRemaining={timeRemaining}
                                    totalTime={game.durationSeconds}
                                />
                            )}

                            {game.isFinished && (
                                <GameResults
                                    results={game.results}
                                    onBackToLobby={() => navigate(`/lobbies`)}
                                />
                            )}
                        </Paper>
                    </Stack>

                    {/* Players Sidebar */}
                    <Stack spacing={3}>
                        <Paper sx={{ p: 3, backgroundColor: "#121212" }}>
                            <Typography variant="h6" mb={2} fontWeight="bold">
                                👥 Joueurs ({game.playerProgresses.length})
                            </Typography>
                            <PlayerProgressList
                                progresses={game.playerProgresses}
                                currentPlayerId={player.id}
                            />
                        </Paper>

                        {game.isInProgress && (
                            <Paper sx={{ p: 3, backgroundColor: "#1e3a5f", textAlign: "center" }}>
                                <Typography variant="h3" fontWeight="bold" color="primary">
                                    ⏱️ {timeRemaining}s
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Temps restant
                                </Typography>
                            </Paper>
                        )}
                    </Stack>
                </Box>
            </Box>
        </div>
    );
}