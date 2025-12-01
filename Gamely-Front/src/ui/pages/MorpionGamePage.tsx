import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { useCases } from "../../app/compositionRoot";
import type { MorpionGame } from "../../domain/morpion/morpion";
import { MorpionBoard } from "../components/morpion/MorpionBoard";
import { useCurrentPlayer } from "../../app/hook/useCurrentPlayer";
import { MorpionSignalRClient } from "../../infrastructure/realtime/morpion/MorpionSignalRClient";

export function MorpionGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { player } = useCurrentPlayer();

  const [game, setGame] = useState<MorpionGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signalRClientRef = useRef<MorpionSignalRClient | null>(null);

  // Charger l'état initial via REST
  useEffect(() => {
    if (!gameId || !player) return;

    const load = async () => {
      try {
        setLoading(true);
        const g = await useCases.morpion.get.execute(gameId);
        setGame(g);
      } catch (err) {
        const message = "Erreur lors du chargement de la partie";
        setError(message);
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

    const client = new MorpionSignalRClient();
    signalRClientRef.current = client;

    client.onGameUpdated((updatedGame) => {
      console.log("[MorpionGamePage] Game mis à jour via SignalR", updatedGame);
      setGame(updatedGame);
    });

    client.onError((err) => {
      console.log("MorpionHub error", err);
      setError(typeof err === "string" ? err : err?.message ?? "Erreur temps réel");
    });

    (async () => {
      try {
        await client.joinGame(gameId, player.id);
      } catch (err) {
        console.log("joinGame error", err);
        const message = "Erreur lors de la connexion temps réel";
        setError(message);
      }
    })();

    return () => {
      client.stop().catch(() => {});
      signalRClientRef.current = null;
    };
  }, [gameId, player]);

  const handleCellClick = async (row: number, col: number) => {
    if (!gameId || !player) return;
    const client = signalRClientRef.current;
    if (!client) return;

    try {
      setPlaying(true);
      setError(null); // Reset l'erreur avant de jouer
      // 👉 On passe par SignalR, pas par l'API REST
      await client.playMove(gameId, player.id, row, col);
      // Pas de setGame ici, on attend GameUpdated
    } catch (err) {
      const message = "Erreur lors du coup (temps réel)";
      console.log(err);
      setError(message);
    } finally {
      setPlaying(false);
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
        <Typography variant="h6" color="text.secondary">
          Chargement de la partie...
        </Typography>
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
      <Stack spacing={3} alignItems="center" sx={{ width: "100%", maxWidth: "800px" }}>
        {/* Affichage des erreurs */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        {/* Indicateur de jeu en cours */}
        {playing && (
          <Alert severity="info" icon={<CircularProgress size={20} />} sx={{ width: "100%" }}>
            Coup en cours d&apos;envoi...
          </Alert>
        )}

        {/* Board du jeu */}
        <MorpionBoard
          game={game}
          currentPlayerId={player.id}
          onCellClick={playing ? undefined : handleCellClick}
        />

        {/* Bouton de rechargement */}
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          size="large"
          sx={{
            minWidth: "200px",
            borderColor: "#616161",
            color: "#fff",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Recharger l&apos;état
        </Button>
      </Stack>
    </div>
  );
}