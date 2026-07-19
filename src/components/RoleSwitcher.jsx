import React, { useState } from 'react';
import { ShieldAlert, UserCheck, Edit, Feather, Key, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { userRoles } from '../data/destinations';

const RoleSwitcher = ({ currentRole, setCurrentRole }) => {
  const [isOpen, setIsOpen] = useState(true);
  const roles = Object.values(userRoles);

  const getIcon = (roleName, color) => {
    const props = { size: 18, style: { color } };
    switch (roleName) {
      case 'Super admin': return <ShieldAlert {...props} />;
      case 'Admin': return <UserCheck {...props} />;
      case 'Editor': return <Edit {...props} />;
      case 'Author': return <Feather {...props} />;
      default: return <Key {...props} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-end',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          boxShadow: 'var(--glass-shadow)',
          border: '1px solid var(--border-glow)',
          background: 'var(--bg-deep)',
          marginRight: '8px',
          alignSelf: 'center'
        }}
        title="Toggle Role Simulator"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ShieldAlert size={18} className="animate-float" style={{ color: 'var(--color-primary)' }} />}
      </button>

      {/* Expanded Console Panel */}
      {isOpen && (
        <div className="glass" style={{
          width: '280px',
          padding: '16px',
          boxShadow: 'var(--glass-shadow)',
          background: 'rgba(11, 15, 25, 0.95)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          animation: 'slideInLeft 0.3s ease-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '8px'
          }}>
            <Key size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em' }}>ROLE SIMULATOR</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Click a role to preview the platform from their perspective:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {roles.map((r) => {
              const isSelected = currentRole.role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentRole(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    border: isSelected ? `1px solid ${r.color}` : '1px solid rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? '600' : '400',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getIcon(r.role, r.color)}
                    <span style={{ fontSize: '0.8rem' }}>{r.role}</span>
                  </div>
                  {isSelected && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: r.color,
                      boxShadow: `0 0 8px ${r.color}`
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Role Permissions Summary */}
          <div style={{
            marginTop: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.7rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              color: currentRole.color, 
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              <HelpCircle size={10} />
              <span>Permissions Granted:</span>
            </div>
            <ul style={{ 
              paddingLeft: '14px', 
              color: 'var(--text-secondary)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '2px',
              listStyleType: 'disc' 
            }}>
              {currentRole.permissions.slice(0, 3).map((perm, idx) => (
                <li key={idx}>{perm}</li>
              ))}
              {currentRole.permissions.length > 3 && (
                <li style={{ color: 'var(--text-muted)', listStyleType: 'none', marginLeft: '-14px' }}>
                  + {currentRole.permissions.length - 3} more...
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Slide-in styles inline */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RoleSwitcher;
