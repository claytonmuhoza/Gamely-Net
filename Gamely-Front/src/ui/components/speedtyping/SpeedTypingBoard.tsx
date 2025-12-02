import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, LinearProgress, Paper, Chip } from '@mui/material';
import type {PlayerProgress, TypingText} from "../../../domain/speedtyping/speedtyping.ts";

interface SpeedTypingBoardProps {
    text: TypingText;
    currentProgress: PlayerProgress;
    onTextChange: (text: string) => void;
    isGameStarted: boolean;
    timeRemaining: number;
    totalTime: number;
}

export const SpeedTypingBoard: React.FC<SpeedTypingBoardProps> = ({
                                                                      text,
                                                                      currentProgress,
                                                                      onTextChange,
                                                                      isGameStarted,
                                                                      timeRemaining,
                                                                      totalTime
                                                                  }) => {
    const [typedText, setTypedText] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isGameStarted && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isGameStarted]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setTypedText(newText);
        onTextChange(newText);
    };

    const getCharacterClass = (index: number): string => {
        if (index >= typedText.length) return 'text-gray-400';
        if (typedText[index] === text.content[index]) return 'text-green-600 bg-green-50';
        return 'text-red-600 bg-red-50';
    };

    const progress = (timeRemaining / totalTime) * 100;

    return (
        <Box className="space-y-4">
            {/* Stats */}
            <Box className="grid grid-cols-4 gap-4">
                <Paper className="p-4">
                    <Typography variant="caption" color="textSecondary">WPM</Typography>
                    <Typography variant="h4">{Math.round(currentProgress.currentWPM)}</Typography>
                </Paper>
                <Paper className="p-4">
                    <Typography variant="caption" color="textSecondary">Précision</Typography>
                    <Typography variant="h4">{Math.round(currentProgress.accuracy)}%</Typography>
                </Paper>
                <Paper className="p-4">
                    <Typography variant="caption" color="textSecondary">Erreurs</Typography>
                    <Typography variant="h4">{currentProgress.errorCount}</Typography>
                </Paper>
                <Paper className="p-4">
                    <Typography variant="caption" color="textSecondary">Temps restant</Typography>
                    <Typography variant="h4">{timeRemaining}s</Typography>
                </Paper>
            </Box>

            {/* Timer Progress */}
            <LinearProgress
                variant="determinate"
                value={progress}
                className="h-2 rounded"
                color={timeRemaining < 10 ? 'error' : 'primary'}
            />

            {/* Text Display */}
            <Paper className="p-6 bg-gray-50">
                <Typography
                    variant="h6"
                    className="font-mono leading-relaxed"
                    component="div"
                >
                    {text.content.split('').map((char, index) => (
                        <span
                            key={index}
                            className={`${getCharacterClass(index)} ${
                                index === typedText.length ? 'border-l-2 border-blue-500 animate-pulse' : ''
                            }`}
                        >
              {char}
            </span>
                    ))}
                </Typography>
            </Paper>

            {/* Input Area */}
            <textarea
                ref={inputRef}
                value={typedText}
                onChange={handleChange}
                disabled={!isGameStarted || currentProgress.hasFinished}
                className="w-full p-4 font-mono text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder={isGameStarted ? 'Commencez à taper...' : 'En attente du démarrage...'}
            />

            {/* Difficulty Badge */}
            <Chip
                label={`Difficulté: ${text.difficulty}`}
                color={
                    text.difficulty === 'Easy' ? 'success' :
                        text.difficulty === 'Medium' ? 'warning' :
                            'error'
                }
            />
        </Box>
    );
};