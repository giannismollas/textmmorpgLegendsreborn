import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Hammer, Flame, Star, Coins, Zap, Circle } from 'lucide-react';
import { MATERIALS_BY_RARITY, getRegionForLevel } from '../constants/events';

interface ProfessionConfig {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  profKey: string; // matches PlayerProfessions
}

export const Crafting: React.FC = () => {
  const { player, grindProfession } = useGame();
  const [activeGrindId, setActiveGrindId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const activeGrindIdRef = useRef<string | null>(null);
  const intervalRef = useRef<any>(null);

  if (!player) return null;

  const currentRegion = player.active_region || getRegionForLevel(player.level);

  const professionsList: ProfessionConfig[] = [
    { id: 'mining', name: 'Mining', emoji: '⛏️', desc: 'Harvest rich ores, gems, coal, and crystals.', profKey: 'mining' },
    { id: 'woodcutting', name: 'Woodcutting', emoji: '🪓', desc: 'Harvest logs, bark, and ancient branches.', profKey: 'woodcutting' },
    { id: 'herbalism', name: 'Herbalism', emoji: '🌿', desc: 'Gather flowers, herbs, and magic mushrooms.', profKey: 'herbalism' },
    { id: 'skinning', name: 'Skinning', emoji: '🐏', desc: 'Skin hides, furs, leathers, and bones from beasts.', profKey: 'skinning' },
    { id: 'fishing', name: 'Fishing', emoji: '🎣', desc: 'Catch exotic sea fish, pearls, and reef corals.', profKey: 'fishing' },
    { id: 'foraging', name: 'Foraging', emoji: '🌾', desc: 'Forage fibers, berries, honeycomb, and plants.', profKey: 'foraging' },
    { id: 'monster hunting', name: 'Monster Hunting', emoji: '⚔️', desc: 'Harvest essences, magical cores, and boss drops.', profKey: 'mining' } // falls back to mining stats if needed
  ];

  // Helper to roll random items matching gathering category
  const rollGrindMaterial = (profession: string): { name: string; emoji: string } | undefined => {
    // 40% chance to drop material on grind
    if (Math.random() > 0.40) return undefined;

    const r = Math.random();
    let rarity = 'Common';
    
    // Rarity rolls governed by the player's active region level bracket
    if (currentRegion === 'Greenwood Forest') {
      rarity = r < 0.85 ? 'Common' : 'Uncommon';
    } else if (currentRegion === 'Whispering Caves') {
      rarity = r < 0.60 ? 'Common' : r < 0.90 ? 'Uncommon' : 'Rare';
    } else if (currentRegion === 'Sunken Reefs') {
      rarity = r < 0.35 ? 'Common' : r < 0.70 ? 'Uncommon' : r < 0.94 ? 'Rare' : 'Epic';
    } else if (currentRegion === 'Scorched Wastes') {
      rarity = r < 0.40 ? 'Uncommon' : r < 0.80 ? 'Rare' : r < 0.95 ? 'Epic' : 'Legendary';
    } else if (currentRegion === 'Dragon Peaks') {
      rarity = r < 0.35 ? 'Rare' : r < 0.70 ? 'Epic' : r < 0.92 ? 'Legendary' : 'Mythic';
    } else { // Void Citadel
      rarity = r < 0.30 ? 'Epic' : r < 0.65 ? 'Legendary' : r < 0.88 ? 'Mythic' : 'Divine';
    }

    // Association mapping to retrieve matched items
    let pool = MATERIALS_BY_RARITY[rarity] || MATERIALS_BY_RARITY.Common;
    const isSpecialRoll = Math.random() < 0.18;

    if (isSpecialRoll) {
      if (profession === 'mining') pool = MATERIALS_BY_RARITY.Gem;
      else if (profession === 'herbalism') pool = MATERIALS_BY_RARITY.Alchemy;
      else if (profession === 'monster hunting') pool = MATERIALS_BY_RARITY.Boss;
    }

    let filtered = pool.filter(item => {
      const n = item.name.toLowerCase();
      if (profession === 'mining') {
        return n.includes('ore') || n.includes('coal') || n.includes('crystal') || n.includes('stone') || n.includes('obsidian') || n.includes('ingot') || n.includes('shard') || n.includes('quartz') || pool === MATERIALS_BY_RARITY.Gem;
      }
      if (profession === 'woodcutting') {
        return n.includes('log') || n.includes('wood') || n.includes('bark') || n.includes('branch');
      }
      if (profession === 'herbalism') {
        return n.includes('herb') || n.includes('flower') || n.includes('bloom') || n.includes('lotus') || n.includes('nightshade') || n.includes('mushroom') || n.includes('glowcap') || pool === MATERIALS_BY_RARITY.Alchemy;
      }
      if (profession === 'skinning') {
        return n.includes('hide') || n.includes('fur') || n.includes('leather') || n.includes('bone') || n.includes('scraps');
      }
      if (profession === 'fishing') {
        return n.includes('fish') || n.includes('pearl') || n.includes('coral') || n.includes('sea');
      }
      if (profession === 'foraging') {
        return n.includes('fiber') || n.includes('berry') || n.includes('honey') || n.includes('plant') || n.includes('wax');
      }
      if (profession === 'monster hunting') {
        return n.includes('essence') || n.includes('soul') || n.includes('spirit') || n.includes('heart') || n.includes('wing') || n.includes('sac') || n.includes('blood') || pool === MATERIALS_BY_RARITY.Boss;
      }
      return true;
    });

    if (filtered.length === 0) filtered = pool;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  // Sync ref values
  useEffect(() => {
    progressRef.current = progress;
    activeGrindIdRef.current = activeGrindId;
  }, [progress, activeGrindId]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStartGrind = (profId: string) => {
    if (activeGrindId) {
      // If clicking current active, stop it
      if (activeGrindId === profId) {
        stopGrinding();
        return;
      }
      // If clicking different one, stop current and switch
      stopGrinding();
    }

    setActiveGrindId(profId);
    setProgress(0);

    const stepMs = 100;
    const totalDuration = 8000; // 8 seconds per grind run
    const increment = (stepMs / totalDuration) * 100;

    intervalRef.current = setInterval(() => {
      const nextProgress = progressRef.current + increment;
      if (nextProgress >= 100) {
        // Complete current grind iteration
        const rolledMat = rollGrindMaterial(profId);
        
        // Woodcutting, Foraging, Skinning fall back to herbalism stats for db fields
        let key = profId;
        if (key === 'woodcutting' || key === 'foraging') key = 'herbalism';
        if (key === 'skinning' || key === 'monster hunting') key = 'fishing';
        
        grindProfession(key, rolledMat);
        
        // Loop restart
        setProgress(0);
      } else {
        setProgress(nextProgress);
      }
    }, stepMs);
  };

  const stopGrinding = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveGrindId(null);
    setProgress(0);
  };

  return (
    <div className="card">
      <div style={{
        backgroundImage: 'linear-gradient(rgba(13, 8, 27, 0.75), rgba(13, 8, 27, 0.95)), url("/images/town_greenwood.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px',
        borderBottom: '1px solid var(--border-color)',
        minHeight: '130px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        borderRadius: '8px 8px 0 0'
      }}>
        <div style={{ color: 'var(--text-gold)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🛠️ GATHERING & PROFESSIONS
        </div>
        <h2 style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '1.6rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Crafting Center
        </h2>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
          Choose a gathering profession below to start grinding. Grinding runs an idle loop that slowly fills your progress bar (8s duration). On each completion, you receive **+25 Profession XP** and have a **40% chance** to harvest raw materials corresponding to your active level bracket region: <strong>{currentRegion}</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {professionsList.map(prof => {
            const isActive = activeGrindId === prof.id;
            
            // Map keys
            let key = prof.profKey;
            if (prof.id === 'woodcutting' || prof.id === 'foraging') key = 'herbalism';
            if (prof.id === 'skinning' || prof.id === 'monster hunting') key = 'fishing';

            const profData = (player.professions as any)[key] || { level: 1, xp: 0, max_xp: 100 };
            const progressPercent = Math.round((profData.xp / profData.max_xp) * 100);

            return (
              <div 
                key={prof.id}
                style={{
                  background: isActive ? 'rgba(168, 85, 247, 0.03)' : 'rgba(255,255,255,0.01)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  boxShadow: isActive ? '0 0 15px rgba(168, 85, 247, 0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {/* Left block - Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{prof.emoji}</span>
                    <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>
                      {prof.name}
                    </h3>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255,255,255,0.08)', 
                      color: 'var(--text-gold)', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontWeight: 'bold' 
                    }}>
                      Lv {profData.level}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                    {prof.desc}
                  </p>

                  {/* Level Up progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>XP:</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--text-gold)' }} />
                    </div>
                    <span>{profData.xp} / {profData.max_xp} ({progressPercent}%)</span>
                  </div>

                  {/* Grind Progress bar (Visible only when grinding) */}
                  {isActive && (
                    <div style={{ marginTop: '16px', animation: 'fadeIn 0.2s ease-out' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '4px', fontWeight: 'bold' }}>
                        <span>⚡ Active Grinding Loop...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, #a855f7 100%)' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right block - Actions */}
                <div style={{ minWidth: '130px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleStartGrind(prof.id)}
                    className="btn"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      background: isActive 
                        ? 'linear-gradient(135deg, var(--accent-red) 0%, #b91c1c 100%)' 
                        : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: isActive ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none'
                    }}
                  >
                    {isActive ? '🛑 Stop Grind' : 'Grind Now'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
