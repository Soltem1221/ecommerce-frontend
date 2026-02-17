import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import '../styles/dashboard.css';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await productAPI.getProducts({ limit: 10 });
      setProducts(data.products);
      setStats({
        totalProducts: data.total || 0,
        totalOrders: 45,
        totalRevenue: 125000,
        pendingOrders: 8
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">📊 Seller Panel</div>
        <nav className="dashboard-nav">
          <Link to="/seller/dashboard" className="nav-item active">
            <span>📈</span> Dashboard
          </Link>
          <Link to="/seller/products" className="nav-item">
            <span>📦</span> Products
          </Link>
          <Link to="/seller/add-product" className="nav-item">
            <span>➕</span> Add Product
          </Link>
          <Link to="/seller/orders" className="nav-item">
            <span>🛍️</span> Orders
          </Link>
          <Link to="/seller/earnings" className="nav-item">
            <span>💰</span> Earnings
          </Link>
          <Link to="/seller/settings" className="nav-item">
            <span>⚙️</span> Settings
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <Link to="/seller/add-product" className="btn btn-primary">
            ➕ Add New Product
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: '#e0e7ff'}}>📦</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#fef3c7'}}>🛍️</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#d1fae5'}}>💰</div>
            <div className="stat-details">
              <div className="stat-value">ETB {stats.totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#fee2e2'}}>⏳</div>
            <div className="stat-details">
              <div className="stat-value">{stats.pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="table-product">
                          <img src={product.primary_image || `https://picsum.photos/50/50?random=${product.id}`} alt={product.name} />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.sku}</td>
                      <td>ETB {product.price}</td>
                      <td>
                        <span className={product.stock_quantity > 10 ? 'badge badge-success' : 'badge badge-warning'}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td>
                        <span className={product.is_active ? 'badge badge-success' : 'badge badge-danger'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-icon" title="Edit">✏️</button>
                          <button className="btn-icon" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
