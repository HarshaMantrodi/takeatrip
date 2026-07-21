import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ClientView from './components/ClientView';
import PlannerView from './components/PlannerView';
import AdminPanel from './components/AdminPanel';
import BlogView from './components/BlogView';
import RoleSwitcher from './components/RoleSwitcher';
import { userRoles, clientReviews } from './data/destinations';
import { Bell, Sparkles, Plane, Phone, Star, X } from 'lucide-react';

function App() {
  const [activeRoute, setActiveRoute] = useState('home');
  const [currentRole, setCurrentRole] = useState(userRoles.SUPER_ADMIN); // Default to Super Admin for trial convenience
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeReviewPopup, setActiveReviewPopup] = useState(null);

  // Dynamic Blog State
  const [blogs, setBlogs] = useState([
    { id: 1, title: "Secret Beaches of Neil Island", author: "Priya Nair", status: "Published", date: "15 June 2026", views: 2450 },
    { id: 2, title: "Top 10 Street Food Spots in Bangkok", author: "Rohan Deshmukh", status: "Draft", date: "10 July 2026", views: 0 },
    { id: 3, title: "Trekking across Solang Valley", author: "Vikram Sen", status: "Pending Review", date: "18 July 2026", views: 0 }
  ]);
  
  // Custom cursor & sparkles trail state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Spawn trail particle with probability constraint
      if (Math.random() < 0.25) {
        const colors = ['#d97706', '#f59e0b', '#0ea5e9', '#38bdf8', '#fbbf24'];
        const newParticle = {
          id: Math.random() + Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 + 0.6 // Float downwards slightly
        };
        setParticles(prev => [...prev.slice(-25), newParticle]); // Max 25 sparkles in buffer
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('a') || 
                         target.closest('button') || 
                         target.style.cursor === 'pointer';
      setIsHoveringClickable(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Animate trail particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.06
          }))
          .filter(p => p.life > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [particles]);

  // Rotate popping testimonial reviews
  useEffect(() => {
    const showRandomReview = () => {
      const randomReview = clientReviews[Math.floor(Math.random() * clientReviews.length)];
      setActiveReviewPopup(randomReview);
      setTimeout(() => {
        setActiveReviewPopup(null);
      }, 7000);
    };

    const interval = setInterval(showRandomReview, 20000);
    
    // Initial popup after 5 seconds
    const initialTimeout = setTimeout(showRandomReview, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  // Simulated database for inquiries
  const [inquiries, setInquiries] = useState([
    {
      destination: "Andaman & Nicobar Islands",
      basePrice: 25900,
      totalPrice: 65800,
      days: 4,
      travelers: 2,
      hotelTier: "deluxe",
      transport: "sedan",
      submittedAt: "18/07/2026",
      status: "Pending"
    },
    {
      destination: "Dubai Glitz & Adventure",
      basePrice: 49000,
      totalPrice: 196000,
      days: 4,
      travelers: 4,
      hotelTier: "luxury",
      transport: "suv",
      submittedAt: "17/07/2026",
      status: "Approved"
    }
  ]);

  // Handle adding inquiries (from ClientView or PlannerView)
  const handleSaveInquiry = (newInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
    showToast(`Inquiry for ${newInquiry.destination} registered successfully! Check the Admin Console.`);
  };

  // Toast helper
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };


  // Toggle Theme Class on Body
  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightTheme]);

  // Dynamic Page Renderer
  const renderContent = () => {
    switch (activeRoute) {
      case 'home':
        return <ClientView onSaveInquiry={handleSaveInquiry} setActiveRoute={setActiveRoute} />;
      case 'blog':
        return <BlogView blogs={blogs} />;
      case 'planner':
        return <PlannerView onSaveInquiry={handleSaveInquiry} />;
      case 'admin':
        return (
          <AdminPanel 
            currentRole={currentRole} 
            inquiries={inquiries} 
            setInquiries={setInquiries} 
            blogs={blogs}
            setBlogs={setBlogs}
          />
        );
      default:
        return <ClientView onSaveInquiry={handleSaveInquiry} setActiveRoute={setActiveRoute} />;
    }
  };

  return (
    <>
      {/* Background Starry Atmosphere */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: isLightTheme 
          ? 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #cbd5e1 100%)' 
          : 'radial-gradient(circle at 50% 50%, #0c1122 0%, #060810 100%)',
        zIndex: -2,
        transition: 'background-image 0.5s ease'
      }} />

      {/* Grid Pattern overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: isLightTheme ? 0.3 : 1
      }} />

      {/* Custom Interactive Cursor Follower */}
      {cursorPos.x !== 0 && cursorPos.y !== 0 && (
        <div 
          className="custom-cursor-follower" 
          style={{ 
            left: cursorPos.x, 
            top: cursorPos.y,
            transform: `translate(-50%, -50%) scale(${isHoveringClickable ? 1.5 : 1.0})`,
            borderColor: isHoveringClickable ? 'var(--color-secondary)' : 'var(--color-primary)',
            backgroundColor: isHoveringClickable ? 'rgba(14, 165, 233, 0.08)' : 'rgba(217, 119, 6, 0.03)',
            boxShadow: isHoveringClickable 
              ? '0 0 16px rgba(14, 165, 233, 0.4)' 
              : '0 0 8px rgba(217, 119, 6, 0.2)'
          }} 
        />
      )}

      {/* Sparkle Particles Trail */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="cursor-sparkle"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 8px ${p.color}`,
            transform: `translate(-50%, -50%) scale(${p.life})`
          }}
        />
      ))}

      {/* Background Animated Traversing Airplane */}
      <div className="flying-airplane">
        <Plane size={36} style={{ transform: 'rotate(90deg)', color: 'var(--color-primary)' }} />
      </div>

      {/* Global Navigation */}
      <Navbar 
        activeRoute={activeRoute} 
        setActiveRoute={setActiveRoute} 
        currentRole={currentRole} 
        setCurrentRole={setCurrentRole}
        isLightTheme={isLightTheme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main style={{ minHeight: '90vh' }}>
        {renderContent()}
      </main>

      {/* Floating Direct Call & WhatsApp Connect Desk */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* WhatsApp Direct Connect */}
        <a 
          href="https://wa.me/916363972474?text=Hello%2C%20I%20am%20interested%20in%20planning%20a%20trip%20with%20Take%20A%20Trip%20Holidays%21"
          target="_blank"
          rel="noopener noreferrer"
          className="pulse-wa"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          title="Chat on WhatsApp"
        >
          <svg size={22} viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px' }}>
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.292-4.143c1.675.993 3.327 1.511 5.705 1.512 5.378 0 9.756-4.374 9.76-9.752.002-2.605-1.01-5.054-2.853-6.899C17.121 2.871 14.67 1.859 12.008 1.859c-5.385 0-9.764 4.377-9.768 9.756-.002 2.129.56 4.19 1.631 5.867l-.98 3.582 3.458-.907zm11.391-7.113c-.305-.153-1.802-.889-2.082-.99-.281-.102-.485-.153-.687.153-.202.306-.783.99-.96 1.192-.177.202-.353.228-.658.076-.305-.153-1.288-.475-2.454-1.517-.9-.803-1.507-1.795-1.684-2.101-.177-.306-.02-.471.133-.622.137-.137.305-.357.458-.535.153-.178.203-.306.305-.51.102-.204.051-.382-.025-.535-.076-.153-.687-1.656-.941-2.268-.247-.595-.5-.515-.688-.524-.177-.008-.38-.01-.582-.01-.203 0-.533.076-.813.382-.28.306-1.068 1.046-1.068 2.551 0 1.505 1.094 2.959 1.246 3.163.153.204 2.153 3.287 5.216 4.609.728.314 1.297.502 1.742.643.73.232 1.395.2 1.92.122.585-.087 1.802-.738 2.056-1.453.254-.715.254-1.327.177-1.453-.076-.127-.28-.203-.585-.356z" />
          </svg>
        </a>

        {/* Direct Phone Dial */}
        <a 
          href="tel:+916363972474"
          className="pulse-phone"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          title="Call Us Now (+91 63639 72474)"
        >
          <Phone size={20} style={{ color: '#ffffff' }} />
        </a>
      </div>

      {/* Popping Testimonial Toast */}
      {activeReviewPopup && (
        <div className="glass" style={{
          position: 'fixed',
          bottom: '90px',
          left: '24px',
          width: '320px',
          padding: '16px',
          background: 'rgba(11, 15, 25, 0.95)',
          border: '1px solid var(--border-glow)',
          borderRadius: '12px',
          boxShadow: 'var(--gold-shadow), var(--glass-shadow)',
          zIndex: 9998,
          animation: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'var(--font-sans)',
        }}>
          <button 
            onClick={() => setActiveReviewPopup(null)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={12} />
          </button>

          <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
            {[...Array(activeReviewPopup.rating || 5)].map((_, i) => (
              <Star key={i} size={12} fill="var(--color-accent)" color="var(--color-accent)" />
            ))}
          </div>

          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
            "{activeReviewPopup.review}"
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>— {activeReviewPopup.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>Verified Guest ({activeReviewPopup.city})</span>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-msg">
          <Sparkles size={18} style={{ color: 'var(--color-primary)' }} className="animate-float" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>System Update</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{toast}</span>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '60px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Take A Trip Holidays India. Created as a premium prototype.</p>
        </div>
      </footer>
    </>
  );
}

export default App;

