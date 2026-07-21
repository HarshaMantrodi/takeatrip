import React, { useState } from 'react';
import { Search, MapPin, Star, Shield, Award, HelpCircle, Phone, Mail, Compass, ChevronRight, X, ArrowUpRight, Globe, Users } from 'lucide-react';
import ThreeDGlobe from './ThreeDGlobe';
import ItineraryBuilder from './ItineraryBuilder';
import { domesticDestinations, internationalDestinations, clientReviews } from '../data/destinations';

const ClientView = ({ onSaveInquiry, setActiveRoute }) => {
  const [filterType, setFilterType] = useState('all'); // all, domestic, international
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [activeDestination, setActiveDestination] = useState(null);

  const allDestinations = [
    ...domesticDestinations.map(d => ({ ...d, type: 'domestic' })),
    ...internationalDestinations.map(d => ({ ...d, type: 'international' }))
  ];

  // Extract all unique tags
  const allTags = Array.from(
    new Set(allDestinations.flatMap(d => d.tags))
  );

  // Filter logic
  const filteredDestinations = allDestinations.filter(dest => {
    const matchesType = filterType === 'all' || dest.type === filterType;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || dest.tags.includes(selectedTag);
    return matchesType && matchesSearch && matchesTag;
  });

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ paddingBottom: '60px', position: 'relative' }}>
        {/* Background video overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: -1,
          opacity: 0.35 // subtle background overlay
        }}>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          >
            <source src="https://video.wixstatic.com/video/368f6b_75bc0cbc23d64119acd2f9cdba9d2901/1080p/mp4/file.mp4" type="video/mp4" />
          </video>
          {/* Subtle overlay gradient to blend into page colors */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(7, 10, 19, 0.4) 0%, var(--bg-space) 100%)'
          }} />
        </div>

        <div className="container hero-container" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Hero Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'var(--color-primary-glow)',
              border: '1px solid var(--border-glow)',
              borderRadius: '30px',
              fontSize: '0.8rem',
              color: 'var(--color-primary)',
              fontWeight: '600',
              width: 'max-content',
            }}>
              <Star size={12} fill="var(--color-primary)" />
              <span>India's Leading Luxury Travel Curator</span>
            </div>

            <h1 style={{ fontSize: '3.6rem', lineHeight: '1.1', fontWeight: '800' }}>
              Crafting <br />
              <span className="gold-gradient-text">Premium Travel</span> <br />
              Memories
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px' }}>
              Ditch the cookie-cutter packages. Design bespoke, tailor-made holiday experiences in India and across 50+ countries with 24/7 on-trip concierge assistance.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <a href="#destinations-grid" className="btn-primary">
                Explore Destinations <ArrowUpRight size={16} />
              </a>
              <button 
                onClick={() => setActiveRoute('planner')}
                className="btn-secondary"
              >
                Custom Planner
              </button>
            </div>
          </div>

          {/* Hero Right: 3D Globe Animation */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ThreeDGlobe />
          </div>
        </div>
      </section>

      {/* Trust Badges / Stats Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div className="glass stats-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          padding: '30px 20px',
          textAlign: 'center',
          gap: '20px',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid var(--border-glass)',
          boxShadow: 'var(--glass-shadow)',
        }}>
          {[
            { value: '450+', label: 'Custom Itineraries' },
            { value: '10K+', label: 'Happy Clients' },
            { value: '24/7', label: 'Concierge Assistance' },
            { value: '50+', label: 'Countries Visited' },
            { value: '4.8★', label: 'Google Rating' }
          ].map((stat, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '4px',
              borderRight: idx < 4 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Core Expertise Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }} className="gradient-text">
            Our Core Expertise
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            We specialize in creating tailored itineraries across three distinct travel disciplines.
          </p>
        </div>

        <div className="expertise-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px'
        }}>
          {[
            {
              icon: <Users size={32} style={{ color: 'var(--color-primary)' }} />,
              title: "Curated Group Journeys",
              desc: "Perfect for families, corporate retreats, and group tours. Pre-scheduled departures with professional guides, stays, and transit pre-arranged.",
              action: "View Group Tours",
              onClick: () => {
                setFilterType('all');
                setSelectedTag('Adventure');
                setTimeout(() => {
                  document.getElementById('destinations-grid')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            },
            {
              icon: <Compass size={32} style={{ color: 'var(--color-secondary)' }} />,
              title: "Handpicked Indian Escapes",
              desc: "From snow-capped mountain valleys to quiet palm-fringed tropical backwaters. Experience the cultural heritage and scenic beauty of India.",
              action: "Explore Domestic Trips",
              onClick: () => {
                setFilterType('domestic');
                setSelectedTag('');
                setTimeout(() => {
                  document.getElementById('destinations-grid')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            },
            {
              icon: <Globe size={32} style={{ color: 'var(--color-accent)' }} />,
              title: "Global Travel Experiences",
              desc: "Immersive international holiday packages covering stunning destinations across the Middle East, Southeast Asia, Indian Ocean, and Europe.",
              action: "Explore International Trips",
              onClick: () => {
                setFilterType('international');
                setSelectedTag('');
                setTimeout(() => {
                  document.getElementById('destinations-grid')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="glass-interactive card-3d" 
              onClick={item.onClick}
              style={{ 
                padding: '30px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                cursor: 'pointer',
                background: 'rgba(15, 23, 42, 0.45)',
                borderRadius: '16px',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--glass-shadow)',
                transition: 'var(--transition-normal)'
              }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-glass)'
              }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', flexGrow: 1 }}>{item.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '600', marginTop: '12px' }}>
                <span>{item.action}</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Features Overview */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }} className="gradient-text">
            Why Discerning Travelers Choose Us
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Unrivalled standards of care before, during, and after your trip.
          </p>
        </div>

        <div className="why-choose-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px'
        }}>
          {[
            {
              icon: <Shield size={32} style={{ color: 'var(--color-primary)' }} />,
              title: "Bespoke Personalization",
              desc: "Every villa, tour guide, and transit schedule is curated precisely according to your pacing, preferences, and dietary requirements."
            },
            {
              icon: <Award size={32} style={{ color: 'var(--color-secondary)' }} />,
              title: "On-Trip Concierge Desk",
              desc: "Get dedicated support on WhatsApp. Need a restaurant booking last minute or flight reschedule? Our operators take care of it instantly."
            },
            {
              icon: <Compass size={32} style={{ color: 'var(--color-accent)' }} />,
              title: "Pre-Vetted Stays",
              desc: "We don't sell random hotel inventory. All accommodations are handpicked and personally inspected by our regional teams for sanitation and safety."
            }
          ].map((feat, idx) => (
            <div key={idx} className="glass-interactive" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>{feat.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{feat.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Grid Section */}
      <section id="destinations-grid" className="container" style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Handpicked Getaways</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Browse pre-designed layouts or customize your own path</p>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '12px 16px 12px 40px',
                  borderRadius: '30px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  width: '260px',
                  transition: 'var(--transition-fast)'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '20px'
        }}>
          {/* Tab filters */}
          {[
            { id: 'all', label: 'All Destinations' },
            { id: 'domestic', label: 'Indian Escapes' },
            { id: 'international', label: 'Global Journeys' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '30px',
                background: filterType === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                border: filterType === t.id ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                color: filterType === t.id ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600',
                transition: 'var(--transition-fast)'
              }}
            >
              {t.label}
            </button>
          ))}

          {/* Spacer */}
          <div style={{ flexGrow: 1 }} />

          {/* Tag Pill Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTag('')}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                background: !selectedTag ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid var(--border-glass)',
                color: !selectedTag ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              All Tags
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: selectedTag === tag ? 'rgba(217, 119, 6, 0.2)' : 'transparent',
                  border: selectedTag === tag ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                  color: selectedTag === tag ? 'var(--color-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Destinations Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {filteredDestinations.map(dest => (
            <div 
              key={dest.id} 
              className="glass-interactive card-3d" 
              onClick={() => setActiveDestination(dest)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
                height: '420px',
                position: 'relative'
              }}
            >
              {/* Image Container */}
              <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} 
                  alt={dest.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '6px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '30px',
                  fontSize: '0.7rem',
                  color: 'var(--color-primary)',
                  fontWeight: '700',
                  border: '1px solid var(--border-glow)'
                }}>
                  ₹{dest.price.toLocaleString('en-IN')} onwards
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 220px)', justifyContent: 'space-between' }}>
                <div>
                  {/* Rating & Tags */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                      <Star size={12} fill="var(--color-accent)" />
                      <span>{dest.rating}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>|</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {dest.tags.slice(0, 2).map((t, i) => (
                        <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{dest.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {dest.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                    {dest.itinerary.length} Days Itinerary
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                    <span>Design Journey</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Testimonials */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }} className="gradient-text">Words From Our Travelers</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Read real reviews from Google maps and independent forums</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px'
        }}>
          {clientReviews.map((rev, idx) => (
            <div key={idx} className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(rev.rating) ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)', flexGrow: 1 }}>
                "{rev.review}"
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block' }}>{rev.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rev.city}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Info Footer */}
      <section className="container" style={{ scrollMarginTop: '100px' }}>
        <div className="glass footer-card-grid" style={{
          padding: '40px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          borderRadius: '16px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Corporate Headquarters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Take A Trip Holidays</strong><br />
                  # 1-97/15 1st Floor, National Tower,<br />
                  Opp: Mini Vidhan Soudha, Station Road,<br />
                  Kalaburagi, Karnataka - 585102
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                <span>
                  <a href="tel:+916363972474" style={{ color: 'inherit', textDecoration: 'none' }}>+91 63639 72474</a> |{' '}
                  <a href="tel:+919886413530" style={{ color: 'inherit', textDecoration: 'none' }}>98864 13530</a> |{' '}
                  <a href="tel:+918971663142" style={{ color: 'inherit', textDecoration: 'none' }}>89716 63142</a>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                <span>
                  <a href="mailto:info@takeatripholidays.in" style={{ color: 'inherit', textDecoration: 'none' }}>info@takeatripholidays.in</a> |{' '}
                  <a href="mailto:takeatripholidays22@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>takeatripholidays22@gmail.com</a>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Accreditations & Partnerships</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              We are recognized members and licensed tour operations agent by Ministry of Tourism, Karnataka State Tourism Development Corporation (KSTDC), and leading flight aggregators.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '16px'
            }}>
              {['KSTDC Approved', '24/7 Safety Desk', 'IATA Agent Connect'].map((badge, i) => (
                <span key={i} style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}>
                  {badge}
                </span>
              ))}
            </div>
            
            {/* Accreditation Partner Logos */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <img 
                  src="https://static.wixstatic.com/media/368f6b_720d9f93cc1e46faaf73ee1e237b8a76~mv2.jpeg/v1/fill/w_55,h_55,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/iso.jpeg"
                  alt="ISO Certified Member"
                  style={{
                    height: '42px',
                    width: 'auto',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>ISO Certified</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <img 
                  src="https://static.wixstatic.com/media/368f6b_abfc9d054678474fb84eedcc7a5139bd~mv2.png/v1/fill/w_55,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/msmepng.png"
                  alt="MSME Registered Member"
                  style={{
                    height: '42px',
                    width: 'auto',
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>MSME Registered</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Destination Customization Lightbox Modal */}
      {activeDestination && (
        <div className="modal-wrapper" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(7, 10, 19, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="glass modal-glass-container" style={{
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'fadeInScale 0.3s ease-out'
          }}>
            {/* Header Image banner */}
            <div style={{ height: '240px', width: '100%', position: 'relative' }}>
              <img 
                src={activeDestination.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} 
                alt={activeDestination.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(7, 10, 19, 0.2) 0%, rgba(7, 10, 19, 0.9) 100%)'
              }} />
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveDestination(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(7, 10, 19, 0.8)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
                <h2 style={{ fontSize: '2rem', color: '#ffffff' }}>{activeDestination.name}</h2>
                <p style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                  Base Plan: {activeDestination.itinerary.length} Days / Starting at ₹{activeDestination.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Modal Body: Interactive ItineraryBuilder */}
            <div className="modal-body" style={{ padding: '24px' }}>
              <ItineraryBuilder 
                destination={activeDestination} 
                onSaveInquiry={(inquiry) => {
                  onSaveInquiry(inquiry);
                  setTimeout(() => {
                    setActiveDestination(null);
                  }, 2000);
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Keyframe animations */}
      <style>{`
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ClientView;
