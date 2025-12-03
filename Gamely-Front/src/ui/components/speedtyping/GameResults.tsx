import { Stack, Paper, Typography, Button, Box } from "@mui/material";
import { Speed, TrendingUp } from "@mui/icons-material";
import type { PlayerResult } from "../../../domain/speedtyping/speedtyping";

interface GameResultsProps {
    results: PlayerResult[];
    onBackToLobby: () => void;
}

export function GameResults({ results, onBackToLobby }: GameResultsProps) {
    const getPodiumStyle = (rank: number) => {
        switch (rank) {
            case 1: return { background: "linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)" };
            case 2: return { background: "linear-gradient(135deg, #9e9e9e 0%, #616161 100%)" };
            case 3: return { background: "linear-gradient(135deg, #ff6f00 0%, #e65100 100%)" };
            default: return { background: "#1e1e1e" };
        }
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h4" textAlign="center" fontWeight="bold">
                🏁 Résultats
            </Typography>

            <Stack spacing={2}>
                {results.map((result) => (
                    <Paper
                        key={result.playerId}
                        sx={{
                            p: 3,
                            ...getPodiumStyle(result.rank)
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(255,255,255,0.9)",
                                        color: "#000",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: "bold"
                                    }}
                                >
                                    #{result.rank}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {result.playerPseudo}
                                    </Typography>
                                    <Typography variant="body2">Score: {result.score} pts</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, textAlign: "right" }}>
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                                        <Speed fontSize="small" />
                                        <Typography variant="h6">{Math.round(result.wpm)}</Typography>
                                    </Box>
                                    <Typography variant="caption">WPM</Typography>
                                </Box>
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
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
            </Stack>

            <Button
                variant="outlined"
                size="large"
                onClick={onBackToLobby}
                sx={{ alignSelf: "center", minWidth: 200 }}
            >
                Retour au lobby
            </Button>
        </Stack>
    );
}