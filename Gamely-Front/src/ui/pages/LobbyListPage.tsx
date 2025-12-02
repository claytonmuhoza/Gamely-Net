import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { useCases } from "../../app/compositionRoot";
import { GameType, Lobby } from "../../domain/lobby/lobby";
import { useCurrentPlayer } from "../../app/hook/useCurrentPlayer";

export function LobbyListPage() {
  const { player } = useCurrentPlayer();
  const navigate = useNavigate();

  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);
  const [startingLobbyId, setStartingLobbyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await useCases.lobby.listOpen.execute();
        setLobbies(data);
      } catch (err) {
        const message = "Erreur lors du chargement des lobbys";
        console.log(err)
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [player, navigate]);

  const handleCreateMorpionLobby = async () => {
    if (!player) return;
    try {
      setCreating(true);
      await useCases.lobby.create.execute({
        hostPlayerId: player.id,
        gameType: GameType.SpeedTyping,
        isPrivate: false,
      });
      const data = await useCases.lobby.listOpen.execute();
      setLobbies(data);
    } catch (err) {
      const message ="Erreur lors de la création du lobby";
      console.log(err)
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinLobby = async (lobby: Lobby) => {
    if (!player) return;
    try {
      setJoiningLobbyId(lobby.id);
      await useCases.lobby.join.execute({
        lobbyId: lobby.id,
        playerId: player.id,
      });
      // On pourrait rediriger vers une future page LobbyDetail ici
      // Pour l'instant, on se contente de rafraîchir la liste
      const data = await useCases.lobby.listOpen.execute();
      setLobbies(data);
    } catch (err) {
      const message = "Erreur lors de la jointure du lobby";
      console.log(err);
      setError(message);
    } finally {
      setJoiningLobbyId(null);
    }
  };

  const handleStartMorpionGame = async (lobby: Lobby) => {
    if (!player) return;
    try {
      setStartingLobbyId(lobby.id);
      const game = await useCases.morpion.start.execute(lobby.id);
      navigate(`/morpion/${game.id}`);
    } catch (err) {
      const message =  "Erreur lors du démarrage de la partie";
      setError(message);
      console.log(err);
    } finally {
      setStartingLobbyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-4">
          <Typography variant="h5">Lobbys ouverts</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => window.location.reload()} disabled={loading}>
              Rafraîchir
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateMorpionLobby}
              disabled={creating}
            >
              {creating ? "Création..." : "Créer un lobby Morpion"}
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Typography color="error" className="mb-4">
            {error}
          </Typography>
        )}

        <Paper className="p-4">
          {loading ? (
            <Typography>Chargement...</Typography>
          ) : lobbies.length === 0 ? (
            <Typography>Aucun lobby disponible pour le moment.</Typography>
          ) : (
            <List>
              {lobbies.map((lobby) => {
              const canJoin = lobby.canJoin(player);
              const canStart = lobby.canStartGame(player);
              const isMorpion = lobby.gameType === GameType.Morpion;

              return (
              <ListItem
                key={lobby.id}
                divider
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
              <ListItemText
                  primary={`Lobby ${lobby.code} – ${GameType[lobby.gameType]} (${lobby.getPlayerCountLabel()})`}
                  secondary={lobby.isPrivate ? "Privé" : "Public"}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={joiningLobbyId === lobby.id || !canJoin}
                    onClick={() => handleJoinLobby(lobby)}
                  >
                    {joiningLobbyId === lobby.id ? "Jointure..." : canJoin ? "Rejoindre" : "Complet"}
                  </Button>
                  {isMorpion && (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!canStart || startingLobbyId === lobby.id}
                      onClick={() => handleStartMorpionGame(lobby)}
                    >
                      {startingLobbyId === lobby.id
                        ? "Démarrage..."
                        : canStart
                        ? "Démarrer la partie"
                        : "En attente de joueurs"}
                    </Button>
                  )}
                </Stack>
              </ListItem>);
              })}
            </List>
          )}
        </Paper>
      </div>
    </div>
  );
}
