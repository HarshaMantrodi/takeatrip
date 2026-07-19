import React, { useState } from 'react';
import { BookOpen, Calendar, User, Eye, ArrowRight, X, Sparkles } from 'lucide-react';

const BlogView = ({ blogs }) => {
  const [activeArticle, setActiveArticle] = useState(null);
  
  // Filter for published articles
  const publishedBlogs = blogs.filter(b => b.status === 'Published');

  const getMockBody = (title) => {
    return `Discovering the essence of travel is about stepping out of comfort zones and finding the extraordinary in the simple. In this guide, we dive deep into the cultural heart and local experiences surrounding "${title}". 

    Whether you are looking for peaceful beach sunrises, historical heritage landmarks, or delicious local street cuisines, this region offers a tailored escape for every travel enthusiast. Our recommended routes are pre-vetted by regional guides and curated to prevent standard tourist overcrowding.
    
    Planning tips:
    1. Travel during mid-week to avoid local weekend crowds.
    2. Try the authentic local food from licensed regional boutique kitchens.
    3. Carry local currency for local flea market purchases.
    4. Connect with our 24/7 WhatsApp assistance desk for instant bookings.
    
    Enjoy your journey and travel safely!`;
  };

  return (
    <div className="container" style={{ paddingTop: '120px', minHeight: '80vh', fontFamily: 'var(--font-sans)' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
          marginBottom: '12px'
        }}>
          <BookOpen size={12} />
          <span>Curated Travel Journals & Insights</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }} className="gradient-text">
          Guides & Blogs
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Explore travel tips, local secrets, and hidden paradises written by our certified destination authors.
        </p>
      </div>

      {publishedBlogs.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles size={32} style={{ color: 'var(--color-primary)', marginBottom: '16px' }} className="animate-float" />
          <p style={{ fontSize: '0.9rem' }}>No travel guides have been published yet. Access the Admin Console to write and publish articles.</p>
        </div>
      ) : (
        <div>
          {/* Featured Article Banner */}
          {publishedBlogs[0] && (
            <div 
              className="glass-interactive" 
              onClick={() => setActiveArticle(publishedBlogs[0])}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '30px',
                padding: '30px',
                marginBottom: '40px',
                cursor: 'pointer',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  ★ Featured Guide
                </span>
                <h2 style={{ fontSize: '2rem', marginTop: '8px', marginBottom: '12px', lineHeight: 1.2 }}>
                  {publishedBlogs[0].title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {getMockBody(publishedBlogs[0].title)}
                </p>

                <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={12} /> {publishedBlogs[0].author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} /> {publishedBlogs[0].date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={12} /> {publishedBlogs[0].views} Views</span>
                </div>
              </div>

              <div style={{ height: '260px', borderRadius: '10px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80" 
                  alt="Featured Travel"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          {/* Blogs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {publishedBlogs.slice(1).map(article => (
              <div 
                key={article.id} 
                className="glass-interactive card-3d" 
                onClick={() => setActiveArticle(article)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  cursor: 'pointer',
                  height: '280px',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }}>{article.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getMockBody(article.title)}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>By {article.author}</span>
                    <span>{article.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Lightbox */}
      {activeArticle && (
        <div style={{
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
          padding: '20px'
        }}>
          <div className="glass" style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            padding: '40px',
            animation: 'fadeInScale 0.3s ease-out'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              <X size={16} />
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Travel Guide
            </span>
            <h2 style={{ fontSize: '1.8rem', marginTop: '6px', marginBottom: '16px', color: 'var(--text-primary)' }}>
              {activeArticle.title}
            </h2>

            <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <span>Author: {activeArticle.author}</span>
              <span>Published: {activeArticle.date}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {getMockBody(activeArticle.title)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogView;
