import { Stack, Paper, Typography, LinearProgress, Chip, Box } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import type { PlayerProgress } from "../../../domain/speedtyping/speedtyping";

interface PlayerProgressListProps {
    progresses: PlayerProgress[];
    currentPlayerId: string;
}

export function PlayerProgressList({ progresses, currentPlayerId }: PlayerProgressListProps) {
    const sorted = [...progresses].sort((a, b) => {
        if (a.hasFinished && !b.hasFinished) return -1;
        if (!a.hasFinished && b.hasFinished) return 1;
        return b.correctCharacters - a.correctCharacters;
    });

    return (
        <Stack spacing={2}>
            {sorted.map((progress, index) => (
                <Paper
                    key={progress.playerId}
                    sx={{
                        p: 2,
                        backgroundColor: progress.playerId === currentPlayerId ? "#1e3a5f" : "#1e1e1e",
                        border: progress.playerId === currentPlayerId ? "2px solid #2196f3" : "none"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        {progress.hasFinished && index === 0 && (
                            <EmojiEvents sx={{ color: "#ffc107" }} />
                        )}
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#2196f3",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold"
                            }}
                        >
                            {progress.playerPseudo[0].toUpperCase()}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {progress.playerPseudo}
                                </Typography>
                                {progress.hasFinished && (
                                    <Chip label="✓ Terminé" color="success" size="small" />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                            <span>{Math.round(progress.currentWPM)} WPM</span>
                            <span>{Math.round(progress.accuracy)}%</span>
                            <span>{progress.correctCharacters} car.</span>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress.accuracy}
                            sx={{ height: 4, borderRadius: 1 }}
                        />
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
}