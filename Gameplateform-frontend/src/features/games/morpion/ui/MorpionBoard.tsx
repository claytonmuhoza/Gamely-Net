import { ButtonBase, Box, Paper } from '@mui/material'

export function MorpionBoard(props: {
    board: string[] // "", "X", "O"
    onCellClick: (index: number) => void
    disabled?: boolean
}) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: { xs: 1, sm: 1.5 },
                maxWidth: { xs: 300, sm: 360 },
                width: '100%'
            }}
        >
            {props.board.map((cell, idx) => {
                const isEmpty = cell === ''
                const isX = cell === 'X'
                const isO = cell === 'O'

                return (
                    <Paper
                        key={idx}
                        elevation={isEmpty && !props.disabled ? 2 : 0}
                        sx={{
                            aspectRatio: '1',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '2px solid',
                            borderColor: isEmpty ? 'divider' : 'transparent',
                            bgcolor: isEmpty
                                ? 'background.paper'
                                : isX
                                    ? 'primary.50'
                                    : 'secondary.50',
                            transition: 'all 0.2s',
                            '&:hover': isEmpty && !props.disabled ? {
                                borderColor: 'primary.main',
                                transform: 'scale(1.05)'
                            } : {}
                        }}
                    >
                        <ButtonBase
                            onClick={() => props.onCellClick(idx)}
                            disabled={props.disabled || !isEmpty}
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: { xs: '2.5rem', sm: '3rem' },
                                fontWeight: 900,
                                color: isX ? 'primary.main' : isO ? 'secondary.main' : 'transparent',
                                userSelect: 'none'
                            }}
                        >
                            {cell || '·'}
                        </ButtonBase>
                    </Paper>
                )
            })}
        </Box>
    )
}