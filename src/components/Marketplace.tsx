import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingBag, Search, Coins } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const { player, marketListings, buyMarketItem } = useGame();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  if (!player) return null;

  const filterTabs = ['All', 'Weapon', 'Armor', 'Accessory', 'Material'];

  // Filter listings
  const filteredListings = marketListings.filter(listing => {
    const matchesSearch = listing.item_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || listing.item_type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="card">
      <h3 className="card-title">
        <ShoppingBag size={16} color="var(--primary)" />
        <span>Player Marketplace</span>
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '-10px 0 20px 0' }}>
        Trade equipment and resources directly with other players. You can list items from your Inventory panel.
      </p>

      {/* Filters and search */}
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
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="chat-input"
              style={{ paddingLeft: '32px', width: '200px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="game-table-container">
        <table className="game-table">
          <thead>
            <tr>
              <th>Seller</th>
              <th>Item</th>
              <th>Type</th>
              <th>Rarity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map(listing => {
              const isOwnListing = listing.seller_id === player.id;
              return (
                <tr key={listing.id}>
                  {/* Seller column */}
                  <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    {listing.seller_name} {isOwnListing && <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.7rem' }}>(You)</span>}
                  </td>
                  
                  {/* Item column */}
                  <td style={{ fontWeight: 600 }}>
                    <div>
                      <span>{listing.item_name}</span>
                      {listing.quantity > 1 && (
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>
                          x{listing.quantity}
                        </span>
                      )}
                    </div>
                    {listing.stats && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>
                        {Object.entries(listing.stats).map(([k, v]) => `+${v} ${k}`).join(', ')}
                      </div>
                    )}
                  </td>
                  
                  {/* Type */}
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{listing.item_type}</td>
                  
                  {/* Rarity */}
                  <td>
                    <span className={`rarity-tag rarity-${listing.item_rarity}`}>
                      {listing.item_rarity}
                    </span>
                  </td>
                  
                  {/* Price */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-gold)', fontWeight: 'bold' }}>
                      <Coins size={12} />
                      <span>{listing.price}</span>
                    </div>
                  </td>
                  
                  {/* Purchase/action trigger */}
                  <td>
                    {isOwnListing ? (
                      <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} disabled>
                        Listed
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                        disabled={player.gold < listing.price}
                        onClick={() => buyMarketItem(listing.id)}
                      >
                        Buy
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredListings.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No listings found on the market matching search parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
