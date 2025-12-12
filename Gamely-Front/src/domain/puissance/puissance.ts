
export class PuissanceGame {
    constructor(
        public readonly id: string,
        public readonly lobbyId: string,
        public  readonly board: string, // 42 chars: '.', 'X', 'O'
        public readonly playerOneId: string,
        public readonly playerTwoId: string,
        public readonly currentPlayerId: string,
        public readonly winnerPlayerId: string | null,
        public readonly isFinished: boolean,
        public readonly isDraw: boolean
    ) {}

    /** Retourne le tableau des 42 cases */
    get cells(): string[] {
        return this.board.split("");
    }

    /** Retourne la marque d'une case (X/O/.) */
    getCell(row: number, col: number): string {
        return this.board[row * 7 + col];
    }

    /** Est-ce que la case est vide ? */
    isCellEmpty(row: number, col: number): boolean {
        return this.getCell(row, col) === ".";
    }

    /** Est-ce au tour de ce joueur ? */
    canPlay(playerId: string): boolean {
        return !this.isFinished && playerId === this.currentPlayerId;
    }

    /** Texte de statut pour l'affichage */
    getStatusLabel(playerId: string): string {
        if (this.isFinished) {
            if (this.isDraw) {
                return "Match nul 🤝";
            }
            if (this.winnerPlayerId === playerId) {
                return "Vous avez gagné 🎉";
            }
            return "Vous avez perdu 😢";
        }

        if (this.currentPlayerId === playerId) {
            return "À vous de jouer 🟢";
        }
        return "Tour de l'adversaire ⏳";
    }
    /** Marque d'un joueur (X ou O) */
    getPlayerMark(playerId: string): "X" | "O" | null {
        if (playerId === this.playerOneId) return "X";
        if (playerId === this.playerTwoId) return "O";
        return null;
    }

    /** Retourne les colonnes jouables (non pleines) */
    getPlayableColumns(): number[] {
        const playableColumns: number[] = [];
        for (let col = 0; col < 7; col++) {
            if (this.isCellEmpty(0, col)) {
                playableColumns.push(col);
            }
        }
        return playableColumns;
    }

    /** Retourne la prochaine ligne disponible dans une colonne */
    getNextAvailableRow(col: number): number | null {
        for (let row = 5; row >= 0; row--) {
            if (this.isCellEmpty(row, col)) {
                return row;
            }
        }
        return null; // Colonne pleine
    }
    /** Retourne le statut avec les couleurs associées pour l'affichage */
    getStatusInfo(playerId: string): {
        label: string;
        color: string;
        bgColor: string;
    } {
        if (this.isFinished) {
            if (this.isDraw) {
                return {
                    label: "Match nul",
                    color: "#9e9e9e",
                    bgColor: "#e0e0e0",
                };
            } else if (this.winnerPlayerId === playerId) {
                return {
                    label: "Vous avez gagné",
                    color: "#4caf50",
                    bgColor: "#c8e6c9",
                };
            } else {
                return {
                    label: "Vous avez perdu",
                    color: "#f44336",
                    bgColor: "#ffcdd2",
                };
            }
        } else {
            if (this.currentPlayerId === playerId) {
                return {
                    label: "À vous de jouer",
                    color: "#2196f3",
                    bgColor: "#bbdefb",
                };
            } else {
                return {
                    label: "Tour de l'adversaire",
                    color: "#ff9800",
                    bgColor: "#ffe0b2",
                }
            }
        }
    }


}