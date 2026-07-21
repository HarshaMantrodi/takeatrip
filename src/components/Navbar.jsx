import React, { useState } from 'react';
import { Compass, UserCheck, ShieldAlert, Edit, Feather, Sun, Moon, LogIn, Menu, X } from 'lucide-react';
import { userRoles } from '../data/destinations';

const Navbar = ({ activeRoute, setActiveRoute, currentRole, setCurrentRole, isLightTheme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const rolesArray = Object.values(userRoles);

  const toggleRole = () => {
    const currentIndex = rolesArray.findIndex(r => r.role === currentRole.role);
    const nextIndex = (currentIndex + 1) % rolesArray.length;
    setCurrentRole(rolesArray[nextIndex]);
  };

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
    <>
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
        borderRadius: '50px',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--glass-shadow)',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setActiveRoute('home');
            setIsMobileMenuOpen(false);
          }}
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
              height: '36px',
              width: 'auto',
              objectFit: 'contain',
              filter: isLightTheme ? 'brightness(0.9) contrast(1.1)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
            className="animate-float"
          />
        </div>

        {/* Navigation Links (Desktop only) */}
        <div className="desktop-nav" style={{
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

        {/* Utility Actions & Hamburger */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
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
              transition: 'var(--transition-smooth)',
            }}
            title="Toggle Visual Theme"
          >
            {isLightTheme ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Active Role Pill indicator */}
          <div 
            onClick={toggleRole}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Click to switch simulated system roles"
          >
            {getRoleIcon(currentRole.role)}
            <span style={{ display: 'inline-block', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentRole.role}</span>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              transition: 'var(--transition-fast)'
            }}
            title="Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="glass" style={{
          position: 'fixed',
          top: '76px',
          left: '5%',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          gap: '8px',
          zIndex: 1001,
          animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)',
          background: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(12px)'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveRoute(item.id);
                setIsMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeRoute === item.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: activeRoute === item.id ? '600' : '400',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '12px 6px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{item.label}</span>
              {activeRoute === item.id && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 6px var(--color-primary)' }} />}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
