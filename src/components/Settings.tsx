import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Settings as SettingsIcon, Globe, RefreshCw, AlertCircle, Database, HelpCircle } from 'lucide-react';
import { getSavedCredentials } from '../supabase';

export const Settings: React.FC = () => {
  const { isOnline, configureSupabase, resetLocalData, supabaseError } = useGame();
  
  const savedCreds = getSavedCredentials();
  const [url, setUrl] = useState(savedCreds.url);
  const [key, setKey] = useState(savedCreds.key);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSql, setShowSql] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    
    const ok = await configureSupabase(url, key);
    setLoading(false);
    
    if (ok) {
      setSuccessMsg('Supabase credentials saved! Game context synchronized.');
    }
  };

  const handleDisconnect = async () => {
    setUrl('');
    setKey('');
    await configureSupabase('', '');
    setSuccessMsg('Disconnected from online mode. Reverted to local-only mode.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Supabase Sync Panel */}
      <div className="card">
        <h3 className="card-title">
          <Database size={16} color="var(--primary)" />
          <span>Supabase Cloud Database Sync</span>
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '-10px 0 20px 0' }}>
          Connect this game client to a Supabase project to enable real-time global chat, multiplayer marketplace, and character leaderboard!
        </p>

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: '#a7f3d0', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '20px' }}>
            {successMsg}
          </div>
        )}

        {supabaseError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '20px' }}>
            Error: {supabaseError}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Supabase Project URL</label>
            <input 
              type="text" 
              placeholder="e.g. https://xyz.supabase.co" 
              className="form-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supabase Anon Key</label>
            <input 
              type="password" 
              placeholder="eyJhbGciOi..." 
              className="form-input"
              value={key}
              onChange={e => setKey(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Connecting...' : 'Connect & Sync'}</span>
            </button>

            {isOnline && (
              <button type="button" className="btn btn-secondary" onClick={handleDisconnect} style={{ flex: 1, borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>
                Disconnect
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. Schema Instructions Panel */}
      <div className="card">
        <h3 className="card-title">
          <HelpCircle size={16} color="var(--accent-gold)" />
          <span>How to setup your Supabase project</span>
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          To enable database synchronizations, follow these quick steps:
        </p>
        
        <ol style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Create a free account on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Supabase</a> and create a new project.</li>
          <li>Find the <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>schema.sql</span> script file in your local workspace directory.</li>
          <li>Copy its contents, navigate to the <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>SQL Editor</span> inside your Supabase dashboard, paste, and run the query.</li>
          <li>Retrieve your Project URL and Anon API key from settings and enter them above!</li>
        </ol>
      </div>

      {/* 3. Dangerous Actions Panel */}
      <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <h3 className="card-title" style={{ color: 'var(--accent-red)', borderBottomColor: 'rgba(239, 68, 68, 0.1)' }}>
          <AlertCircle size={16} />
          <span>Dangerous Actions</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '-10px 0 20px 0' }}>
          This will wipe your character progress, inventory items, professions levels, and resets the game back to scratch. This action is irreversible.
        </p>

        <button className="btn btn-danger" onClick={resetLocalData}>
          Wipe Character & Game Data
        </button>
      </div>

    </div>
  );
};
