import { createBrowserRouter } from "react-router-dom";
import { LobbyListPage } from "../ui/pages/LobbyListPage";
import { MorpionGamePage } from "../ui/pages/MorpionGamePage";
import GamelyHomePage from "../ui/pages/GamelyHomePage.tsx";
import GamesListPage from "../ui/pages/GamesListPage.tsx";
import Layout from "../ui/components/layout.tsx";
import PuissanceGamePage from "../ui/pages/PuissanceGamePage.tsx";
import SpeedTypingGamePage from "../ui/pages/SpeedTypingGamePage";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <GamelyHomePage /> },
            { path: "jeux", element: <GamesListPage /> },
            { path: "lobbies", element: <LobbyListPage /> },
            { path: "morpion/:gameId", element: <MorpionGamePage /> },
            { path: "puissance/:gameId", element: <PuissanceGamePage /> }
            { path: "speedtyping/:gameId", element: <SpeedTypingGamePage /> },

        ]
    }
]);