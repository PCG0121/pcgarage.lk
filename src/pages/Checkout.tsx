import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ArrowRight, User, Phone, MapPin, Building, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const steps = ['Details', 'Review', 'Confirm'];

export function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const cartTotal = total();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 0) { setStep(1); return; }

    setIsSubmitting(true);
    setError('');

    const orderItems = items.map((item) => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      sku: item.sku,
    }));

    try {
      if (supabase) {
        const { error: orderError } = await supabase.from('orders').insert({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          items: orderItems,
          total: cartTotal,
          status: 'pending',
        });

        if (orderError) throw orderError;
      }

      const orderItemLines = orderItems
        .map((item) => `${item.quantity}x ${item.name} - Rs. ${item.subtotal.toLocaleString()}`)
        .join('\n');
      const totalStr = `Rs. ${cartTotal.toLocaleString()}`;
      const message = `*New Order - PC Garage*\n\n*Customer:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}\n\n*Items:*\n${orderItemLines}\n\n*Total: ${totalStr}*`;
      const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '94700000000';

      clearCart();
      window.location.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save order.');
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%',
    background: 'var(--bg-card)',
    border: `1px solid ${focusedField === field ? 'rgba(225,29,72,0.45)' : 'var(--border-subtle)'}`,
    borderRadius: '0.75rem',
    color: 'var(--text-primary)',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
  });

  const iconStyle = {
    position: 'absolute' as const,
    left: '0.875rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    color: 'var(--text-muted)',
  };

  return (
    <div style={{ flex: 1, background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(239,68,68,0.05) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.5rem 2rem',
        textAlign: 'center',
      }}>
        <div className="section-label" style={{ marginBottom: '0.5rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Secure Checkout
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: '0 0 1.5rem' }}>
          Complete Your Order
        </h1>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                  {i < step ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (i + 1)}
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: i === step ? '#f87171' : 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: '4rem', height: '1px', background: i < step ? '#ef4444' : 'rgba(255,255,255,0.12)', margin: '0 0.5rem', marginBottom: '1.1rem', transition: 'background 0.4s ease' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }} className="checkout-grid">

          {/* Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '1.25rem', padding: '2rem' }}>
            {step === 0 ? (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '1.75rem', height: '1.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={13} color="#ef4444" />
                  </div>
                  Your Details
                </h2>

                <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Name */}
                  <div>
                    <label htmlFor="checkout-name" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={14} style={iconStyle} />
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your full name"
                        style={inputStyle('name')}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="checkout-phone" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Phone Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={14} style={iconStyle} />
                      <input
                        id="checkout-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+94 7X XXX XXXX"
                        style={inputStyle('phone')}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="checkout-address" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Delivery Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={14} style={iconStyle} />
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Street address"
                        style={inputStyle('address')}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="checkout-city" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      City
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={14} style={iconStyle} />
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        onFocus={() => setFocusedField('city')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your city"
                        style={inputStyle('city')}
                      />
                    </div>
                  </div>

                  <button
                    id="next-step-btn"
                    type="submit"
                    className="btn-glow"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                  >
                    Review Order <ArrowRight size={15} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '1.75rem', height: '1.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={13} color="#ef4444" />
                  </div>
                  Confirm Order
                </h2>

                {/* Customer Summary */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="section-label" style={{ marginBottom: '0.875rem' }}>Delivery to</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[['Name', formData.name], ['Phone', formData.phone], ['Address', `${formData.address}, ${formData.city}`]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)', minWidth: '3.5rem', fontWeight: 600 }}>{k}:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setStep(0)} style={{ marginTop: '0.875rem', fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0 }}>
                    Edit Details →
                  </button>
                </div>

                {/* Order Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '0.625rem' }}>
                      <img src={item.image_url} alt={item.name} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover', borderRadius: '0.375rem', mixBlendMode: 'luminosity', opacity: 0.85 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>×{item.quantity}</div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{ marginBottom: '0.875rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>
                      {error}
                    </div>
                  )}
                  <button
                    id="whatsapp-order-btn"
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      color: 'white', border: 'none', borderRadius: '0.875rem',
                      padding: '1rem', fontWeight: 700, fontSize: '0.9rem',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer', letterSpacing: '0.02em',
                      boxShadow: '0 0 25px rgba(37,211,102,0.25)',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      opacity: isSubmitting ? 0.75 : 1,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                    {isSubmitting ? 'Saving order...' : 'Continue to WhatsApp'}
                  </button>
                </form>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.875rem', lineHeight: 1.5 }}>
                  You'll be redirected to WhatsApp to complete your order. PayHere online payments coming soon.
                </p>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            position: 'sticky',
            top: '5rem',
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Order ({items.reduce((a, i) => a + i.quantity, 0)} items)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name} ×{item.quantity}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="divider" style={{ marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444', letterSpacing: '-0.03em' }}>Rs. {cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr !important; } }
        input::placeholder { color: var(--text-muted) !important; }
      `}</style>
    </div>
  );
}
