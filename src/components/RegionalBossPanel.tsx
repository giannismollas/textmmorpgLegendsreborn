import React from 'react';
import { useGame } from '../context/GameContext';
import { REGIONS_CONFIG } from '../constants/events';
import { Flame, Swords, Heart, ShieldAlert, Award } from 'lucide-react';

interface RegionalBossPanelProps {
  onClose: () => void;
}

export const RegionalBossPanel: React.FC<RegionalBossPanelProps> = ({ onClose }) => {
  const { player, startRegionalBossFight } = useGame();

  if (!player) return null;

  const currentRegion = player.active_region || 'Greenwood Forest';
  const regionConfig = REGIONS_CONFIG.find(r => r.name === currentRegion) || REGIONS_CONFIG[0];
  const boss = regionConfig.boss;

  const handleChallenge = () => {
    startRegionalBossFight();
    onClose();
  };

  return (
    <div className="overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '480px', background: 'rgba(23, 18, 51, 0.95)', border: '1px solid var(--primary)', boxShadow: '0 0 35px rgba(239, 68, 68, 0.2)' }}>
        
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <Flame size={18} color="#ef4444" />
            <span>Regional Boss Sanctuary</span>
          </span>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CURRENT REGION: {currentRegion.toUpperCase()}</span>
          <h3 style={{ margin: '8px 0 20px 0', fontSize: '1.4rem', fontWeight: 'bold', color: '#fff' }}>
            Area Guardian Fight
          </h3>

          <div style={{ 
            background: 'rgba(239, 68, 68, 0.03)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '12px', 
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'inset 0 0 15px rgba(239, 68, 68, 0.05)'
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '16px' }}>👿</div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ef4444', margin: '0 0 12px 0' }}>
              {boss.name}
            </h4>

            {/* Boss Stats list */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Heart size={14} color="#ef4444" />
                HP: <strong>{boss.hp}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Swords size={14} color="var(--primary)" />
                Atk: <strong>{boss.attack}</strong>
              </span>
            </div>

            {/* Rewards */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '12px', 
              fontSize: '0.75rem', 
              background: 'rgba(0,0,0,0.4)', 
              padding: '8px 12px', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.03)' 
            }}>
              <span>💰 +{boss.goldReward} Gold</span>
              <span>⭐ +{boss.xpReward} XP</span>
              <span style={{ color: 'var(--text-gold)' }}>🎁 100% Loot Drop</span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            Warning: Regional bosses are significantly stronger than ordinary encounters. Ensure your attributes are fully spent and weapons/armor equipped before initiating!
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleChallenge}
              style={{ flex: 2, background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', borderColor: '#ef4444', fontWeight: 'bold', padding: '12px' }}
            >
              CHALLENGE BOSS (⚡ 1 Energy)
            </button>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Retreat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
