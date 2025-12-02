import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { EmojiEvents, Speed, TrendingUp } from '@mui/icons-material';

interface GameResultsProps {
    results: PlayerResult[];
    onPlayAgain: () => void;
    onBackToLobby: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
                                                            results,
                                                            onPlayAgain,
                                                            onBackToLobby
                                                        }) => {
    const getPodiumColor = (rank: number): string => {
        switch (rank) {
            case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
            case 2: return 'bg-gradient-to-br from-gray-300 to-gray-500';
            case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600';
            default: return 'bg-gray-200';
        }
    };

    return (
        <Box className="space-y-6">
            <Typography variant="h4" className="text-center font-bold">
                🏁 Résultats de la partie
            </Typography>

            <Box className="grid gap-4">
                {results.map((result) => (
                    <Paper
                        key={result.playerId}
                        className={`p-6 ${result.rank <= 3 ? getPodiumColor(result.rank) : ''}`}
                        elevation={result.rank <= 3 ? 8 : 2}
                    >
                        <Box className="flex items-center justify-between">
                            <Box className="flex items-center gap-4">
                                <Box className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                                    result.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                        result.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                            result.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                }`}>
                                    #{result.rank}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {result.playerPseudo}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Score: {result.score} points
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className="grid grid-cols-3 gap-6 text-right">
                                <Box>
                                    <Box className="flex items-center justify-end gap-1">
                                        <Speed fontSize="small" />
                                        <Typography variant="h6">{Math.round(result.wpm)}</Typography>
                                    </Box>
                                    <Typography variant="caption">WPM</Typography>
                                </Box>
                                <Box>
                                    <Box className="flex items-center justify-end gap-1">
                                        <TrendingUp fontSize="small" />
                                        <Typography variant="h6">{Math.round(result.accuracy)}%</Typography>
                                    </Box>
                                    <Typography variant="caption">Précision</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{result.errorCount}</Typography>
                                    <Typography variant="caption">Erreurs</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>

            <Box className="flex gap-4 justify-center">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onPlayAgain}
                >
                    Rejouer
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={onBackToLobby}
                >
                    Retour au lobby
                </Button>
            </Box>
        </Box>
    );
};