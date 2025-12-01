import {
    Button,
    Chip,
    Container,
    Typography,
    Box
} from '@mui/material';
import {
    ChevronRight,
} from 'lucide-react';

const HeroSection = () => {
    return (
        <Box sx={{ pt: { xs: 16, md: 20 }, pb: 10, px: 2 }} >
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Chip
                    label="🎮 Plateforme de jeux "
                    sx={{
                        mb: 3,
                        backgroundColor: 'rgba(168, 85, 247, 0.2)',
                        color: '#d8b4fe',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                    }}
                />

                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '2.5rem', md: '4.5rem' },
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 4,
                        lineHeight: 1.2,
                    }}
                >
                    Découvrez l'univers
                    <br />
                    <Box
                        component="span"
                        sx={{
                            background: 'linear-gradient(to right, #c084fc, #f9a8d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        des Jeux Vidéo
                    </Box>
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        color: 'rgba(209, 213, 219, 1)',
                        mb: 6,
                        maxWidth: '42rem',
                        mx: 'auto',
                        lineHeight: 1.6,
                    }}
                >
                    Des jeux à portée de main. Jouez, progressez et devenez une légende.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ChevronRight />}
                        sx={{
                            background: 'linear-gradient(to right, #9333ea, #ec4899)',
                            color: 'white',
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                                background: 'linear-gradient(to right, #7e22ce, #db2777)',
                            },
                        }}
                    >
                        Commencer à jouer
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                        }}
                    >
                        Explorer les jeux
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;