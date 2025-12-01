import { useContext } from "react";
import { CurrentPlayerContext } from "../providers/CurrentPlayerContext";

export function useCurrentPlayer() {
  const ctx = useContext(CurrentPlayerContext);
  if (!ctx) throw new Error("useCurrentPlayer must be used within CurrentPlayerProvider");
  return ctx;
}