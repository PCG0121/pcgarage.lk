import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useProductStore } from '../store/productStore';
import {
  Laptop, Monitor, Keyboard, Battery, Zap, HardDrive, Cpu, Printer, ArrowRight, AlertCircle, LoaderCircle, Camera, BatteryCharging, Droplet, Code2
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'Laptop Batteries': Battery,
  'Keyboards': Keyboard,
  'Displays': Monitor,
  'SSD': HardDrive,
  'RAM': Cpu,
  'Chargers': Zap,
  'Printers': Printer,
  'Laptops': Laptop,
  'WiFi Camera': Camera,
  'Power bank': BatteryCharging,
  'Toner & Ink': Droplet,
  'Software': Code2,
  'Accessories': Laptop,
};

const categoryImages: Record<string, string> = {
  'SSD': '/category/ssd.png',
  'RAM': '/category/ram.png',
  'Displays': '/category/displays.png',
  'Laptop Batteries': '/category/battery.png',
  'Keyboards': '/category/keyboards.png',
  'Chargers': '/category/chargers.png',
  'Printers': '/category/printers.png',
};

const categoryColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'Laptop Batteries': { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.32)', text: '#ef4444', glow: 'rgba(239,68,68,0.12)' },
  'Keyboards':        { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.20)', text: '#ffffff', glow: 'rgba(255,255,255,0.08)' },
  'Displays':         { bg: 'rgba(244,63,94,0.14)', border: 'rgba(244,63,94,0.32)', text: '#f43f5e', glow: 'rgba(244,63,94,0.12)' },
  'SSD':              { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.32)', text: '#ef4444', glow: 'rgba(239,68,68,0.12)' },
  'RAM':              { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.20)', text: '#ffffff', glow: 'rgba(255,255,255,0.08)' },
  'Chargers':         { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.32)', text: '#ef4444', glow: 'rgba(239,68,68,0.12)' },
  'Printers':         { bg: 'rgba(244,63,94,0.14)', border: 'rgba(244,63,94,0.32)', text: '#f43f5e', glow: 'rgba(244,63,94,0.12)' },
  'Laptops':          { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.20)', text: '#ffffff', glow: 'rgba(255,255,255,0.08)' },
  'WiFi Camera':      { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.32)', text: '#ef4444', glow: 'rgba(239,68,68,0.12)' },
  'Power bank':       { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.20)', text: '#ffffff', glow: 'rgba(255,255,255,0.08)' },
  'Toner & Ink':      { bg: 'rgba(244,63,94,0.14)', border: 'rgba(244,63,94,0.32)', text: '#f43f5e', glow: 'rgba(244,63,94,0.12)' },
  'Software':         { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.20)', text: '#ffffff', glow: 'rgba(255,255,255,0.08)' },
  'Accessories':      { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.20)', text: '#ffffff', glow: 'rgba(255,255,255,0.08)' },
};

export function Categories() {
  const products = useProductStore((state) => state.products);
  const categoryRecords = useProductStore((state) => state.categories);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const loadProducts = useProductStore((state) => state.loadProducts);
  const categories = useMemo(() => categoryRecords.map((category) => category.name), [categoryRecords]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div style={{ flex: 1, background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.14) 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3.5rem 1.5rem 3rem',
        textAlign: 'center',
      }}>
        <div className="section-label" style={{ marginBottom: '0.75rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Browse Everything
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: '0 0 0.75rem' }}>
          All <span className="gradient-text">Categories</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '28rem', margin: '0 auto', lineHeight: 1.7 }}>
          From laptop batteries to mechanical keyboards — find the perfect PC component for your needs.
        </p>
      </div>

      {/* Categories Grid */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.32)',
              color: 'var(--text-secondary)',
              borderRadius: '0.875rem',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              fontWeight: 650,
              lineHeight: 1.5,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.1rem' }}>Categories could not be loaded</div>
              <div>Please refresh the page or check the Supabase deployment environment variables.</div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)' }}>
            <div style={{ width: '5rem', height: '5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoaderCircle size={30} color="var(--red-primary)" className="category-loading-icon" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Loading categories...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Fetching category collections from Supabase.</p>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)' }}>
            <div style={{ width: '5rem', height: '5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Laptop size={30} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>No categories found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>No product categories are available right now.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {categories.map((catName) => {
              const Icon = categoryIcons[catName] || Laptop;
              const colors = categoryColors[catName] || { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#ef4444', glow: 'rgba(239,68,68,0.1)' };
              const count = products.filter((p) => p.category === catName).length;
              const productImage = products.find((product) => product.category === catName)?.image_url;
              const categoryImage = categoryImages[catName] || productImage;

              return (
                <Link
                  key={catName}
                  to={`/products?category=${encodeURIComponent(catName)}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    padding: '1.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '1.25rem',
                    textDecoration: 'none',
                    transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    position: 'relative', overflow: 'hidden',
                  }}
                  className="cat-link"
                  data-color={colors.glow}
                >
                  <div style={{
                    width: '4rem', height: '4rem', flexShrink: 0,
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                  }}>
                    {categoryImage ? (
                      <img
                        src={categoryImage}
                        alt=""
                        aria-hidden="true"
                        className="category-card-image"
                      />
                    ) : (
                      <Icon size={22} color={colors.text} />
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {catName}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                      {count > 0 ? `${count} product${count > 1 ? 's' : ''}` : 'View collection'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, transition: 'all 0.3s ease' }} className="cat-arrow" />

                  {/* Bottom accent line */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, ${colors.text}, transparent)`,
                    transform: 'scaleX(0)', transformOrigin: 'left',
                    transition: 'transform 0.4s ease',
                  }} className="cat-line" />
                </Link>
              );
            })}
          </div>
        )}

        {/* All Products CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1.25rem',
            padding: '2.5rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Can't find what you're looking for?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Browse all {products.length}+ products or contact us on WhatsApp for custom orders.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                Browse All Products <ArrowRight size={14} />
              </Link>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '94711479191'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-glow"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cat-link:hover {
          border-color: rgba(239,68,68,0.3) !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 0 35px rgba(239,68,68,0.1), 0 20px 40px rgba(0,0,0,0.4) !important;
        }
        .category-card-image {
          width: 86%;
          height: 86%;
          object-fit: contain;
          object-position: center;
          filter: drop-shadow(0 10px 14px rgba(0,0,0,0.34));
        }
        .cat-link:hover .cat-line { transform: scaleX(1) !important; }
        .cat-link:hover .cat-arrow { color: var(--text-primary) !important; transform: translateX(4px); }
        .category-loading-icon { animation: category-spin 0.9s linear infinite; }
        @keyframes category-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
