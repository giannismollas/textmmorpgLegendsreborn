import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Home, Backpack, Swords, Scroll, Gift, User, Award, 
  Users, Settings, LogOut, Compass, Coins, Gem, Send, 
  Flame, Globe, Menu, ShieldAlert, Sparkles, MessageSquare, Briefcase, Trophy
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    player, logout, currentView, setCurrentView, 
    chatMessages, addChatMessage, isOnline, loading
  } = useGame();
  
  const [chatInput, setChatInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hardcoded Top players for mock leaderboard
  const topPlayers = [
    { name: 'ShadowBlade', level: 62, class: 'Rogue' },
    { name: 'LunaSkye', level: 61, class: 'Ranger' },
    { name: 'WarriorX', level: 60, class: 'Warrior' },
    { name: 'Aetheris', level: 59, class: 'Mage' },
    { name: player?.name || 'Monarch', level: player?.level || 1, class: player?.class || 'Warrior' },
  ].sort((a, b) => b.level - a.level);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addChatMessage(chatInput);
    setChatInput('');
  };

  if (!player) return <>{children}</>;

  // Format big numbers
  const formatNum = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="app-container">
      {/* Top Header Bar */}
      <header className="top-bar">
        <div className="game-logo glow-text" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
          <Flame size={24} color="#a855f7" fill="#a855f7" />
          <span>LEGENDS REBORN</span>
        </div>
        
        <div className="top-bar-stats">
          {/* Level Badge */}
          <div className="stat-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>LV</span>
            <span className="stat-value" style={{ color: 'var(--primary)', fontSize: '1rem' }}>{player.level}</span>
          </div>

          {/* HP Bar */}
          <div className="stat-item" style={{ width: '140px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
            <div className="stat-label-container" style={{ width: '100%' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HP</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{formatNum(player.hp)}/{formatNum(player.max_hp)}</span>
            </div>
            <div className="progress-container">
              <div className="progress-fill hp" style={{ width: `${(player.hp / player.max_hp) * 100}%` }}></div>
            </div>
          </div>

          {/* Energy Bar */}
          <div className="stat-item" style={{ width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
            <div className="stat-label-container" style={{ width: '100%' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ENERGY</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{player.energy}/{player.max_energy}</span>
            </div>
            <div className="progress-container">
              <div className="progress-fill energy" style={{ width: `${(player.energy / player.max_energy) * 100}%` }}></div>
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="stat-item" style={{ width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
            <div className="stat-label-container" style={{ width: '100%' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STAMINA</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{player.stamina}/{player.max_stamina}</span>
            </div>
            <div className="progress-container">
              <div className="progress-fill stamina" style={{ width: `${(player.stamina / player.max_stamina) * 100}%` }}></div>
            </div>
          </div>

          {/* Gold coin count */}
          <div className="stat-item" style={{ color: 'var(--accent-gold)' }}>
            <Coins size={16} />
            <span className="stat-value gold-text">{formatNum(player.gold)}</span>
          </div>

          {/* Diamonds balance */}
          <div className="stat-item" style={{ color: 'var(--accent-diamond)' }}>
            <Gem size={16} />
            <span className="stat-value" style={{ color: '#38bdf8' }}>{formatNum(player.diamonds)}</span>
          </div>

          {/* Sync indicator */}
          <div className="stat-item" title={isOnline ? 'Synced online with Supabase' : 'Offline local mode. Sync config available in Settings.'}>
            <Globe size={16} color={isOnline ? '#10b981' : '#64748b'} />
            <span style={{ fontSize: '0.7rem', color: isOnline ? '#10b981' : '#64748b', fontWeight: 'bold' }}>
              {isOnline ? 'ONLINE' : 'LOCAL'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Panel grid containing sidebar + content + chat */}
      <div className="game-layout">
        
        {/* Left Side-Nav Sidebar */}
        <aside className="game-sidebar">
          <div>
            {(() => {
              const classImages: Record<string, string> = {
                Warrior: '/images/class_warrior.png',
                Mage: '/images/class_mage.png',
                Rogue: '/images/class_rogue.png',
                Ranger: '/images/class_ranger.png',
              };
              const avatarImage = classImages[player.class] || '/images/class_warrior.png';
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
                  <img 
                    src={avatarImage} 
                    alt={player.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--primary)', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{player.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{player.class}</div>
                  </div>
                </div>
              );
            })()}

            <div className="nav-section-title">Main</div>
            <button className={`nav-button ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>
              <Home size={16} />
              <span className="sidebar-text">Home</span>
            </button>
            <button className={`nav-button ${currentView === 'town' ? 'active' : ''}`} onClick={() => setCurrentView('town')}>
              <Compass size={16} />
              <span className="sidebar-text">Town</span>
            </button>
            <button className={`nav-button ${currentView === 'jobs' ? 'active' : ''}`} onClick={() => setCurrentView('jobs')}>
              <Briefcase size={16} />
              <span className="sidebar-text">Jobs Board</span>
            </button>
            <button className={`nav-button ${currentView === 'inventory' ? 'active' : ''}`} onClick={() => setCurrentView('inventory')}>
              <Backpack size={16} />
              <span className="sidebar-text">Inventory</span>
            </button>

            <div className="nav-section-title">Character</div>
            <button className={`nav-button ${currentView === 'character' ? 'active' : ''}`} onClick={() => setCurrentView('character')}>
              <User size={16} />
              <span className="sidebar-text">Professions & Stats</span>
            </button>
            <button className={`nav-button ${currentView === 'achievements' ? 'active' : ''}`} onClick={() => setCurrentView('achievements')}>
              <Award size={16} />
              <span className="sidebar-text">Trophy Room</span>
            </button>
            <button className={`nav-button ${currentView === 'arena' ? 'active' : ''}`} onClick={() => setCurrentView('arena')}>
              <Swords size={16} />
              <span className="sidebar-text">PVP Battle Arena</span>
            </button>
            
            <div className="nav-section-title">Social</div>
            <button className={`nav-button ${currentView === 'market' ? 'active' : ''}`} onClick={() => setCurrentView('market')}>
              <Coins size={16} />
              <span className="sidebar-text">Marketplace</span>
            </button>
            <button className={`nav-button ${currentView === 'guild' ? 'active' : ''}`} onClick={() => setCurrentView('guild')}>
              <Users size={16} />
              <span className="sidebar-text">Guild</span>
            </button>
            <button className={`nav-button ${currentView === 'boss' ? 'active' : ''}`} onClick={() => setCurrentView('boss')}>
              <Flame size={16} />
              <span className="sidebar-text">World Boss Raid</span>
            </button>
            <button className={`nav-button ${currentView === 'leaderboard' ? 'active' : ''}`} onClick={() => setCurrentView('leaderboard')}>
              <Trophy size={16} />
              <span className="sidebar-text">Leaderboard</span>
            </button>
            
            <div className="nav-section-title">System</div>
            <button className={`nav-button ${currentView === 'settings' ? 'active' : ''}`} onClick={() => setCurrentView('settings')}>
              <Settings size={16} />
              <span className="sidebar-text">Settings</span>
            </button>
          </div>

          <button className="nav-button" onClick={logout} style={{ color: 'var(--accent-red)', marginTop: 'auto' }}>
            <LogOut size={16} />
            <span className="sidebar-text">Logout</span>
          </button>
        </aside>

        {/* Center Dynamic Content View panel */}
        <main className="main-content">
          {children}
        </main>

        {/* Right Chat Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
              <MessageSquare size={16} color="var(--primary)" />
              <span>GLOBAL CHAT</span>
            </div>
            <div className="chat-online-badge">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }}></span>
              <span>1,248 Online</span>
            </div>
          </div>

          {/* Event Announcement Panel */}
          <div style={{ background: 'rgba(168, 85, 247, 0.05)', borderBottom: '1px solid var(--border-color)', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-gold)', marginBottom: '4px' }}>
              <Sparkles size={14} />
              <span>WORLD BOSS INCOMING</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Ancient Dragon spawns in <span style={{ color: '#fff', fontWeight: 'bold' }}>01:45:32</span>
            </div>
          </div>

          {/* Messages logger container */}
          <div className="chat-messages">
            {chatMessages.map(msg => (
              <div className="chat-message" key={msg.id}>
                <span className="chat-msg-time">{msg.created_at}</span>
                <span className="chat-msg-user">[{msg.player_name}]</span>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>

          {/* Chat Form submission */}
          <form className="chat-input-container" onSubmit={handleSendChat}>
            <input 
              type="text" 
              placeholder="Send message to lobby..." 
              className="chat-input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
              <Send size={14} />
            </button>
          </form>

          {/* Small Top Leaderboard Panel at the bottom of Chat Sidebar */}
          <div style={{ borderTop: '1px solid var(--border-color)', padding: '16px', background: 'rgba(0,0,0,0.1)' }}>
            <h4 style={{ fontSize: '0.75rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} color="var(--accent-gold)" />
              <span>TOP PLAYERS</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topPlayers.slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: item.name === player.name ? 'var(--accent-gold)' : 'var(--text-main)', fontWeight: item.name === player.name ? 'bold' : 'normal' }}>
                    {idx + 1}. {item.name}
                  </span>
                  <span style={{ color: 'var(--primary)' }}>Lv {item.level}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
