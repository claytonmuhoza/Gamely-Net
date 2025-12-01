import {  useEffect, useState } from "react";
import { Player } from "../../domain/player/player";
import { CurrentPlayerContext, STORAGE_KEY } from "./CurrentPlayerContext";

export function CurrentPlayerProvider({ children }: { children: React.ReactNode }) {
    const [player, setPlayerState] = useState<Player | null>(() => {
        // important si vous avez du SSR / tests
        if (typeof window === "undefined") return null;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        try {
            return JSON.parse(stored) as Player;
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    });
    useEffect(() => {
        if (!player) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
        } catch {
            // éventuellement log ou ignore
        }
    }, [player]);

    const setPlayer = (p: Player | null) => {
        setPlayerState(p);
        if (p) {
            // on ne stocke que des données brutes, pas les méthodes
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: p.id, pseudo: p.pseudo }));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <CurrentPlayerContext.Provider value={{ player, setPlayer }}>
            {children}
        </CurrentPlayerContext.Provider>
    );
}


