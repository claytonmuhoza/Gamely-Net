import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import { X, Zap, User } from 'lucide-react';

interface PseudoModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (pseudo: string) => void | Promise<any>;
}

const PseudoModal: React.FC<PseudoModalProps> = ({ open, onClose, onSubmit }) => {
    const [pseudo, setPseudo] = useState('');
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
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

        // Submit (support synchrone ou asynchrone)
        setError('');
        try {
            const result = onSubmit(trimmed);
            if (result && typeof (result as any).then === 'function') {
                (result as Promise<any>)
                    .then(() => {
                        showSnack('Pseudo modifié avec succès', 'success');
                    })
                    .catch(() => {
                        showSnack("Erreur lors de la modification du pseudo", 'error');
                    });
            } else {
                showSnack('Pseudo modifié avec succès', 'success');
            }
        } catch {
            showSnack("Erreur lors de la modification du pseudo", 'error');
        }

        // Reset and close modal (notification reste visible)
        setPseudo('');
        onClose();
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
                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: '90%', sm: 450 },
                        backgroundColor: '#1e293b',
                        borderRadius: 3,
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <X size={20} />
                    </IconButton>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 2,
                                background: 'linear-gradient(to bottom right, #a855f7, #ec4899)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Zap size={36} color="white" />
                        </Box>
                    </Box>

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 1,
                        }}
                    >
                        Bienvenue sur Gamely
                    </Typography>

                    <Typography
                        sx={{
                            color: 'rgba(209, 213, 219, 1)',
                            textAlign: 'center',
                            mb: 4,
                            fontSize: '0.875rem',
                        }}
                    >
                        Choisissez votre pseudo pour commencer l'aventure
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            placeholder="Entrez votre pseudo"
                            value={pseudo}
                            onChange={(e) => {
                                setPseudo(e.target.value);
                                setError('');
                            }}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: 'rgba(168, 85, 247, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(168, 85, 247, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#a855f7',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '14px 16px',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: 'rgba(156, 163, 175, 1)',
                                    opacity: 1,
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                        <User size={20} color="rgba(168, 85, 247, 1)" />
                                    </Box>
                                ),
                            }}
                        />

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2,
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#fca5a5',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    '& .MuiAlert-icon': {
                                        color: '#fca5a5',
                                    },
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                border: '1px solid rgba(168, 85, 247, 0.2)',
                                borderRadius: 2,
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: 'rgba(209, 213, 219, 1)',
                                    fontSize: '0.75rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                <strong style={{ color: '#c084fc' }}>Règles du pseudo :</strong>
                                <br />
                                • Entre 3 et 20 caractères
                                <br />
                                • Lettres, chiffres et underscores uniquement
                                <br />• Pas d'espaces ou caractères spéciaux
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleClose}
                                sx={{
                                    color: 'rgba(209, 213, 219, 1)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    textTransform: 'none',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    },
                                }}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={pseudo.trim().length === 0}
                                sx={{
                                    background: 'linear-gradient(to right, #9333ea, #ec4899)',
                                    color: 'white',
                                    textTransform: 'none',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #7e22ce, #db2777)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(156, 163, 175, 0.3)',
                                        color: 'rgba(156, 163, 175, 0.5)',
                                    },
                                }}
                            >
                                Commencer
                            </Button>
                        </Box>
                    </Box>
                </Box>
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