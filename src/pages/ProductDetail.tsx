import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Star, Package, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast-container">
      <div className="toast animate-toast-in">
        <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>Added to Cart!</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{message}</div>
        </div>
        <button onClick={onClose} style={{ marginLeft: 'auto', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
      </div>
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const loadProducts = useProductStore((state) => state.loadProducts);
  const product = products.find((p) => p.id === id || p.slug === id);
  const addItem = useCartStore((state) => state.addItem);
  const [toast, setToast] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (isLoading && !product) {
    return (
      <div style={{ flex: 1, background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Package size={48} color="var(--text-muted)" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ flex: 1, background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Package size={48} color="var(--text-muted)" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-outline-glow">
          ← Back to products
        </button>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, qty);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div style={{ flex: 1, background: 'var(--bg-base)' }}>
      {toast && <Toast message={`${qty}× ${product.name}`} onClose={() => setToast(false)} />}

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: '2rem', transition: 'color 0.2s ease',
            padding: 0,
          }}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="detail-grid">
          {/* Image Panel */}
          <div style={{
            borderRadius: '1.5rem',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            aspectRatio: '1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: 'var(--shadow-soft)',
          }}>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1 }}>
              {product.in_stock
                ? <span className="badge-green">In Stock</span>
                : <span style={{ background: 'rgba(30,30,40,0.95)', color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>Out of Stock</span>
              }
            </div>
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: '80%', height: '80%', objectFit: 'contain',
                mixBlendMode: 'luminosity', opacity: 0.9,
                transition: 'all 0.5s ease',
              }}
              className="detail-img"
            />
          </div>

          {/* Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="section-label" style={{ marginBottom: '0.625rem' }}>{product.category}</div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              {product.name}
            </h1>

            {/* Rating (decorative) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.15rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={i < 4 ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>4.8 (124 reviews)</span>
            </div>

            {/* Price */}
            <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: '0.5rem',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                Rs. {product.price.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>LKR</span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
              {product.description}
            </p>

            {/* Features */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0.875rem',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex', flexDirection: 'column', gap: '0.875rem',
            }}>
              {[
                { icon: ShieldCheck, text: 'Genuine products with warranty', color: '#22c55e' },
                { icon: Truck, text: 'Island-wide delivery available', color: '#3b82f6' },
                { icon: Star, text: 'Top rated by 2,500+ customers', color: '#f59e0b' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '2rem', height: '2rem', background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={color} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', marginBottom: '1rem' }}>
              {/* Qty */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: '0.75rem', padding: '0.5rem 0.75rem',
              }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="qty-btn" id="qty-minus">−</button>
                <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="qty-btn" id="qty-plus">+</button>
              </div>

              {/* Add to Cart */}
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="btn-glow"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: product.in_stock ? 1 : 0.5, cursor: product.in_stock ? 'pointer' : 'not-allowed' }}
              >
                <ShoppingCart size={16} />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* WhatsApp quick order */}
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '94700000000'}?text=${encodeURIComponent(`Hi, I'd like to order: ${qty}x ${product.name} - Rs. ${(product.price * qty).toLocaleString()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.75rem', borderRadius: '0.75rem',
                background: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.2)',
                color: '#4ade80', fontSize: '0.8rem', fontWeight: 700,
                textDecoration: 'none', transition: 'all 0.2s ease',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Order via WhatsApp
            </a>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <div className="divider" style={{ marginBottom: '2.5rem' }} />
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>More like this</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              Related Products
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {relatedProducts.map((rp) => (
                <div key={rp.id} className="product-card">
                  <Link to={`/product/${rp.slug || rp.id}`} style={{ display: 'block', aspectRatio: '4/3', overflow: 'hidden', background: '#f1f5f9' }}>
                    <img src={rp.image_url} alt={rp.name} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.8 }} className="product-img" />
                  </Link>
                  <div style={{ padding: '0.875rem' }}>
                    <Link to={`/product/${rp.slug || rp.id}`} style={{ textDecoration: 'none' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rp.name}</h4>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>Rs. {rp.price.toLocaleString()}</span>
                      <button onClick={() => { addItem(rp); setToast(true); setTimeout(() => setToast(false), 3000); }} style={{ width: '1.875rem', height: '1.875rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer' }}>
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr !important; } }
        .detail-img:hover { opacity: 1 !important; transform: scale(1.04); }
        .back-btn:hover { color: var(--text-primary) !important; }
        .product-card:hover .product-img { opacity: 1 !important; transform: scale(1.06); }
      `}</style>
    </div>
  );
}
