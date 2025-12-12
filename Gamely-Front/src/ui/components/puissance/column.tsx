import { Stack, Box } from '@mui/material';
import Cell from './cell.tsx';

    interface ColumnProps {
        columnIndex: number;
        cells: string[];
        onClick: (columnIndex: number) => void;
        disabled: boolean;
    }

    const Column = ({ columnIndex, cells, onClick, disabled }: ColumnProps) => {
        return (
            <Box
                onClick={() => !disabled && onClick(columnIndex)}
                sx={{
                    cursor: disabled ? 'default' : 'pointer',
                    p: 1,
                    borderRadius: 2,
                    '&:hover': {
                        bgcolor: disabled ? 'transparent' : 'rgba(255, 255, 255, 0.15)'
                    }
                }}
            >
                <Stack direction="column" spacing={1}>
                    {cells.map((cellValue: string, rowIndex: number) => (
                        <Cell key={`${columnIndex}-${rowIndex}`} value={cellValue} />
                    ))}
                </Stack>
            </Box>
        );
    };

    export default Column;