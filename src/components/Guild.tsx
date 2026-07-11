import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Coins, Award, Trophy } from 'lucide-react';

export const Guild: React.FC = () => {
  const { player, setPlayer } = useGame();
  
  // Local simulated guild stats loaded from localStorage
  const [guildXp, setGuildXp] = useState(() => parseInt(localStorage.getItem('guild_xp') || '0') || 0);
  const [guildLv, setGuildLv] = useState(() => parseInt(localStorage.getItem('guild_lv') || '1') || 1);
  const [donationAmount, setDonationAmount] = useState('');
  
  if (!player) return null;

  const maxGuildXp = guildLv * 1000;
  const attackBonus = guildLv * 2;
  const hpBonus = guildLv * 10;

  const roster = [
    { name: 'Monarch', rank: 'Guild Master', level: player.level, class: player.class, contributions: guildXp },
    { name: 'ShadowBlade', rank: 'Officer', level: 62, class: 'Rogue', contributions: 8500 },
    { name: 'LunaSkye', rank: 'Veteran', level: 61, class: 'Ranger', contributions: 6200 },
    { name: 'WarriorX', rank: 'Member', level: 60, class: 'Warrior', contributions: 3400 },
    { name: 'Aetheris', rank: 'Member', level: 59, class: 'Mage', contributions: 1200 },
  ].sort((a, b) => b.contributions - a.contributions);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const goldToDonate = parseInt(donationAmount);
    
    if (isNaN(goldToDonate) || goldToDonate <= 0) return;
    if (player.gold < goldToDonate) return;

    // Deduct gold
    const updatedPlayer = {
      ...player,
      gold: player.gold - goldToDonate
    };
    if (setPlayer) {
      setPlayer(updatedPlayer);
    }
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    // Increase guild XP (1 gold = 1 XP)
    let newXp = guildXp + goldToDonate;
    let newLv = guildLv;
    let nextMax = maxGuildXp;

    while (newXp >= nextMax) {
      newXp -= nextMax;
      newLv += 1;
      nextMax = newLv * 1000;
    }

    setGuildXp(newXp);
    setGuildLv(newLv);
    
    localStorage.setItem('guild_xp', newXp.toString());
    localStorage.setItem('guild_lv', newLv.toString());

    setDonationAmount('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Guild Overview Card */}
      <div className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '4rem', background: 'rgba(168, 85, 247, 0.1)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🏰
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold' }}>GUILD LEVEL {guildLv}</div>
          <h2 style={{ fontSize: '1.5rem', margin: '4px 0 10px 0' }} className="glow-text">LEGENDS UNITE</h2>
          
          <div className="stat-label-container" style={{ maxWidth: '300px' }}>
            <span>Guild Progression</span>
            <span>{guildXp} / {maxGuildXp} XP</span>
          </div>
          <div className="progress-container" style={{ height: '8px', maxWidth: '300px', marginBottom: '16px' }}>
            <div className="progress-fill stamina" style={{ width: `${(guildXp / maxGuildXp) * 100}%` }}></div>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trophy size={14} color="var(--accent-gold)" />
              Rank: #4 Worldwide
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} color="var(--primary)" />
              Active Buffs: +{attackBonus} Atk, +{hpBonus} HP
            </span>
          </div>
        </div>
      </div>

      {/* 2. Grid split: Donations & Roster */}
      <div className="dashboard-grid">
        {/* Left: Donation Card */}
        <div className="card">
          <h3 className="card-title">
            <Coins size={16} color="var(--accent-gold)" />
            <span>Guild Vault Donation</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Donate gold to help level up the guild. Doing so awards you ranking points and unlocks better team buffs for everyone!
          </p>

          <form onSubmit={handleDonate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gold Amount</label>
              <input 
                type="number" 
                placeholder="Enter donation amount..." 
                className="form-input" 
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '10px' }}
              disabled={!donationAmount || parseInt(donationAmount) <= 0 || player.gold < parseInt(donationAmount)}
            >
              Donate Gold
            </button>
          </form>
        </div>

        {/* Right: Members Roster */}
        <div className="card">
          <h3 className="card-title">
            <Users size={16} color="var(--primary)" />
            <span>Members Roster</span>
          </h3>

          <div className="game-table-container">
            <table className="game-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Rank</th>
                  <th>Class</th>
                  <th>Donations</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 'bold' }}>{m.name}</td>
                    <td style={{ color: m.rank.includes('Master') ? 'var(--text-gold)' : 'var(--text-muted)' }}>{m.rank}</td>
                    <td>{m.class}</td>
                    <td style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>💰 {m.contributions}</td>
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
