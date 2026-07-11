import React from 'react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS_DATABASE, Achievement } from '../constants/achievements';
import { Award, CheckCircle, Lock, Trophy, Sparkles } from 'lucide-react';

export const AchievementsPanel: React.FC = () => {
  const { player } = useGame();

  if (!player) return null;

  const unlockedSet = new Set(player.achievements || []);

  const getProgress = (achId: string): { current: number; target: number } => {
    switch (achId) {
      case 'first_steps':
        return { current: player.level >= 2 ? 1 : 0, target: 1 };
      case 'champion_training':
        return { current: Math.min(10, player.level), target: 10 };
      case 'first_blood':
        return { current: (player.pvp_wins || 0) >= 1 ? 1 : 0, target: 1 };
      case 'pvp_warlord':
        return { current: Math.min(10, player.pvp_wins || 0), target: 10 };
      case 'novice_gatherer':
        // Simulated or tracked gather count. We can approximate using professions or general items
        const rawMatsTotal = player.total_kills || 0; // fallback to kills or items
        return { current: Math.min(10, rawMatsTotal), target: 10 };
      case 'master_crafter':
        return { current: Math.min(5, player.total_crafts || 0), target: 5 };
      case 'gold_hoarder':
        return { current: Math.min(1000, player.gold), target: 1000 };
      case 'dragon_striker':
        const bossDmg = parseInt(localStorage.getItem('boss_contrib') || '0');
        return { current: Math.min(10000, bossDmg), target: 10000 };
      default:
        return { current: 0, target: 1 };
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <Award size={16} color="var(--primary)" />
        <span>Trophy Room</span>
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '-10px 0 24px 0' }}>
        Unlock challenges to earn Diamonds and Gold rewards. Your achievements represent your glory across Greenwood.
      </p>

      {/* Progress overview */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.02)', 
        border: '1px solid var(--border-color)', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>COMPLETED CHALLENGES</span>
          <h2 style={{ fontSize: '1.5rem', margin: '4px 0 0 0', color: 'var(--accent-gold)' }}>
            {unlockedSet.size} / {ACHIEVEMENTS_DATABASE.length}
          </h2>
        </div>
        <div style={{ width: '150px' }}>
          <div className="progress-container" style={{ height: '8px' }}>
            <div 
              className="progress-fill stamina" 
              style={{ width: `${(unlockedSet.size / ACHIEVEMENTS_DATABASE.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="town-grid">
        {ACHIEVEMENTS_DATABASE.map(ach => {
          const isUnlocked = unlockedSet.has(ach.id);
          const { current, target } = getProgress(ach.id);
          const percentage = Math.min(100, Math.round((current / target) * 100));

          return (
            <div 
              key={ach.id} 
              style={{ 
                background: isUnlocked ? 'rgba(168, 85, 247, 0.03)' : 'rgba(0,0,0,0.15)', 
                border: isUnlocked ? '1px solid var(--primary)' : '1px solid var(--border-color)', 
                padding: '16px', 
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isUnlocked ? 1 : 0.75,
                position: 'relative',
                boxShadow: isUnlocked ? '0 0 10px rgba(168, 85, 247, 0.1)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, color: isUnlocked ? 'var(--text-gold)' : 'var(--text-main)' }}>
                    {ach.name}
                  </h4>
                  {isUnlocked ? (
                    <CheckCircle size={16} color="var(--accent-green)" />
                  ) : (
                    <Lock size={14} color="var(--text-muted)" />
                  )}
                </div>
                
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0', minHeight: '36px' }}>
                  {ach.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div className="stat-label-container" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>
                    <span>{ach.conditionDescription}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="progress-container" style={{ height: '4px' }}>
                    <div 
                      className={`progress-fill ${isUnlocked ? 'stamina' : 'xp'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reward info */}
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>💎 +{ach.diamondReward}</span>
                  {ach.goldReward > 0 && (
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>💰 +{ach.goldReward}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
