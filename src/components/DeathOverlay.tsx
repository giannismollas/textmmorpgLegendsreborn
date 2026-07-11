import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Skull, Heart, Coins } from 'lucide-react';

export const DeathOverlay: React.FC = () => {
  const { isDead, respawnNow, player } = useGame();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isDead) {
      setCountdown(10);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDead]);

  if (!isDead || !player) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Skull icon */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '3px solid var(--accent-red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)',
        animation: 'pulse-glow 2s infinite alternate'
      }}>
        <Skull size={64} color="#ef4444" />
      </div>

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 900,
        color: '#ef4444',
        letterSpacing: '0.15em',
        margin: '0 0 8px 0',
        textShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
      }}>
        YOU HAVE FALLEN
      </h1>

      <p style={{
        color: '#94a3b8',
        fontSize: '1rem',
        margin: '0 0 32px 0'
      }}>
        Your journey has been cut short...
      </p>

      {/* Penalty info */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '32px',
        fontSize: '0.9rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#fca5a5',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <Coins size={16} />
          <span>Lost 10% Gold</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#93c5fd',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <Heart size={16} />
          <span>Respawn at 50% HP</span>
        </div>
      </div>

      {/* Countdown */}
      <div style={{
        fontSize: '3rem',
        fontWeight: 900,
        color: countdown > 0 ? '#64748b' : '#22c55e',
        margin: '0 0 16px 0',
        fontFamily: 'monospace'
      }}>
        {countdown > 0 ? countdown : '✓'}
      </div>

      <button
        className="btn btn-primary"
        style={{
          padding: '14px 48px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: countdown > 0
            ? 'rgba(100, 116, 139, 0.3)'
            : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderColor: countdown > 0 ? '#475569' : 'var(--primary)',
          cursor: countdown > 0 ? 'not-allowed' : 'pointer',
          opacity: countdown > 0 ? 0.6 : 1
        }}
        onClick={respawnNow}
        disabled={countdown > 0}
      >
        {countdown > 0 ? `Respawning in ${countdown}s...` : '⚔️ Return to Town'}
      </button>
    </div>
  );
};
