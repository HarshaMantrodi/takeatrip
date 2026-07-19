import React, { useState, useEffect } from 'react';
import { Calendar, Users, Hotel, Car, ArrowRight, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ItineraryBuilder = ({ destination, onSaveInquiry }) => {
  const [days, setDays] = useState(destination.itinerary.length);
  const [travelers, setTravelers] = useState(2);
  const [hotelTier, setHotelTier] = useState('deluxe'); // standard, deluxe, luxury
  const [transport, setTransport] = useState('private'); // sedan, suv, none
  const [price, setPrice] = useState(destination.price);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Custom activities state mapped from the itinerary
  const [customItinerary, setCustomItinerary] = useState(
    destination.itinerary.map(item => ({ ...item, isCustom: false, notes: '' }))
  );

  // Price Calculation Logic
  useEffect(() => {
    let basePrice = destination.price;
    
    // Day adjustments (add or subtract cost per day)
    const dayDifference = days - destination.itinerary.length;
    basePrice += dayDifference * 3500;

    // Hotel multiplier
    let hotelCost = 0;
    if (hotelTier === 'standard') hotelCost = days * 1500;
    else if (hotelTier === 'deluxe') hotelCost = days * 3000;
    else if (hotelTier === 'luxury') hotelCost = days * 7500;

    // Transport cost
    let transportCost = 0;
    if (transport === 'sedan') transportCost = days * 2000;
    else if (transport === 'suv') transportCost = days * 3500;

    // Total price per traveler
    const pricePerPerson = Math.round(basePrice + hotelCost + transportCost);
    setPrice(pricePerPerson * travelers);
  }, [days, travelers, hotelTier, transport, destination]);

  // Handle adding a day
  const handleAddDay = () => {
    if (days >= 10) return;
    const newDayNum = days + 1;
    setDays(newDayNum);
    setCustomItinerary([
      ...customItinerary,
      {
        day: newDayNum,
        title: `Custom Exploration Day ${newDayNum}`,
        details: "Leisure day for exploring local markets, cafes, and shopping centers on your own.",
        isCustom: true,
        notes: ''
      }
    ]);
  };

  // Handle removing a day
  const handleRemoveDay = () => {
    if (days <= 2) return;
    setDays(days - 1);
    setCustomItinerary(customItinerary.slice(0, -1));
  };

  // Modify day activity text
  const handleEditActivity = (index, value) => {
    const updated = [...customItinerary];
    updated[index].details = value;
    setCustomItinerary(updated);
  };

  // Submit Inquiry
  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiryData = {
      destination: destination.name,
      basePrice: destination.price,
      totalPrice: price,
      days,
      travelers,
      hotelTier,
      transport,
      itinerary: customItinerary,
      submittedAt: new Date().toLocaleDateString(),
      status: 'Pending' // Admin / Editor role can approve
    };
    onSaveInquiry(inquiryData);
    setIsSubmitted(true);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      alignItems: 'start',
      fontFamily: 'var(--font-sans)',
      padding: '8px'
    }}>
      {/* Customize Panel */}
      <div className="glass" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.4)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--color-primary)' }}>
          Design Your Journey
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Days Slider */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Duration (Days)</span>
              <span style={{ fontWeight: '600' }}>{days} Days</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={handleRemoveDay}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              <input 
                type="range" 
                min="2" 
                max="10" 
                value={days}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDays(val);
                  if (val > customItinerary.length) {
                    // add diff
                    const diff = val - customItinerary.length;
                    const items = [...customItinerary];
                    for (let i = 0; i < diff; i++) {
                      const num = items.length + 1;
                      items.push({
                        day: num,
                        title: `Custom Exploration Day ${num}`,
                        details: "Relaxation or optional local site exploring on request.",
                        isCustom: true,
                        notes: ''
                      });
                    }
                    setCustomItinerary(items);
                  } else {
                    setCustomItinerary(customItinerary.slice(0, val));
                  }
                }}
                style={{ flex: 1, accentColor: 'var(--color-primary)' }}
              />
              <button 
                type="button" 
                onClick={handleAddDay}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Travelers</span>
              <span style={{ fontWeight: '600' }}>{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
            </label>
            <input 
              type="number" 
              min="1" 
              max="20" 
              value={travelers} 
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Hotel Tier Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '8px' }}>
              <Hotel size={14} /> Accommodation Luxury Tier
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'standard', label: 'Standard', desc: 'Comfortable (3★)' },
                { id: 'deluxe', label: 'Deluxe', desc: 'Premium (4★)' },
                { id: 'luxury', label: 'Luxury', desc: 'Royal (5★)' }
              ].map(tier => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setHotelTier(tier.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    background: hotelTier === tier.id ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.02)',
                    border: hotelTier === tier.id ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    color: hotelTier === tier.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{tier.label}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transport selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '8px' }}>
              <Car size={14} /> Local Transportation
            </label>
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="none">Self Guided / Personal Booking</option>
              <option value="sedan">Premium Sedan (Toyota Etios or similar)</option>
              <option value="suv">Luxury SUV (Toyota Innova Crysta)</option>
            </select>
          </div>

          {/* Live Price Calculator Summary */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)',
            border: '1px dashed var(--border-glow)',
            padding: '16px',
            borderRadius: '12px',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Average per person:</span>
              <span>₹{Math.round(price / travelers).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Estimated Quote:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {!isSubmitted ? (
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', borderRadius: '8px' }}>
              Submit Inquiry <ArrowRight size={16} />
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#10b981',
              fontWeight: '600',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={18} /> Inquiry Registered in System!
            </div>
          )}
        </form>
      </div>

      {/* Itinerary Preview Timeline */}
      <div style={{ maxHeight: '540px', overflowY: 'auto', paddingRight: '4px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '600' }}>
          Day-by-Day Experience Preview
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
          {customItinerary.map((dayItem, index) => (
            <div key={dayItem.day} style={{ position: 'relative' }}>
              {/* Timeline dot */}
              <span style={{
                position: 'absolute',
                left: '-27px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: dayItem.isCustom ? 'var(--color-secondary)' : 'var(--color-primary)',
                border: '2px solid var(--bg-space)',
                boxShadow: '0 0 6px rgba(255,255,255,0.1)'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  color: dayItem.isCustom ? 'var(--color-secondary)' : 'var(--color-primary)',
                  letterSpacing: '0.05em'
                }}>
                  DAY {dayItem.day}: {dayItem.title}
                </span>

                {dayItem.isCustom ? (
                  <textarea
                    value={dayItem.details}
                    onChange={(e) => handleEditActivity(index, e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-secondary)',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-sans)',
                      resize: 'vertical',
                      outline: 'none',
                      width: '100%',
                      minHeight: '60px'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {dayItem.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
