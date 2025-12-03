import { useState, useEffect, useRef } from "react";
import { Stack, Typography, Paper, LinearProgress, Box } from "@mui/material";
import type { TypingText, PlayerProgress } from "../../../domain/speedtyping/speedtyping";

interface SpeedTypingBoardProps {
    text: TypingText;
    currentProgress: PlayerProgress;
    onTextChange: (text: string) => void;
    isGameStarted: boolean;
    timeRemaining: number;
    totalTime: number;
}

export function SpeedTypingBoard({
                                     text,
                                     currentProgress,
                                     onTextChange,
                                     isGameStarted,
                                     timeRemaining,
                                     totalTime
                                 }: SpeedTypingBoardProps) {
    const [typedText, setTypedText] = useState("");
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

    const getCharClass = (index: number): string => {
        if (index >= typedText.length) return "text-gray-400";
        if (typedText[index] === text.content[index]) return "text-green-600";
        return "text-red-600";
    };

    const progress = (timeRemaining / totalTime) * 100;

    return (
        <Stack spacing={3}>
            {/* Stats */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#1e1e1e" }}>
                    <Typography variant="caption" color="text.secondary">WPM</Typography>
                    <Typography variant="h4" color="primary">{Math.round(currentProgress.currentWPM)}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#1e1e1e" }}>
                    <Typography variant="caption" color="text.secondary">Précision</Typography>
                    <Typography variant="h4" color="success.main">{Math.round(currentProgress.accuracy)}%</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#1e1e1e" }}>
                    <Typography variant="caption" color="text.secondary">Erreurs</Typography>
                    <Typography variant="h4" color="error.main">{currentProgress.errorCount}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#1e1e1e" }}>
                    <Typography variant="caption" color="text.secondary">Temps</Typography>
                    <Typography variant="h4" color="warning.main">{timeRemaining}s</Typography>
                </Paper>
            </Box>

            {/* Timer Bar */}
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: "#424242",
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: timeRemaining < 10 ? "#f44336" : "#2196f3"
                    }
                }}
            />

            {/* Text Display */}
            <Paper sx={{ p: 3, backgroundColor: "#1e1e1e", minHeight: 120 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontFamily: "monospace",
                        lineHeight: 1.8,
                        letterSpacing: 1
                    }}
                >
                    {text.content.split("").map((char, index) => (
                        <span
                            key={index}
                            className={getCharClass(index)}
                            style={{
                                backgroundColor: typedText[index] === text.content[index] && index < typedText.length
                                    ? "rgba(76, 175, 80, 0.2)"
                                    : typedText[index] && index < typedText.length
                                        ? "rgba(244, 67, 54, 0.2)"
                                        : "transparent",
                                borderLeft: index === typedText.length ? "2px solid #2196f3" : "none",
                                paddingLeft: "2px"
                            }}
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
                style={{
                    width: "100%",
                    padding: "16px",
                    fontFamily: "monospace",
                    fontSize: "18px",
                    border: "2px solid #424242",
                    borderRadius: "8px",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    outline: "none",
                    resize: "none"
                }}
                rows={4}
                placeholder={isGameStarted ? "Commencez à taper..." : "En attente du démarrage..."}
            />
        </Stack>
    );
}