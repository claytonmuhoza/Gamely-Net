import { Box, ButtonBase, Paper } from '@mui/material'

export function Puissance4Board(props: {
    grid: string[][] // [col][row]
    disabled?: boolean
    onDrop: (col: number) => void
}) {
    const cols = 7
    const rows = 6

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                p: { xs: 1.5, sm: 2 },
                display: 'inline-block',
                bgcolor: 'primary.main'
            }}
        >
            {/* Header click zones */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, minmax(40px, 56px))`,
                    gap: { xs: 0.75, sm: 1 },
                    mb: 1
                }}
            >
                {Array.from({ length: cols }).map((_, col) => (
                    <ButtonBase
                        key={col}
                        disabled={props.disabled}
                        onClick={() => props.onDrop(col)}
                        sx={{
                            height: { xs: 20, sm: 24 },
                            borderRadius: 2,
                            bgcolor: 'white',
                            opacity: props.disabled ? 0.3 : 0.8,
                            transition: 'all 0.2s',
                            '&:hover': !props.disabled ? {
                                opacity: 1,
                                transform: 'translateY(-2px)'
                            } : {}
                        }}
                    />
                ))}
            </Box>

            {/* Grille */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, minmax(40px, 56px))`,
                    gap: { xs: 0.75, sm: 1 }
                }}
            >
                {Array.from({ length: rows }).map((_, rowFromTop) => {
                    const row = rows - 1 - rowFromTop
                    return Array.from({ length: cols }).map((__, col) => {
                        const value = props.grid?.[col]?.[row] ?? ''
                        const isEmpty = value === ''
                        const isRed = value === 'R'
                        const isYellow = value === 'Y'

                        return (
                            <Box
                                key={`${col}-${row}`}
                                sx={{
                                    aspectRatio: '1',
                                    borderRadius: '50%',
                                    bgcolor: isEmpty
                                        ? 'white'
                                        : isRed
                                            ? 'error.main'
                                            : 'warning.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                    fontWeight: 900,
                                    userSelect: 'none',
                                    boxShadow: isEmpty ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isRed ? '🔴' : isYellow ? '🟡' : ''}
                            </Box>
                        )
                    })
                })}
            </Box>
        </Paper>
    )
}