export class MorpionGame {
  constructor(
    public readonly id: string,
    public readonly lobbyId: string,
    public readonly board: string, // 9 chars: '.', 'X', 'O'
    public readonly playerXId: string,
    public readonly playerOId: string,
    public readonly currentPlayerId: string,
    public readonly winnerPlayerId: string | null,
    public readonly isFinished: boolean,
    public readonly isDraw: boolean
  ) {}

  /** Retourne le tableau des 9 cases */
  get cells(): string[] {
    return this.board.split("");
  }

  /** Retourne la marque d'une case (X/O/.) */
  getCell(row: number, col: number): string {
    return this.board[row * 3 + col];
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
    if (playerId === this.playerXId) return "X";
    if (playerId === this.playerOId) return "O";
    return null;
  }

  // ============================================================================
  // NOUVELLES MÉTHODES POUR L'UI AMÉLIORÉE
  // ============================================================================

  /**
   * Retourne le statut avec les couleurs associées pour l'affichage
   */
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
          bgColor: "rgba(158, 158, 158, 0.1)",
        };
      }
      if (this.winnerPlayerId === playerId) {
        return {
          label: "Victoire",
          color: "#4caf50",
          bgColor: "rgba(76, 175, 80, 0.1)",
        };
      }
      return {
        label: "Défaite",
        color: "#f44336",
        bgColor: "rgba(244, 67, 54, 0.1)",
      };
    }

    if (this.currentPlayerId === playerId) {
      return {
        label: "Votre tour",
        color: "#4caf50",
        bgColor: "rgba(76, 175, 80, 0.1)",
      };
    }
    return {
      label: "Tours de l'adversaire",
      color: "#ff9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
    };
  }

  /**
   * Retourne la ligne gagnante (indices des 3 cases alignées)
   * ou null s'il n'y a pas de gagnant
   */
  getWinningLine(): number[] | null {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes horizontales
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes verticales
      [0, 4, 8], [2, 4, 6],            // diagonales
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const cells = this.cells;
      if (
        cells[a] !== "." &&
        cells[a] === cells[b] &&
        cells[a] === cells[c]
      ) {
        return pattern;
      }
    }
    return null;
  }

  /**
   * Vérifie si une cellule fait partie de la combinaison gagnante
   */
  isWinningCell(row: number, col: number): boolean {
    const index = row * 3 + col;
    const winningLine = this.getWinningLine();
    return winningLine ? winningLine.includes(index) : false;
  }
}
