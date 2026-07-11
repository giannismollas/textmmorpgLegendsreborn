import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Item, ItemRarity, ItemType } from '../types';
import { Backpack, Search, Coins, Plus, Sparkles } from 'lucide-react';
import { RARITIES } from '../constants/items';

export const Inventory: React.FC = () => {
  const { 
    inventory, equipItem, unequipItem, sellItem, useItem, listMarketItem 
  } = useGame();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');
  
  // Market listing state per item
  const [marketPrices, setMarketPrices] = useState<{ [itemId: string]: number }>({});
  const [showMarketForm, setShowMarketForm] = useState<{ [itemId: string]: boolean }>({});

  const filterTabs = [
    'All', 'Weapon', 'Armor', 'Accessory', 'Consumable', 'Material', 'Quest Item'
  ];

  // Helper to resolve rarity rank for sorting
  const getRarityRank = (rarity: ItemRarity): number => {
    return RARITIES.findIndex(r => r.name === rarity);
  };

  const handleListMarket = (itemId: string) => {
    const price = marketPrices[itemId] || 0;
    if (price <= 0) return;
    listMarketItem(itemId, price);
    // Reset listing UI for this item
    setShowMarketForm(prev => ({ ...prev, [itemId]: false }));
  };

  // Filter items
  let filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Sort items
  filteredItems.sort((a, b) => {
    if (sortBy === 'Highest Value') {
      return b.value - a.value;
    }
    if (sortBy === 'Highest Rarity') {
      return getRarityRank(b.rarity) - getRarityRank(a.rarity);
    }
    if (sortBy === 'Item Type') {
      return a.type.localeCompare(b.type);
    }
    // 'Newest' (default fallback, just preserves local storage order/id)
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="card">
      <h3 className="card-title">
        <Backpack size={16} color="var(--primary)" />
        <span>Inventory</span>
      </h3>

      {/* Filters, search and sort headers */}
      <div className="inventory-controls">
        <div className="filter-group">
          {filterTabs.map(tab => (
            <button 
              key={tab} 
              className={`filter-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'All' ? 'All' : `${tab}s`}
            </button>
          ))}
        </div>

        <div className="search-input-container">
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="chat-input"
              style={{ paddingLeft: '32px', width: '160px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Sort By dropdown */}
          <select 
            className="chat-input" 
            style={{ width: '150px', cursor: 'pointer' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="Newest">Newest</option>
            <option value="Highest Value">Highest Value</option>
            <option value="Highest Rarity">Highest Rarity</option>
            <option value="Item Type">Item Type</option>
          </select>
        </div>
      </div>

      {/* Simple Table representation */}
      <div className="game-table-container">
        <table className="game-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Rarity</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                {/* Item Column (adds indicators for quantity and equips) */}
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{item.name}</span>
                    {item.quantity && item.quantity > 1 && (
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                        x{item.quantity}
                      </span>
                    )}
                    {item.equipped && (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Equipped
                      </span>
                    )}
                  </div>
                  
                  {/* Detailed item stats description inside column */}
                  {item.stats && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>
                      {Object.entries(item.stats).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(', ')}
                    </div>
                  )}
                </td>
                
                {/* Type Column */}
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.type}</td>
                
                {/* Rarity Column */}
                <td>
                  <span className={`rarity-tag rarity-${item.rarity}`}>
                    {item.rarity}
                  </span>
                </td>
                
                {/* Value Column */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-gold)', fontWeight: 'bold' }}>
                    <Coins size={12} />
                    <span>{item.value * (item.quantity || 1)}</span>
                  </div>
                </td>
                
                {/* Actions Column */}
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Equip toggles */}
                    {['Weapon', 'Armor', 'Accessory'].includes(item.type) && (
                      item.equipped ? (
                        <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => unequipItem(item.id)}>
                          Unequip
                        </button>
                      ) : (
                        <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => equipItem(item.id)}>
                          Equip
                        </button>
                      )
                    )}

                    {/* Consumables triggers */}
                    {item.type === 'Consumable' && (
                      <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => useItem(item.id)}>
                        Use
                      </button>
                    )}

                    {/* Sell item trigger */}
                    <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => sellItem(item.id)}>
                      Sell
                    </button>

                    {/* Sell on player Marketplace listing toggle */}
                    {item.type !== 'Quest Item' && !item.equipped && (
                      <div style={{ display: 'inline-block', position: 'relative' }}>
                        {!showMarketForm[item.id] ? (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--primary)' }}
                            onClick={() => setShowMarketForm(prev => ({ ...prev, [item.id]: true }))}
                          >
                            List
                          </button>
                        ) : (
                          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card-hover)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', position: 'absolute', right: 0, bottom: '30px', zIndex: 10 }}>
                            <input 
                              type="number" 
                              placeholder="Price" 
                              className="chat-input"
                              style={{ width: '60px', padding: '2px 4px' }}
                              value={marketPrices[item.id] || ''}
                              onChange={e => setMarketPrices(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))}
                            />
                            <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => handleListMarket(item.id)}>
                              Confirm
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => setShowMarketForm(prev => ({ ...prev, [item.id]: false }))}>
                              &times;
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No items in inventory matching search parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
