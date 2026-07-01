import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { Plus, Search, SlidersHorizontal, X, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';

// Toast
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast-container">
      <div className="toast animate-toast-in">
        <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>Added to Cart!</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message}</div>
        </div>
        <button onClick={onClose} style={{ marginLeft: 'auto', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>x</button>
      </div>
    </div>
  );
}

export function ProductList() {
  const addItem = useCartStore((state) => state.addItem);
  const products = useProductStore((state) => state.products);
  const categories = useProductStore((state) => state.categories.map((category) => category.name));
  const loadProducts = useProductStore((state) => state.loadProducts);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setToast(product.name);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory);
    if (search.trim()) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <div style={{ flex: 1, background: 'var(--bg-base)', minHeight: '60vh' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(239,68,68,0.05) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.5rem 2rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: '0.5rem' }}>All Hardware</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
              Products{' '}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: 0 }}>
                {filteredProducts.length} items
              </span>
            </h1>

            {/* Search & Sort */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  id="product-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-dark"
                  style={{ paddingLeft: '2.25rem', width: '200px', padding: '0.5rem 0.875rem 0.5rem 2.25rem', borderRadius: '0.625rem' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div style={{ position: 'relative' }}>
                <SlidersHorizontal size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.625rem',
                    color: 'var(--text-primary)',
                    padding: '0.5rem 0.875rem 0.5rem 2.25rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    minWidth: '140px',
                  }}
                >
                  <option value="default">Default Sort</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '2rem', scrollbarWidth: 'none' }}>
          <button
            id="filter-all"
            onClick={() => setSelectedCategory('All')}
            className={`filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '5rem', height: '5rem', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={30} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Try a different search or category filter.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="btn-outline-glow"
              style={{ marginTop: '0.5rem' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="product-card animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s`, animationFillMode: 'both' }}
              >
                <Link to={`/product/${product.slug || product.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: '#f1f5f9' }}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.85, transition: 'all 0.5s ease' }}
                    className="product-img"
                  />
                  <div style={{ position: 'absolute', top: '0.625rem', left: '0.625rem' }}>
                    {product.in_stock
                      ? <span className="badge-green">In Stock</span>
                      : <span style={{ background: 'rgba(30,30,40,0.9)', color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>Out of Stock</span>
                    }
                  </div>
                </Link>

                <div style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{product.category}</div>
                  <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h4>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.875rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <button
                      id={`add-cart-${product.id}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                      style={{
                        width: '2.25rem', height: '2.25rem',
                        background: product.in_stock ? '#fff1f2' : '#f8fafc',
                        border: `1px solid ${product.in_stock ? 'rgba(225,29,72,0.22)' : 'var(--border-subtle)'}`,
                        borderRadius: '0.625rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: product.in_stock ? '#ef4444' : 'var(--text-muted)',
                        cursor: product.in_stock ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        opacity: product.in_stock ? 1 : 0.5,
                      }}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-card:hover .product-img { opacity: 1 !important; transform: scale(1.04); }
        @media (max-width: 640px) {
          #product-search { width: 100% !important; }
        }
        select option { background: #ffffff; color: #0f172a; }
      `}</style>
    </div>
  );
}
