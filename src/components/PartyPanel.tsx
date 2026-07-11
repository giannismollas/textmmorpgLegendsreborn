import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, UserPlus, LogOut, Check, X, Shield, Sparkles, Zap, Eye, Trophy } from 'lucide-react';

interface PartyPanelProps {
  onClose: () => void;
}

export const PartyPanel: React.FC<PartyPanelProps> = ({ onClose }) => {
  const { 
    player, party, incomingInvites, createParty, sendPartyInvite, 
    acceptPartyInvite, declinePartyInvite, leaveParty, togglePartyReady, startCoopAdventure,
    isOnline
  } = useGame();

  const [inviteName, setInviteName] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [sending, setSending] = useState(false);

  if (!player) return null;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    setSending(true);
    setInviteError('');
    setInviteSuccess('');
    
    const success = await sendPartyInvite(inviteName.trim());
    setSending(false);
    
    if (success) {
      setInviteSuccess(`Invite sent to ${inviteName}!`);
      setInviteName('');
    } else {
      setInviteError(`Failed to find or invite ${inviteName}.`);
    }
  };

  const classImages: Record<string, string> = {
    Warrior: '/images/class_warrior.png',
    Mage: '/images/class_mage.png',
    Rogue: '/images/class_rogue.png',
    Ranger: '/images/class_ranger.png',
  };

  const classIcons: Record<string, any> = {
    Warrior: Shield,
    Mage: Sparkles,
    Rogue: Zap,
    Ranger: Eye
  };

  // Determine if leader can start: everyone must be ready (except the leader)
  const isLeader = party?.leader_id === player.id;
  const canStart = isLeader && party?.members.every(m => m.id === player.id || m.ready);

  return (
    <div className="overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '550px', background: 'rgba(23, 18, 51, 0.95)', border: '1px solid var(--primary)', boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}>
        
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <Users size={18} color="var(--primary)" />
            <span>Co-Op Party Lobby</span>
          </span>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          {!party ? (
            /* LOBBY ENTRY STATE */
            <div>
              <div style={{ textAlign: 'center', padding: '16px 0 24px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏰</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Adventure Together</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                  Create a co-op party to travel with friends! The group shares exploration narrative scripts, fights sequential monsters together, and rolls for rare loot.
                </p>
                <button className="btn btn-primary" onClick={createParty} style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 'bold' }}>
                  CREATE PARTY LOBBY
                </button>
              </div>

              {/* INCOMING INVITATIONS */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-gold)', marginBottom: '12px' }}>
                  Pending Party Invites ({incomingInvites.length})
                </h4>
                {incomingInvites.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No incoming invites. Ask a party leader to invite you by your name: <strong style={{ color: '#fff' }}>{player.name}</strong>.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {incomingInvites.map(invite => (
                      <div 
                        key={invite.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          background: 'rgba(255, 255, 255, 0.02)', 
                          border: '1px solid var(--border-color)', 
                          padding: '10px 14px', 
                          borderRadius: '8px' 
                        }}
                      >
                        <span style={{ fontSize: '0.85rem' }}>
                          ✉️ <strong style={{ color: 'var(--primary)' }}>{invite.sender_name}</strong> invited you to join their team.
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => acceptPartyInvite(invite.id)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => declinePartyInvite(invite.id)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* PARTY IN-LOBBY STATE */
            <div>
              {/* Leader header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PARTY LEADER</span>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--accent-gold)' }}>👑 {party.leader_name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: party.status === 'adventuring' ? 'var(--primary)' : 'var(--accent-green)' }}>
                  ● {party.status === 'adventuring' ? 'In Combat' : 'Lobby Idle'}
                </div>
              </div>

              {/* Members List */}
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Members ({party.members.length}/4)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {party.members.map(member => {
                  const Icon = classIcons[member.class] || Shield;
                  const isMemLeader = member.id === party.leader_id;
                  
                  return (
                    <div 
                      key={member.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        border: '1px solid var(--border-color)', 
                        padding: '10px 14px', 
                        borderRadius: '8px' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={classImages[member.class]} 
                          alt={member.class} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{member.name}</span>
                            {isMemLeader && <span style={{ fontSize: '0.7rem', background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', borderRadius: '4px', padding: '0px 4px' }}>Leader</span>}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                            <span>Lv {member.level} {member.class}</span>
                            <span>❤️ {member.hp}/{member.max_hp}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ready status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isMemLeader ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Always Ready</span>
                        ) : member.ready ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                            <Check size={14} /> Ready
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Not Ready
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INVITATION FORM (LEADER ONLY) */}
              {isLeader && party.members.length < 4 && (
                <form onSubmit={handleSendInvite} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
                    Invite adventurers
                  </h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Enter player name..." 
                      value={inviteName} 
                      onChange={e => setInviteName(e.target.value)}
                      disabled={sending}
                      style={{ flex: 1, margin: 0 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', margin: 0 }} disabled={sending}>
                      <UserPlus size={16} />
                    </button>
                  </div>
                  {inviteError && <p style={{ fontSize: '0.75rem', color: 'var(--accent-red)', margin: '6px 0 0 0' }}>{inviteError}</p>}
                  {inviteSuccess && <p style={{ fontSize: '0.75rem', color: 'var(--accent-green)', margin: '6px 0 0 0' }}>{inviteSuccess}</p>}
                </form>
              )}

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
                {isLeader ? (
                  <button 
                    className="btn btn-primary" 
                    onClick={startCoopAdventure} 
                    disabled={!canStart || party.status === 'adventuring'}
                    style={{ flex: 2, padding: '12px', fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    {party.status === 'adventuring' ? '⚔️ CURRENTLY ADVENTURING' : canStart ? '🚀 DEPART ADVENTURE' : '⏳ WAITING FOR READINESS'}
                  </button>
                ) : (
                  <button 
                    className={`btn ${player.party_ready ? 'btn-secondary' : 'btn-primary'}`} 
                    onClick={togglePartyReady}
                    style={{ flex: 2, padding: '12px', fontSize: '1rem', fontWeight: 'bold', borderColor: player.party_ready ? 'var(--accent-green)' : 'var(--primary)' }}
                  >
                    {player.party_ready ? '✓ READY' : '❌ MARK NOT READY'}
                  </button>
                )}
                
                <button 
                  className="btn btn-secondary" 
                  onClick={leaveParty}
                  style={{ flex: 1, borderColor: 'var(--accent-red)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <LogOut size={16} />
                  <span>Leave</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
