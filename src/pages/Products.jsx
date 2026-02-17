import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { categoryAPI } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import '../styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'newest',
    featured: '',
    sale: ''
  });
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  // initialize filters from URL search params (e.g., /products?search=phone&category=electronics)
  useEffect(() => {
    const initial = {};
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const feat = searchParams.get('featured');
    const sale = searchParams.get('sale');

    if (s) initial.search = s;
    if (c) initial.category = c;
    if (min) initial.minPrice = min;
    if (max) initial.maxPrice = max;
    if (sort) initial.sort = sort;
    if (feat) initial.featured = feat;
    if (sale) initial.sale = sale;
    if (Object.keys(initial).length > 0) {
      setFilters((f) => ({ ...f, ...initial }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const { data } = await categoryAPI.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCats();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getProducts(filters);
      setProducts(data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    if (filters.featured === 'true') return 'Featured Products';
    if (filters.sale === 'true') return 'Flash Sale Items';
    if (filters.sort === 'newest' && !filters.search && !filters.category) return 'New Arrivals';
    if (filters.sort === 'best_sellers' && !filters.search && !filters.category) return 'Best Sellers';
    if (filters.category) {
      const cat = categories.find(c => c.slug === filters.category);
      return cat ? `${cat.name} Products` : 'Products';
    }
    if (filters.search) return `Results for "${filters.search}"`;
    return 'All Products';
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 className="page-title">{getPageTitle()}</h1>

      <div className={`products-layout ${filters.sort === 'best_sellers' ? 'full-width-layout' : ''}`}>
        {filters.sort !== 'best_sellers' ? (
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Search</h3>
              <input
                type="text"
                className="form-input"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <span>-</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="filter-section">
              <h3>Sort By</h3>
              <select
                className="form-input"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="best_sellers">Best Sellers</option>
              </select>
            </div>
            <div className="filter-section">
              <h3>Category</h3>
              <select
                className="form-input"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </aside>
        ) : (
          <div className="best-sellers-search" style={{ width: '100%', marginBottom: '24px' }}>
            <div className="search-group" style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Find Best Sellers by Seller Name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ flex: 1, padding: '12px 20px', fontSize: '1.1rem', borderRadius: '30px' }}
              />
            </div>
          </div>
        )}

        <div className={`products-content ${filters.sort === 'best_sellers' ? 'full-width' : ''}`}>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="grid grid-3">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.slug}`}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={product.primary_image || `https://picsum.photos/300/250?random=${product.id}`}
                        alt={product.name}
                        className="product-image"
                      />
                      {product.discount_price && (
                        <div className="product-badge">
                          {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category">{product.category_name}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="text-gray">({product.review_count || 0})</span>
                      </div>
                      <div className="product-price">
                        <span className="price-current">ETB {product.discount_price || product.price}</span>
                        {product.discount_price && (
                          <span className="price-original">ETB {product.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="product-info">
                    <div className="product-actions">
                      <button
                        className="btn-cart"
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity === 0}
                        title={product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      >
                        Add to Cart
                      </button>
                      <button
                        className={`btn-wishlist ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        style={{ color: isInWishlist(product.id) ? '#ff4d4d' : 'inherit' }}
                      >
                        {isInWishlist(product.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
