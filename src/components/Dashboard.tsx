import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getRegionForLevel } from '../constants/events';
import { 
  Compass, Flame, ShieldAlert, Award, Calendar, 
  Hammer, Scissors, Eye, AlertCircle, Sparkles, Check, Scroll
} from 'lucide-react';
import { PartyPanel } from './PartyPanel';

export const Dashboard: React.FC = () => {
  const { 
    player, startAdventure, adventureLog, quests, 
    claimDailyReward 
  } = useGame();

  const [showParty, setShowParty] = useState(false);

  if (!player) return null;

  const currentRegion = getRegionForLevel(player.level);

  // Dynamic daily rewards based on player streak data
  const streakDay = player.daily_streak || 0;
  const today = new Date().toISOString().split('T')[0];
  const alreadyClaimed = player.last_daily_claim === today;
  
  // Show current day and next 4 days
  const dailyStreak = Array.from({ length: 5 }, (_, i) => {
    const day = streakDay + i + (alreadyClaimed ? 0 : 1);
    const isCurrent = i === 0 && !alreadyClaimed;
    const isPast = alreadyClaimed && i === 0;
    let value: number | string = day <= 2 ? 10 : day <= 6 ? 20 : day <= 13 ? 50 : 100;
    if (day % 7 === 0 && day > 0) value = 'Chest';
    return { day, claimed: isPast, value, isCurrent };
  });

  const regionImages: Record<string, string> = {
    'Greenwood Forest': '/images/region_greenwood.png',
    'Whispering Caves': '/images/region_greenwood.png',
    'Cursed Graveyard': '/images/region_greenwood.png',
    'Dragon peaks': '/images/region_greenwood.png',
    'Void Citadel': '/images/region_greenwood.png',
  };
  const regionBg = regionImages[currentRegion] || '/images/region_greenwood.png';

  return (
    <>
      {/* 1. Large Adventure Banner & Action trigger */}
      <section className="adventure-banner" style={{ 
        backgroundImage: `linear-gradient(rgba(15, 11, 28, 0.75), rgba(15, 11, 28, 0.92)), url("${regionBg}")`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={14} color="var(--primary)" />
          <span>CURRENT REGION: {currentRegion.toUpperCase()}</span>
        </div>
        
        <h1 style={{ fontSize: '2rem', margin: '8px 0 0 0', fontWeight: 800 }} className="glow-text">
          THE WORLD AWAITS
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
          Embark on your journey, brave warrior. Spend 1 Energy to explore.
        </p>

        <button className="btn-adventure" onClick={startAdventure}>
          START ADVENTURE
        </button>

        <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          <span>🏃‍♂️ Sprint</span>
          <span onClick={() => setShowParty(true)} style={{ cursor: 'pointer' }} className="hover-gold">👥 Party</span>
          <span>🏰 Dungeons</span>
          <span>👹 Bosses</span>
        </div>
      </section>

      {showParty && <PartyPanel onClose={() => setShowParty(false)} />}

      {/* 2. Middle Row grids (Recent Activity & Daily Rewards) */}
      <div className="dashboard-grid">
        {/* Left: Recent Activity Feed */}
        <div className="card">
          <h3 className="card-title">
            <Flame size={16} color="var(--primary)" />
            <span>Recent Activity</span>
          </h3>
          
          <div className="feed-list">
            {adventureLog.slice(0, 8).map((log, idx) => (
              <div key={idx} className="feed-item">
                {log}
              </div>
            ))}
            {adventureLog.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '24px' }}>
                No travel logs yet. Click Start Adventure above!
              </div>
            )}
          </div>
        </div>

        {/* Right: Daily Streak Calendar */}
        <div className="card">
          <h3 className="card-title">
            <Calendar size={16} color="var(--accent-gold)" />
            <span>Daily Rewards</span>
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '-10px 0 16px 0' }}>
            Login streak: {streakDay} day{streakDay !== 1 ? 's' : ''}. {alreadyClaimed ? 'Come back tomorrow!' : 'Claim your daily diamonds!'}
          </p>

          <div className="daily-rewards-row">
            {dailyStreak.map((day, idx) => (
              <div 
                key={idx} 
                className={`daily-day-card ${day.claimed ? 'completed' : ''} ${day.isCurrent ? 'current' : ''}`}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Day {day.day}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: day.isCurrent ? 'var(--text-gold)' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', height: '24px' }}>
                  {day.claimed ? (
                    <Check size={14} color="var(--accent-green)" />
                  ) : typeof day.value === 'number' ? (
                    <>💎 {day.value}</>
                  ) : (
                    <>🎁</>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '10px' }} 
            onClick={claimDailyReward}
            disabled={alreadyClaimed}
          >
            Claim Reward
          </button>
        </div>
      </div>

      {/* 3. Lower Row grids (Professions & Active Quests) */}
      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        {/* Left: Professions Levels */}
        <div className="card">
          <h3 className="card-title">
            <Hammer size={16} color="var(--primary)" />
            <span>Professions</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Mining */}
            <div>
              <div className="stat-label-container">
                <span style={{ fontWeight: 600 }}>⛏️ Mining</span>
                <span style={{ color: 'var(--text-muted)' }}>Lv {player.professions.mining.level} ({player.professions.mining.xp}/{player.professions.mining.max_xp} XP)</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill stamina" style={{ width: `${(player.professions.mining.xp / player.professions.mining.max_xp) * 100}%` }}></div>
              </div>
            </div>

            {/* Blacksmithing */}
            <div>
              <div className="stat-label-container">
                <span style={{ fontWeight: 600 }}>🔨 Blacksmithing</span>
                <span style={{ color: 'var(--text-muted)' }}>Lv {player.professions.blacksmithing.level} ({player.professions.blacksmithing.xp}/{player.professions.blacksmithing.max_xp} XP)</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill energy" style={{ width: `${(player.professions.blacksmithing.xp / player.professions.blacksmithing.max_xp) * 100}%` }}></div>
              </div>
            </div>

            {/* Herbalism */}
            <div>
              <div className="stat-label-container">
                <span style={{ fontWeight: 600 }}>🌿 Herbalism</span>
                <span style={{ color: 'var(--text-muted)' }}>Lv {player.professions.herbalism.level} ({player.professions.herbalism.xp}/{player.professions.herbalism.max_xp} XP)</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill stamina" style={{ width: `${(player.professions.herbalism.xp / player.professions.herbalism.max_xp) * 100}%` }}></div>
              </div>
            </div>

            {/* Fishing */}
            <div>
              <div className="stat-label-container">
                <span style={{ fontWeight: 600 }}>🎣 Fishing</span>
                <span style={{ color: 'var(--text-muted)' }}>Lv {player.professions.fishing.level} ({player.professions.fishing.xp}/{player.professions.fishing.max_xp} XP)</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill xp" style={{ width: `${(player.professions.fishing.xp / player.professions.fishing.max_xp) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Quests */}
        <div className="card">
          <h3 className="card-title">
            <Scroll size={16} color="var(--primary)" />
            <span>Active Quests</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {quests.map(q => (
              <div key={q.id} className="quest-item" style={{ borderLeft: q.completed ? '3px solid var(--accent-green)' : '3px solid var(--primary)' }}>
                <div>
                  <div className="quest-item-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{q.name}</span>
                    {q.completed && <span style={{ color: 'var(--accent-green)', fontSize: '0.7rem', fontWeight: 'bold' }}>[COMPLETED]</span>}
                  </div>
                  <div className="quest-item-desc">
                    Progress: {q.progress} / {q.target}
                  </div>
                  <div className="quest-rewards">
                    <span style={{ color: 'var(--accent-gold)' }}>💰 {q.reward_gold} Gold</span>
                    <span style={{ color: 'var(--primary)' }}>⭐ {q.reward_xp} XP</span>
                  </div>
                </div>
                
                <div className="progress-container" style={{ width: '60px', height: '6px' }}>
                  <div 
                    className={`progress-fill ${q.completed ? 'stamina' : 'xp'}`} 
                    style={{ width: `${(q.progress / q.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            {quests.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '24px' }}>
                No active quests. Explore regions to meet quest givers!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
