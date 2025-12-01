// src/App.tsx
import React from 'react';
import { Routes } from 'react-router-dom';
import Layout from './ui/components/layout.tsx';
import {PlayerProvider} from "./context/PlayerContext.tsx";

const App: React.FC = () => {
  return (
      <PlayerProvider>
          <Layout>
              <Routes>

              </Routes>
          </Layout>
      </PlayerProvider>
  );
};

export default App;