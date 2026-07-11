import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { CharacterCreator } from './components/CharacterCreator';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Town } from './components/Town';
import { CharacterPanel } from './components/CharacterPanel';
import { Marketplace } from './components/Marketplace';
import { Guild } from './components/Guild';
import { Settings } from './components/Settings';
import { AdventureEvent } from './components/AdventureEvent';
import { JobsPanel } from './components/JobsPanel';
import { PvPArena } from './components/PvPArena';
import { WorldBoss } from './components/WorldBoss';
import { DeathOverlay } from './components/DeathOverlay';
import { Leaderboard } from './components/Leaderboard';
import { AchievementsPanel } from './components/AchievementsPanel';
import { Crafting } from './components/Crafting';
import { Flame } from 'lucide-react';

const GameRouter: React.FC = () => {
  const { user, player, currentView, loading } = useGame();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'radial-gradient(circle at 50% 0%, #171233 0%, var(--bg-main) 70%)', gap: '16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', border: '2px solid var(--primary)', color: 'var(--primary)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)', animation: 'pulse-glow 1.5s infinite alternate' }}>
          <Flame size={36} fill="var(--primary)" />
        </div>
        <div className="glow-text" style={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>LOADING LEGENDS REBORN...</div>
      </div>
    );
  }

  // 1. Session check: not logged in -> Landing / Auth page
  if (!user) {
    return <LandingPage />;
  }

  // 2. Character creation check: no player created -> Character Creator page
  if (!player) {
    return <CharacterCreator />;
  }

  // 3. Main game layout
  return (
    <Layout>
      {currentView === 'home' && <Dashboard />}
      {currentView === 'town' && <Town />}
      {currentView === 'crafting' && <Crafting />}
      {currentView === 'inventory' && <Inventory />}
      {currentView === 'character' && <CharacterPanel />}
      {currentView === 'market' && <Marketplace />}
      {currentView === 'guild' && <Guild />}
      {currentView === 'settings' && <Settings />}
      {currentView === 'jobs' && <JobsPanel />}
      {currentView === 'arena' && <PvPArena />}
      {currentView === 'boss' && <WorldBoss />}
      {currentView === 'leaderboard' && <Leaderboard />}
      {currentView === 'achievements' && <AchievementsPanel />}
      
      {/* Universal event overlay panel overlaying the screen */}
      <AdventureEvent />
      <DeathOverlay />
    </Layout>
  );
};

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
