import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormControlLabel,
    Switch,
    Stack,
    Typography,
    Alert
} from "@mui/material";
import { GameType } from "../../../domain/lobby/lobby";

interface CreateLobbyDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        gameType: GameType;
        isPrivate: boolean;
        password?: string;
    }) => Promise<void>;
}

const gameTypeLabels: Record<GameType, string> = {
    [GameType.SpeedTyping]: "⌨️ Speed Typing",
    [GameType.Puissance4]: "🔴 Puissance 4",
    [GameType.Morpion]: "❌ Morpion",
    [GameType.Mastermind]: "🧠 Mastermind",
    [GameType.TicTacBoom]: "💣 Tic Tac Boom",
    [GameType.BatailleNavale]: "⚓ Bataille Navale",
    [GameType.PetitBac]: "📝 Petit Bac",
    [GameType.Labyrinthe]: "🌀 Labyrinthe"
};

const gameTypeDescriptions: Record<GameType, string> = {
    [GameType.SpeedTyping]: "2-8 joueurs • Tapez plus vite que vos adversaires",
    [GameType.Puissance4]: "2 joueurs • Alignez 4 jetons",
    [GameType.Morpion]: "2 joueurs • Tic-Tac-Toe classique",
    [GameType.Mastermind]: "2 joueurs • Devinez la combinaison",
    [GameType.TicTacBoom]: "2-8 joueurs • Passez la bombe avant l'explosion",
    [GameType.BatailleNavale]: "2 joueurs • Coulez les navires ennemis",
    [GameType.PetitBac]: "2-8 joueurs • Trouvez des mots par catégorie",
    [GameType.Labyrinthe]: "2-4 joueurs • Sortez du labyrinthe en premier"
};

export function CreateLobbyDialog({ open, onClose, onSubmit }: CreateLobbyDialogProps) {
    const [gameType, setGameType] = useState<GameType>(GameType.SpeedTyping);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (isPrivate && !password.trim()) {
            setError("Veuillez saisir un mot de passe pour un lobby privé");
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                gameType,
                isPrivate,
                password: isPrivate ? password : undefined
            });
            // Reset form
            setGameType(GameType.SpeedTyping);
            setIsPrivate(false);
            setPassword("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du lobby");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                🎮 Créer un nouveau lobby
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <FormControl fullWidth>
                        <InputLabel>Type de jeu</InputLabel>
                        <Select
                            value={gameType}
                            label="Type de jeu"
                            onChange={(e) => setGameType(e.target.value as GameType)}
                        >
                            {Object.entries(gameTypeLabels).map(([value, label]) => (
                                <MenuItem key={value} value={Number(value)}>
                                    <Stack>
                                        <Typography variant="body1">{label}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {gameTypeDescriptions[Number(value) as GameType]}
                                        </Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                        }
                        label="Lobby privé (avec mot de passe)"
                    />

                    {isPrivate && (
                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            helperText="Les joueurs devront entrer ce mot de passe pour rejoindre"
                        />
                    )}

                    <Alert severity="info" icon="ℹ️">
                        Un code unique sera généré automatiquement pour partager votre lobby.
                    </Alert>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} disabled={loading}>
                    Annuler
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? "Création..." : "Créer le lobby"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}