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

      <footer className="site-footer">
        <div className="footer-shell">
          <div className="footer-main">
            <Link to="/" className="footer-brand" aria-label="PC Garage home">
              <span className="footer-brand-mark">
                <img src="/pc-garage-logo.png" alt="" aria-hidden="true" />
              </span>
              <span>
                <strong>PC Garage</strong>
                <small>Kurunegala, Sri Lanka</small>
              </span>
            </Link>

            <p className="footer-copy">
              Laptop parts, repairs, upgrades, and island-wide delivery with practical support.
            </p>

            <div className="footer-contact">
              <a href="tel:+94700000000">+94 70 000 0000</a>
              <a href="mailto:pcgarage012@gmail.com">pcgarage012@gmail.com</a>
            </div>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            {[
              ['Home', '/'],
              ['Products', '/products'],
              ['Categories', '/categories'],
              ['Cart', '/cart'],
            ].map(([label, to]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>Copyright {new Date().getFullYear()} PC Garage.</span>
          <span>Genuine parts. Clear repairs. Fast delivery.</span>
        </div>
      </footer>

      <style>{`
        .site-footer {
          margin-top: auto;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0)),
            #070708;
          border-top: 1px solid var(--border-subtle);
        }

        .footer-shell {
          width: min(80rem, calc(100% - 3rem));
          margin: 0 auto;
          padding: 2rem 0 1.35rem;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 2rem;
        }

        .footer-main {
          min-width: 0;
        }

        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: #ffffff;
          text-decoration: none;
        }

        .footer-brand-mark {
          width: 3.5rem;
          height: 2.4rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .footer-brand-mark img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.34));
        }

        .footer-brand strong,
        .footer-brand small {
          display: block;
        }

        .footer-brand strong {
          font-size: 0.98rem;
          font-weight: 950;
          line-height: 1.15;
        }

        .footer-brand small {
          margin-top: 0.16rem;
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 750;
        }

        .footer-copy {
          max-width: 34rem;
          margin: 1rem 0 0;
          color: var(--text-muted);
          font-size: 0.86rem;
          line-height: 1.7;
        }

        .footer-contact {
          margin-top: 1.1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .footer-contact a,
        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }

        .footer-contact a {
          min-height: 2.2rem;
          display: inline-flex;
          align-items: center;
          padding: 0 0.85rem;
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          background: rgba(255,255,255,0.035);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .footer-contact a:hover,
        .footer-links a:hover {
          color: #ffffff;
          border-color: rgba(239,68,68,0.45);
          background: rgba(239,68,68,0.10);
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 0.45rem;
        }

        .footer-links a {
          min-height: 2.35rem;
          display: inline-flex;
          align-items: center;
          padding: 0 0.9rem;
          border: 1px solid transparent;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 850;
        }

        .footer-bottom {
          width: min(80rem, calc(100% - 3rem));
          margin: 0 auto;
          padding: 1rem 0 1.2rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
        }

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
          .footer-shell {
            width: calc(100% - 2rem);
            grid-template-columns: 1fr;
            gap: 1.25rem;
            padding-top: 1.6rem;
          }

          .footer-links {
            justify-content: flex-start;
          }

          .footer-bottom {
            width: calc(100% - 2rem);
          }
        }
      `}</style>
    </div>
  );
}
