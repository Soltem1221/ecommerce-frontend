import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { categoryAPI } from '../utils/api';
import { NotificationContext } from '../context/NotificationContext';
import '../styles/dashboard.css';

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const [numericId, setNumericId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    brandId: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    weight: '',
    dimensions: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await categoryAPI.getCategories();
        setCategories(data.categories || []);

        if (isEdit) {
          const res = await productAPI.getProduct(id);
          const p = res.data.product;
          setNumericId(p.id);
          setFormData({
            name: p.name,
            description: p.description,
            categoryId: String(p.category_id),
            brandId: p.brand_id || '',
            price: p.price,
            discountPrice: p.discount_price || '',
            stockQuantity: p.stock_quantity,
            weight: p.weight?.split(' ')[0] || '',
            weightUnit: p.weight?.split(' ')[1] || 'kg',
            dimensions: p.dimensions?.split(' ')[0] || '',
            dimensionUnit: p.dimensions?.split(' ')[1] || 'cm'
          });
        } else if (!formData.categoryId && data.categories && data.categories.length > 0) {
          setFormData((f) => ({ ...f, categoryId: String(data.categories[0].id) }));
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        weight: formData.weight ? `${formData.weight} ${formData.weightUnit || 'kg'}` : '',
        dimensions: formData.dimensions ? `${formData.dimensions} ${formData.dimensionUnit || 'cm'}` : ''
      };

      if (isEdit) {
        await productAPI.updateProduct(numericId, payload);
        showNotification('Product updated successfully', 'success');
      } else {
        await productAPI.createProduct(payload);
        showNotification('Product created successfully', 'success');
      }
      navigate('/seller/products');
    } catch (err) {
      const resp = err.response?.data;
      let message = isEdit ? 'Failed to update product' : 'Failed to create product';
      if (resp) {
        if (resp.message) message = resp.message;
        else if (resp.error) message = resp.error;
        else if (Array.isArray(resp.errors)) message = resp.errors.map(e => e.msg || e.message || e).join('; ');
      }
      showNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">📊 Seller Panel</div>
        <nav className="dashboard-nav">
          <Link to="/seller/dashboard" className="nav-item">
            <span>📈</span> Dashboard
          </Link>
          <Link to="/seller/products" className="nav-item">
            <span>📦</span> Products
          </Link>
          <Link to="/seller/add-product" className={`nav-item ${!isEdit ? 'active' : ''}`}>
            <span>➕</span> Add Product
          </Link>
          {isEdit && (
            <Link to="#" className="nav-item active">
              <span>✏️</span> Edit Product
            </Link>
          )}
          <Link to="/seller/orders" className="nav-item">
            <span>🛍️</span> Orders
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="5"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Pricing & Inventory</h3>

              <div className="grid grid-3">
                <div className="form-group">
                  <label className="form-label">Price (ETB) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Price (ETB)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Shipping Information</h3>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Weight</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder="Amount"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      min="0"
                      step="0.01"
                    />
                    <select
                      className="form-input"
                      style={{ width: '80px' }}
                      value={formData.weightUnit || 'kg'}
                      onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dimensions (L x W x H)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder="e.g., 30 x 20 x 10"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    />
                    <select
                      className="form-input"
                      style={{ width: '80px' }}
                      value={formData.dimensionUnit || 'cm'}
                      onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="inch">in</option>
                      <option value="mm">mm</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/seller/products')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
