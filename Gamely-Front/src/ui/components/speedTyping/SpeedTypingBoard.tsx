// presentation/components/speedTyping/SpeedTypingBoard.tsx

import { useState, useEffect, useRef } from "react";
import { Timer, Zap, Target, TrendingUp, Award } from "lucide-react";
import type { SpeedTypingGame, PlayerProgress } from "../../../domain/speedTyping/speedTyping";
import { SpeedTypingStatus } from "../../../domain/speedTyping/speedTyping";

interface SpeedTypingBoardProps {
    game: SpeedTypingGame;
    currentPlayerId: string;
    onStartGame: () => void;
    onTextChange: (text: string) => void;
}

interface ChipProps {
    label: string;
    color: string;
    bgColor: string;
    icon?: React.ReactNode;
}

function Chip({ label, color, bgColor, icon }: ChipProps) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: bgColor,
                color: color,
                fontSize: "14px",
                fontWeight: 600,
                border: `2px solid ${color}`,
            }}
        >
            {icon}
            {label}
        </div>
    );
}

interface PlayerStatsProps {
    progress: PlayerProgress;
    isCurrentPlayer: boolean;
}

function PlayerStats({ progress, isCurrentPlayer }: PlayerStatsProps) {
    return (
        <div
            style={{
                padding: "16px",
                backgroundColor: isCurrentPlayer ? "rgba(33, 150, 243, 0.1)" : "#1e1e1e",
                borderRadius: "8px",
                border: isCurrentPlayer ? "2px solid #2196f3" : "1px solid #424242",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>
                    {progress.playerPseudo}
                    {isCurrentPlayer && " (Vous)"}
                </div>
                {progress.hasFinished && (
                    <span style={{ color: "#4caf50", fontSize: "14px" }}>✓ Terminé</span>
                )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", fontSize: "14px" }}>
                <div>
                    <div style={{ color: "#9e9e9e" }}>WPM</div>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>{Math.round(progress.currentWPM)}</div>
                </div>
                <div>
                    <div style={{ color: "#9e9e9e" }}>Précision</div>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>{Math.round(progress.accuracy)}%</div>
                </div>
                <div>
                    <div style={{ color: "#9e9e9e" }}>Erreurs</div>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>{progress.errorCount}</div>
                </div>
            </div>
        </div>
    );
}

interface ResultsTableProps {
    game: SpeedTypingGame;
    currentPlayerId: string;
}

function ResultsTable({ game, currentPlayerId }: ResultsTableProps) {
    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return "🏅";
    };

    const formatTime = (timeSpan: string) => {
        // TimeSpan format: "00:00:30.1234567"
        const parts = timeSpan.split(':');
        if (parts.length >= 3) {
            const minutes = parseInt(parts[1]);
            const seconds = parseFloat(parts[2]);
            if (minutes > 0) {
                return `${minutes}m ${seconds.toFixed(1)}s`;
            }
            return `${seconds.toFixed(1)}s`;
        }
        return timeSpan;
    };

    return (
        <div
            style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "16px",
                padding: "32px",
                border: "2px solid #424242",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "12px", color: "#fff" }}>
                    🏆 Résultats de la partie
                </h2>
                <p style={{ fontSize: "16px", color: "#9e9e9e" }}>
                    Bravo à tous les participants !
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {game.results.map((result, index) => {
                    const isCurrentPlayer = result.playerId === currentPlayerId;
                    const rankColor =
                        result.rank === 1 ? "#ffd700" :
                            result.rank === 2 ? "#c0c0c0" :
                                result.rank === 3 ? "#cd7f32" :
                                    "#9e9e9e";

                    return (
                        <div
                            key={result.playerId}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "80px 1fr auto",
                                gap: "20px",
                                padding: "24px",
                                backgroundColor: isCurrentPlayer ? "rgba(33, 150, 243, 0.15)" : "#121212",
                                borderRadius: "12px",
                                border: isCurrentPlayer ? "3px solid #2196f3" : "2px solid #2a2a2a",
                                alignItems: "center",
                                transition: "all 0.3s ease",
                                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                            }}
                        >
                            {/* Rank */}
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "36px", marginBottom: "4px" }}>
                                    {getMedalEmoji(result.rank)}
                                </div>
                                <div style={{ fontSize: "20px", fontWeight: "bold", color: rankColor }}>
                                    #{result.rank}
                                </div>
                            </div>

                            {/* Player Info */}
                            <div>
                                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", marginBottom: "12px" }}>
                                    {result.playerPseudo}
                                    {isCurrentPlayer && (
                                        <span style={{
                                            marginLeft: "12px",
                                            fontSize: "14px",
                                            color: "#2196f3",
                                            fontWeight: "normal"
                                        }}>
                      (Vous)
                    </span>
                                    )}
                                </div>

                                {/* Stats Grid */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: "16px",
                                    marginTop: "8px"
                                }}>
                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "4px" }}>
                                            Temps
                                        </div>
                                        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fff" }}>
                                            {formatTime(result.completionTime.toString())}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "4px" }}>
                                            WPM
                                        </div>
                                        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#4caf50" }}>
                                            {Math.round(result.wpm)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "4px" }}>
                                            Précision
                                        </div>
                                        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ff9800" }}>
                                            {Math.round(result.accuracy)}%
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "4px" }}>
                                            Erreurs
                                        </div>
                                        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f44336" }}>
                                            {result.errorCount}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Score */}
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "4px" }}>
                                    SCORE
                                </div>
                                <div style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    color: isCurrentPlayer ? "#2196f3" : "#fff",
                                    textShadow: isCurrentPlayer ? "0 0 10px rgba(33, 150, 243, 0.5)" : "none"
                                }}>
                                    {result.score}
                                </div>
                                <div style={{ fontSize: "12px", color: "#9e9e9e" }}>
                                    points
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Statistiques globales */}
            <div style={{
                marginTop: "32px",
                padding: "24px",
                backgroundColor: "#121212",
                borderRadius: "12px",
                border: "1px solid #2a2a2a"
            }}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#fff" }}>
                    📊 Statistiques de la partie
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    <div>
                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "8px" }}>
                            WPM Moyen
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4caf50" }}>
                            {Math.round(game.results.reduce((sum, r) => sum + r.wpm, 0) / game.results.length)}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "8px" }}>
                            Précision Moyenne
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>
                            {Math.round(game.results.reduce((sum, r) => sum + r.accuracy, 0) / game.results.length)}%
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: "12px", color: "#9e9e9e", marginBottom: "8px" }}>
                            Score Total
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2196f3" }}>
                            {game.results.reduce((sum, r) => sum + r.score, 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Boutons d'action */}
            <div style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                justifyContent: "center"
            }}>
                <button
                    onClick={() => window.location.href = '/lobbies'}
                    style={{
                        padding: "12px 32px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "#2196f3",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2196f3")}
                >
                    Retour aux lobbies
                </button>
            </div>

            {/* CSS pour l'animation */}
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}

export function SpeedTypingBoard({ game, currentPlayerId, onStartGame, onTextChange }: SpeedTypingBoardProps) {
    const [typedText, setTypedText] = useState("");
    const [timeLeft, setTimeLeft] = useState(game.durationSeconds);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lastUpdateRef = useRef<string>("");

    const statusInfo = game.getStatusInfo(currentPlayerId);
    const myProgress = game.getPlayerProgress(currentPlayerId);

    // Timer
    useEffect(() => {
        if (game.status !== SpeedTypingStatus.InProgress) return;

        const interval = setInterval(() => {
            const remaining = game.getRemainingSeconds();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [game]);

    // Afficher les résultats avec un délai quand le jeu se termine
    useEffect(() => {
        if (game.status === SpeedTypingStatus.Finished && !showResults) {
            // Petit délai pour une transition en douceur
            const timer = setTimeout(() => {
                setShowResults(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [game.status, showResults]);

    // Focus automatique quand le jeu démarre
    useEffect(() => {
        if (game.status === SpeedTypingStatus.InProgress && inputRef.current) {
            inputRef.current.focus();
        }
    }, [game.status]);

    // Synchroniser le texte local avec le serveur (sans écraser la saisie en cours)
    useEffect(() => {
        if (myProgress && myProgress.currentTypedText !== lastUpdateRef.current) {
            // Ne synchroniser que si on n'est pas en train de taper
            if (document.activeElement !== inputRef.current) {
                setTypedText(myProgress.currentTypedText);
                lastUpdateRef.current = myProgress.currentTypedText;
            }
        }
    }, [myProgress]);

    const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setTypedText(newText);

        // Envoyer au serveur immédiatement (pas de debounce pour éviter les désynchronisations)
        onTextChange(newText);
        lastUpdateRef.current = newText;
    };

    const renderTextDisplay = () => {
        const targetText = game.text.content;
        const typed = typedText;

        return (
            <div
                style={{
                    fontSize: "20px",
                    lineHeight: "1.8",
                    fontFamily: "monospace",
                    backgroundColor: "#1e1e1e",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "2px solid #424242",
                    minHeight: "200px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            >
                {targetText.split("").map((char, i) => {
                    let color = "#616161"; // Non tapé
                    let bgColor = "transparent";

                    if (i < typed.length) {
                        if (typed[i] === char) {
                            color = "#4caf50"; // Correct
                        } else {
                            color = "#f44336"; // Incorrect
                            bgColor = "rgba(244, 67, 54, 0.2)";
                        }
                    }

                    return (
                        <span
                            key={i}
                            style={{
                                color,
                                backgroundColor: bgColor,
                                fontWeight: i < typed.length ? "bold" : "normal",
                            }}
                        >
              {char}
            </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "32px",
                backgroundColor: "#121212",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            }}
        >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px", color: "#fff" }}>
                    ⚡ Speed Typing
                </h2>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                    <Chip label={statusInfo.label} color={statusInfo.color} bgColor={statusInfo.bgColor} icon={<Zap size={16} />} />
                    <Chip
                        label={`${timeLeft}s`}
                        color={timeLeft < 10 ? "#f44336" : "#2196f3"}
                        bgColor={timeLeft < 10 ? "rgba(244, 67, 54, 0.1)" : "rgba(33, 150, 243, 0.1)"}
                        icon={<Timer size={16} />}
                    />
                    {myProgress && (
                        <>
                            <Chip
                                label={`${Math.round(myProgress.currentWPM)} WPM`}
                                color="#4caf50"
                                bgColor="rgba(76, 175, 80, 0.1)"
                                icon={<TrendingUp size={16} />}
                            />
                            <Chip
                                label={`${Math.round(myProgress.accuracy)}%`}
                                color="#ff9800"
                                bgColor="rgba(255, 152, 0, 0.1)"
                                icon={<Target size={16} />}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Waiting to start */}
            {game.status === SpeedTypingStatus.WaitingToStart && (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "24px" }}>
                        En attente du démarrage...
                    </h3>
                    <button
                        onClick={onStartGame}
                        style={{
                            padding: "16px 48px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#fff",
                            backgroundColor: "#2196f3",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2196f3")}
                    >
                        Démarrer la partie
                    </button>
                </div>
            )}

            {/* In progress */}
            {game.status === SpeedTypingStatus.InProgress && (
                <>
                    <div style={{ marginBottom: "24px" }}>
                        {renderTextDisplay()}
                    </div>

                    {/* Zone de saisie ou message de fin selon l'état */}
                    {!myProgress?.hasFinished && !game.isFinished && (
                        <textarea
                            ref={inputRef}
                            value={typedText}
                            onChange={handleTextInput}
                            placeholder="Commencez à taper ici..."
                            style={{
                                width: "100%",
                                minHeight: "120px",
                                padding: "16px",
                                fontSize: "18px",
                                fontFamily: "monospace",
                                backgroundColor: "#1e1e1e",
                                color: "#fff",
                                border: "2px solid #2196f3",
                                borderRadius: "8px",
                                resize: "vertical",
                                outline: "none",
                            }}
                        />
                    )}

                    {myProgress?.hasFinished && !game.isFinished && (
                        <div
                            style={{
                                padding: "24px",
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                                border: "2px solid #4caf50",
                                borderRadius: "12px",
                                textAlign: "center",
                            }}
                        >
                            <h3 style={{ fontSize: "24px", color: "#4caf50", marginBottom: "8px" }}>
                                ✓ Vous avez terminé !
                            </h3>
                            <p style={{ color: "#9e9e9e" }}>En attente des autres joueurs...</p>
                        </div>
                    )}

                    {/* Stats des joueurs en cours de partie */}
                    {!game.isFinished && (
                        <div style={{ marginTop: "32px" }}>
                            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px", color: "#fff" }}>
                                Progression des joueurs
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {game.playerProgresses.map((progress) => (
                                    <PlayerStats
                                        key={progress.playerId}
                                        progress={progress}
                                        isCurrentPlayer={progress.playerId === currentPlayerId}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Finished */}
            {game.status === SpeedTypingStatus.Finished && (
                <>
                    {showResults && game.results.length > 0 ? (
                        <ResultsTable game={game} currentPlayerId={currentPlayerId} />
                    ) : (
                        <div style={{ textAlign: "center", padding: "60px 40px" }}>
                            <div style={{
                                fontSize: "48px",
                                marginBottom: "24px",
                                animation: "pulse 1.5s ease-in-out infinite"
                            }}>
                                🎉
                            </div>
                            <h3 style={{ fontSize: "28px", color: "#fff", marginBottom: "16px" }}>
                                Partie terminée !
                            </h3>
                            <p style={{ color: "#9e9e9e", fontSize: "16px" }}>
                                Calcul des résultats en cours...
                            </p>
                            <style>{`
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
              `}</style>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}