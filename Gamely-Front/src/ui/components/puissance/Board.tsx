import { Paper, Stack, Box } from '@mui/material';
import Column from './column.tsx';

interface BoardProps {
    grid: string[][];
    onColumnClick: (columnIndex: number) => void;
    isMyTurn: boolean;
}

const Board = ({ grid, onColumnClick, isMyTurn }: BoardProps) => {
    return (
        <Box display="flex" justifyContent="center" mt={2}>
            <Paper
                elevation={12}
                sx={{
                    bgcolor: '#1976d2',
                    p: { xs: 1, md: 2 },
                    borderRadius: 4,
                    width: 'fit-content'
                }}
            >
                <Stack direction="row" spacing={{ xs: 0.5, md: 1 }}>
                    {grid.map((columnCells: string[], colIndex: number) => (
                        <Column
                            key={colIndex}
                            columnIndex={colIndex}
                            cells={columnCells}
                            onClick={onColumnClick}
                            disabled={!isMyTurn}
                        />
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
};

export default Board;