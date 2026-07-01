import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { useAdminAuthStore } from './store/adminAuthStore';
import { useProductStore } from './store/productStore';

// Public pages
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';

// Admin pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';

export default function App() {
  const loadProducts = useProductStore((state) => state.loadProducts);
  const initializeAdmin = useAdminAuthStore((state) => state.initialize);

  useEffect(() => {
    loadProducts();
    initializeAdmin();
  }, [initializeAdmin, loadProducts]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/*" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
