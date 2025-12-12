import { Container, Typography, Alert, Box } from '@mui/material';
import { useMemo } from 'react';
import Board from './Board';

interface GameInstance {
    id: string;
    board: string;
    currentPlayerId: string;
    winnerPlayerId: string | null;
    isFinished: boolean;
    isDraw: boolean;
    playerOneId: string;
}

interface GameProps {
    gameInstance: GameInstance;
    myPlayerId: string;
    onPlayAction: (columnIndex: number) => void;
}

const parseBoardString = (boardString: string): string[][] => {
    const columns: string[][] = Array.from({ length: 7 }, () => []);

    for (let i = 0; i < boardString.length; i++) {
        const colIndex = i % 7;
        columns[colIndex].push(boardString[i]);
    }
    return columns;
};

const Game = ({ gameInstance, myPlayerId, onPlayAction }: GameProps) => {
    const {
        board,
        currentPlayerId,
        winnerPlayerId,
        isFinished,
        isDraw
    } = gameInstance;

    const isMyTurn = currentPlayerId === myPlayerId && !isFinished;
    const amIPlayerOne = myPlayerId === gameInstance.playerOneId;
    const mySymbol = amIPlayerOne ? 'X (Rouge)' : 'O (Jaune)';

    const grid = useMemo(() => parseBoardString(board), [board]);

    let alertSeverity: 'info' | 'warning' | 'success' | 'error' = "info";
    let statusMessage = "";

    if (isFinished) {
        if (isDraw) {
            statusMessage = "Match Nul !";
            alertSeverity = "warning";
        } else if (winnerPlayerId === myPlayerId) {
            statusMessage = "VICTOIRE ! Félicitations 🎉";
            alertSeverity = "success";
        } else {
            statusMessage = "Défaite. L'adversaire a gagné.";
            alertSeverity = "error";
        }
    } else {
        statusMessage = isMyTurn
            ? `C'est à votre tour ! Vous jouez les ${mySymbol}`
            : "En attente de l'adversaire...";
    }

    const handleColumnClick = (colIndex: number) => {
        onPlayAction(colIndex);
    };

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                Puissance 4
            </Typography>

            <Alert
                severity={alertSeverity}
                variant="filled"
                sx={{ mb: 3, justifyContent: 'center', fontSize: '1.1rem' }}
            >
                {statusMessage}
            </Alert>

            <Box sx={{ opacity: isFinished ? 0.8 : 1 }}>
                <Board
                    grid={grid}
                    onColumnClick={handleColumnClick}
                    isMyTurn={isMyTurn}
                />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Partie ID: {gameInstance.id} | Joueur: {mySymbol}
            </Typography>
        </Container>
    );
};

export default Game;