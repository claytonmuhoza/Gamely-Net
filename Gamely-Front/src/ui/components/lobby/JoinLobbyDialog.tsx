import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Alert,
    Typography
} from "@mui/material";
import { Lock } from "@mui/icons-material";

interface JoinLobbyDialogProps {
    open: boolean;
    onClose: () => void;
    lobbyId: string;
    lobbyCode: string;
    isPrivate: boolean;
    onSubmit: (password?: string) => Promise<void>;
}

export function JoinLobbyDialog({
                                    open,
                                    onClose,
                                    lobbyId,
                                    lobbyCode,
                                    isPrivate,
                                    onSubmit
                                }: JoinLobbyDialogProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        if (isPrivate && !password.trim()) {
            setError("Veuillez entrer le mot de passe");
            return;
        }

        try {
            setLoading(true);
            await onSubmit(isPrivate ? password : undefined);
            setPassword("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la connexion au lobby");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {isPrivate ? <Lock sx={{ mr: 1, verticalAlign: "middle" }} /> : "🚪"}
                Rejoindre le lobby
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <Alert severity="info">
                        <Typography variant="subtitle2" fontWeight="bold">
                            Code du lobby: {lobbyCode}
                        </Typography>
                    </Alert>

                    {isPrivate && (
                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            autoFocus
                            helperText="Ce lobby est protégé par un mot de passe"
                        />
                    )}

                    {!isPrivate && (
                        <Typography variant="body2" color="text.secondary">
                            Vous êtes sur le point de rejoindre ce lobby public.
                        </Typography>
                    )}
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
                    {loading ? "Connexion..." : "Rejoindre"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}