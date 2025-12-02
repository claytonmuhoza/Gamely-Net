import {List, ListItem, ListItemText, Avatar, LinearProgress, Box, Typography, Chip} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import type {PlayerProgress} from "../../../domain/speedtyping/speedtyping.ts";

interface PlayerProgressListProps {
    progresses: PlayerProgress[];
    currentPlayerId: string;
}

export const PlayerProgressList: React.FC<PlayerProgressListProps> = ({
                                                                          progresses,
                                                                          currentPlayerId
                                                                      }) => {
    const sortedProgresses = [...progresses].sort((a, b) => {
        if (a.hasFinished && !b.hasFinished) return -1;
        if (!a.hasFinished && b.hasFinished) return 1;
        return b.correctCharacters - a.correctCharacters;
    });

    return (
        <List className="space-y-2">
            {sortedProgresses.map((progress, index) => (
                <ListItem
                    key={progress.playerId}
                    className={`rounded-lg ${
                        progress.playerId === currentPlayerId ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white'
                    }`}
                >
                    <Box className="flex items-center w-full gap-4">
                        <Box className="flex items-center gap-2">
                            {progress.hasFinished && index === 0 && (
                                <TrophyIcon className="text-yellow-500" />
                            )}
                            <Avatar className="bg-gradient-to-br from-blue-500 to-purple-500">
                                {progress.playerPseudo[0].toUpperCase()}
                            </Avatar>
                        </Box>

                        <Box className="flex-1">
                            <ListItemText
                                primary={
                                    <Box className="flex items-center gap-2">
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {progress.playerPseudo}
                                        </Typography>
                                        {progress.hasFinished && (
                                            <Chip label="✓ Terminé" color="success" size="small" />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Box className="mt-2 space-y-1">
                                        <Box className="flex justify-between text-sm">
                                            <span>{Math.round(progress.currentWPM)} WPM</span>
                                            <span>{Math.round(progress.accuracy)}% précis</span>
                                            <span>{progress.correctCharacters} caractères</span>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress.accuracy}
                                            className="h-1"
                                        />
                                    </Box>
                                }
                            />
                        </Box>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};
