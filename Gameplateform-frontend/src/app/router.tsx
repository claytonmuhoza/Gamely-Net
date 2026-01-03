import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { LobbyListPage } from '../features/lobbies/ui/LobbyListPage'
import { LobbyRoomPage } from '../features/lobbies/ui/LobbyRoomPage'
import { GamePage } from '../features/games/shared/GamePage'
import { EnterPseudoPage } from '../features/lobbies/ui/EnterPseudoPage'
import { ScoresPage } from '../features/scores/ui/ScoresPage'
import { GameActionsPage } from '../features/admin-actions/ui/GameActionsPage'
import { NotFoundPage } from './layout/NotFoundPage'


export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppShell />,
        children: [
            { index: true, element: <LobbyListPage /> },
            { path: 'enter', element: <EnterPseudoPage /> },
            { path: 'lobbies/:lobbyId', element: <LobbyRoomPage /> },
            { path: 'games/:lobbyId', element: <GamePage /> },
            { path: '/scores', element: <ScoresPage /> },
            {path:'/admin/actions', element: <GameActionsPage/>},
            {path:"/admin/actions/:lobbyId", element:<GameActionsPage /> },
            { path: '*', element: <NotFoundPage />}
        ]
    }
])
