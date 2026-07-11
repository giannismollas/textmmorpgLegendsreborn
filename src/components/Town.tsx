import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CRAFTING_RECIPES } from '../constants/items';
import { Compass, ShoppingBag, Flame, Coins, Hammer } from 'lucide-react';
import { ItemType, ItemRarity } from '../types';
import { ItemIcon } from './ItemIcon';

export const Town: React.FC = () => {
  const { player, inventory, buyShopItem, craftItem } = useGame();
  const [activeTab, setActiveTab] = useState<'shop' | 'craft'>('shop');
  if (!player) return null;

  const currentRegion = player.active_region || 'Greenwood Forest';

  const townNames: Record<string, string> = {
    'Greenwood Forest': 'Oakvale Village',
    'Whispering Caves': 'Underforge Cavern',
    'Sunken Reefs': 'Coral Cove',
    'Scorched Wastes': 'Obsidian Outpost',
    'Dragon Peaks': 'Wyvern Nest Outpost',
    'Void Citadel': 'Eternity Sanctuary',
  };
  const townBgKeys: Record<string, string> = {
    'Greenwood Forest': 'greenwood',
    'Whispering Caves': 'whispering_caves',
    'Sunken Reefs': 'sunken_reefs',
    'Scorched Wastes': 'scorched_wastes',
    'Dragon Peaks': 'dragon_peaks',
    'Void Citadel': 'void_citadel',
  };

  const townName = townNames[currentRegion] || 'Oakvale Village';
  const townBgKey = townBgKeys[currentRegion] || 'greenwood';

  // Shop items list
  const shopItems: { name: string; cost: number; type: ItemType; rarity: ItemRarity; desc: string }[] = [
    { name: 'Health Potion', cost: 30, type: 'Consumable', rarity: 'Common', desc: 'Restores +40 HP instantly.' },
    { name: 'Greater HP Potion', cost: 80, type: 'Consumable', rarity: 'Uncommon', desc: 'Restores +100 HP instantly.' },
    { name: 'Energy Potion', cost: 40, type: 'Consumable', rarity: 'Common', desc: 'Restores +40 Energy immediately.' },
    { name: 'Stamina Tonic', cost: 40, type: 'Consumable', rarity: 'Common', desc: 'Restores +4 Stamina immediately.' },
  ];

  const checkHasMaterial = (matName: string, requiredQty: number): { has: boolean; count: number } => {
    const item = inventory.find(i => i.name === matName);
    const count = item ? (item.quantity || 1) : 0;
    return { has: count >= requiredQty, count };
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        backgroundImage: `linear-gradient(rgba(13, 8, 27, 0.6), rgba(13, 8, 27, 0.9)), url("/images/town_${townBgKey}.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '24px',
        borderBottom: '1px solid var(--border-color)',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <div style={{ color: 'var(--text-gold)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🏘️ ACTIVE SETTLEMENT
        </div>
        <h2 style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          {townName}
        </h2>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', gap: '8px' }}>
          <button 
            className={`nav-button ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
            style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
          >
            <ShoppingBag size={14} />
            <span>Alchemist Shop</span>
          </button>
          <button 
            className={`nav-button ${activeTab === 'craft' ? 'active' : ''}`}
            onClick={() => setActiveTab('craft')}
            style={{ width: 'auto', marginBottom: 0, borderRadius: '6px 6px 0 0' }}
          >
            <Hammer size={14} />
            <span>Blacksmith Forge</span>
          </button>
        </div>

      {activeTab === 'shop' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            "Welcome, traveler! Keep your bags stocked with potions to ensure your survival in deep forests."
          </p>

          <div className="town-grid">
            {shopItems.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ItemIcon name={item.name} type={item.type} rarity={item.rarity} size={36} />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0', color: 'var(--text-main)' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>{item.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <Coins size={12} />
                      <span>{item.cost} Gold</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  onClick={() => buyShopItem(item.name, item.cost, item.type, item.rarity)}
                  disabled={player.gold < item.cost}
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'craft' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            "Hammer your ores into mythical weapons. Requires high Blacksmithing levels."
          </p>

          <div className="town-grid">
            {CRAFTING_RECIPES.map((recipe, idx) => {
              const meetsLv = player.professions.blacksmithing.level >= recipe.levelRequired;
              // Check mats
              let canCraft = meetsLv;
              
              return (
                <div key={idx} className="crafting-recipe-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ItemIcon name={recipe.resultName} type={recipe.resultType} rarity={recipe.resultRarity} size={36} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{recipe.resultName}</h4>
                        <span className={`rarity-tag rarity-${recipe.resultRarity}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          {recipe.resultRarity}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: meetsLv ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      Req. BS Lv {recipe.levelRequired}
                    </span>
                  </div>

                  <div className="crafting-mats-list">
                    {recipe.materials.map((req, mIdx) => {
                      const status = checkHasMaterial(req.name, req.quantity);
                      if (!status.has) canCraft = false;
                      return (
                        <div key={mIdx} className={`mats-item ${status.has ? 'has' : 'missing'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ItemIcon name={req.name} type="Material" size={16} />
                          <span style={{ flex: 1 }}>{req.name}</span>
                          <span>{status.count} / {req.quantity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '8px', fontSize: '0.8rem', marginTop: '12px' }}
                    onClick={() => craftItem(recipe.resultName)}
                    disabled={!canCraft}
                  >
                    Forge Item
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
