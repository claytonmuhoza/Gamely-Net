import { useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Stack,
    Box,
    LinearProgress
} from "@mui/material";
import {
    Lock,
    LockOpen,
    Person,
    PlayArrow,
    ExitToApp
} from "@mui/icons-material";
import type { Lobby } from "../../../domain/lobby/lobby";
import type { Player } from "../../../domain/player/player";

interface LobbyCardProps {
    lobby: Lobby;
    currentPlayer: Player | null;
    onJoin: (lobby: Lobby) => void;
    onStart: (lobby: Lobby) => void;
    onLeave?: (lobby: Lobby) => void;
}

const gameTypeLabels: Record<number, string> = {
    0: "⌨️ Speed Typing",
    1: "🔴 Puissance 4",
    2: "❌ Morpion",
    3: "🧠 Mastermind",
    4: "💣 Tic Tac Boom",
    5: "⚓ Bataille Navale",
    6: "📝 Petit Bac",
    7: "🌀 Labyrinthe"
};

export function LobbyCard({ lobby, currentPlayer, onJoin, onStart, onLeave }: LobbyCardProps) {
    const [loading, setLoading] = useState(false);
    const isInLobby = lobby.isInLobby(currentPlayer);
    const isHost = lobby.isHost(currentPlayer);
    const canStart = lobby.canStartGame(currentPlayer);
    const canJoin = lobby.canJoin(currentPlayer);
    const progress = (lobby.playerCount / lobby.maxPlayers) * 100;

    const handleAction = async (action: () => void) => {
        setLoading(true);
        try {
            action();
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <Card
            sx={{
                backgroundColor: "#1e1e1e",
                border: isInLobby ? "2px solid #2196f3" : "1px solid #424242",
                transition: "all 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                }
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <Typography variant="h6" fontWeight="bold">
                            {gameTypeLabels[lobby.gameType]}
                        </Typography>
                        <Chip
                            icon={lobby.isPrivate ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                            label={lobby.isPrivate ? "Privé" : "Public"}
                            size="small"
                            color={lobby.isPrivate ? "warning" : "success"}
                        />
                    </Box>

                    {/* Code */}
                    <Box
                        sx={{
                            backgroundColor: "#2a2a2a",
                            p: 1.5,
                            borderRadius: 1,
                            textAlign: "center"
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Code du lobby
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" letterSpacing={2}>
                            {lobby.code}
                        </Typography>
                    </Box>

                    {/* Players */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <Person fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                Joueurs
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {lobby.getPlayerCountLabel()}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 1,
                                backgroundColor: "#2a2a2a",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: lobby.isFull() ? "#f44336" : "#4caf50"
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                            Minimum {lobby.minPlayers} joueur{lobby.minPlayers > 1 ? "s" : ""}
                        </Typography>
                    </Box>

                    {/* Status */}
                    {isInLobby && (
                        <Chip
                            label={isHost ? "👑 Vous êtes l'hôte" : "✅ Vous êtes dans le lobby"}
                            color="primary"
                            size="small"
                        />
                    )}

                    {lobby.hasStarted && (
                        <Chip label="🎮 Partie en cours" color="error" size="small" />
                    )}
                </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                    {!isInLobby && canJoin && (
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            onClick={() => handleAction(() => onJoin(lobby))}
                        >
                            Rejoindre
                        </Button>
                    )}

                    {isInLobby && !isHost && onLeave && (
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            disabled={loading}
                            startIcon={<ExitToApp />}
                            onClick={() => handleAction(() => onLeave(lobby))}
                        >
                            Quitter
                        </Button>
                    )}

                    {isHost && canStart && (
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={loading}
                            startIcon={<PlayArrow />}
                            onClick={() => handleAction(() => onStart(lobby))}
                        >
                            Démarrer la partie
                        </Button>
                    )}

                    {isHost && !canStart && (
                        <Button variant="outlined" fullWidth disabled>
                            En attente de joueurs ({lobby.playerCount}/{lobby.minPlayers})
                        </Button>
                    )}
                </Stack>
            </CardActions>
        </Card>
    );
}