import React, { useState } from 'react';
import {
    Modal,
    Typography,
    TextField,
    Button,
    Alert,
    Snackbar, Paper,
} from '@mui/material';
import {useCases} from "../../app/compositionRoot.ts";
import {useNavigate} from "react-router-dom";
import {useCurrentPlayer} from "../../app/hook/useCurrentPlayer.ts";

interface PseudoModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (pseudo: string) => void | Promise<void>;
}

const PseudoModal: React.FC<PseudoModalProps> = ({ open, onClose}) => {
    const [pseudo, setPseudo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setPlayer } = useCurrentPlayer();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const trimmed = pseudo.trim();
            if (trimmed.length < 3) {
                setError('Le pseudo doit contenir au moins 3 caractères');
                return;
            }

            if (trimmed.length > 20) {
                setError('Le pseudo ne peut pas dépasser 20 caractères');
                return;
            }

            if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
                setError('Le pseudo ne peut contenir que des lettres, chiffres et underscores');
                return;
            }
            const player = await useCases.player.register.execute(pseudo);
            setPlayer(player);
            showSnack('Pseudo modifié avec succès', 'success');
            navigate("/lobbies");
        } catch (error) {
            const message = "Erreur lors de l'enregistrement";
            setError(message);
            console.log(error);
            showSnack("Erreur lors de la modification du pseudo", 'error');

        } finally {
            setLoading(false);
        }
    };

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    const showSnack = (message: string, severity: typeof snackSeverity = 'success') => {
        setSnackMsg(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleSnackClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
    };

    const handleClose = () => {
        setError('');
        setPseudo('');
        onClose();
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper className="p-8 max-w-md w-full">
                    <Typography variant="h5" gutterBottom>
                        Bienvenue sur Gamely 👋
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-4">
                        Choisissez un pseudo pour commencer à jouer.
                    </Typography>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <TextField
                            label="Pseudo"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            fullWidth
                        />
                        {error && (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? "Chargement..." : "Commencer"}
                        </Button>
                    </form>
                </Paper>
            </Modal>

            <Snackbar
                open={snackOpen}
                autoHideDuration={4000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ top: '50%', transform: 'translateY(-50%)' }}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
                    {snackMsg}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PseudoModal;