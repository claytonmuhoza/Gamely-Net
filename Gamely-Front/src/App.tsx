// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/UI/layout';
import GamelyHomePage from './pages/GamelyHomePage';
import GamesListPage from './pages/GamesListPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<GamelyHomePage />} />
        <Route path="/jeux" element={<GamesListPage />} />
      </Routes>
    </Layout>
  );
};

export default App;