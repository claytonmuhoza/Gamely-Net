import { Button, Card, CardContent, Stack, TextField, Typography, Box } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gamepad, ArrowForward } from '@mui/icons-material'
import { getOrCreateClientId } from '../../../shared/session/clientId'
import { setPseudo } from '../../../shared/session/pseudo'

export function EnterPseudoPage() {
    const nav = useNavigate()
    useMemo(() => getOrCreateClientId(), [])

    const [value, setValue] = useState('')

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 200px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Card
                sx={{
                    borderRadius: 4,
                    maxWidth: 480,
                    width: '100%',
                    boxShadow: 3
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack spacing={3} alignItems="center">
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 3,
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Gamepad sx={{ fontSize: 48, color: 'white' }} />
                        </Box>

                        <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                Bienvenue !
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Choisissez un pseudo pour commencer à jouer
                            </Typography>
                        </Stack>

                        <TextField
                            label="Votre pseudo"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            inputProps={{ maxLength: 20 }}
                            fullWidth
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            helperText={`${value.length}/20 caractères`}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={value.trim().length < 2}
                            endIcon={<ArrowForward />}
                            onClick={() => {
                                setPseudo(value)
                                nav('/')
                            }}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            Continuer
                        </Button>

                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                            Minimum 2 caractères requis
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}