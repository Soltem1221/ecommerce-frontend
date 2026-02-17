import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import { NotificationContext } from '../../context/NotificationContext';
import '../../styles/dashboard.css';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await productAPI.getProducts({ limit: 50 });
        if (mounted) setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await productAPI.deleteProduct(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      showNotification('Product deleted successfully', 'success');
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product', err);
      showNotification('Failed to delete product. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">📊 Seller Panel</div>
        <nav className="dashboard-nav">
          <Link to="/seller/dashboard" className="nav-item">
            <span>📈</span> Dashboard
          </Link>
          <Link to="/seller/products" className="nav-item active">
            <span>📦</span> Products
          </Link>
          <Link to="/seller/add-product" className="nav-item">
            <span>➕</span> Add Product
          </Link>
          <Link to="/seller/orders" className="nav-item">
            <span>🛍️</span> Orders
          </Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Products</h1>
          <Link to="/seller/add-product" className="btn btn-primary">➕ Add Product</Link>
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
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-product">
                        <img src={p.primary_image || `https://picsum.photos/50/50?random=${p.id}`} alt={p.name} />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.sku || '-'}</td>
                    <td>ETB {p.price}</td>
                    <td><span className={p.stock_quantity > 10 ? 'badge badge-success' : 'badge badge-warning'}>{p.stock_quantity}</span></td>
                    <td><span className={p.is_active ? 'badge badge-success' : 'badge badge-danger'}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/seller/edit-product/${p.slug}`); }}
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmDelete(p); }}
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <div className="modal-header">
              <h3>Delete Product</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
