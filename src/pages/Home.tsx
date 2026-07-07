import {
  ArrowRight, Award, Battery, CheckCircle2, ChevronLeft, ChevronRight, Clock, Cpu, HardDrive,
  Keyboard, Laptop, Monitor, Plus, Printer, ShieldCheck, Truck, Wrench, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import type { Product } from '../types';

const categories = [
  { name: 'SSD', icon: HardDrive, color: '#ef4444' },
  { name: 'RAM', icon: Cpu, color: '#ffffff' },
  { name: 'Displays', icon: Monitor, color: '#f43f5e' },
  { name: 'Keyboards', icon: Keyboard, color: '#ffffff' },
  { name: 'Laptop Batteries', icon: Battery, color: '#ef4444' },
  { name: 'Chargers', icon: Zap, color: '#ffffff' },
  { name: 'Printers', icon: Printer, color: '#f43f5e' },
  { name: 'Accessories', icon: Laptop, color: '#ffffff' },
];

const services = [
  { icon: Monitor, title: 'Display Replacement', desc: 'Clean panel swaps for damaged laptop screens.' },
  { icon: HardDrive, title: 'SSD Upgrades', desc: 'Faster boot times, data migration, and setup.' },
  { icon: Battery, title: 'Battery Service', desc: 'OEM-grade batteries with installation support.' },
  { icon: Wrench, title: 'Thermal Cleaning', desc: 'Deep clean, paste replacement, and tune-ups.' },
];

const heroSlides = [
  {
    image: 'https://ik.imagekit.io/pcg/hero/hero1',
    mobileImage: 'https://ik.imagekit.io/pcg/hero/mobile%20/Quality%20laptop%20parts%20pc%20garage',
    label: 'Laptop diagnostics',
  },
  {
    image: 'https://ik.imagekit.io/pcg/hero/mobile%20/Untitled%20(1080%20x%201440%20px).webp',
    mobileImage: 'https://ik.imagekit.io/pcg/hero/mobile%20/Untitled%20(1080%20x%201440%20px).webp',
    label: 'PC parts and accessories',
  },
  {
    image: 'https://ik.imagekit.io/pcg/hero/mobile%20/banner/Untitled-design.jpg',
    mobileImage: 'https://ik.imagekit.io/pcg/hero/mobile%20/banner/Untitled-design.jpg',
    label: 'Repair bench service',
  },
];

const heroFallbackImage = heroSlides[0].image;
const mobileAfterHeroBanner = 'https://ik.imagekit.io/pcg/hero/mobile%20/banner/Untitled-design.jpg';

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
      <Link to={`/product/${product.slug || product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '4/3', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
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
              background: product.in_stock ? 'rgba(239,68,68,0.16)' : 'var(--bg-elevated)',
              color: product.in_stock ? '#ffffff' : 'var(--text-muted)',
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
  const [toast, setToast] = useState<string | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isMobileHero, setIsMobileHero] = useState(false);
  const featuredProducts = products.slice(0, 4);
  const currentHeroSlide = heroSlides[activeHeroSlide];
  const currentHeroImage = isMobileHero ? currentHeroSlide.mobileImage : currentHeroSlide.image;

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const updateHeroMode = () => setIsMobileHero(mediaQuery.matches);

    updateHeroMode();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateHeroMode);
    } else {
      mediaQuery.addListener(updateHeroMode);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateHeroMode);
      } else {
        mediaQuery.removeListener(updateHeroMode);
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((slide) => (slide + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const showPreviousHeroSlide = () => {
    setActiveHeroSlide((slide) => (slide - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNextHeroSlide = () => {
    setActiveHeroSlide((slide) => (slide + 1) % heroSlides.length);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setToast(product.name);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div style={{ flex: 1 }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <section
        className="hero-modern"
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: '#060607',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto' }}>
          <div className="electro-hero-grid" style={{ display: 'grid', gridTemplateColumns: '16.5rem minmax(0, 1fr)', gap: '1rem', alignItems: 'stretch' }}>
            <aside className="electro-departments" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '0.9rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.95rem 1rem', background: '#dc2626', color: '#ffffff', fontSize: '0.88rem', fontWeight: 900 }}>
                All Departments
              </div>
              <div>
                {categories.map(({ name, icon: Icon }) => (
                  <Link
                    key={name}
                    to={`/products?category=${name}`}
                    className="electro-department-link"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                      <Icon size={16} color="var(--red-bright)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    </span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </aside>

            <div
              className="electro-main-slide"
              style={{
                minHeight: '32rem',
                borderRadius: '0.9rem',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#060607',
              }}
            >
              <img
                key={currentHeroImage}
                src={currentHeroImage}
                alt={currentHeroSlide.label}
                className="hero-slide-img"
                onError={(event) => {
                  if (event.currentTarget.src !== heroFallbackImage) {
                    event.currentTarget.src = heroFallbackImage;
                  }
                }}
              />
              <div className="hero-slide-shade" />
              <div className="hero-carousel-controls" aria-label="Hero image carousel">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={showPreviousHeroSlide} aria-label="Previous hero image" className="hero-carousel-btn">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" onClick={showNextHeroSlide} aria-label="Next hero image" className="hero-carousel-btn">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.label}
                      type="button"
                      onClick={() => setActiveHeroSlide(index)}
                      aria-label={`Show ${slide.label}`}
                      aria-current={index === activeHeroSlide}
                      className={`hero-carousel-dot ${index === activeHeroSlide ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Link
        to="/products"
        className="mobile-after-hero-banner"
        aria-label="Browse PC Garage products"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,5,6,0.10), rgba(5,5,6,0.04)), url("${mobileAfterHeroBanner}")`,
        }}
      />

      <section style={{ padding: '1.35rem 1.5rem', background: '#0b0b0d', borderBottom: '1px solid var(--border-subtle)' }}>
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

      <section style={{ padding: '3rem 1.5rem', background: '#0b0b0d', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
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
        .electro-department-link {
          min-height: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0 1rem;
          border-top: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 800;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }
        .electro-department-link:hover {
          color: #ffffff;
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.28);
        }
        .hero-carousel-controls {
          position: absolute;
          left: 3.25rem;
          right: 3.25rem;
          bottom: 1.4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          z-index: 2;
          pointer-events: auto;
        }
        .hero-carousel-btn {
          width: 2.35rem;
          height: 2.35rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(8,8,9,0.58);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .hero-carousel-btn:hover {
          background: #dc2626;
          border-color: rgba(239,68,68,0.70);
          transform: translateY(-1px);
        }
        .hero-carousel-dot {
          width: 0.62rem;
          height: 0.62rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.44);
          background: rgba(255,255,255,0.24);
          cursor: pointer;
          padding: 0;
          transition: width 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .hero-carousel-dot.active {
          width: 2rem;
          background: #ef4444;
          border-color: #ef4444;
        }
        .mobile-after-hero-banner {
          display: none;
        }
        .hero-slide-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          transition: opacity 0.28s ease;
        }
        .hero-slide-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(5,5,6,0.18), rgba(5,5,6,0.08));
          pointer-events: none;
        }
        @media (max-width: 980px) {
          .electro-hero-grid, .hero-grid, .service-grid { grid-template-columns: 1fr !important; }
          .electro-departments { order: 2; }
          .electro-main-slide { order: 1; min-height: 28rem !important; }
          .hero-modern { min-height: auto !important; }
          .category-strip { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .mobile-after-hero-banner {
            display: block;
            width: calc(100% - 2rem);
            max-width: 40rem;
            aspect-ratio: 16 / 7;
            margin: 0.25rem auto 1rem;
            border: 1px solid var(--border-subtle);
            border-radius: 0.9rem;
            background-color: #111113;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            overflow: hidden;
            box-shadow: var(--shadow-card);
          }
          .hero-modern { padding: 1rem !important; }
          .electro-departments { display: none !important; }
          .electro-main-slide {
            min-height: 0 !important;
            aspect-ratio: 3 / 4 !important;
            background-color: #060607 !important;
          }
          .hero-slide-img {
            object-fit: contain;
          }
          .hero-slide-shade {
            background: linear-gradient(180deg, rgba(5,5,6,0.02), rgba(5,5,6,0.16));
          }
          .hero-carousel-controls {
            left: 1.35rem !important;
            right: 1.35rem !important;
            bottom: 1rem !important;
          }
          .trust-grid, .repair-grid, .products-grid, .stats-grid { grid-template-columns: 1fr !important; }
          .category-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </div>
  );
}
