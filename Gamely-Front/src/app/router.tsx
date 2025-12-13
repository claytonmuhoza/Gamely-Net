import { createBrowserRouter } from "react-router-dom";
import { LobbyListPage } from "../ui/pages/LobbyListPage";
import { MorpionGamePage } from "../ui/pages/MorpionGamePage";
import GamelyHomePage from "../ui/pages/GamelyHomePage";
import GamesListPage from "../ui/pages/GamesListPage";
import Layout from "../ui/components/layout";
import {SpeedTypingGamePage} from "../ui/pages/SpeedTypingGamePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <GamelyHomePage /> },
            { path: "jeux", element: <GamesListPage /> },
            { path: "lobbies", element: <LobbyListPage /> },
            { path: "morpion/:gameId", element: <MorpionGamePage /> },
            { path: "speedtyping/:gameId", element: <SpeedTypingGamePage /> },

        ]
    }
]);