import {
  ArrowRight, Battery, BatteryCharging, Camera, CheckCircle2, ChevronLeft, ChevronRight, Clock, Code2, Cpu, Droplet, HardDrive,
  Headphones, Heart, Keyboard, Laptop, Monitor, Plus, Printer, ShieldCheck, Star, Truck, Wrench, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import type { Product } from '../types';

const categories = [
  {
    name: 'SSD',
    icon: HardDrive,
    color: '#ef4444',
    imageUrl: '/category/ssd.png',
  },
  {
    name: 'RAM',
    icon: Cpu,
    color: '#ffffff',
    imageUrl: '/category/ram.png',
  },
  {
    name: 'Displays',
    icon: Monitor,
    color: '#f43f5e',
    imageUrl: '/category/displays.png',
  },
  {
    name: 'Laptop Batteries',
    icon: Battery,
    color: '#ef4444',
    imageUrl: '/category/battery.png',
  },
  {
    name: 'Keyboards',
    icon: Keyboard,
    color: '#ffffff',
    imageUrl: '/category/keyboards.png',
  },
  {
    name: 'Chargers',
    icon: Zap,
    color: '#ffffff',
    imageUrl: '/category/chargers.png',
  },
  {
    name: 'Printers',
    icon: Printer,
    color: '#f43f5e',
    imageUrl: '/category/printers.png',
  },
  { name: 'Laptops', icon: Laptop, color: '#ffffff' },
  { name: 'WiFi Camera', icon: Camera, color: '#ef4444' },
  { name: 'Power bank', icon: BatteryCharging, color: '#ffffff' },
  { name: 'Toner & Ink', icon: Droplet, color: '#f43f5e' },
  { name: 'Software', icon: Code2, color: '#ffffff' },
  { name: 'Accessories', icon: Laptop, color: '#ffffff' },
];

const services = [
  { icon: Monitor, title: 'Display Replacement', desc: 'Clean panel swaps for damaged laptop screens.' },
  { icon: HardDrive, title: 'SSD Upgrades', desc: 'Faster boot times, data migration, and setup.' },
  { icon: Battery, title: 'Battery Service', desc: 'OEM-grade batteries with installation support.' },
  { icon: Wrench, title: 'Thermal Cleaning', desc: 'Deep clean, paste replacement, and tune-ups.' },
];

const desktopHeroLaptopImage = 'https://ik.imagekit.io/pcg/Website/hero/hero1?updatedAt=1783423943542';
const desktopHeroSecurityImage = 'https://ik.imagekit.io/pcg/Website/hero/Untitled%20design%20(8).webp?updatedAt=1783424118191';
const desktopKokoBanner = 'https://ik.imagekit.io/pcg/hero/mobile%20/banner/koko_banner.png';
const desktopKokoSideBanner = 'https://ik.imagekit.io/pcg/Website/hero/mobile%20/banner/ChatGPT%20Image%20Jun%209,%202026,%2001_06_47%20PM.webp?updatedAt=1783424118191';
const mobileHeroLaptopImage = 'https://ik.imagekit.io/pcg/Website/hero/mobile%20/Quality%20laptop%20parts%20pc%20garage?updatedAt=1783423943541';
const mobileHeroPartsImage = 'https://ik.imagekit.io/pcg/Website/hero/mobile%20/Untitled%20(1080%20x%201440%20px).webp?updatedAt=1783423943539';
const mobileAfterHeroBanner = desktopKokoSideBanner;

const heroSlides = [
  {
    image: desktopHeroLaptopImage,
    mobileImage: mobileHeroLaptopImage,
    label: 'Laptop diagnostics',
  },
  {
    image: desktopHeroSecurityImage,
    mobileImage: mobileHeroPartsImage,
    label: 'PC parts and accessories',
  },
];

const heroFallbackImage = heroSlides[0].image;

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
  const [isBestSellerPaused, setIsBestSellerPaused] = useState(false);
  const bestSellerProducts = products.slice(0, 4);
  const storeProducts = products.slice(0, 16);
  const bestSellerCarouselProducts = bestSellerProducts.length > 1
    ? [...bestSellerProducts, ...bestSellerProducts]
    : bestSellerProducts;
  const categoryTiles = categories.slice(0, 4).map((category) => ({
    ...category,
    product: products.find((product) => product.category === category.name),
  }));
  const currentHeroSlide = heroSlides[activeHeroSlide];
  const currentHeroImage = isMobileHero ? currentHeroSlide.mobileImage : currentHeroSlide.image;
  const [displayHeroImage, setDisplayHeroImage] = useState(currentHeroImage);
  const [previousHeroImage, setPreviousHeroImage] = useState<string | null>(null);
  const displayHeroImageRef = useRef(currentHeroImage);
  const bestSellerRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      [slide.image, slide.mobileImage].forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    });
  }, []);

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
    if (currentHeroImage === displayHeroImageRef.current) {
      return;
    }

    setPreviousHeroImage(displayHeroImageRef.current);
    displayHeroImageRef.current = currentHeroImage;
    setDisplayHeroImage(currentHeroImage);

    const timer = window.setTimeout(() => {
      setPreviousHeroImage(null);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [currentHeroImage]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((slide) => (slide + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    bestSellerRowRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [bestSellerProducts.length]);

  useEffect(() => {
    if (bestSellerProducts.length <= 1 || isBestSellerPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      const row = bestSellerRowRef.current;
      const firstCard = row?.querySelector<HTMLElement>('.best-seller-card');

      if (!row || !firstCard) {
        return;
      }

      const styles = window.getComputedStyle(row);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      const resetPoint = row.scrollWidth / 2;

      if (row.scrollLeft + step >= resetPoint - 2) {
        row.scrollTo({ left: 0, behavior: 'auto' });
        return;
      }

      row.scrollBy({ left: step, behavior: 'smooth' });
    }, 3200);

    return () => window.clearInterval(timer);
  }, [bestSellerProducts.length, isBestSellerPaused]);

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
          background: 'var(--bg-base)',
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
                {categories.map(({ name, icon: Icon, imageUrl }) => {
                  const categoryProduct = products.find((product) => product.category === name);
                  const categoryImage = imageUrl || categoryProduct?.image_url;

                  return (
                    <Link
                      key={name}
                      to={`/products?category=${name}`}
                      className="electro-department-link"
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                        <span className="department-thumb">
                          {categoryImage ? (
                            <img src={categoryImage} alt="" aria-hidden="true" />
                          ) : (
                            <Icon size={15} color="var(--red-bright)" />
                          )}
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div
              className="electro-main-slide"
              style={{
                minHeight: 0,
                aspectRatio: '16 / 9',
                borderRadius: '0.9rem',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              {previousHeroImage && (
                <img
                  key={`previous-${previousHeroImage}`}
                  src={previousHeroImage}
                  alt=""
                  aria-hidden="true"
                  className="hero-slide-img hero-slide-img-out"
                  onError={(event) => {
                    if (event.currentTarget.src !== heroFallbackImage) {
                      event.currentTarget.src = heroFallbackImage;
                    }
                  }}
                />
              )}
              <img
                key={`current-${displayHeroImage}`}
                src={displayHeroImage}
                alt={currentHeroSlide.label}
                className="hero-slide-img hero-slide-img-in"
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
        aria-label="Browse PC Garage payment offers"
      >
        <img src={mobileAfterHeroBanner} alt="" aria-hidden="true" />
      </Link>

      <section className="commerce-showcase">
        <div className="commerce-shell">
          <div className="commerce-panel">
            <div className="commerce-section-head">
              <h2>Top Categories</h2>
              <Link to="/categories">View all</Link>
            </div>

            <div className="top-category-row">
              {categoryTiles.map(({ name, icon: Icon, color, imageUrl, product }) => (
                <Link key={name} to={`/products?category=${name}`} className="top-category-card">
                  <div className="top-category-media">
                    {imageUrl || product?.image_url ? (
                      <img src={imageUrl || product?.image_url} alt={name} />
                    ) : (
                      <Icon size={42} color={color} />
                    )}
                  </div>
                  <span>{name === 'Laptop Batteries' ? 'Batteries' : name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="commerce-panel best-seller-panel">
            <div className="commerce-section-head">
              <h2>Best Sellers</h2>
              <Link to="/products">View all</Link>
            </div>

            <div
              ref={bestSellerRowRef}
              className="best-seller-row"
              onMouseEnter={() => setIsBestSellerPaused(true)}
              onMouseLeave={() => setIsBestSellerPaused(false)}
              onPointerDown={() => setIsBestSellerPaused(true)}
              onPointerUp={() => setIsBestSellerPaused(false)}
              onPointerCancel={() => setIsBestSellerPaused(false)}
            >
              {bestSellerCarouselProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="best-seller-card">
                  <Link to={`/product/${product.slug || product.id}`} className="best-seller-image">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  </Link>

                  <button type="button" className="wishlist-btn" aria-label={`Save ${product.name}`}>
                    <Heart size={18} />
                  </button>

                  <div className="best-seller-info">
                    <Link to={`/product/${product.slug || product.id}`} className="best-seller-title">
                      {product.name}
                    </Link>
                    <div className="best-seller-price">Rs. {product.price.toLocaleString()}</div>
                    <div className="best-seller-meta">
                      <Star size={13} fill="currentColor" />
                      <span>4.{8 + (index % 2)} ({64 + index * 18})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.in_stock}
                    className="best-add-btn"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="koko-banner-grid">
            <Link
              to="/products"
              className="koko-banner"
              aria-label="Shop now, pay later with KOKO"
              style={{
                backgroundImage: `url("${desktopKokoBanner}")`,
              }}
            />
            <Link
              to="/products"
              className="koko-banner koko-banner-extra"
              aria-label="Browse PC Garage payment offers"
              style={{
                backgroundImage: `url("${desktopKokoSideBanner}")`,
              }}
            />
          </div>

          <div className="commerce-panel store-products-panel">
            <div className="commerce-section-head">
              <h2>Latest Products</h2>
              <Link to="/products">View all</Link>
            </div>

            <div className="store-products-grid">
              {storeProducts.map((product, index) => (
                <div key={product.id} className="store-product-card">
                  <Link to={`/product/${product.slug || product.id}`} className="store-product-image">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className={product.in_stock ? 'store-stock-badge' : 'store-stock-badge sold'}>
                      {product.in_stock ? 'In stock' : 'Sold out'}
                    </span>
                    {index < 4 && <span className="store-sale-badge">Hot</span>}
                  </Link>

                  <div className="store-product-body">
                    <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="store-product-category">
                      {product.category}
                    </Link>
                    <Link to={`/product/${product.slug || product.id}`} className="store-product-title">
                      {product.name}
                    </Link>
                    <div className="store-product-rating">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star key={star} size={12} fill="currentColor" />
                      ))}
                      <span>({24 + index * 7})</span>
                    </div>
                    <div className="store-product-footer">
                      <strong>Rs. {product.price.toLocaleString()}</strong>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="repair-hero-card">
            <div>
              <h2>Expert Laptop Repairs</h2>
              <p>From screen replacements to motherboard repairs, we have got you covered.</p>
              <div className="repair-points">
                {services.slice(0, 3).map(({ icon: Icon, title }) => (
                  <span key={title}>
                    <Icon size={15} />
                    {title.replace(' Replacement', '').replace(' Service', '')}
                  </span>
                ))}
              </div>
              <Link to="/products" className="repair-action">
                Book a repair <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="service-info-bar">
            {[
              { icon: Headphones, title: 'Need Help?', desc: 'Chat with our team' },
              { icon: ShieldCheck, title: 'Quality Assured', desc: 'Genuine parts with warranty' },
              { icon: Truck, title: 'Islandwide Delivery', desc: 'Fast delivery across Sri Lanka' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="service-info-item">
                <Icon size={30} />
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
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
        .department-thumb {
          width: 1.35rem;
          height: 1.35rem;
          flex: 0 0 1.35rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.38rem;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .department-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
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
        .commerce-showcase {
          padding: 1rem 1.5rem 4rem;
          background: var(--bg-base);
        }
        .commerce-shell {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          display: grid;
          gap: 1rem;
        }
        .commerce-panel {
          padding: 1.35rem;
          border: 1px solid var(--border-subtle);
          border-radius: 1.1rem;
          background:
            radial-gradient(circle at 18% 0%, rgba(255,255,255,0.07), transparent 34%),
            var(--bg-surface);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }
        .best-seller-panel {
          --best-card-width: 12.2rem;
          --best-card-gap: 0.75rem;
        }
        .commerce-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .commerce-section-head h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.18rem;
          line-height: 1.2;
          font-weight: 900;
        }
        .commerce-section-head a {
          color: #ef4444;
          text-decoration: none;
          font-size: 0.74rem;
          font-weight: 900;
          text-transform: uppercase;
        }
        .top-category-row,
        .best-seller-row {
          display: grid;
          gap: var(--best-card-gap, 0.75rem);
          scrollbar-width: none;
        }
        .top-category-row {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .best-seller-row {
          grid-auto-flow: column;
          grid-auto-columns: var(--best-card-width);
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          touch-action: pan-x;
        }
        .top-category-row::-webkit-scrollbar,
        .best-seller-row::-webkit-scrollbar {
          display: none;
        }
        .top-category-card {
          min-height: 10.2rem;
          padding: 0.85rem;
          border: 1px solid var(--border-subtle);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 50% 16%, rgba(255,255,255,0.10), transparent 42%),
            var(--bg-card);
          color: var(--text-primary);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.65rem;
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }
        .top-category-card:hover {
          transform: translateY(-2px);
          border-color: rgba(239,68,68,0.42);
          background:
            radial-gradient(circle at 50% 16%, rgba(239,68,68,0.18), transparent 42%),
            var(--bg-elevated);
        }
        .top-category-media {
          height: 6.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .top-category-media img {
          width: min(100%, 6.8rem);
          height: min(100%, 6.2rem);
          object-fit: contain;
          object-position: center;
          filter: drop-shadow(0 16px 18px rgba(0,0,0,0.42));
        }
        .top-category-card span {
          color: var(--text-primary);
          font-size: 0.8rem;
          line-height: 1.25;
          font-weight: 800;
        }
        .best-seller-card {
          position: relative;
          min-height: 16.9rem;
          border: 1px solid var(--border-subtle);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 50% 10%, rgba(255,255,255,0.08), transparent 40%),
            var(--bg-card);
          overflow: hidden;
          box-shadow: 0 16px 34px rgba(0,0,0,0.28);
          scroll-snap-align: start;
        }
        .best-seller-image {
          height: 8.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem;
          background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.10));
        }
        .best-seller-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 18px 20px rgba(0,0,0,0.46));
        }
        .wishlist-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 2rem;
          height: 2rem;
          border: 0;
          border-radius: 999px;
          background: rgba(0,0,0,0.26);
          color: rgba(255,255,255,0.82);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .best-seller-info {
          padding: 0 0.78rem 0.78rem;
        }
        .best-seller-title {
          min-height: 2.35rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.76rem;
          line-height: 1.35;
          font-weight: 800;
        }
        .best-seller-price {
          margin-top: 0.35rem;
          color: var(--text-primary);
          font-size: 0.92rem;
          font-weight: 900;
        }
        .best-seller-meta {
          margin-top: 0.32rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #ef4444;
          font-size: 0.72rem;
          font-weight: 800;
        }
        .best-seller-meta span {
          color: var(--text-muted);
        }
        .best-add-btn {
          position: absolute;
          right: 0.7rem;
          bottom: 0.7rem;
          width: 1.85rem;
          height: 1.85rem;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(239,68,68,0.30);
        }
        .best-add-btn:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }
        .repair-action {
          min-height: 2.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0 1.3rem;
          border-radius: 0.55rem;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: #ffffff;
          text-decoration: none;
          font-size: 0.74rem;
          font-weight: 900;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .repair-hero-card {
          min-height: 17rem;
          padding: 2rem;
          border: 1px solid var(--border-subtle);
          border-radius: 1.1rem;
          background:
            linear-gradient(90deg, rgba(8,8,9,0.96) 0%, rgba(8,8,9,0.82) 38%, rgba(8,8,9,0.26) 100%),
            url("https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&q=80&w=1600");
          background-size: cover;
          background-position: center right;
          display: flex;
          align-items: center;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .repair-hero-card > div {
          max-width: 38rem;
        }
        .repair-hero-card h2 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(1.65rem, 3vw, 2.45rem);
          line-height: 1.1;
          font-weight: 900;
        }
        .repair-hero-card p {
          max-width: 31rem;
          margin: 0.85rem 0 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .repair-points {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.35rem;
        }
        .repair-points span {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 800;
        }
        .repair-points svg {
          width: 1.9rem;
          height: 1.9rem;
          padding: 0.42rem;
          border-radius: 999px;
          background: #dc2626;
          color: #ffffff;
        }
        .koko-banner-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        .koko-banner {
          min-height: 5.4rem;
          aspect-ratio: 1950 / 760;
          border: 1px solid rgba(236,72,153,0.34);
          border-radius: 1rem;
          background-color: #ffffff;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          text-decoration: none;
          display: block;
          box-shadow: 0 16px 34px rgba(0,0,0,0.24);
        }
        .koko-banner-extra {
          aspect-ratio: 1950 / 760;
          background-size: cover;
        }
        .store-products-panel {
          padding: 1.25rem;
        }
        .store-products-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.9rem;
        }
        .store-product-card {
          position: relative;
          min-width: 0;
          border: 1px solid var(--border-subtle);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.07), transparent 34%),
            var(--bg-card);
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0,0,0,0.24);
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .store-product-card:hover {
          transform: translateY(-3px);
          border-color: rgba(239,68,68,0.42);
          box-shadow: 0 20px 42px rgba(0,0,0,0.36);
        }
        .store-product-image {
          position: relative;
          height: 11.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.14)),
            var(--bg-elevated);
          text-decoration: none;
        }
        .store-product-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 18px 20px rgba(0,0,0,0.42));
          transition: transform 0.2s ease;
        }
        .store-product-card:hover .store-product-image img {
          transform: scale(1.035);
        }
        .store-stock-badge,
        .store-sale-badge {
          position: absolute;
          top: 0.7rem;
          min-height: 1.35rem;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0 0.52rem;
          font-size: 0.58rem;
          line-height: 1;
          font-weight: 900;
          text-transform: uppercase;
        }
        .store-stock-badge {
          left: 0.7rem;
          color: #121214;
          background: #ffffff;
        }
        .store-stock-badge.sold {
          color: #ffffff;
          background: #7f1d1d;
        }
        .store-sale-badge {
          right: 0.7rem;
          color: #ffffff;
          background: #dc2626;
          box-shadow: 0 10px 22px rgba(239,68,68,0.30);
        }
        .store-product-body {
          padding: 0.9rem;
        }
        .store-product-category {
          display: block;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.64rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .store-product-title {
          min-height: 2.42rem;
          margin-top: 0.42rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.88rem;
          line-height: 1.38;
          font-weight: 850;
        }
        .store-product-rating {
          margin-top: 0.55rem;
          display: flex;
          align-items: center;
          gap: 0.18rem;
          color: #ef4444;
          font-size: 0.72rem;
          font-weight: 800;
        }
        .store-product-rating span {
          margin-left: 0.25rem;
          color: var(--text-muted);
        }
        .store-product-footer {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.65rem;
        }
        .store-product-footer strong {
          min-width: 0;
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 950;
          white-space: nowrap;
        }
        .store-product-footer button {
          width: 2.2rem;
          height: 2.2rem;
          flex: 0 0 2.2rem;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #ef4444, #991b1b);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 12px 22px rgba(239,68,68,0.24);
        }
        .store-product-footer button:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }
        .service-info-bar {
          padding: 1rem;
          border: 1px solid var(--border-subtle);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 0% 0%, rgba(255,255,255,0.06), transparent 30%),
            var(--bg-card);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.5rem;
        }
        .service-info-item {
          min-height: 4.75rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0 0.8rem;
          color: #ef4444;
          border-right: 1px solid var(--border-subtle);
        }
        .service-info-item:last-child {
          border-right: 0;
        }
        .service-info-item strong,
        .service-info-item span {
          display: block;
        }
        .service-info-item strong {
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 900;
        }
        .service-info-item span {
          margin-top: 0.2rem;
          color: var(--text-muted);
          font-size: 0.78rem;
          line-height: 1.35;
        }
        .hero-slide-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          object-position: center;
          will-change: opacity, transform;
        }
        .hero-slide-img-out,
        .hero-slide-img-in {
          position: absolute;
          inset: 0;
        }
        .hero-slide-img-out {
          animation: hero-slide-out 0.7s ease both;
        }
        .hero-slide-img-in {
          animation: hero-slide-in 0.7s ease both;
        }
        .hero-slide-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(5,5,6,0.18), rgba(5,5,6,0.08));
          pointer-events: none;
        }
        @keyframes hero-slide-in {
          from {
            opacity: 0;
            transform: scale(1.015);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes hero-slide-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.992);
          }
        }
        @media (max-width: 980px) {
          .electro-hero-grid, .hero-grid, .service-grid { grid-template-columns: 1fr !important; }
          .electro-departments { order: 2; }
          .electro-main-slide { order: 1; min-height: 28rem !important; }
          .hero-modern { min-height: auto !important; }
          .commerce-showcase { padding: 0 1rem 3rem; }
          .best-seller-panel { --best-card-width: 10.8rem; }
          .store-products-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .service-info-bar { grid-template-columns: 1fr; }
          .service-info-item {
            border-right: 0;
            border-bottom: 1px solid var(--border-subtle);
          }
          .service-info-item:last-child { border-bottom: 0; }
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
            background-color: var(--bg-card);
            overflow: hidden;
            box-shadow: var(--shadow-card);
          }
          .mobile-after-hero-banner img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          .hero-modern { padding: 1rem !important; }
          .electro-departments { display: none !important; }
          .electro-main-slide {
            min-height: 0 !important;
            aspect-ratio: 3 / 4 !important;
            background-color: var(--bg-card) !important;
          }
          .hero-slide-shade {
            background: linear-gradient(180deg, rgba(5,5,6,0.02), rgba(5,5,6,0.16));
          }
          .hero-carousel-controls {
            left: 1rem !important;
            right: 1rem !important;
            bottom: 0.75rem !important;
          }
          .commerce-showcase { padding: 0 0.75rem 2.4rem; }
          .commerce-shell { gap: 0.85rem; }
          .commerce-panel { padding: 1rem; border-radius: 1rem; }
          .commerce-section-head h2 { font-size: 1rem; }
          .top-category-row {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.45rem;
          }
          .top-category-card { min-height: 7.8rem; padding: 0.52rem; border-radius: 0.85rem; }
          .top-category-media { height: 4.7rem; }
          .top-category-media img {
            width: min(100%, 4.8rem);
            height: min(100%, 4.4rem);
          }
          .top-category-card span { font-size: 0.68rem; }
          .best-seller-panel {
            --best-card-width: 8.9rem;
            --best-card-gap: 0.55rem;
          }
          .best-seller-card { min-height: 15.4rem; border-radius: 0.85rem; }
          .best-seller-image { height: 7.4rem; padding: 0.7rem; }
          .wishlist-btn {
            top: 0.55rem;
            right: 0.55rem;
            width: 1.75rem;
            height: 1.75rem;
          }
          .best-seller-info { padding: 0 0.65rem 0.65rem; }
          .best-seller-title { min-height: 2.15rem; font-size: 0.7rem; }
          .best-seller-price { font-size: 0.82rem; }
          .best-seller-meta { font-size: 0.66rem; }
          .best-add-btn {
            width: 1.65rem;
            height: 1.65rem;
            right: 0.55rem;
            bottom: 0.55rem;
          }
          .repair-hero-card {
            min-height: 20rem;
            padding: 1.25rem;
            align-items: end;
            background:
              linear-gradient(180deg, rgba(8,8,9,0.28), rgba(8,8,9,0.96) 62%),
              url("https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&q=80&w=1000");
            background-size: cover;
            background-position: center;
          }
          .repair-points { gap: 0.55rem; }
          .koko-banner-grid {
            display: none;
          }
          .store-products-panel {
            padding: 1rem;
          }
          .store-products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.62rem;
          }
          .store-product-card:nth-child(n+9) {
            display: none;
          }
          .store-product-image {
            height: 8.3rem;
            padding: 0.72rem;
          }
          .store-stock-badge,
          .store-sale-badge {
            top: 0.52rem;
            min-height: 1.15rem;
            padding: 0 0.42rem;
            font-size: 0.5rem;
          }
          .store-stock-badge { left: 0.52rem; }
          .store-sale-badge { right: 0.52rem; }
          .store-product-body {
            padding: 0.72rem;
          }
          .store-product-category {
            font-size: 0.55rem;
          }
          .store-product-title {
            min-height: 2.55rem;
            font-size: 0.74rem;
            line-height: 1.35;
          }
          .store-product-rating {
            margin-top: 0.42rem;
            font-size: 0.64rem;
          }
          .store-product-footer {
            margin-top: 0.58rem;
            gap: 0.45rem;
          }
          .store-product-footer strong {
            font-size: 0.78rem;
          }
          .store-product-footer button {
            width: 1.82rem;
            height: 1.82rem;
            flex-basis: 1.82rem;
          }
          .trust-grid, .repair-grid, .products-grid, .stats-grid { grid-template-columns: 1fr !important; }
          .category-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </div>
  );
}
