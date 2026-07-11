import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getSupabase } from '../supabase';
import { Flame, Star, Coins, Users, Heart, Swords, Award } from 'lucide-react';
import { generateRandomItem } from '../constants/items';

export const WorldBoss: React.FC = () => {
  const { player, setPlayer, isOnline } = useGame();

  const [bossHp, setBossHp] = useState(() => parseInt(localStorage.getItem('boss_hp') || '75000') || 75000);
  const maxBossHp = 150000;
  
  const [personalDmg, setPersonalDmg] = useState(() => parseInt(localStorage.getItem('boss_contrib') || '0') || 0);
  const [contribFeed, setContribFeed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState(() => localStorage.getItem('boss_claimable') === 'true');

  const botNames = ['ShadowBlade', 'LunaSkye', 'WarriorX', 'Aetheris', 'KnightRider', 'EliteKnight'];

  // Sync / Simulate damage contributions
  useEffect(() => {
    if (isOnline) {
      const supabase = getSupabase();
      if (!supabase) return;

      // Load initial boss HP
      supabase.from('world_bosses').select('*').eq('id', 'ancient_dragon').then(({ data }) => {
        if (data && data.length > 0) {
          setBossHp(data[0].current_hp);
          if (data[0].current_hp <= 0) {
            setClaimable(true);
            localStorage.setItem('boss_claimable', 'true');
          }
        } else {
          // create if missing
          supabase.from('world_bosses').insert({
            id: 'ancient_dragon',
            name: 'Ancient Dragon',
            current_hp: 75000,
            max_hp: 150000,
            active: true
          }).then(() => setBossHp(75000));
        }
      });

      // Real-time channel subscription
      const channel = supabase.channel('world_boss_channel')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'world_bosses', filter: 'id=eq.ancient_dragon' }, payload => {
          const nextHp = payload.new.current_hp;
          setBossHp(nextHp);
          if (nextHp <= 0) {
            setClaimable(true);
            localStorage.setItem('boss_claimable', 'true');
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      if (bossHp <= 0) return;

      const timer = setInterval(() => {
        const bot = botNames[Math.floor(Math.random() * botNames.length)];
        const dmg = Math.round(150 + Math.random() * 200);
        
        setBossHp(prev => {
          const next = Math.max(0, prev - dmg);
          localStorage.setItem('boss_hp', next.toString());
          if (next <= 0) {
            setClaimable(true);
            localStorage.setItem('boss_claimable', 'true');
          }
          return next;
        });

        setContribFeed(prev => {
          return [`🐉 ${bot} struck the Ancient Dragon for ${dmg} damage!`, ...prev].slice(0, 10);
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [bossHp, isOnline]);

  if (!player) return null;

  const handleAttack = () => {
    if (player.stamina < 1) {
      setContribFeed(prev => ['❌ Not enough Stamina! Wait for it to regenerate.', ...prev].slice(0, 10));
      return;
    }

    if (bossHp <= 0) {
      setContribFeed(prev => ['❌ The Ancient Dragon has already been defeated!', ...prev].slice(0, 10));
      return;
    }

    // Deduct stamina
    const updatedPlayer = {
      ...player,
      stamina: player.stamina - 1
    };
    if (setPlayer) setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    // Calculate player damage based on strength
    const dmg = Math.round((player.strength * 8) * (0.8 + Math.random() * 0.4));
    const nextBossHp = Math.max(0, bossHp - dmg);
    
    setBossHp(nextBossHp);
    localStorage.setItem('boss_hp', nextBossHp.toString());
    
    if (nextBossHp <= 0) {
      setClaimable(true);
      localStorage.setItem('boss_claimable', 'true');
    }

    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('world_bosses').update({
          current_hp: nextBossHp,
          active: nextBossHp > 0,
          updated_at: new Date().toISOString()
        }).eq('id', 'ancient_dragon').then();
      }
    }

    const newPersonal = personalDmg + dmg;
    setPersonalDmg(newPersonal);
    localStorage.setItem('boss_contrib', newPersonal.toString());

    setContribFeed(prev => [
      `⚔️ You struck the Ancient Dragon for ${dmg} damage! (-1 Stamina)`,
      ...prev
    ].slice(0, 10));
  };

  const handleClaimRewards = () => {
    if (!claimable) return;

    // Award gold, diamonds, and epic gear based on contribution
    const finalPlayer = { ...player };
    const goldEarned = Math.round(personalDmg * 0.1) + 500;
    const diamondsEarned = Math.round(personalDmg * 0.005) + 10;
    
    finalPlayer.gold += goldEarned;
    finalPlayer.diamonds += diamondsEarned;
    
    if (setPlayer) setPlayer(finalPlayer);
    localStorage.setItem('game_player', JSON.stringify(finalPlayer));

    // Give an Epic or Legendary item
    const loot = generateRandomItem(personalDmg > 15000 ? 'Legendary' : 'Epic');
    const savedInventory = JSON.parse(localStorage.getItem('game_inventory') || '[]');
    savedInventory.push(loot);
    localStorage.setItem('game_inventory', JSON.stringify(savedInventory));

    // Reset boss values for next spawn
    setBossHp(maxBossHp);
    setPersonalDmg(0);
    setClaimable(false);
    localStorage.setItem('boss_hp', maxBossHp.toString());
    localStorage.setItem('boss_contrib', '0');
    localStorage.setItem('boss_claimable', 'false');

    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        supabase.from('world_bosses').update({
          current_hp: maxBossHp,
          active: true,
          updated_at: new Date().toISOString()
        }).eq('id', 'ancient_dragon').then();
      }
    }

    setContribFeed([
      `🎉 Claimed Raid Loot! Gained +${goldEarned} Gold, +${diamondsEarned} Diamonds, and 1x ${loot.name} (${loot.rarity})!`
    ]);
  };

  // Ranks listing matching contributions
  const leaderboard = [
    { name: 'ShadowBlade', damage: 38400 },
    { name: 'LunaSkye', damage: 29500 },
    { name: player.name, damage: personalDmg, isPlayer: true },
    { name: 'WarriorX', damage: 22100 },
    { name: 'Aetheris', damage: 18900 },
  ].sort((a, b) => b.damage - a.damage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* World Boss Status banner */}
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><circle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23a855f7\' opacity=\'0.05\'/></svg>")', border: '1px solid var(--accent-red)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)' }}>
        <div style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em' }}>
          🚨 ACTIVE WORLD EVENT: CRITICAL RAID
        </div>

        <div style={{ fontSize: '5rem', margin: '16px 0', filter: bossHp <= 0 ? 'grayscale(1)' : 'none', animation: bossHp > 0 ? 'pulse-glow 1.5s infinite alternate' : 'none' }}>
          🐉
        </div>

        <h2 style={{ fontSize: '1.75rem', margin: '0 0 6px 0', color: 'var(--text-main)' }}>Ancient Dragon</h2>
        
        {bossHp > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Level 100 Colossus. Work together to take it down!
            </p>

            <div style={{ maxWidth: '400px', margin: '0 auto 24px auto' }}>
              <div className="stat-label-container">
                <span>Boss HP</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-red)' }}>
                  {new Intl.NumberFormat().format(bossHp)} / {new Intl.NumberFormat().format(maxBossHp)} HP
                </span>
              </div>
              <div className="progress-container" style={{ height: '10px' }}>
                <div className="progress-fill hp" style={{ width: `${(bossHp / maxBossHp) * 100}%` }}></div>
              </div>
            </div>

            <button 
              className="btn-adventure" 
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', borderColor: 'var(--accent-gold)', padding: '12px 32px', fontSize: '1rem' }}
              onClick={handleAttack}
              disabled={player.stamina < 1}
            >
              <Swords size={18} />
              <span>ATTACK WORLD BOSS</span>
            </button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Consumes 1 Stamina per strike. (Your Stamina: {player.stamina}/{player.max_stamina})
            </div>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <h4 style={{ color: 'var(--accent-green)', fontSize: '1.25rem', marginBottom: '8px' }}>🎉 BOSS SLAIN!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              The Ancient Dragon has been defeated. Claims your share of the bounty.
            </p>
            
            <button 
              className="btn btn-primary btn-adventure" 
              style={{ animation: 'pulse-glow 1.5s infinite alternate' }}
              onClick={handleClaimRewards}
              disabled={!claimable || personalDmg === 0}
            >
              CLAIM RAID LOOT
            </button>
          </div>
        )}
      </div>

      {/* Grid split: Feed and leaderboard contributions */}
      <div className="dashboard-grid">
        {/* Left: Contributions Feed */}
        <div className="card">
          <h3 className="card-title">
            <Flame size={16} color="var(--accent-red)" />
            <span>Raid Activity Feed</span>
          </h3>

          <div className="feed-list" style={{ minHeight: '220px' }}>
            {contribFeed.map((line, idx) => (
              <div key={idx} className="feed-item" style={{ borderLeftColor: line.includes('You') ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {line}
              </div>
            ))}
            {contribFeed.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
                Raid has started! Click attack to strike.
              </div>
            )}
          </div>
        </div>

        {/* Right: Damage Leaderboard */}
        <div className="card">
          <h3 className="card-title">
            <Award size={16} color="var(--accent-gold)" />
            <span>Damage Contribution</span>
          </h3>

          <div className="game-table-container">
            <table className="game-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Damage Dealt</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, idx) => (
                  <tr key={idx} style={{ background: item.isPlayer ? 'rgba(168, 85, 247, 0.05)' : 'transparent' }}>
                    <td style={{ fontWeight: 'bold' }}>#{idx + 1}</td>
                    <td style={{ color: item.isPlayer ? 'var(--accent-gold)' : 'var(--text-main)', fontWeight: item.isPlayer ? 'bold' : 'normal' }}>
                      {item.name} {item.isPlayer && '(You)'}
                    </td>
                    <td style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat().format(item.damage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
