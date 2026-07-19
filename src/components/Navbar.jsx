import React from 'react';
import { Compass, UserCheck, ShieldAlert, Edit, Feather, Sun, Moon, LogIn } from 'lucide-react';
import { userRoles } from '../data/destinations';

const Navbar = ({ activeRoute, setActiveRoute, currentRole, setCurrentRole, isLightTheme, toggleTheme }) => {
  const rolesArray = Object.values(userRoles);

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'Super admin': return <ShieldAlert size={14} className="text-red-500" />;
      case 'Admin': return <UserCheck size={14} className="text-yellow-500" />;
      case 'Editor': return <Edit size={14} className="text-blue-500" />;
      case 'Author': return <Feather size={14} className="text-green-500" />;
      default: return <LogIn size={14} />;
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Guides & Blogs', id: 'blog' },
    { label: 'Itinerary Planner', id: 'planner' },
    { label: 'Admin Console', id: 'admin' },
  ];

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      zIndex: 1000,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--glass-shadow)',
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveRoute('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <img 
          src="https://static.wixstatic.com/media/368f6b_b4f9a631c635476e9345991bcdc717b7~mv2.png/v1/crop/x_0,y_15,w_842,h_246/fill/w_161,h_47,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Take-A-Trip-Logo_edited.png"
          alt="Take A Trip Holidays Logo"
          style={{
            height: '40px',
            width: 'auto',
            objectFit: 'contain',
            filter: isLightTheme ? 'brightness(0.9) contrast(1.1)' : 'none',
            transition: 'var(--transition-smooth)'
          }}
          className="animate-float"
        />
      </div>


      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveRoute(item.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeRoute === item.id ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: activeRoute === item.id ? '600' : '400',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              position: 'relative',
              padding: '6px 0',
            }}
          >
            {item.label}
            {activeRoute === item.id && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'var(--color-primary)',
                borderRadius: '2px',
                boxShadow: '0 0 8px var(--color-primary)'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Utility Actions & Role Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'var(--transition-fast)'
          }}
        >
          {isLightTheme ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Role Selector Pill */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            {getRoleIcon(currentRole.role)}
            <span>{currentRole.role}</span>
          </div>

          {/* Hidden helper info hover */}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            width: '180px',
            boxShadow: 'var(--glass-shadow)',
            padding: '8px',
            display: 'none',
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role Switcher below</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
