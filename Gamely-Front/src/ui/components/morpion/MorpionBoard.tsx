import { useState } from "react";
import { X, Circle } from "lucide-react";
import type { MorpionGame } from "../../../domain/morpion/morpion";

interface MorpionBoardProps {
  game: MorpionGame;
  currentPlayerId: string;
  onCellClick?: (row: number, col: number) => void;
}

interface CellProps {
  value: string;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
}

function Cell({ value, onClick, disabled, isWinning }: CellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderIcon = () => {
    if (value === "X") {
      return <X size={56} strokeWidth={3} color="#f44336" />;
    }
    if (value === "O") {
      return <Circle size={56} strokeWidth={3} color="#2196f3" />;
    }
    return null;
  };

  const baseStyle: React.CSSProperties = {
    width: "100%",
    height: "110px",
    border: isWinning ? "3px solid #4caf50" : "2px solid #424242",
    backgroundColor: isWinning ? "rgba(76, 175, 80, 0.15)" : "#1e1e1e",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled || value !== "." ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    transform: isWinning ? "scale(1.05)" : "scale(1)",
    opacity: disabled && value === "." ? 0.5 : 1,
  };

  const hoverStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: isWinning ? "rgba(76, 175, 80, 0.25)" : "#2a2a2a",
    borderColor: isWinning ? "#4caf50" : "#616161",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== "."}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered && !disabled && value === "." ? hoverStyle : baseStyle}
    >
      {renderIcon()}
    </button>
  );
}

// ============================================================================
// COMPOSANT CHIP
// ============================================================================
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
        padding: "6px 16px",
        borderRadius: "16px",
        backgroundColor: bgColor,
        color: color,
        fontSize: "14px",
        fontWeight: 500,
        border: `1px solid ${color}`,
      }}
    >
      {icon}
      {label}
    </div>
  );
}

// ============================================================================
// COMPOSANT BOARD PRINCIPAL
// ============================================================================
export function MorpionBoard({
  game,
  currentPlayerId,
  onCellClick,
}: MorpionBoardProps) {
  const handleClick = (row: number, col: number) => {
    if (!onCellClick) return;
    if (!game.canPlay(currentPlayerId)) return;
    if (!game.isCellEmpty(row, col)) return;
    onCellClick(row, col);
  };

  const statusInfo = game.getStatusInfo(currentPlayerId);
  const playerMark = game.getPlayerMark(currentPlayerId);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "32px",
        backgroundColor: "#121212",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* En-tête */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#fff",
          }}
        >
          Morpion
        </h2>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            bgColor={statusInfo.bgColor}
          />
          {playerMark && (
            <Chip
              label={`Vous êtes: ${playerMark}`}
              color="#90caf9"
              bgColor="rgba(144, 202, 249, 0.1)"
            />
          )}
        </div>
      </div>

      {/* Grille de jeu */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <Cell
              key={`${row}-${col}`}
              value={game.getCell(row, col)}
              onClick={() => handleClick(row, col)}
              disabled={
                !game.canPlay(currentPlayerId) ||
                !game.isCellEmpty(row, col) ||
                game.isFinished
              }
              isWinning={game.isWinningCell(row, col)}
            />
          ))
        )}
      </div>

      {/* Message de fin */}
      {game.isFinished && (
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "24px", color: "#2196f3", margin: 0 }}>
            {game.getStatusLabel(currentPlayerId)}
          </h3>
        </div>
      )}
    </div>
  );
}