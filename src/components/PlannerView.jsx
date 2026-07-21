import React, { useState } from 'react';
import { Calendar, Compass, User, DollarSign, Plus, Trash2, Send, CheckCircle } from 'lucide-react';
import { domesticDestinations, internationalDestinations } from '../data/destinations';
import ThreeDGlobe from './ThreeDGlobe';

const PlannerView = ({ onSaveInquiry }) => {
  const [destType, setDestType] = useState('preset'); // preset, custom
  const [selectedDest, setSelectedDest] = useState(domesticDestinations[0]);
  const [customDestName, setCustomDestName] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [hotelTier, setHotelTier] = useState('deluxe');
  const [transport, setTransport] = useState('sedan');
  
  const [days, setDays] = useState([
    { day: 1, title: "Arrival & Sightseeing", details: "Check-in to the hotel. Spend the afternoon exploring nearby locations and relaxing." },
    { day: 2, title: "Adventure & Activities", details: "Embark on local adventure tours, boat rides, or guided historical walks." },
    { day: 3, title: "Departure Prep", details: "Souvenir shopping, checkout, and heading to the airport for the return flight." }
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const allPresets = [...domesticDestinations, ...internationalDestinations];

  // Handle Preset Destination Change
  const handlePresetChange = (e) => {
    const dest = allPresets.find(d => d.id === e.target.value);
    if (dest) {
      setSelectedDest(dest);
      setDays(dest.itinerary.map(item => ({
        day: item.day,
        title: item.title,
        details: item.details
      })));
    }
  };

  // Add a blank day
  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    setDays([...days, {
      day: nextDayNum,
      title: `Day ${nextDayNum} Itinerary`,
      details: "Leisure or custom activities."
    }]);
  };

  // Remove last day
  const handleRemoveDay = (index) => {
    if (days.length <= 1) return;
    const filtered = days.filter((_, idx) => idx !== index).map((dayItem, idx) => ({
      ...dayItem,
      day: idx + 1
    }));
    setDays(filtered);
  };

  // Update day text
  const handleUpdateDay = (index, field, value) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  // Calculate pricing
  const calculateEstimate = () => {
    const baseRate = destType === 'preset' ? selectedDest.price : 18000;
    const durationMultiplier = days.length * 2000;

    let hotelCost = 0;
    if (hotelTier === 'standard') hotelCost = days.length * 1500;
    else if (hotelTier === 'deluxe') hotelCost = days.length * 3000;
    else if (hotelTier === 'luxury') hotelCost = days.length * 7500;

    let transportCost = 0;
    if (transport === 'sedan') transportCost = days.length * 2000;
    else if (transport === 'suv') transportCost = days.length * 3500;

    return Math.round((baseRate + durationMultiplier + hotelCost + transportCost) * travelers);
  };

  const handleApplyCoupon = () => {
    const subtotal = calculateEstimate();
    if (couponCode === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountApplied(discount);
      setCouponMessage(`✓ Coupon WELCOME10 applied! Saved ₹${discount.toLocaleString('en-IN')}`);
    } else if (couponCode === 'TRIP5000') {
      const discount = 5000;
      setDiscountApplied(discount);
      setCouponMessage(`✓ Coupon TRIP5000 applied! Saved ₹5,000`);
    } else if (!couponCode) {
      setDiscountApplied(0);
      setCouponMessage('');
    } else {
      setDiscountApplied(0);
      setCouponMessage('✗ Invalid coupon code.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = calculateEstimate();
    const finalPrice = Math.max(0, subtotal - discountApplied);
    const destinationName = destType === 'preset' ? selectedDest.name : (customDestName || 'Custom Destination');
    
    const inquiry = {
      destination: destinationName,
      basePrice: destType === 'preset' ? selectedDest.price : 15000,
      totalPrice: finalPrice,
      days: days.length,
      travelers,
      hotelTier,
      transport,
      itinerary: days,
      submittedAt: new Date().toLocaleDateString(),
      status: 'Pending',
      isCustomScratch: true,
      startDate: startDate || 'Not specified'
    };

    onSaveInquiry(inquiry);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setStartDate('');
      setCouponCode('');
      setDiscountApplied(0);
      setCouponMessage('');
    }, 3000);
  };

  return (
    <div className="container" style={{ paddingTop: '120px', minHeight: '80vh', fontFamily: 'var(--font-sans)' }}>
      <div className="hero-container" style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 0.6fr',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }} className="gradient-text">
            Interactive Trip Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Design an entirely customized itinerary from scratch. Build your perfect route and request a premium quote.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ThreeDGlobe size={200} />
        </div>
      </div>

      <div className="planner-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Side: Itinerary Editor */}
        <div className="glass" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', color: 'var(--color-primary)' }}>
            1. Plan Your Days
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {days.map((d, index) => (
              <div 
                key={d.day}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-glass)',
                  padding: '16px',
                  borderRadius: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    DAY {d.day}
                  </span>
                  
                  {days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Day heading (e.g. Travel to city, beach cruise...)"
                    value={d.title}
                    onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                  />
                  <textarea
                    placeholder="Describe planned activities, stays, or items to explore..."
                    value={d.details}
                    onChange={(e) => handleUpdateDay(index, 'details', e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-secondary)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-sans)',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddDay}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--color-secondary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <Plus size={16} /> Add Next Day
            </button>
          </div>
        </div>

        {/* Right Side: Settings & Live Invoice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '18px', color: 'var(--color-primary)' }}>
              2. Core Details
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Destination selector */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Destination Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setDestType('preset')}
                    style={{
                      padding: '8px',
                      background: destType === 'preset' ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
                      border: destType === 'preset' ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                      color: destType === 'preset' ? 'var(--color-primary)' : 'var(--text-secondary)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    Preset Package
                  </button>
                  <button
                    type="button"
                    onClick={() => setDestType('custom')}
                    style={{
                      padding: '8px',
                      background: destType === 'custom' ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                      border: destType === 'custom' ? '1px solid var(--color-secondary)' : '1px solid var(--border-glass)',
                      color: destType === 'custom' ? 'var(--color-secondary)' : 'var(--text-secondary)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    Custom Spot
                  </button>
                </div>

                {destType === 'preset' ? (
                  <select
                    onChange={handlePresetChange}
                    value={selectedDest.id}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {allPresets.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter city/country (e.g. Switzerland)"
                    value={customDestName}
                    onChange={(e) => setCustomDestName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                )}
              </div>

              {/* Start Date & Travelers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
              </div>

              {/* Accommodation Tier */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Hotel Standard</label>
                <select
                  value={hotelTier}
                  onChange={(e) => setHotelTier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="standard">Standard Boutique (3★)</option>
                  <option value="deluxe">Premium Executive (4★)</option>
                  <option value="luxury">5★ Ultra-Luxury Palace (Heritage / Resort)</option>
                </select>
              </div>

              {/* Transport choice */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Private Vehicle Service</label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    borderRadius: '6px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="none">No Private Vehicle Required</option>
                  <option value="sedan">Dedicated Executive Sedan</option>
                  <option value="suv">Dedicated Luxury 4x4 SUV</option>
                </select>
              </div>

              {/* Promo Coupon Inputs */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Promo Coupon Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: discountApplied > 0 ? '#10b981' : '#ef4444',
                    marginTop: '4px',
                    display: 'block',
                    fontWeight: '500'
                  }}>
                    {couponMessage}
                  </span>
                )}
              </div>

              {/* Pricing breakdown */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.04) 0%, rgba(14, 165, 233, 0.04) 100%)',
                border: '1px solid var(--border-glow)',
                padding: '16px',
                borderRadius: '10px',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Total Duration:</span>
                  <span>{days.length} Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Price per person:</span>
                  <span>₹{Math.round(calculateEstimate() / travelers).toLocaleString('en-IN')}</span>
                </div>
                {discountApplied > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#10b981', marginBottom: '6px' }}>
                    <span>Promo Discount:</span>
                    <span>- ₹{discountApplied.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Cost Estimator:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                    ₹{Math.max(0, calculateEstimate() - discountApplied).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!isSuccess ? (
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                >
                  Submit Studio Plan <Send size={14} />
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}>
                  <CheckCircle size={16} /> Inquiry Lodged in Dashboard!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerView;
