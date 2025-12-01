import { createContext } from "react";
import { Player } from "../../domain/player/player";

export const STORAGE_KEY = "gamely_current_player";

interface CurrentPlayerContextValue {
  player: Player | null;
  setPlayer: (p: Player | null) => void;
}

export const CurrentPlayerContext = createContext<CurrentPlayerContextValue | undefined>(undefined);