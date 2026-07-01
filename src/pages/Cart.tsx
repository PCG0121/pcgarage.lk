import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, ArrowRight, ShoppingCart, Minus, Plus, Package } from 'lucide-react';

export function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const navigate = useNavigate();
  const cartTotal = total();

  if (items.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', padding: '3rem 1.5rem', minHeight: '60vh', gap: '1.25rem',
      }}>
        <div style={{
          width: '6rem', height: '6rem',
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShoppingCart size={32} color="var(--text-muted)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
          Your cart is empty
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, textAlign: 'center', maxWidth: '24rem' }}>
          Looks like you haven't added anything yet. Browse our collection of premium PC components.
        </p>
        <Link
          to="/products"
          className="btn-glow"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginTop: '0.5rem' }}
        >
          Start Shopping <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(239,68,68,0.05) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.5rem 2rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>Review Your Order</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
            Shopping Cart{' '}
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: 0 }}>
              {items.reduce((a, i) => a + i.quantity, 0)} items
            </span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="cart-grid">
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '1rem',
                padding: '1.25rem',
                display: 'flex', gap: '1.25rem', alignItems: 'center',
                transition: 'border-color 0.3s ease',
              }}
              className="cart-item"
              >
                {/* Image */}
                <Link
                  to={`/product/${item.slug || item.id}`}
                  style={{
                    width: '5rem', height: '5rem', flexShrink: 0,
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.85 }}
                  />
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{item.category}</div>
                  <Link to={`/product/${item.slug || item.id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </h4>
                  </Link>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Rs. {item.price.toLocaleString()} each
                  </div>
                </div>

                {/* Qty Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    id={`qty-minus-${item.id}`}
                    onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                    className="qty-btn"
                    title="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ minWidth: '1.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    id={`qty-plus-${item.id}`}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                    title="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal + Remove */}
                <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    id={`remove-${item.id}`}
                    onClick={() => removeItem(item.id)}
                    style={{
                      padding: '0.375rem',
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.12)',
                      borderRadius: '0.5rem',
                      color: '#ef444460',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    className="remove-btn"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            position: 'sticky',
            top: '5rem',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Order Summary
            </h2>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name} ×{item.quantity}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ marginBottom: '1.25rem' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivery</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e' }}>Calculated at checkout</span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.05))',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '0.875rem',
              padding: '1rem 1.25rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ef4444', letterSpacing: '-0.03em' }}>Rs. {cartTotal.toLocaleString()}</span>
            </div>

            <button
              id="checkout-btn"
              onClick={() => navigate('/checkout')}
              className="btn-glow"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}
            >
              Proceed to Checkout <ArrowRight size={15} />
            </button>

            <Link
              to="/products"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.625rem', borderRadius: '0.75rem',
                color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600,
                textDecoration: 'none', transition: 'color 0.2s ease',
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-item { flex-wrap: wrap; gap: 0.875rem !important; }
        }
        .cart-item:hover { border-color: rgba(15,23,42,0.16) !important; }
        .remove-btn:hover { background: rgba(239,68,68,0.15) !important; border-color: rgba(239,68,68,0.3) !important; color: #ef4444 !important; }
      `}</style>
    </div>
  );
}
