// presentation/pages/SpeedTypingGamePage.tsx

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, CircularProgress, Alert } from "@mui/material";
import { useCases } from "../../app/compositionRoot";
import type { SpeedTypingGame } from "../../domain/speedTyping/speedTyping";
import { SpeedTypingBoard } from "../components/speedTyping/SpeedTypingBoard";
import { useCurrentPlayer } from "../../app/hook/useCurrentPlayer";
import { SpeedTypingSignalRClient } from "../../infrastructure/realtime/speedTyping/SpeedTypingSignalRClient";

export function SpeedTypingGamePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const { player } = useCurrentPlayer();

    const [game, setGame] = useState<SpeedTypingGame | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const signalRClientRef = useRef<SpeedTypingSignalRClient | null>(null);

    // Charger l'état initial via REST
    useEffect(() => {
        if (!gameId || !player) return;

        const load = async () => {
            try {
                setLoading(true);
                const g = await useCases.speedTyping.get.execute(gameId);
                setGame(g);
            } catch (err) {
                const message = "Erreur lors du chargement de la partie";
                setError(message);
                console.error(err);
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
        });

        client.onGameStarted((startedGame) => {
            console.log("[SpeedTypingGamePage] Game démarré via SignalR", startedGame);
            setGame(startedGame);
        });

        client.onError((err) => {
            console.error("SpeedTypingHub error", err);
            setError(typeof err === "string" ? err : err?.message ?? "Erreur temps réel");
        });

        (async () => {
            try {
                await client.joinGame(gameId, player.id);
            } catch (err) {
                console.error("joinGame error", err);
                const message = "Erreur lors de la connexion temps réel";
                setError(message);
            }
        })();

        return () => {
            client.stop().catch(() => {});
            signalRClientRef.current = null;
        };
    }, [gameId, player]);

    const handleStartGame = async () => {
        if (!gameId || !player) return;
        const client = signalRClientRef.current;
        if (!client) return;

        try {
            setError(null);
            await client.startGame(gameId);
        } catch (err) {
            const message = "Erreur lors du démarrage de la partie";
            console.error(err);
            setError(message);
        }
    };

    const handleTextChange = async (typedText: string) => {
        if (!gameId || !player) return;
        const client = signalRClientRef.current;
        if (!client) return;

        try {
            setError(null);
            await client.updateProgress(gameId, player.id, typedText);
        } catch (err) {
            const message = "Erreur lors de la mise à jour";
            console.error(err);
            setError(message);
        }
    };

    if (!player) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0a0a0a",
                    padding: "16px",
                }}
            >
                <Alert severity="warning" sx={{ maxWidth: "500px" }}>
                    Veuillez d&apos;abord choisir un pseudo.
                </Alert>
            </div>
        );
    }

    if (loading || !game) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0a0a0a",
                    padding: "16px",
                    gap: "16px",
                }}
            >
                <CircularProgress size={60} />
                <div style={{ fontSize: "18px", color: "#9e9e9e" }}>
                    Chargement de la partie...
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0a0a0a",
                padding: "32px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Stack spacing={3} alignItems="center" sx={{ width: "100%", maxWidth: "1200px" }}>
                {/* Affichage des erreurs */}
                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{ width: "100%" }}>
                        {error}
                    </Alert>
                )}

                {/* Board du jeu */}
                <SpeedTypingBoard
                    game={game}
                    currentPlayerId={player.id}
                    onStartGame={handleStartGame}
                    onTextChange={handleTextChange}
                />
            </Stack>
        </div>
    );
}