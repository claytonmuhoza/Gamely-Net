import React, { createContext, useContext, useEffect, useState } from "react";

type Player = {
    id: string;
    pseudo: string;
};

type PlayerContextType = {
    player: Player | null;
    setPlayer: (player: Player | null) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [player, setPlayerState] = useState<Player | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("player");
        if (stored) {
            setPlayerState(JSON.parse(stored));
        }
    }, []);

    const setPlayer = (p: Player | null) => {
        setPlayerState(p);
        if (p) {
            localStorage.setItem("player", JSON.stringify(p));
        } else {
            localStorage.removeItem("player");
        }
    };

    return (
        <PlayerContext.Provider value={{ player, setPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = (): PlayerContextType => {
    const ctx = useContext(PlayerContext);
    if (!ctx) {
        throw new Error("usePlayer must be used within PlayerProvider");
    }
    return ctx;
};
