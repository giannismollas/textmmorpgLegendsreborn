import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Sparkles, Zap, Eye, Swords } from 'lucide-react';

const AVATARS = ['🧙‍♂️', '🥷', '🛡️', '🏹', '🦁', '🐉', '🦅', '🐺', '💀', '🔥', '💎', '👑'];

const CLASSES = [
  {
    name: 'Warrior' as const,
    icon: Shield,
    desc: 'Brave guardian with immense resilience and heavy steel gear.',
    stats: { hp: 150, attack: 15, defense: 18, speed: 8, crit: 5 },
    hpColor: '#ef4444',
    image: '/images/class_warrior.png'
  },
  {
    name: 'Mage' as const,
    icon: Sparkles,
    desc: 'Wielder of cosmic elements, dealing devastating high spell damage.',
    stats: { hp: 80, attack: 35, defense: 5, speed: 12, crit: 8 },
    hpColor: '#a855f7',
    image: '/images/class_mage.png'
  },
  {
    name: 'Rogue' as const,
    icon: Zap,
    desc: 'Agile assassin specializing in lethal speed and critical backstabs.',
    stats: { hp: 95, attack: 22, defense: 8, speed: 20, crit: 25 },
    hpColor: '#10b981',
    image: '/images/class_rogue.png'
  },
  {
    name: 'Ranger' as const,
    icon: Eye,
    desc: 'Master marksman with balanced speed, range, and survival instinct.',
    stats: { hp: 105, attack: 18, defense: 12, speed: 14, crit: 12 },
    hpColor: '#3b82f6',
    image: '/images/class_ranger.png'
  }
];

export const CharacterCreator: React.FC = () => {
  const { createCharacter } = useGame();
  
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please choose a name for your character.');
      return;
    }
    if (name.trim().length < 3) {
      setError('Character name must be at least 3 characters.');
      return;
    }
    if (name.trim().length > 16) {
      setError('Character name cannot exceed 16 characters.');
      return;
    }

    createCharacter(name.trim(), selectedAvatar, selectedClass.name);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.75rem' }} className="glow-text">
          CREATE CHARACTER
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '32px' }}>
          Select your class, choose an identity, and start your legend.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreate}>
          {/* 1. Character Name */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Character Name</label>
            <input 
              type="text" 
              placeholder="Enter Character Name..." 
              className="form-input" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* 2. Choose Avatar */}
          <div className="form-group" style={{ marginTop: '24px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Choose Avatar</label>
            <div className="avatar-selector">
              {AVATARS.map(av => (
                <div 
                  key={av} 
                  className={`avatar-option ${selectedAvatar === av ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(av)}
                >
                  {av}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Choose Class */}
          <div className="form-group" style={{ marginTop: '24px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Choose Class</label>
            <div className="creator-grid">
              {CLASSES.map(cls => {
                const Icon = cls.icon;
                const isSelected = selectedClass.name === cls.name;
                return (
                  <div 
                    key={cls.name} 
                    className={`class-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedClass(cls)}
                  >
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <img 
                        src={cls.image} 
                        alt={cls.name} 
                        style={{ width: '48px', height: '48px', borderRadius: '6px', border: '1px solid var(--border-color)', objectFit: 'cover' }} 
                      />
                      <div>
                        <h3 style={{ fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icon size={14} color="var(--primary)" />
                          {cls.name}
                        </h3>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Class Specialty</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minHeight: '44px', margin: '0 0 16px 0' }}>
                      {cls.desc}
                    </p>
                    
                    {/* Stat Progress Bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* HP stat */}
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>HP</span>
                          <span style={{ fontWeight: 'bold' }}>{cls.stats.hp}</span>
                        </div>
                        <div className="progress-container" style={{ height: '4px' }}>
                          <div className="progress-fill" style={{ background: cls.hpColor, width: `${(cls.stats.hp / 150) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Damage stat */}
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Damage</span>
                          <span style={{ fontWeight: 'bold' }}>{cls.stats.attack}</span>
                        </div>
                        <div className="progress-container" style={{ height: '4px' }}>
                          <div className="progress-fill" style={{ background: '#a855f7', width: `${(cls.stats.attack / 35) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Defense stat */}
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Defense</span>
                          <span style={{ fontWeight: 'bold' }}>{cls.stats.defense}</span>
                        </div>
                        <div className="progress-container" style={{ height: '4px' }}>
                          <div className="progress-fill" style={{ background: '#eab308', width: `${(cls.stats.defense / 18) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Speed stat */}
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Speed</span>
                          <span style={{ fontWeight: 'bold' }}>{cls.stats.speed}</span>
                        </div>
                        <div className="progress-container" style={{ height: '4px' }}>
                          <div className="progress-fill" style={{ background: '#0ea5e9', width: `${(cls.stats.speed / 20) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Crit stat */}
                      <div style={{ fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Crit %</span>
                          <span style={{ fontWeight: 'bold' }}>{cls.stats.crit}%</span>
                        </div>
                        <div className="progress-container" style={{ height: '4px' }}>
                          <div className="progress-fill" style={{ background: '#f97316', width: `${(cls.stats.crit / 25) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '24px' }}
          >
            <Swords size={20} />
            <span>Create Character</span>
          </button>
        </form>
      </div>
    </div>
  );
};
