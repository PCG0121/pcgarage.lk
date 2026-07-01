import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingCart, Wrench, X, Cpu, ChevronRight, MapPin, Phone } from 'lucide-react';
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

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
        fontSize: '0.78rem',
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0.55rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
            <Wrench size={14} color="var(--red-bright)" />
            Same-day diagnostics and trusted PC repairs
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.9rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={13} /> Kurunegala
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={13} /> +94 70 000 0000
            </span>
          </span>
        </div>
      </div>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ height: '4.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', minWidth: 0 }}>
              <div style={{
                width: '2.55rem',
                height: '2.55rem',
                borderRadius: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                boxShadow: '0 12px 30px rgba(239,68,68,0.22)',
                flexShrink: 0,
              }}>
                <Cpu size={19} color="white" />
              </div>
              <div style={{ lineHeight: 1.08, minWidth: 0 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 0 }}>
                  PC Garage
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Hardware and repair store
                </div>
              </div>
            </Link>

            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.7rem' }}>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              {searchOpen && (
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products"
                  className="input-dark"
                  style={{ width: '12.5rem', height: '2.55rem', padding: '0 0.9rem' }}
                />
              )}

              <button
                onClick={() => setSearchOpen((value) => !value)}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
                style={{
                  width: '2.55rem',
                  height: '2.55rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  background: '#ffffff',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {searchOpen ? <X size={17} /> : <Search size={17} />}
              </button>

              <Link
                to="/cart"
                aria-label="Open cart"
                style={{
                  width: '2.55rem',
                  height: '2.55rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  background: '#ffffff',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  position: 'relative',
                }}
              >
                <ShoppingCart size={17} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-0.35rem',
                    right: '-0.35rem',
                    minWidth: '1.15rem',
                    height: '1.15rem',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    border: '2px solid #ffffff',
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                id="mobile-menu-btn"
                onClick={() => setIsMenuOpen((value) => !value)}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
                style={{
                  width: '2.55rem',
                  height: '2.55rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  background: '#ffffff',
                  color: 'var(--text-secondary)',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(255,255,255,0.98)',
            padding: '0.75rem 1.5rem 1rem',
          }}>
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

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <footer style={{
        background: '#ffffff',
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
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
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
        @media (max-width: 820px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          header input { width: 9rem !important; }
        }
      `}</style>
    </div>
  );
}
