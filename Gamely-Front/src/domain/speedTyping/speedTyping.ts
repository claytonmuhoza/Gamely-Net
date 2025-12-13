// domain/speedTyping/speedTyping.ts

export interface PlayerProgress {
    playerId: string;
    playerPseudo: string;
    currentTypedText: string;
    correctCharacters: number;
    totalCharacters: number;
    errorCount: number;
    accuracy: number;
    currentWPM: number;
    hasFinished: boolean;
    finishedAt: Date | null;
    completionTime: string | null; // TimeSpan en string
}

export interface PlayerResult {
    playerId: string;
    playerPseudo: string;
    rank: number;
    completionTime: string; // TimeSpan en string
    accuracy: number;
    wpm: number;
    errorCount: number;
    score: number;
}

export interface TypingText {
    id: string;
    content: string;
    difficulty: string;
    wordCount: number;
    language: string;
}

export enum SpeedTypingStatus {
    WaitingToStart = "WaitingToStart",
    InProgress = "InProgress",
    Finished = "Finished"
}

export class SpeedTypingGame {
    constructor(
        public readonly id: string,
        public readonly lobbyId: string,
        public readonly text: TypingText,
        public readonly status: SpeedTypingStatus,
        public readonly startedAt: Date | null,
        public readonly finishedAt: Date | null,
        public readonly durationSeconds: number,
        public readonly playerProgresses: PlayerProgress[],
        public readonly results: PlayerResult[]
    ) {}

    /** Est-ce que le jeu a démarré ? */
    get hasStarted(): boolean {
        return this.status !== SpeedTypingStatus.WaitingToStart;
    }

    /** Est-ce que le jeu est terminé ? */
    get isFinished(): boolean {
        return this.status === SpeedTypingStatus.Finished;
    }

    /** Est-ce que le jeu est en cours ? */
    get isInProgress(): boolean {
        return this.status === SpeedTypingStatus.InProgress;
    }

    /** Temps écoulé depuis le début */
    getElapsedSeconds(): number {
        if (!this.startedAt) return 0;
        const now = new Date();
        const start = new Date(this.startedAt);
        return Math.floor((now.getTime() - start.getTime()) / 1000);
    }

    /** Temps restant */
    getRemainingSeconds(): number {
        if (!this.hasStarted) return this.durationSeconds;
        const elapsed = this.getElapsedSeconds();
        return Math.max(0, this.durationSeconds - elapsed);
    }

    /** Progression d'un joueur spécifique */
    getPlayerProgress(playerId: string): PlayerProgress | undefined {
        return this.playerProgresses.find(p => p.playerId === playerId);
    }

    /** Résultat d'un joueur spécifique */
    getPlayerResult(playerId: string): PlayerResult | undefined {
        return this.results.find(r => r.playerId === playerId);
    }

    /** Est-ce que ce joueur a terminé ? */
    hasPlayerFinished(playerId: string): boolean {
        const progress = this.getPlayerProgress(playerId);
        return progress?.hasFinished ?? false;
    }

    /** Pourcentage de progression du joueur */
    getPlayerProgressPercentage(playerId: string): number {
        const progress = this.getPlayerProgress(playerId);
        if (!progress) return 0;
        if (this.text.content.length === 0) return 0;
        return Math.min(100, (progress.currentTypedText.length / this.text.content.length) * 100);
    }

    /** Label de statut pour l'affichage */
    getStatusLabel(playerId: string): string {
        if (this.isFinished) {
            const result = this.getPlayerResult(playerId);
            if (result) {
                return `Terminé - Rang ${result.rank}`;
            }
            return "Terminé";
        }

        if (this.isInProgress) {
            const progress = this.getPlayerProgress(playerId);
            if (progress?.hasFinished) {
                return "En attente des autres joueurs...";
            }
            return "En cours";
        }

        return "En attente";
    }

    /** Couleurs pour le statut */
    getStatusInfo(playerId: string): {
        label: string;
        color: string;
        bgColor: string;
    } {
        if (this.isFinished) {
            const result = this.getPlayerResult(playerId);
            if (result?.rank === 1) {
                return {
                    label: "🏆 Victoire",
                    color: "#ffd700",
                    bgColor: "rgba(255, 215, 0, 0.1)",
                };
            }
            return {
                label: `Rang ${result?.rank ?? "?"}`,
                color: "#2196f3",
                bgColor: "rgba(33, 150, 243, 0.1)",
            };
        }

        if (this.isInProgress) {
            const progress = this.getPlayerProgress(playerId);
            if (progress?.hasFinished) {
                return {
                    label: "Terminé ✓",
                    color: "#4caf50",
                    bgColor: "rgba(76, 175, 80, 0.1)",
                };
            }
            return {
                label: "En cours",
                color: "#ff9800",
                bgColor: "rgba(255, 152, 0, 0.1)",
            };
        }

        return {
            label: "En attente",
            color: "#9e9e9e",
            bgColor: "rgba(158, 158, 158, 0.1)",
        };
    }

    /** Factory depuis un DTO API */
    static fromDto(dto: any): SpeedTypingGame {
        return new SpeedTypingGame(
            dto.id,
            dto.lobbyId,
            dto.text,
            dto.status as SpeedTypingStatus,
            dto.startedAt ? new Date(dto.startedAt) : null,
            dto.finishedAt ? new Date(dto.finishedAt) : null,
            dto.durationSeconds,
            dto.playerProgresses || [],
            dto.results || []
        );
    }
}