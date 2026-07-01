import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Package, ShoppingBag, LayoutDashboard, LogOut, Cpu } from 'lucide-react';
import { useAdminAuthStore } from '../store/adminAuthStore';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '16rem',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '1.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '0.625rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(239,68,68,0.3)',
            }}>
              <Cpu size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>PC GARAGE</div>
              <div style={{ fontSize: '0.55rem', color: '#ef4444', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="admin-sidebar-link"
                style={isActive ? {
                  background: 'rgba(239,68,68,0.12)',
                  color: '#f87171',
                  borderLeft: '2px solid #ef4444',
                  paddingLeft: 'calc(1rem - 2px)',
                } : {}}
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem 0.875rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 1rem', width: '100%', borderRadius: '0.75rem',
              fontSize: '0.875rem', fontWeight: 500,
              color: 'var(--text-muted)', background: 'none', border: 'none',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            className="logout-btn"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <header style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          height: '3.5rem',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }} className="admin-mobile-header">
          <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            PC GARAGE<span style={{ color: '#ef4444' }}>.</span>
          </div>
          <button onClick={handleLogout} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-header { display: flex !important; }
        }
        .logout-btn:hover { background: rgba(239,68,68,0.06) !important; color: var(--text-secondary) !important; }
      `}</style>
    </div>
  );
}
