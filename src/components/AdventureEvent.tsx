import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Swords, ShieldAlert, Sparkles, User, ShoppingBag, 
  Trash2, Award, Gem, Coins, Heart, Star, Hammer
} from 'lucide-react';

export const AdventureEvent: React.FC = () => {
  const { 
    activeEvent, fightMonster, gatherMaterials, claimChest, 
    completeQuestEvent, interactMerchant, dismissEvent, player, inventory, quests,
    dungeonRoom, advanceDungeon, claimDungeonTreasure
  } = useGame();

  const [fightStarted, setFightStarted] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (!activeEvent) return null;

  const renderEventContent = () => {
    switch (activeEvent.type) {
      case 'Monster':
      case 'Boss':
        const monster = activeEvent.monster!;
        const isBoss = activeEvent.type === 'Boss';
        
        // Check if combat has already been simulated (description will have combat logs inside)
        const isCombatFinished = activeEvent.description.includes('Victory') || activeEvent.description.includes('Defeat');

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem' }}>{isBoss ? '👿' : '👹'}</div>
              <div>
                <h4 style={{ margin: 0, color: isBoss ? 'var(--accent-red)' : 'var(--text-main)', fontSize: '1.2rem' }}>
                  {monster.name}
                </h4>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} color="var(--accent-red)" />
                    HP: {monster.hp}
                  </span>
                  <span>⚔️ Attack: {monster.attack}</span>
                </div>
              </div>
            </div>

            {!isCombatFinished ? (
              <>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  A hostile creature stands in your path. Do you fight or try to flee?
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={fightMonster} style={{ flex: 1 }}>
                    <Swords size={16} />
                    <span>FIGHT</span>
                  </button>
                  <button className="btn btn-secondary" onClick={dismissEvent} style={{ flex: 1 }}>
                    <span>Flee</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="combat-logs-console">
                  {activeEvent.description.split('\n').map((line, idx) => (
                    <div key={idx} style={{ 
                      color: line.includes('Strike') || line.includes('strike') ? '#22c55e' : 
                             line.includes('attacks') || line.includes('Slain') ? '#ef4444' : 
                             line.includes('Victory') ? '#eab308' : '#94a3b8' 
                    }}>
                      {line}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={dismissEvent}>
                    Continue Adventure
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'Gathering':
        const node = activeEvent.gathering!;
        const hasSkill = player!.professions[node.profession].level >= node.requiredLevel;

        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>
              {node.profession === 'mining' ? '💎' : node.profession === 'herbalism' ? '🌿' : '🐟'}
            </div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{node.name}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Required level: {node.profession.toUpperCase()} Lv {node.requiredLevel} <br />
              Your level: {player!.professions[node.profession].level}
            </p>

            {hasSkill ? (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={gatherMaterials}>
                  <Hammer size={16} />
                  <span>GATHER MATERIAL</span>
                </button>
                <button className="btn btn-secondary" onClick={dismissEvent}>
                  Ignore
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '16px' }}>
                  ⚠️ Your gathering level is too low to extract this node.
                </p>
                <button className="btn btn-secondary" onClick={dismissEvent}>
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case 'Treasure':
        const loot = activeEvent.chestLoot!;
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px', animation: 'pulse-glow 1.5s infinite alternate' }}>🎁</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {activeEvent.description}
            </p>

            {!chestOpened ? (
              <button 
                className="btn btn-primary btn-adventure" 
                onClick={() => {
                  setChestOpened(true);
                  claimChest();
                }}
                style={{ fontSize: '0.9rem', padding: '10px 24px' }}
              >
                OPEN CHEST
              </button>
            ) : (
              <div>
                <p style={{ color: 'var(--text-gold)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '16px' }}>
                  Claimed! Check inventory/logs.
                </p>
                <button className="btn btn-secondary" onClick={dismissEvent}>
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case 'NPC':
        const quest = activeEvent.quest!;
        const hasQuest = quests.find(q => q.quest_id === quest.quest_id);
        const canHandIn = hasQuest && hasQuest.completed;

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '3rem' }}>🧙‍♂️</div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--primary)' }}>{activeEvent.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quest Broker</span>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {activeEvent.description}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-gold)', marginBottom: '6px' }}>REWARDS:</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>💰 {quest.reward_gold} Gold</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⭐ {quest.reward_xp} XP</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {canHandIn ? (
                <button className="btn btn-primary" onClick={completeQuestEvent} style={{ flex: 1 }}>
                  <span>Hand In Quest</span>
                </button>
              ) : hasQuest ? (
                <button className="btn btn-secondary" style={{ flex: 1 }} disabled>
                  <span>Already Accepted ({hasQuest.progress}/{hasQuest.target})</span>
                </button>
              ) : (
                <button className="btn btn-primary" onClick={completeQuestEvent} style={{ flex: 1 }}>
                  <span>Accept Quest</span>
                </button>
              )}
              <button className="btn btn-secondary" onClick={dismissEvent}>
                Leave
              </button>
            </div>
          </div>
        );

      case 'Merchant':
        const wares = activeEvent.merchantItems || [];
        const hasMaterials = inventory.some(i => i.type === 'Material');

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '3rem' }}>🐪</div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--primary)' }}>{activeEvent.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wandering Peddler</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {activeEvent.description}
            </p>

            <h5 style={{ fontSize: '0.8rem', color: 'var(--text-gold)', margin: '12px 0 8px 0' }}>ITEMS FOR SALE:</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {wares.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
                    <span className={`rarity-tag rarity-${item.rarity}`} style={{ fontSize: '0.65rem', marginLeft: '8px', padding: '1px 4px' }}>
                      {item.rarity}
                    </span>
                    {item.stats && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {Object.entries(item.stats).map(([k, v]) => `+${v} ${k}`).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <button className="btn btn-secondary" onClick={() => interactMerchant('buy', item)} style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--accent-gold)' }}>
                    Buy ({item.value}g)
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => interactMerchant('sell')} 
                style={{ flex: 1 }}
                disabled={!hasMaterials}
              >
                Sell All Materials (+25% gold)
              </button>
              <button className="btn btn-secondary" onClick={dismissEvent}>
                Leave
              </button>
            </div>
          </div>
        );

      case 'Nothing':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🛡️</div>
            <h4 style={{ color: 'var(--accent-green)' }}>Travel Safely</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              {activeEvent.description}
            </p>
            <button className="btn btn-primary" onClick={claimChest}>
              Claim & Continue
            </button>
          </div>
        );

      case 'Dungeon':
        const sentinel = activeEvent.monster!;
        const isDungeonCombatDone = activeEvent.description.includes('Victory') || activeEvent.description.includes('Defeat');

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem' }}>🏰</div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--primary)' }}>
                  {dungeonRoom === 3 ? 'Dungeon Sentinel Overlord' : `Dungeon Room ${dungeonRoom}`}
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Defeat them to secure loot</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {activeEvent.description}
            </p>

            {!isDungeonCombatDone ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={fightMonster} style={{ flex: 1 }}>
                  <span>FIGHT SENTINEL</span>
                </button>
                <button className="btn btn-secondary" onClick={dismissEvent}>
                  Retreat
                </button>
              </div>
            ) : (
              <div>
                <div className="combat-logs-console">
                  {activeEvent.description.split('\n').map((line, idx) => (
                    <div key={idx} style={{ 
                      color: line.includes('strike') || line.includes('Strikes') ? '#22c55e' : 
                             line.includes('attacks') || line.includes('slain') ? '#ef4444' : 
                             line.includes('Victory') ? '#eab308' : '#94a3b8' 
                    }}>
                      {line}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '12px' }}>
                  {activeEvent.description.includes('Victory') ? (
                    dungeonRoom < 3 ? (
                      <button className="btn btn-primary" onClick={advanceDungeon}>
                        Advance to Room {dungeonRoom + 1}
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-adventure" onClick={claimDungeonTreasure}>
                        Claim Dungeon Chest
                      </button>
                    )
                  ) : (
                    <button className="btn btn-secondary" onClick={dismissEvent}>
                      Return to Town
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <p>Unknown Event type</p>;
    }
  };

  return (
    <div className="overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span>{activeEvent.title}</span>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }} onClick={dismissEvent}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {renderEventContent()}
        </div>
      </div>
    </div>
  );
};
