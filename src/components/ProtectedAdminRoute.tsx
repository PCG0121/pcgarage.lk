import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';

export function ProtectedAdminRoute() {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const isLoading = useAdminAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: 700 }}>
        Checking admin access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
