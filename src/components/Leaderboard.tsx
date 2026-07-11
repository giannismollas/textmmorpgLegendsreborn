import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getSupabase } from '../supabase';
import { Trophy, Award, Coins, Swords, ShieldCheck, User } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  class: string;
  avatar: string;
  level: number;
  gold: number;
  pvp_rating?: number;
  boss_damage?: number;
  isPlayer?: boolean;
}

export const Leaderboard: React.FC = () => {
  const { player, isOnline } = useGame();
  
  const [activeTab, setActiveTab] = useState<'level' | 'gold' | 'pvp'>('level');
  const [loading, setLoading] = useState(false);
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);

  // Local simulated leaderboard for offline fallback
  const mockRankings: Record<'level' | 'gold' | 'pvp', LeaderboardEntry[]> = {
    level: [
      { name: 'Arthur Pendragon', class: 'Warrior', avatar: '🛡️', level: 98, gold: 45000 },
      { name: 'Gandalf Grey', class: 'Mage', avatar: '🧙‍♂️', level: 94, gold: 38200 },
      { name: 'Robin Hood', class: 'Ranger', avatar: '🏹', level: 87, gold: 29000 },
      { name: 'Ezio Auditore', class: 'Rogue', avatar: '🥷', level: 82, gold: 31000 },
      { name: 'Legolas Greenleaf', class: 'Ranger', avatar: '🏹', level: 75, gold: 18000 },
    ],
    gold: [
      { name: 'King Midas', class: 'Warrior', avatar: '👑', level: 60, gold: 999999 },
      { name: 'Smaug Dragon', class: 'Warrior', avatar: '🐉', level: 85, gold: 750000 },
      { name: 'Scrooge McDuck', class: 'Ranger', avatar: '🦆', level: 42, gold: 500000 },
      { name: 'Arthur Pendragon', class: 'Warrior', avatar: '🛡️', level: 98, gold: 45000 },
      { name: 'Ezio Auditore', class: 'Rogue', avatar: '🥷', level: 82, gold: 31000 },
    ],
    pvp: [
      { name: 'Ezio Auditore', class: 'Rogue', avatar: '🥷', level: 82, gold: 31000, pvp_rating: 2850 },
      { name: 'Arthur Pendragon', class: 'Warrior', avatar: '🛡️', level: 98, gold: 45000, pvp_rating: 2600 },
      { name: 'Gandalf Grey', class: 'Mage', avatar: '🧙‍♂️', level: 94, gold: 38200, pvp_rating: 2420 },
      { name: 'Robin Hood', class: 'Ranger', avatar: '🏹', level: 87, gold: 29000, pvp_rating: 2100 },
      { name: 'Legolas Greenleaf', class: 'Ranger', avatar: '🏹', level: 75, gold: 18000, pvp_rating: 1950 },
    ]
  };

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      const supabase = getSupabase();
      
      if (isOnline && supabase) {
        try {
          let orderByCol = 'level';
          if (activeTab === 'gold') orderByCol = 'gold';
          if (activeTab === 'pvp') orderByCol = 'pvp_wins'; // map to pvp wins online for ranking
          
          const { data, error } = await supabase
            .from('players')
            .select('*')
            .order(orderByCol, { ascending: false })
            .limit(20);
            
          if (data && data.length > 0) {
            const formatted: LeaderboardEntry[] = data.map((p: any) => ({
              name: p.name,
              class: p.class,
              avatar: p.avatar,
              level: p.level,
              gold: p.gold,
              pvp_rating: p.pvp_wins ? p.pvp_wins * 10 + 1000 : 1000, // project rating
              isPlayer: p.id === player?.id
            }));
            
            // Inject player if not in top 20
            const hasPlayer = formatted.some(e => e.isPlayer);
            if (!hasPlayer && player) {
              formatted.push({
                name: player.name,
                class: player.class,
                avatar: player.avatar,
                level: player.level,
                gold: player.gold,
                pvp_rating: (player.pvp_wins || 0) * 10 + 1000,
                isPlayer: true
              });
            }
            
            setRankings(formatted);
          } else {
            fallbackToMock();
          }
        } catch (e) {
          fallbackToMock();
        }
      } else {
        fallbackToMock();
      }
      setLoading(false);
    };

    const fallbackToMock = () => {
      const list = [...mockRankings[activeTab]];
      
      // Inject player ranking
      if (player) {
        const playerRating = parseInt(localStorage.getItem('arena_rank') || '1000');
        const playerEntry: LeaderboardEntry = {
          name: player.name,
          class: player.class,
          avatar: player.avatar,
          level: player.level,
          gold: player.gold,
          pvp_rating: playerRating,
          isPlayer: true
        };
        
        const existingIdx = list.findIndex(e => e.name === player.name);
        if (existingIdx !== -1) {
          list[existingIdx] = playerEntry;
        } else {
          list.push(playerEntry);
        }
      }
      
      // Sort based on active tab
      if (activeTab === 'level') {
        list.sort((a, b) => b.level - a.level);
      } else if (activeTab === 'gold') {
        list.sort((a, b) => b.gold - a.gold);
      } else {
        list.sort((a, b) => (b.pvp_rating || 0) - (a.pvp_rating || 0));
      }
      
      setRankings(list);
    };

    fetchRankings();
  }, [activeTab, isOnline, player]);

  const classImages: Record<string, string> = {
    Warrior: '/images/class_warrior.png',
    Mage: '/images/class_mage.png',
    Rogue: '/images/class_rogue.png',
    Ranger: '/images/class_ranger.png',
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <Trophy size={16} color="var(--primary)" />
        <span>Global Hall of Fame</span>
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '-10px 0 20px 0' }}>
        Compare your ranking against the strongest heroes in the world. Ranks sync dynamically with Supabase.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', gap: '8px' }}>
        <button 
          className={`nav-button ${activeTab === 'level' ? 'active' : ''}`}
          onClick={() => setActiveTab('level')}
          style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
        >
          <Award size={14} />
          <span>Top Levels</span>
        </button>
        <button 
          className={`nav-button ${activeTab === 'gold' ? 'active' : ''}`}
          onClick={() => setActiveTab('gold')}
          style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
        >
          <Coins size={14} />
          <span>Wealthiest</span>
        </button>
        <button 
          className={`nav-button ${activeTab === 'pvp' ? 'active' : ''}`}
          onClick={() => setActiveTab('pvp')}
          style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
        >
          <Swords size={14} />
          <span>PvP Masters</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading rankings...
        </div>
      ) : (
        <div className="game-table-container">
          <table className="game-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Player</th>
                <th>Class</th>
                <th style={{ textAlign: 'right' }}>
                  {activeTab === 'level' ? 'Level' : activeTab === 'gold' ? 'Gold Balance' : 'PvP Rating'}
                </th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((entry, idx) => {
                const avatarImg = classImages[entry.class] || '/images/class_warrior.png';
                return (
                  <tr key={idx} style={{ background: entry.isPlayer ? 'rgba(168, 85, 247, 0.08)' : 'transparent' }}>
                    <td style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={avatarImg} 
                          alt={entry.class} 
                          style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }} 
                        />
                        <span style={{ fontWeight: entry.isPlayer ? 'bold' : 'normal', color: entry.isPlayer ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                          {entry.name} {entry.isPlayer && '(You)'}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{entry.class}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {activeTab === 'level' ? (
                        <span style={{ color: 'var(--primary)' }}>Lv {entry.level}</span>
                      ) : activeTab === 'gold' ? (
                        <span style={{ color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Coins size={12} />
                          {new Intl.NumberFormat().format(entry.gold)}
                        </span>
                      ) : (
                        <span style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Trophy size={12} />
                          {entry.pvp_rating} Rating
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
