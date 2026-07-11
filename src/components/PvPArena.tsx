import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getSupabase } from '../supabase';
import { Player, Item } from '../types';
import { Swords, ShieldAlert, Award, ShoppingBag, Coins, Heart, Trophy } from 'lucide-react';
import { generateRandomItem } from '../constants/items';

export const PvPArena: React.FC = () => {
  const { player, isOnline, inventory, setPlayer, checkAchievements } = useGame();
  
  const [opponents, setOpponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeBattleLog, setActiveBattleLog] = useState<string[]>([]);
  const [battleFinished, setBattleFinished] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'loss' | null>(null);
  const [activeOpponent, setActiveOpponent] = useState<any | null>(null);
  
  // PVP currencies stored in localStorage
  const [arenaTokens, setArenaTokens] = useState(() => parseInt(localStorage.getItem('arena_tokens') || '0') || 0);
  const [arenaRank, setArenaRank] = useState(() => parseInt(localStorage.getItem('arena_rank') || '1000') || 1000);
  const [activeTab, setActiveTab] = useState<'arena' | 'shop'>('arena');

  // Hardcoded mock opponents for offline fallback
  const mockOpponents = [
    { id: 'bot1', name: 'ShadowBlade', level: 12, class: 'Rogue', strength: 22, defense: 14, speed: 20, vitality: 15, hp: 150, max_hp: 150 },
    { id: 'bot2', name: 'LunaSkye', level: 8, class: 'Ranger', strength: 16, defense: 10, speed: 15, vitality: 12, hp: 120, max_hp: 120 },
    { id: 'bot3', name: 'WarriorX', level: 15, class: 'Warrior', strength: 28, defense: 25, speed: 10, vitality: 22, hp: 220, max_hp: 220 },
    { id: 'bot4', name: 'Aetheris', level: 10, class: 'Mage', strength: 10, defense: 8, speed: 12, vitality: 10, hp: 100, max_hp: 100 },
    { id: 'bot5', name: 'EliteKnight', level: 5, class: 'Warrior', strength: 14, defense: 12, speed: 8, vitality: 12, hp: 120, max_hp: 120 },
  ];

  // Fetch PvP opponents
  useEffect(() => {
    const fetchOpponents = async () => {
      setLoading(true);
      const supabase = getSupabase();
      
      if (isOnline && supabase) {
        try {
          const { data, error } = await supabase
            .from('players')
            .select('*')
            .neq('id', player?.id)
            .limit(10);
            
          if (data && data.length > 0) {
            setOpponents(data.map((p: any) => ({
              id: p.id,
              name: p.name,
              level: p.level,
              class: p.class,
              strength: p.strength,
              defense: p.defense,
              speed: p.speed,
              vitality: p.vitality,
              hp: p.hp,
              max_hp: p.max_hp
            })));
          } else {
            setOpponents(mockOpponents);
          }
        } catch (e) {
          setOpponents(mockOpponents);
        }
      } else {
        setOpponents(mockOpponents);
      }
      setLoading(false);
    };

    if (player) fetchOpponents();
  }, [isOnline, player?.id]);

  if (!player) return null;

  // PvP shop items
  const honorShopItems = [
    { name: 'Sorcerer Wand', cost: 10, type: 'Weapon' as const, rarity: 'Rare' as const, stats: { attack: 20 } },
    { name: 'Demon Shell Chest', cost: 25, type: 'Armor' as const, rarity: 'Epic' as const, stats: { defense: 38, attack: 10 } },
    { name: 'Windrunner Bow', cost: 75, type: 'Weapon' as const, rarity: 'Legendary' as const, stats: { attack: 95, speed: 20, crit: 15 } },
    { name: 'Stamina Tonic', cost: 2, type: 'Consumable' as const, rarity: 'Common' as const },
  ];

  const handleBuyShopItem = (shopItem: any) => {
    if (arenaTokens < shopItem.cost) return;

    // Deduct tokens
    const newTokens = arenaTokens - shopItem.cost;
    setArenaTokens(newTokens);
    localStorage.setItem('arena_tokens', newTokens.toString());

    // Add item to inventory
    const boughtItem: Item = {
      id: Math.random().toString(),
      name: shopItem.name,
      type: shopItem.type,
      rarity: shopItem.rarity,
      value: shopItem.cost * 50,
      equipped: false,
      quantity: 1,
      stats: shopItem.stats
    };

    const savedInventory = JSON.parse(localStorage.getItem('game_inventory') || '[]');
    savedInventory.push(boughtItem);
    localStorage.setItem('game_inventory', JSON.stringify(savedInventory));

    // Force context page update if online (by triggering local state reload, simple local storage triggers reload usually or context handles it)
    window.location.reload();
  };

  // Arena fight simulation
  const handleStartFight = (opp: any) => {
    setActiveOpponent(opp);
    setActiveBattleLog([]);
    setBattleFinished(false);
    setBattleResult(null);

    // Calculate player total stats
    const equippedWeapon = inventory.find(i => i.type === 'Weapon' && i.equipped);
    const equippedArmor = inventory.find(i => i.type === 'Armor' && i.equipped);
    const equippedAccessory = inventory.find(i => i.type === 'Accessory' && i.equipped);

    const weaponAtk = equippedWeapon?.stats?.attack || 0;
    const armorDef = equippedArmor?.stats?.defense || 0;
    const itemCrit = (equippedWeapon?.stats?.crit || 0) + (equippedAccessory?.stats?.crit || 0);
    const itemSpeed = (equippedWeapon?.stats?.speed || 0) + (equippedArmor?.stats?.speed || 0);

    const pAtk = player.strength + weaponAtk + (player.class === 'Mage' ? 10 : 0);
    const pDef = player.defense + armorDef + (player.class === 'Warrior' ? 5 : 0);
    const pSpeed = player.speed + itemSpeed + (player.class === 'Rogue' ? 5 : 0);
    const pCrit = 0.05 + itemCrit / 100 + (player.class === 'Rogue' ? 0.20 : 0);

    let pHP = player.hp;
    let oHP = opp.max_hp || opp.hp || 100;
    const logs: string[] = [];

    logs.push(`⚔️ PVP Arena: Match started against ${opp.name} (Level ${opp.level} ${opp.class})!`);

    let turn = 1;
    while (pHP > 0 && oHP > 0 && turn <= 25) {
      // Player turn
      let isCrit = Math.random() < pCrit;
      let dmg = Math.max(5, Math.round(pAtk * (0.85 + Math.random() * 0.3) - opp.defense));
      if (isCrit) {
        dmg = Math.round(dmg * 2);
        logs.push(`🗡️ Turn ${turn}: You slice ${opp.name} for ${dmg} critical damage!`);
      } else {
        logs.push(`🗡️ Turn ${turn}: You strike ${opp.name} for ${dmg} damage.`);
      }
      oHP -= dmg;
      if (oHP <= 0) break;

      // Opponent turn (simple stat simulation)
      let oAtk = opp.strength + (opp.class === 'Mage' ? 10 : 0);
      let oDmg = Math.max(5, Math.round(oAtk * (0.85 + Math.random() * 0.3) - pDef));
      logs.push(`🛡️ Turn ${turn}: ${opp.name} attacks you for ${oDmg} damage (Blocked ${pDef}).`);
      pHP -= oDmg;

      turn++;
    }

    const won = pHP > 0;
    setBattleResult(won ? 'win' : 'loss');
    setBattleFinished(true);

    if (won) {
      logs.push(`🎉 VICTORY! You defeated ${opp.name}!`);
      
      const tokensReward = 2;
      const rankGain = Math.round(15 + Math.random() * 10);
      const newTokens = arenaTokens + tokensReward;
      const newRank = arenaRank + rankGain;

      setArenaTokens(newTokens);
      setArenaRank(newRank);
      localStorage.setItem('arena_tokens', newTokens.toString());
      localStorage.setItem('arena_rank', newRank.toString());

      logs.push(`🏆 Received +${tokensReward} Arena Tokens & +${rankGain} Arena Rating!`);

      // Gained gold/XP minor reward
      let updatedPlayer = {
        ...player,
        gold: player.gold + 50,
        pvp_wins: (player.pvp_wins || 0) + 1
      };
      updatedPlayer = checkAchievements(updatedPlayer);
      
      if (setPlayer) setPlayer(updatedPlayer);
      localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    } else {
      logs.push(`💀 DEFEAT! You were beaten by ${opp.name}.`);
      const rankLoss = Math.round(10 + Math.random() * 5);
      const newRank = Math.max(100, arenaRank - rankLoss);
      
      setArenaRank(newRank);
      localStorage.setItem('arena_rank', newRank.toString());
      logs.push(`📉 Lost -${rankLoss} Arena Rating.`);
    }

    setActiveBattleLog(logs);
  };

  return (
    <div className="card">
      <h3 className="card-title">
        <Swords size={16} color="var(--primary)" />
        <span>PVP Battle Arena</span>
      </h3>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', gap: '8px' }}>
        <button 
          className={`nav-button ${activeTab === 'arena' ? 'active' : ''}`}
          onClick={() => setActiveTab('arena')}
          style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
        >
          <Swords size={14} />
          <span>Fighters Ladder</span>
        </button>
        <button 
          className={`nav-button ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
          style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
        >
          <ShoppingBag size={14} />
          <span>Arena Honor Shop</span>
        </button>
        
        {/* Token balances */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.8rem', paddingRight: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)' }}>
            <Trophy size={14} />
            Rating: {arenaRank}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
            🪙 Arena Tokens: {arenaTokens}
          </span>
        </div>
      </div>

      {activeTab === 'arena' && (
        <div>
          {activeOpponent && battleFinished ? (
            <div>
              <h4 style={{ color: battleResult === 'win' ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} />
                <span>BATTLE OUTCOME: {battleResult === 'win' ? 'VICTORY' : 'DEFEAT'}</span>
              </h4>
              
              <div className="combat-logs-console" style={{ minHeight: '200px' }}>
                {activeBattleLog.map((line, idx) => (
                  <div key={idx} style={{ 
                    color: line.includes('slice') || line.includes('Turn') && line.includes('You') ? '#22c55e' : 
                           line.includes('attacks') || line.includes('DEFEAT') ? '#ef4444' : 
                           line.includes('VICTORY') ? '#eab308' : '#94a3b8' 
                  }}>
                    {line}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={() => setActiveOpponent(null)}>
                  Close Battle Log
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                "Challenge active players. Victorious fighters climb ratings and claim Arena tokens."
              </p>

              <div className="game-table-container">
                <table className="game-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Class</th>
                      <th>Level</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opponents.map((opp, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{opp.name}</td>
                        <td style={{ fontSize: '0.85rem' }}>{opp.class}</td>
                        <td style={{ fontWeight: 'bold' }}>Lv {opp.level}</td>
                        <td>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            onClick={() => handleStartFight(opp)}
                          >
                            Fight
                          </button>
                        </td>
                      </tr>
                    ))}
                    {opponents.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          No opponents found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'shop' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            "Spend your Arena tokens here to trade for Rare and Legendary PvP gears."
          </p>

          <div className="town-grid">
            {honorShopItems.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0', color: 'var(--text-main)' }}>{item.name}</h4>
                  <span className={`rarity-tag rarity-${item.rarity}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {item.rarity}
                  </span>
                  
                  {item.stats && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {Object.entries(item.stats).map(([k, v]) => `+${v} ${k}`).join(', ')}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '8px' }}>
                    <span>🪙 {item.cost} Tokens</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleBuyShopItem(item)}
                  disabled={arenaTokens < item.cost}
                  style={{ padding: '8px 16px', fontSize: '0.8rem', borderColor: 'var(--primary)' }}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
