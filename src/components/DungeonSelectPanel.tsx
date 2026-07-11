import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Sparkles, Clock, Lock, ArrowRight, Swords, Trophy } from 'lucide-react';

interface DungeonSelectPanelProps {
  onClose: () => void;
}

export const DungeonSelectPanel: React.FC<DungeonSelectPanelProps> = ({ onClose }) => {
  const { player, startSoloDungeon, startGroupDungeon, claimGroupDungeonRewards } = useGame();
  const [timeLeftStr, setTimeLeftStr] = useState('');

  if (!player) return null;

  const currentRegion = player.active_region || 'Greenwood Forest';
  const finishTime = player.group_dungeon_finish_time || 0;
  const isLocked = finishTime > 0 && Date.now() < finishTime;
  const isFinished = finishTime > 0 && Date.now() >= finishTime;

  // Countdown timer effect
  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      const remainingMs = finishTime - Date.now();
      if (remainingMs <= 0) {
        setTimeLeftStr('');
        clearInterval(timer);
        window.location.reload(); // Refresh to update finished state
        return;
      }
      const hours = Math.floor(remainingMs / 3600000);
      const minutes = Math.floor((remainingMs % 3600000) / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);
      setTimeLeftStr(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, finishTime]);

  const handleEnterSolo = () => {
    startSoloDungeon();
    onClose();
  };

  const handleEnterGroup = () => {
    startGroupDungeon();
  };

  return (
    <div className="overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '650px', background: 'rgba(23, 18, 51, 0.95)', border: '1px solid var(--primary)', boxShadow: '0 0 35px rgba(168, 85, 247, 0.25)' }}>
        
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <Shield size={18} color="var(--primary)" />
            <span>Region Dungeons: {currentRegion}</span>
          </span>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* SOLO DUNGEON CARD */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>⚔️ Solo Gauntlet</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid var(--text-gold)', padding: '2px 6px', borderRadius: '4px' }}>Instant</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                  Battle through 3 sequential rooms of Dungeon Sentinels immediately. Clearing the gauntlet awards a guaranteed Rare or higher chest on Room 3.
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  ⚡ Cost: <strong>1 Energy</strong>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleEnterSolo}
                disabled={isLocked}
                style={{ width: '100%', padding: '10px', fontWeight: 'bold' }}
              >
                {isLocked ? '🔒 locked in raid' : 'ENTER SOLO DUNGEON'}
              </button>
            </div>

            {/* GROUP RAID DUNGEON CARD */}
            <div style={{ 
              background: 'rgba(168, 85, 247, 0.02)', 
              border: '1px solid rgba(168, 85, 247, 0.15)', 
              borderRadius: '8px', 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: 'rgba(168, 85, 247, 1)' }}>🏰 Group Raid</h4>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(168, 85, 247, 1)', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>3-Hour Raid</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                  Send your character deep into the ruins of {currentRegion}. Locks regular exploration for 3 hours. Rewards Epic or Legendary items and high gold split upon completion.
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  ⚡ Cost: <strong>2 Energy</strong>
                </div>
              </div>

              {isLocked ? (
                /* IN PROGRESS LOCK SCREEN */
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Clock size={12} color="var(--primary)" />
                    <span>Raid in Progress...</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '10px', fontFamily: 'monospace' }}>
                    {timeLeftStr || '0h 00m 00s'}
                  </div>
                  <button className="btn btn-secondary" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                    LOCKED IN RUINS
                  </button>
                </div>
              ) : isFinished ? (
                /* FINISHED CLAIM STATUS */
                <button 
                  className="btn btn-primary glow-button" 
                  onClick={claimGroupDungeonRewards}
                  style={{ width: '100%', padding: '10px', fontWeight: 'bold', background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', borderColor: '#eab308' }}
                >
                  🎁 CLAIM RAID REWARDS
                </button>
              ) : (
                /* READY STATUS */
                <button 
                  className="btn btn-primary" 
                  onClick={handleEnterGroup}
                  style={{ width: '100%', padding: '10px', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}
                >
                  START GROUP RAID
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
