import React from 'react';
import { useGame } from '../context/GameContext';
import { REGIONS_CONFIG } from '../constants/events';
import { Map, Lock, CheckCircle, Compass } from 'lucide-react';

interface MapPanelProps {
  onClose: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ onClose }) => {
  const { player, setPlayer, isOnline } = useGame();

  if (!player) return null;

  const currentActive = player.active_region || 'Greenwood Forest';

  const handleSelectRegion = async (regionName: string, minLevel: number) => {
    if (player.level < minLevel) return;

    const updatedPlayer = {
      ...player,
      active_region: regionName
    };
    
    if (setPlayer) setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    if (isOnline) {
      const { getSupabase } = await import('../supabase');
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('players').update({ active_region: regionName }).eq('id', player.id).then();
      }
    }
    onClose();
  };

  const regionImages: Record<string, string> = {
    'Greenwood Forest': '/images/region_greenwood.png',
    'Whispering Caves': '/images/region_whispering_caves.png',
    'Sunken Reefs': '/images/region_sunken_reefs.png',
    'Scorched Wastes': '/images/region_scorched_wastes.png',
    'Dragon Peaks': '/images/region_dragon_peaks.png',
    'Void Citadel': '/images/region_void_citadel.png',
  };

  return (
    <div className="overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '750px', background: 'rgba(23, 18, 51, 0.95)', border: '1px solid var(--primary)', boxShadow: '0 0 35px rgba(168, 85, 247, 0.25)' }}>
        
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <Map size={18} color="var(--primary)" />
            <span>World Map & Regions</span>
          </span>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
            Select an unlocked territory to travel there. Exploring a region rewards you with region-specific monsters, unique quests, and resources corresponding to that level bracket.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {REGIONS_CONFIG.map(region => {
              const isUnlocked = player.level >= region.minLevel;
              const isActive = currentActive === region.name;
              const bg = regionImages[region.name] || '/images/region_greenwood.png';

              return (
                <div 
                  key={region.name}
                  onClick={() => handleSelectRegion(region.name, region.minLevel)}
                  style={{
                    position: 'relative',
                    backgroundImage: `linear-gradient(rgba(13, 8, 27, 0.78), rgba(13, 8, 27, 0.95)), url("${bg}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: isActive 
                      ? '2px solid var(--accent-gold)' 
                      : isUnlocked 
                        ? '1px solid var(--border-color)' 
                        : '1px solid rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    opacity: isUnlocked ? 1 : 0.45,
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 0 15px rgba(234, 179, 8, 0.2)' : 'none'
                  }}
                  className={isUnlocked ? 'hover-scale' : ''}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: isActive ? 'var(--accent-gold)' : '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
                      {region.name}
                    </h4>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: isUnlocked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      color: isUnlocked ? '#4ade80' : '#f87171', 
                      border: isUnlocked ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      Lv {region.minLevel} - {region.maxLevel}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    {region.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>🏘️ Town: <strong>{region.townName}</strong></span>
                    <span>👹 Boss: <strong>{region.boss.name}</strong></span>
                  </div>

                  {/* Active / Locked Indicators */}
                  {!isUnlocked && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#f87171' }}>
                      <Lock size={10} /> Locked (Need Lv {region.minLevel})
                    </div>
                  )}

                  {isActive && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(234, 179, 8, 0.15)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      <CheckCircle size={10} /> Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
