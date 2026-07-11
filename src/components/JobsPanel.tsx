import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { JOBS_DATABASE } from '../constants/jobs';
import { Briefcase, Clock, Coins, Star, AlertTriangle, ShieldCheck } from 'lucide-react';

export const JobsPanel: React.FC = () => {
  const { player, activeJobId, activeJobEndTime, startJob, claimJobReward, cancelJob } = useGame();
  
  // Track remaining seconds locally for current active job
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!activeJobEndTime) {
      setRemaining(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.ceil((activeJobEndTime - Date.now()) / 1000));
      setRemaining(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeJobEndTime]);

  if (!player) return null;

  const currentActiveJob = JOBS_DATABASE.find(j => j.id === activeJobId);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Active Job Status Panel (shows countdown if working) */}
      {activeJobId && currentActiveJob && (
        <div className="card" style={{ border: '1px solid var(--accent-gold)', background: 'rgba(234, 179, 8, 0.03)' }}>
          <h3 className="card-title" style={{ color: 'var(--accent-gold)', borderBottomColor: 'rgba(234,179,8,0.1)' }}>
            <Clock size={16} />
            <span>Active Job in Progress</span>
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>{currentActiveJob.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {currentActiveJob.description}
              </p>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', marginTop: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-gold)' }}>
                  <Coins size={12} />
                  +{currentActiveJob.goldReward} Gold
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                  <Star size={12} />
                  +{currentActiveJob.xpReward} XP
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
              {remaining > 0 ? (
                <>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {formatTime(remaining)}
                  </div>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={cancelJob}>
                    Cancel Job
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                    <ShieldCheck size={14} />
                    <span>WORK DONE!</span>
                  </div>
                  <button 
                    className="btn btn-primary btn-adventure" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', animation: 'pulse-glow 1.5s infinite alternate' }} 
                    onClick={claimJobReward}
                  >
                    Claim Reward
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Available Jobs List */}
      <div className="card">
        <h3 className="card-title">
          <Briefcase size={16} color="var(--primary)" />
          <span>Job Board</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '-10px 0 20px 0' }}>
          Take on idle tasks to earn passive rewards. Note: While working, you cannot go on adventures!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {JOBS_DATABASE.map(job => {
            const isWorkingThis = activeJobId === job.id;
            const meetsLv = player.level >= job.levelRequired;
            const canStart = meetsLv && !activeJobId;
            
            return (
              <div 
                key={job.id} 
                style={{ 
                  background: isWorkingThis ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255, 255, 255, 0.01)', 
                  border: isWorkingThis ? '1px solid var(--primary)' : '1px solid var(--border-color)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  opacity: meetsLv ? 1 : 0.6
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{job.name}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={10} />
                      {job.durationSeconds >= 60 ? `${Math.round(job.durationSeconds / 60)}m` : `${job.durationSeconds}s`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>{job.description}</p>
                  
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-gold)', fontWeight: 'bold' }}>
                      💰 +{job.goldReward}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>
                      ⭐ +{job.xpReward}
                    </span>
                    {!meetsLv && (
                      <span style={{ color: 'var(--accent-red)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <AlertTriangle size={12} />
                        Level {job.levelRequired} required
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isWorkingThis ? (
                    <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }} disabled>
                      Active
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => startJob(job.id)}
                      disabled={!canStart}
                      style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                    >
                      Start Work
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
