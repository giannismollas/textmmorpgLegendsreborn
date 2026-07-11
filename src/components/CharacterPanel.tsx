import React from 'react';
import { useGame } from '../context/GameContext';
import { User, Shield, Swords, ShieldAlert, Award, Star, Compass } from 'lucide-react';

export const CharacterPanel: React.FC = () => {
  const { player, inventory, unequipItem, allocateStat } = useGame();

  if (!player) return null;

  // Retrieve equipped items
  const equippedWeapon = inventory.find(i => i.type === 'Weapon' && i.equipped);
  const equippedArmor = inventory.find(i => i.type === 'Armor' && i.equipped);
  const equippedAccessory = inventory.find(i => i.type === 'Accessory' && i.equipped);

  // Compute stats
  const weaponAtk = equippedWeapon?.stats?.attack || 0;
  const armorDef = equippedArmor?.stats?.defense || 0;
  const itemHp = (equippedArmor?.stats?.health || 0) + (equippedAccessory?.stats?.health || 0);
  const itemCrit = (equippedWeapon?.stats?.crit || 0) + (equippedAccessory?.stats?.crit || 0);
  const itemSpeed = (equippedWeapon?.stats?.speed || 0) + (equippedArmor?.stats?.speed || 0);

  // Calculate totals from manual stats
  const baseAttack = player.strength + (player.class === 'Mage' ? 10 : 0);
  const totalAttack = baseAttack + weaponAtk;
  const baseDefense = player.defense + (player.class === 'Warrior' ? 5 : 0);
  const totalDefense = baseDefense + armorDef;
  const baseCrit = Math.round(player.speed * 0.4) + (player.class === 'Rogue' ? 15 : 0);
  const totalCrit = baseCrit + itemCrit;
  const baseSpeed = player.speed + (player.class === 'Rogue' ? 5 : 0);
  const totalSpeed = baseSpeed + itemSpeed;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Upper overview and statistics split */}
      <div className="dashboard-grid">
        {/* Left: General Stats Card */}
        <div className="card">
          <h3 className="card-title">
            <User size={16} color="var(--primary)" />
            <span>Character Attributes</span>
          </h3>

          {(() => {
            const classImages: Record<string, string> = {
              Warrior: '/images/class_warrior.png',
              Mage: '/images/class_mage.png',
              Rogue: '/images/class_rogue.png',
              Ranger: '/images/class_ranger.png',
            };
            const avatarImage = classImages[player.class] || '/images/class_warrior.png';
            return (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                  src={avatarImage} 
                  alt={player.name} 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover', boxShadow: '0 0 10px rgba(168,85,247,0.3)' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: '0 0 4px 0' }} className="glow-text">{player.name}</h2>
                  <span className="rarity-tag rarity-Epic" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {player.class.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })()}

          {player.stat_points > 0 && (
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-gold)' }}>
                🌟 UNSPENT STAT POINTS: {player.stat_points}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Customize your build below!
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Experience Level Progress */}
            <div>
              <div className="stat-label-container" style={{ fontSize: '0.75rem' }}>
                <span>Experience Progression (Level {player.level})</span>
                <span>{player.xp} / {player.max_xp} XP</span>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-fill xp" style={{ width: `${(player.xp / player.max_xp) * 100}%` }}></div>
              </div>
            </div>

            {/* Base Attributes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>💪 Strength (Attack):</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{player.strength}</span>
                  {player.stat_points > 0 && (
                    <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => allocateStat('strength')}>+</button>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>🛡️ Defense:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{player.defense}</span>
                  {player.stat_points > 0 && (
                    <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => allocateStat('defense')}>+</button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>⚡ Speed (Crit/Evade):</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{player.speed}</span>
                  {player.stat_points > 0 && (
                    <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => allocateStat('speed')}>+</button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>❤️ Vitality (HP):</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{player.vitality}</span>
                  {player.stat_points > 0 && (
                    <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => allocateStat('vitality')}>+</button>
                  )}
                </div>
              </div>
            </div>

            {/* General metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Class Base HP:</span>
                <span style={{ fontWeight: 'bold' }}>{player.max_hp - itemHp} HP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Equipment HP Buff:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>+{itemHp} HP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Attack Power:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-red)' }}>⚔️ {totalAttack} ({baseAttack} Base + {weaponAtk} Gear)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Defense Score:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>🛡️ {totalDefense} ({baseDefense} Base + {armorDef} Gear)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Critical Hit Chance:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>💥 {totalCrit}% ({baseCrit}% Base + {itemCrit}% Gear)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Movement Speed:</span>
                <span style={{ fontWeight: 'bold', color: '#0ea5e9' }}>⚡ {totalSpeed} ({baseSpeed} Base + {itemSpeed} Gear)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Equipped Gears slots Card */}
        <div className="card">
          <h3 className="card-title">
            <Swords size={16} color="var(--accent-gold)" />
            <span>Equipped Gears</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Weapon slot */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Weapon Slot</div>
                {equippedWeapon ? (
                  <>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '2px' }}>{equippedWeapon.name}</div>
                    <span className={`rarity-tag rarity-${equippedWeapon.rarity}`} style={{ fontSize: '0.6rem', padding: '1px 4px', marginTop: '4px' }}>
                      {equippedWeapon.rarity}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {Object.entries(equippedWeapon.stats || {}).map(([k, v]) => `+${v} ${k}`).join(', ')}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '2px' }}>No Weapon Equipped</div>
                )}
              </div>

              {equippedWeapon && (
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => unequipItem(equippedWeapon.id)}>
                  Unequip
                </button>
              )}
            </div>

            {/* Armor slot */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Armor Slot</div>
                {equippedArmor ? (
                  <>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '2px' }}>{equippedArmor.name}</div>
                    <span className={`rarity-tag rarity-${equippedArmor.rarity}`} style={{ fontSize: '0.6rem', padding: '1px 4px', marginTop: '4px' }}>
                      {equippedArmor.rarity}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {Object.entries(equippedArmor.stats || {}).map(([k, v]) => `+${v} ${k}`).join(', ')}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '2px' }}>No Armor Equipped</div>
                )}
              </div>

              {equippedArmor && (
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => unequipItem(equippedArmor.id)}>
                  Unequip
                </button>
              )}
            </div>

            {/* Accessory slot */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Accessory Slot</div>
                {equippedAccessory ? (
                  <>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '2px' }}>{equippedAccessory.name}</div>
                    <span className={`rarity-tag rarity-${equippedAccessory.rarity}`} style={{ fontSize: '0.6rem', padding: '1px 4px', marginTop: '4px' }}>
                      {equippedAccessory.rarity}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {Object.entries(equippedAccessory.stats || {}).map(([k, v]) => `+${v} ${k}`).join(', ')}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '2px' }}>No Accessory Equipped</div>
                )}
              </div>

              {equippedAccessory && (
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => unequipItem(equippedAccessory.id)}>
                  Unequip
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
