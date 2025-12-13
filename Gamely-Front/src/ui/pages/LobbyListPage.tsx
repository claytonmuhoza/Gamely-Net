import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Stack,
    Typography,
    Button,
    Box,
    CircularProgress,
    Alert,
    Fab
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import { useCurrentPlayer } from "../../app/hook/useCurrentPlayer";
import { useCases } from "../../app/compositionRoot";
import { CreateLobbyDialog } from "../components/lobby/CreateLobbyDialog";
import { JoinLobbyDialog } from "../components/lobby/JoinLobbyDialog";
import { LobbyCard } from "../components/lobby/LobbyCard";
import type { Lobby } from "../../domain/lobby/lobby";
import type { GameType } from "../../domain/lobby/lobby";

export function LobbyListPage() {
    const { player } = useCurrentPlayer();
    const navigate = useNavigate();

    const [lobbies, setLobbies] = useState<Lobby[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialog, setJoinDialog] = useState<{
        open: boolean;
        lobby: Lobby | null;
    }>({ open: false, lobby: null });

    const loadLobbies = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await useCases.lobby.listOpen.execute();
            setLobbies(result);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des lobbies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLobbies();
    }, []);

    const handleCreateLobby = async (data: {
        gameType: GameType;
        isPrivate: boolean;
        password?: string;
    }) => {
        if (!player) {
            setError("Vous devez être connecté pour créer un lobby");
            return;
        }

        try {
            const lobby = await useCases.lobby.create.execute({
                hostPlayerId: player.id,
                gameType: data.gameType,
                isPrivate: data.isPrivate,
                password: data.password
            });

            await loadLobbies();
            // Optionally navigate to lobby detail page
            // navigate(`/lobby/${lobby.id}`);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du lobby");
            throw err;
        }
    };

    const handleJoinLobby = (lobby: Lobby) => {
        if (!player) {
            setError("Vous devez être connecté pour rejoindre un lobby");
            return;
        }

        if (lobby.isPrivate) {
            setJoinDialog({ open: true, lobby });
        } else {
            performJoin(lobby);
        }
    };

    const performJoin = async (lobby: Lobby, password?: string) => {
        if (!player) return;

        try {
            await useCases.lobby.join.execute({
                lobbyId: lobby.id,
                playerId: player.id,
                password
            });
            await loadLobbies();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la connexion au lobby");
            throw err;
        }
    };

    const handleStartGame = async (lobby: Lobby) => {
        try {
            // Start game based on game type
            switch (lobby.gameType) {
                case 0: // SpeedTyping
                {
                    const speedTypingGame = await useCases.speedTyping.start.execute(lobby.id);
                    navigate(`/speedtyping/${speedTypingGame.id}`);
                    break;
                }
                case 2: // Morpion
                {
                    const morpionGame = await useCases.morpion.start.execute(lobby.id);
                    navigate(`/morpion/${morpionGame.id}`);
                    break;
                }
                case 1: // puissance
                {
                    const puissanceGame = await useCases.puissance.start.execute(lobby.id);
                    navigate(`/puissance/${puissanceGame.id}`);
                    break;
                }
                default:
                    setError("Ce jeu n'est pas encore implémenté");
            }
        } catch (err: any) {
            setError(err.message || "Erreur lors du démarrage de la partie");
        }
    };

    if (!player) {
        return (
            <Container sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" }}>
                <Alert severity="warning" sx={{ maxWidth: 500 }}>
                    Veuillez d&apos;abord choisir un pseudo pour accéder aux lobbies.
                </Alert>
            </Container>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", padding: "32px 16px" }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                🎮 Lobbies de jeu
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Rejoignez une partie ou créez votre propre lobby
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={loadLobbies}
                                disabled={loading}
                            >
                                Actualiser
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setCreateDialogOpen(true)}
                                size="large"
                            >
                                Créer un lobby
                            </Button>
                        </Stack>
                    </Box>

                    {/* Error */}
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Loading */}
                    {loading && lobbies.length === 0 && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress size={60} />
                        </Box>
                    )}

                    {/* Empty State */}
                    {!loading && lobbies.length === 0 && (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                Aucun lobby disponible
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Soyez le premier à créer un lobby !
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Add />}
                                onClick={() => setCreateDialogOpen(true)}
                            >
                                Créer le premier lobby
                            </Button>
                        </Box>
                    )}

                    {/* Lobby Grid */}
                    {lobbies.length > 0 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)"
                                },
                                gap: 3
                            }}
                        >
                            {lobbies.map((lobby) => (
                                <LobbyCard
                                    key={lobby.id}
                                    lobby={lobby}
                                    currentPlayer={player}
                                    onJoin={handleJoinLobby}
                                    onStart={handleStartGame}
                                />
                            ))}
                        </Box>
                    )}
                </Stack>
            </Container>

            {/* Dialogs */}
            <CreateLobbyDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSubmit={handleCreateLobby}
            />

            {joinDialog.lobby && (
                <JoinLobbyDialog
                    open={joinDialog.open}
                    onClose={() => setJoinDialog({ open: false, lobby: null })}
                    lobbyId={joinDialog.lobby.id}
                    lobbyCode={joinDialog.lobby.code}
                    isPrivate={joinDialog.lobby.isPrivate}
                    onSubmit={(password) => performJoin(joinDialog.lobby!, password)}
                />
            )}

            {/* FAB for mobile */}
            <Fab
                color="primary"
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    display: { xs: "flex", md: "none" }
                }}
                onClick={() => setCreateDialogOpen(true)}
            >
                <Add />
            </Fab>
        </div>
    );
}