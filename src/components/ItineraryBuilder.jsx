import React, { useState, useEffect } from 'react';
import { Calendar, Users, Hotel, Car, ArrowRight, Save, ShieldCheck, CheckCircle2, CreditCard, Lock, RefreshCw, CheckCircle } from 'lucide-react';
import RouteMap from './RouteMap';

const ItineraryBuilder = ({ destination, onSaveInquiry }) => {
  const [days, setDays] = useState(destination.itinerary.length);
  const [travelers, setTravelers] = useState(2);
  const [hotelTier, setHotelTier] = useState('deluxe'); // standard, deluxe, luxury
  const [transport, setTransport] = useState('private'); // sedan, suv, none
  const [price, setPrice] = useState(destination.price);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Inquiry Submission States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input'); // input, processing, otp, success
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [txnId, setTxnId] = useState('');

  // Custom activities state mapped from the itinerary
  const [customItinerary, setCustomItinerary] = useState(
    destination.itinerary.map(item => ({ ...item, isCustom: false, notes: '' }))
  );

  // Price Calculation Logic
  useEffect(() => {
    let basePrice = destination.price;
    
    // Day adjustments
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

    const pricePerPerson = Math.round(basePrice + hotelCost + transportCost);
    setPrice(pricePerPerson * travelers);
  }, [days, travelers, hotelTier, transport, destination]);

  // Recalculate discount if base price changes
  useEffect(() => {
    if (couponCode === 'WELCOME10') {
      setDiscountApplied(Math.round(price * 0.1));
    }
  }, [price, couponCode]);

  const handleApplyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      const discount = Math.round(price * 0.1);
      setDiscountApplied(discount);
      setCouponMessage(`✓ Code WELCOME10 applied! Saved ₹${discount.toLocaleString('en-IN')}`);
    } else if (couponCode === 'TRIP5000') {
      const discount = 5000;
      setDiscountApplied(discount);
      setCouponMessage(`✓ Code TRIP5000 applied! Saved ₹5,000`);
    } else if (!couponCode) {
      setDiscountApplied(0);
      setCouponMessage('');
    } else {
      setDiscountApplied(0);
      setCouponMessage('✗ Invalid coupon code.');
    }
  };

  const finalDisplayPrice = Math.max(0, price - discountApplied);

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

  const handleRemoveDay = () => {
    if (days <= 2) return;
    setDays(days - 1);
    setCustomItinerary(customItinerary.slice(0, -1));
  };

  const handleEditActivity = (index, value) => {
    const updated = [...customItinerary];
    updated[index].details = value;
    setCustomItinerary(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiryData = {
      destination: destination.name,
      basePrice: destination.price,
      totalPrice: finalDisplayPrice,
      days,
      travelers,
      hotelTier,
      transport,
      itinerary: customItinerary,
      submittedAt: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    onSaveInquiry(inquiryData);
    setIsSubmitted(true);
  };

  // Payment triggers
  const handleLaunchPayment = () => {
    setPaymentStep('input');
    setShowPaymentModal(true);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('otp');
    }, 2000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setTxnId('PAY_' + Math.floor(Math.random() * 90000000 + 10000000));
      setPaymentStep('success');
    }, 2000);
  };

  return (
    <div className="itinerary-grid" style={{
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

          {/* Promo Code Input */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Promo Coupon Code</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10, TRIP5000"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.8rem'
                }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
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

          {/* Live Price Calculator Summary */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)',
            border: '1px dashed var(--border-glow)',
            padding: '16px',
            borderRadius: '12px',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span style={{ marginRight: 'auto' }}>Price per person:</span>
              <span>₹{Math.round(price / travelers).toLocaleString('en-IN')}</span>
            </div>
            {discountApplied > 0 && (
              <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: '0.75rem', color: '#10b981', marginBottom: '6px' }}>
                <span style={{ marginRight: 'auto' }}>Promo Discount:</span>
                <span>- ₹{discountApplied.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', marginRight: 'auto' }}>Estimated Quote:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                ₹{finalDisplayPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {!isSubmitted ? (
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', borderRadius: '8px' }}>
              Submit Inquiry <ArrowRight size={16} />
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              
              <button 
                type="button"
                onClick={handleLaunchPayment}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}
              >
                Proceed to Payment (Razorpay)
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Itinerary Preview Timeline */}
      <div style={{ maxHeight: '540px', overflowY: 'auto', paddingRight: '4px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '600' }}>
          Day-by-Day Experience Preview
        </h3>
        
        {/* SVG Route Map Widget */}
        <RouteMap destinationId={destination.id} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
          {customItinerary.map((dayItem, index) => (
            <div key={dayItem.day} style={{ position: 'relative' }}>
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

      {/* Razorpay Simulated Checkout Lightbox Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(7, 10, 19, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass" style={{
            width: '100%',
            maxWidth: '420px',
            background: '#0e1424',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            fontFamily: 'var(--font-sans)',
            animation: 'fadeInScale 0.3s ease-out'
          }}>
            {/* Header: Razorpay design style */}
            <div style={{
              background: '#0f172a',
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  color: '#ffffff'
                }}>R</div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block', color: '#ffffff' }}>Razorpay Checkout</strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Take A Trip Holidays</span>
                </div>
              </div>

              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Price indicator banner */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'var(--text-muted)' }}>AMOUNT TO PAY:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                ₹{finalDisplayPrice.toLocaleString('en-IN')}
              </strong>
            </div>

            {/* Modal content body based on state */}
            <div style={{ padding: '24px' }}>
              {paymentStep === 'input' && (
                <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    <Lock size={12} />
                    <span>Secure 256-bit SSL encrypted connection.</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>CARD NUMBER</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength="19"
                        style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.8rem', outline: 'none' }}
                      />
                      <CreditCard size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>CARDHOLDER NAME</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>CVV</label>
                      <input 
                        type="password" 
                        required
                        placeholder="•••"
                        maxLength="3"
                        style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px', padding: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', boxShadow: 'none' }}>
                    Pay ₹{finalDisplayPrice.toLocaleString('en-IN')}
                  </button>
                </form>
              )}

              {paymentStep === 'processing' && (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <RefreshCw size={36} className="animate-float" style={{ color: 'var(--color-primary)', animation: 'spin-slow 2s linear infinite', marginBottom: '16px' }} />
                  <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Connecting Bank Securely...</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Do not close this modal or refresh the page.</span>
                </div>
              )}

              {paymentStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    We sent a mock 6-digit OTP code to your registered mobile number for validation.
                  </div>
                  
                  <input 
                    type="text" 
                    required
                    placeholder="1 2 3 4 5 6"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    style={{ width: '120px', margin: '0 auto', textAlign: 'center', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--color-primary)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '1.2rem', letterSpacing: '4px', outline: 'none' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>💡 Tip: Type any 6-digit code (e.g. 123456) to proceed</span>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px', padding: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: 'none' }}>
                    Verify & Confirm Booking
                  </button>
                </form>
              )}

              {paymentStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <CheckCircle size={44} style={{ color: '#10b981', marginBottom: '16px' }} />
                  <h3 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '12px' }}>Payment Successful!</h3>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '10px', fontSize: '0.75rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    <div><strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace' }}>{txnId}</span></div>
                    <div><strong>Destination:</strong> {destination.name}</div>
                    <div><strong>Travelers:</strong> {travelers} Pax</div>
                    <div><strong>Final Charge:</strong> ₹{finalDisplayPrice.toLocaleString('en-IN')}</div>
                    <div><strong>Booking Status:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>CONFIRMED</span></div>
                  </div>

                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }}
                  >
                    Return to Experience
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox inline helper styles */}
      <style>{`
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ItineraryBuilder;
