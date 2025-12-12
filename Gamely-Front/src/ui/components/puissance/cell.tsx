import { Box } from '@mui/material';

interface CellProps {
    value: string;
}

const getColor = (value: string): string => {
    if (value === 'X') return '#d32f2f'; // Rouge (Joueur 1)
    if (value === 'O') return '#fbc02d'; // Jaune (Joueur 2)
    return 'white'; // Vide ('.')
};

const Cell = ({ value }: CellProps) => {
    const color = getColor(value);
    const isEmpty = value === '.' || !value;

    return (
        <Box
            sx={{
                width: { xs: 30, sm: 40, md: 50 },
                height: { xs: 30, sm: 40, md: 50 },
                borderRadius: '50%',
                bgcolor: color,
                border: '2px solid #1565c0',
                boxShadow: !isEmpty ? 'inset 0px -2px 5px rgba(0,0,0,0.4)' : 'inset 2px 2px 5px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s ease'
            }}
        />
    );
};

export default Cell;