import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Flame, Lock, Mail, UserPlus, LogIn, Disc, Laptop, Shield, Globe } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login, register, supabaseError } = useGame();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      
      setLoadingAction(true);
      const ok = await register(email, password);
      setLoadingAction(false);
      if (ok) {
        setLocalError('Account registered! You can now log in.');
        setIsRegisterMode(false);
      }
    } else {
      setLoadingAction(true);
      const ok = await login(email, password);
      setLoadingAction(false);
      if (!ok) {
        setLocalError('Invalid email or password.');
      }
    }
  };

  const triggerSocialMock = (platform: string) => {
    // Generate a mock login based on username from fake social account
    const randomName = `${platform.toLowerCase()}_player_${Math.floor(100 + Math.random() * 900)}`;
    setLoadingAction(true);
    setTimeout(() => {
      login(`${randomName}@game.com`, 'social_password_mock');
      setLoadingAction(false);
    }, 800);
  };

  return (
    <div className="auth-page" style={{ backgroundImage: 'url("/images/landing_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card">
        {/* Game Title Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="/images/logo_banner.png" 
            alt="Legends Reborn Title Banner" 
            style={{ width: '240px', height: 'auto', marginBottom: '8px', filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))' }}
          />
          <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0' }}>
            Multiplayer Online Text RPG
          </p>
        </div>

        {(localError || supabaseError) && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '20px' }}>
            {localError || supabaseError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input 
                type="password" 
                placeholder="Enter password" 
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="password" 
                  placeholder="Re-enter password" 
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required={isRegisterMode}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loadingAction}>
            {loadingAction ? 'Processing...' : isRegisterMode ? (
              <>
                <UserPlus size={16} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Enter World</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isRegisterMode ? 'Already have an account? ' : 'First time traveler? '}
          </span>
          <button 
            className="glow-text"
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setLocalError(null);
            }}
          >
            {isRegisterMode ? 'Login Here' : 'Create Account'}
          </button>
        </div>

        <div className="auth-divider">or</div>

        {/* Social Authentication buttons */}
        <div className="social-auth-grid">
          <button className="btn btn-secondary" onClick={() => triggerSocialMock('Google')} style={{ justifyContent: 'center' }}>
            <Globe size={16} />
            <span>Continue with Google</span>
          </button>
          
          <button className="btn btn-secondary" onClick={() => triggerSocialMock('Discord')} style={{ justifyContent: 'center', color: '#5865F2' }}>
            <Disc size={16} />
            <span>Continue with Discord</span>
          </button>

          <button className="btn btn-secondary" onClick={() => triggerSocialMock('Steam')} style={{ justifyContent: 'center', color: '#1b2838' }}>
            <Laptop size={16} />
            <span>Continue with Steam</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '24px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <Shield size={12} />
          <span>Local Engine & Supabase Secure Authentication Enabled</span>
        </div>
      </div>
    </div>
  );
};
