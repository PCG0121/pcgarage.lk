import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X, Cpu, ChevronRight, Home as HomeIcon, Package, Grid3X3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Categories' },
    { to: '/products', label: 'Products' },
  ];

  const bottomNavLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/categories', label: 'Categories', icon: Grid3X3 },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
  ];

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : path === '/products'
        ? location.pathname.startsWith('/products') || location.pathname.startsWith('/product')
        : location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <header className="site-header">
        <div className="site-header-shell">
          <div className="site-header-row">
            <Link to="/" className="site-brand" aria-label="PC Garage home">
              <img
                src="/pc-garage-logo.png"
                alt="PC Garage"
                className="site-logo-img"
              />
              <span className="site-brand-text">PC Garage</span>
            </Link>

            <nav className="desktop-nav header-nav" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="header-actions">
              <Link to="/products" className="header-cta">
                Shop Now
              </Link>

              {searchOpen && (
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products"
                  className="input-dark header-search-input"
                />
              )}

              <button
                onClick={() => setSearchOpen((value) => !value)}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                className="header-icon-btn"
              >
                {searchOpen ? <X size={17} /> : <Search size={17} />}
              </button>

              <Link
                to="/cart"
                aria-label="Open cart"
                className="header-icon-btn"
              >
                <ShoppingCart size={17} />
                {cartCount > 0 && (
                  <span className="header-cart-badge">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                id="mobile-menu-btn"
                onClick={() => setIsMenuOpen((value) => !value)}
                className="mobile-menu-btn header-icon-btn"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mobile-header-panel">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  minHeight: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: isActive(link.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 800,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {link.label}
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="site-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <nav className="mobile-bottom-nav" aria-label="Mobile primary navigation">
        {bottomNavLinks.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);

          return (
            <Link key={to} to={to} className={`bottom-nav-link ${active ? 'active' : ''}`} aria-label={label}>
              <span className="bottom-nav-icon">
                <Icon size={20} />
                {to === '/cart' && cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="site-footer" style={{
        background: '#080809',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '2.7rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) repeat(3, minmax(9rem, 1fr))',
          gap: '2rem',
        }} className="footer-grid">
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: '2.3rem',
                height: '2.3rem',
                borderRadius: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ef4444, #7f1d1d)',
              }}>
                <Cpu size={18} color="white" />
              </div>
              <div style={{ fontWeight: 900, color: 'var(--text-primary)' }}>PC Garage</div>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.7, maxWidth: '26rem', margin: 0 }}>
              PC components, laptop repairs, upgrades, and reliable service from Kurunegala.
            </p>
          </div>

          <div>
            <h4 className="section-label" style={{ margin: '0 0 1rem' }}>Shop</h4>
            {[
              ['Products', '/products'],
              ['Categories', '/categories'],
              ['Cart', '/cart'],
            ].map(([label, to]) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
                {label}
              </Link>
            ))}
          </div>

          <div>
            <h4 className="section-label" style={{ margin: '0 0 1rem' }}>Services</h4>
            {['Laptop repair', 'SSD upgrades', 'Battery replacement'].map((label) => (
              <div key={label} style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
                {label}
              </div>
            ))}
          </div>

          <div>
            <h4 className="section-label" style={{ margin: '0 0 1rem' }}>Contact</h4>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.8 }}>
              Kurunegala, Sri Lanka<br />
              +94 70 000 0000<br />
              pcgarage012@gmail.com
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '1rem 1.5rem 1.35rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
        }}>
          <span>Copyright {new Date().getFullYear()} PC Garage. All rights reserved.</span>
          <span>WhatsApp orders and island-wide delivery available</span>
        </div>
      </footer>

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          left: 50%;
          right: auto;
          bottom: max(0.85rem, env(safe-area-inset-bottom));
          z-index: 80;
          width: min(34rem, calc(100vw - 1.5rem));
          transform: translateX(-50%);
          display: none;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.25rem;
          padding: 0.45rem;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 1.15rem;
          background: rgba(12,12,14,0.96);
          box-shadow: 0 18px 44px rgba(15,23,42,0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .bottom-nav-link {
          min-width: 0;
          min-height: 3.65rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.18rem;
          border-radius: 0.85rem;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.66rem;
          font-weight: 850;
          line-height: 1;
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
        }

        .bottom-nav-link.active {
          color: #ffffff;
          background: #dc2626;
        }

        .bottom-nav-link:active {
          transform: scale(0.97);
        }

        .bottom-nav-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-cart-badge {
          position: absolute;
          top: -0.55rem;
          right: -0.7rem;
          min-width: 1rem;
          height: 1rem;
          padding: 0 0.25rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ef4444;
          color: #ffffff;
          border: 2px solid #ffffff;
          font-size: 0.58rem;
          font-weight: 900;
        }

        @media (max-width: 900px) {
          .site-main,
          .site-footer {
            padding-bottom: 5.8rem !important;
          }

          .mobile-bottom-nav {
            display: grid;
            left: 0.75rem;
            right: 0.75rem;
            width: auto;
            bottom: max(0.75rem, env(safe-area-inset-bottom));
            transform: none;
          }
        }

        @media (max-width: 820px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
