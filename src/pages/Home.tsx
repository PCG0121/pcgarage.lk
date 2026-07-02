import {
  ArrowRight, Award, Battery, CheckCircle2, Clock, Cpu, HardDrive,
  Keyboard, Laptop, Monitor, Plus, Printer, ShieldCheck, Truck, Wrench, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import type { Product } from '../types';

const categories = [
  { name: 'SSD', icon: HardDrive, color: '#ef4444' },
  { name: 'RAM', icon: Cpu, color: '#22c55e' },
  { name: 'Displays', icon: Monitor, color: '#38bdf8' },
  { name: 'Keyboards', icon: Keyboard, color: '#a78bfa' },
  { name: 'Laptop Batteries', icon: Battery, color: '#f59e0b' },
  { name: 'Chargers', icon: Zap, color: '#f97316' },
  { name: 'Printers', icon: Printer, color: '#14b8a6' },
  { name: 'Accessories', icon: Laptop, color: '#fb7185' },
];

const services = [
  { icon: Monitor, title: 'Display Replacement', desc: 'Clean panel swaps for damaged laptop screens.' },
  { icon: HardDrive, title: 'SSD Upgrades', desc: 'Faster boot times, data migration, and setup.' },
  { icon: Battery, title: 'Battery Service', desc: 'OEM-grade batteries with installation support.' },
  { icon: Wrench, title: 'Thermal Cleaning', desc: 'Deep clean, paste replacement, and tune-ups.' },
];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast-container">
      <div className="toast animate-toast-in">
        <CheckCircle2 size={22} color="var(--green-accent)" />
        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>Added to cart</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{message}</div>
        </div>
        <button onClick={onClose} aria-label="Close toast" style={{ marginLeft: 'auto', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          x
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { key?: string; product: Product; onAdd: (product: Product) => void }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.slug || product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '4/3', background: '#f1f5f9', overflow: 'hidden' }}>
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92, transition: 'transform 0.22s ease, opacity 0.22s ease' }}
          />
        )}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
          <span className={product.in_stock ? 'badge-green' : 'badge-red'}>
            {product.in_stock ? 'In stock' : 'Sold out'}
          </span>
        </div>
      </Link>

      <div style={{ padding: '1rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
          {product.category}
        </div>
        <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.35, fontWeight: 800, margin: 0, minHeight: '2.55rem' }}>
            {product.name}
          </h3>
        </Link>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <span style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 900 }}>Rs. {product.price.toLocaleString()}</span>
          <button
            onClick={() => onAdd(product)}
            disabled={!product.in_stock}
            aria-label={`Add ${product.name} to cart`}
            style={{
              width: '2.35rem',
              height: '2.35rem',
              borderRadius: '0.72rem',
              border: '1px solid rgba(239,68,68,0.28)',
              background: product.in_stock ? '#fff1f2' : '#f8fafc',
              color: product.in_stock ? '#fb7185' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: product.in_stock ? 'pointer' : 'not-allowed',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const products = useProductStore((state) => state.products);
  const loadProducts = useProductStore((state) => state.loadProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const [toast, setToast] = useState<string | null>(null);
  const featuredProducts = products.slice(0, 4);
  const heroProduct = products[2] ?? products[0];

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setToast(product.name);
    setTimeout(() => setToast(null), 2600);
  };

  if (!heroProduct) {
    return (
      <div style={{ flex: 1, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: 800 }}>
        {isLoading ? 'Loading products...' : 'No products available yet.'}
      </div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <section className="hero-bg" style={{ padding: '3.5rem 1.5rem 2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.02fr) minmax(20rem, 0.78fr)', gap: '2rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '29rem' }}>
              <div className="section-label" style={{ marginBottom: '0.9rem' }}>PC repair, parts, and upgrades</div>
              <h1 style={{ color: 'var(--text-primary)', fontSize: '3.65rem', lineHeight: 1.02, fontWeight: 900, letterSpacing: 0, margin: '0 0 1.25rem', maxWidth: '46rem' }}>
                Build faster. Repair smarter. Shop genuine PC parts.
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, margin: '0 0 1.7rem', maxWidth: '35rem' }}>
                PC Garage helps you buy trusted components and fix laptops quickly with clear pricing, WhatsApp ordering, and island-wide delivery.
              </p>

              <div className="hero-actions" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link to="/products" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  Shop products <ArrowRight size={16} />
                </Link>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '94700000000'}`} target="_blank" rel="noopener noreferrer" className="btn-outline-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  Get repair quote
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', maxWidth: '38rem' }} className="trust-grid">
                {[
                  { icon: ShieldCheck, title: 'Warranty', text: 'Genuine parts' },
                  { icon: Truck, title: 'Delivery', text: 'Across Sri Lanka' },
                  { icon: Clock, title: 'Fast repair', text: 'Same-day checks' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} style={{ padding: '0.9rem', border: '1px solid var(--border-subtle)', borderRadius: '0.85rem', background: '#ffffff' }}>
                    <Icon size={18} color="var(--red-bright)" />
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 800, marginTop: '0.55rem' }}>{title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '1.2rem', overflow: 'hidden', background: '#ffffff', boxShadow: 'var(--shadow-soft)' }}>
              <Link to={`/product/${heroProduct.slug || heroProduct.id}`} style={{ display: 'block', height: '22rem', background: '#f1f5f9', overflow: 'hidden' }}>
                {heroProduct.image_url && (
                  <img
                    src={heroProduct.image_url}
                    alt={heroProduct.name}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </Link>
              <div style={{ padding: '1.25rem' }}>
                <span className="badge-red">Featured deal</span>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', lineHeight: 1.28, fontWeight: 900, margin: '0.9rem 0 0.55rem' }}>
                  {heroProduct.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  {heroProduct.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '1.35rem', fontWeight: 900 }}>
                    Rs. {heroProduct.price.toLocaleString()}
                  </div>
                  <button onClick={() => handleAddToCart(heroProduct)} className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    Add <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '1.35rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }} className="stats-grid">
          {[
            ['100+', 'Products in stock'],
            ['2500+', 'Happy customers'],
            ['6+', 'Years experience'],
            ['24h', 'Fast diagnostics'],
          ].map(([value, label]) => (
            <div key={label} className="stat-card">
              <div style={{ color: 'var(--text-primary)', fontSize: '1.55rem', fontWeight: 900 }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>Shop by type</div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900 }}>Popular categories</h2>
            </div>
            <Link to="/categories" style={{ color: 'var(--red-bright)', textDecoration: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: '0.8rem' }} className="category-strip">
            {categories.map(({ name, icon: Icon, color }) => (
              <Link key={name} to={`/products?category=${name}`} className="category-card">
                <div style={{ width: '2.9rem', height: '2.9rem', borderRadius: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18`, border: `1px solid ${color}33`, marginBottom: '0.75rem' }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.78rem', lineHeight: 1.25, fontWeight: 800 }}>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>Ready to order</div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900 }}>Featured products</h2>
            </div>
            <Link to="/products" style={{ color: 'var(--red-bright)', textDecoration: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Browse store <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }} className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.78fr 1.22fr', gap: '1.5rem', alignItems: 'start' }} className="service-grid">
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>Repair desk</div>
              <h2 style={{ margin: '0 0 0.8rem', color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 900 }}>Bring it in. We will diagnose it clearly.</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                From slow laptops to broken displays, PC Garage handles everyday repair work with practical advice and transparent quotes.
              </p>
              <div style={{ marginTop: '1.4rem', display: 'flex', gap: '0.7rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 700 }}>
                <Award size={18} color="var(--amber-accent)" /> Trusted by local customers
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }} className="repair-grid">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="service-card">
                  <Icon size={22} color="var(--red-bright)" />
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 900, margin: '0.8rem 0 0.35rem' }}>{title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .product-card:hover .product-img { transform: scale(1.04); opacity: 1 !important; }
        @media (max-width: 980px) {
          .hero-grid, .service-grid { grid-template-columns: 1fr !important; }
          .category-strip { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .hero-bg { padding: 2.2rem 1rem 1.75rem !important; }
          .hero-grid h1 { font-size: 2.05rem !important; line-height: 1.08 !important; }
          .hero-grid p { font-size: 0.94rem !important; }
          .hero-grid > div:first-child { min-height: 0 !important; }
          .hero-actions {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
          .hero-actions a {
            justify-content: center !important;
          }
          .hero-grid > div:last-child a:first-child { height: 15rem !important; }
          .trust-grid, .repair-grid, .products-grid, .stats-grid { grid-template-columns: 1fr !important; }
          .category-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </div>
  );
}
