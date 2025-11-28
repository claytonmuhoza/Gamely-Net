// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/UI/layout';
import GamelyHomePage from './pages/GamelyHomePage';
import GamesListPage from './pages/GamesListPage';
import {PlayerProvider} from "./context/PlayerContext.tsx";

const App: React.FC = () => {
  return (
      <PlayerProvider>
          <Layout>
              <Routes>
                  <Route path="/home" element={<GamelyHomePage />} />
                  <Route path="/jeux" element={<GamesListPage />} />
              </Routes>
          </Layout>
      </PlayerProvider>
  );
};

export default App;