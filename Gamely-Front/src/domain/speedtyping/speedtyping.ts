export enum TextDifficulty {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard"
}

export enum SpeedTypingStatus {
    WaitingToStart = "WaitingToStart",
    InProgress = "InProgress",
    Finished = "Finished"
}

export class TypingText {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly difficulty: TextDifficulty,
        public readonly wordCount: number,
        public readonly language: string
    ) {}
}

export class PlayerProgress {
    constructor(
        public readonly playerId: string,
        public readonly playerPseudo: string,
        public readonly currentTypedText: string,
        public readonly correctCharacters: number,
        public readonly totalCharacters: number,
        public readonly errorCount: number,
        public readonly accuracy: number,
        public readonly currentWPM: number,
        public readonly hasFinished: boolean,
        public readonly finishedAt: string | null,
        public readonly completionTime: string | null
    ) {}
}

export class PlayerResult {
    constructor(
        public readonly playerId: string,
        public readonly playerPseudo: string,
        public readonly rank: number,
        public readonly completionTime: string,
        public readonly accuracy: number,
        public readonly wpm: number,
        public readonly errorCount: number,
        public readonly score: number
    ) {}

    getStatusInfo(): { label: string; color: string; bgColor: string } {
        if (this.rank === 1) {
            return {
                label: "🥇 1er",
                color: "#ffc107",
                bgColor: "rgba(255, 193, 7, 0.1)"
            };
        }
        if (this.rank === 2) {
            return {
                label: "🥈 2ème",
                color: "#9e9e9e",
                bgColor: "rgba(158, 158, 158, 0.1)"
            };
        }
        if (this.rank === 3) {
            return {
                label: "🥉 3ème",
                color: "#ff6f00",
                bgColor: "rgba(255, 111, 0, 0.1)"
            };
        }
        return {
            label: `#${this.rank}`,
            color: "#616161",
            bgColor: "rgba(97, 97, 97, 0.1)"
        };
    }
}

export class SpeedTypingGame {
    constructor(
        public readonly id: string,
        public readonly lobbyId: string,
        public readonly text: TypingText,
        public readonly status: SpeedTypingStatus,
        public readonly startedAt: string | null,
        public readonly finishedAt: string | null,
        public readonly durationSeconds: number,
        public readonly playerProgresses: PlayerProgress[],
        public readonly results: PlayerResult[]
    ) {}

    get isWaiting(): boolean {
        return this.status === SpeedTypingStatus.WaitingToStart;
    }

    get isInProgress(): boolean {
        return this.status === SpeedTypingStatus.InProgress;
    }

    get isFinished(): boolean {
        return this.status === SpeedTypingStatus.Finished;
    }

    getPlayerProgress(playerId: string): PlayerProgress | null {
        return this.playerProgresses.find(p => p.playerId === playerId) ?? null;
    }

    getPlayerResult(playerId: string): PlayerResult | null {
        return this.results.find(r => r.playerId === playerId) ?? null;
    }

    getTimeRemaining(): number {
        if (!this.startedAt) return this.durationSeconds;
        const elapsed = (Date.now() - new Date(this.startedAt).getTime()) / 1000;
        return Math.max(0, this.durationSeconds - Math.floor(elapsed));
    }

    static fromDto(dto: any): SpeedTypingGame {
        return new SpeedTypingGame(
            dto.id,
            dto.lobbyId,
            new TypingText(
                dto.text.id,
                dto.text.content,
                dto.text.difficulty as TextDifficulty,
                dto.text.wordCount,
                dto.text.language
            ),
            dto.status as SpeedTypingStatus,
            dto.startedAt,
            dto.finishedAt,
            dto.durationSeconds,
            dto.playerProgresses.map((p: any) => new PlayerProgress(
                p.playerId,
                p.playerPseudo,
                p.currentTypedText,
                p.correctCharacters,
                p.totalCharacters,
                p.errorCount,
                p.accuracy,
                p.currentWPM,
                p.hasFinished,
                p.finishedAt,
                p.completionTime
            )),
            dto.results.map((r: any) => new PlayerResult(
                r.playerId,
                r.playerPseudo,
                r.rank,
                r.completionTime,
                r.accuracy,
                r.wpm,
                r.errorCount,
                r.score
            ))
        );
    }
}