import React from 'react';
import { Paper, Stack, Box } from '@mui/material';
import Column from './Column';

const PuissanceBoard = ({ grid, onColumnClick, winningLine }) => {
    return (
        // Box sert de conteneur pour centrer le plateau dans la page
        <Box display="flex" justifyContent="center" mt={4}>

        {/* Paper crée le cadre bleu du jeu avec une ombre (elevation) */}
        <Paper
    elevation={10}
    sx={{
        bgcolor: '#1976d2', // Le bleu Material (ou mettez '#0055ff' pour le classique)
            p: 2,               // Padding (espace intérieur)
            borderRadius: 4,    // Coins arrondis
            width: 'fit-content' // Le plateau s'adapte au contenu
    }}
>
    {/* Stack aligne les colonnes horizontalement avec un espacement régulier */}
    <Stack direction="row" spacing={1}>
        {grid.map((columnCells, colIndex) => (
                <Column
                    key={colIndex}
            columnIndex={colIndex}
            cells={columnCells}
            onClick={onColumnClick}
            winningLine={winningLine}
    />
))}
    </Stack>
    </Paper>
    </Box>
);
};

export default Board;