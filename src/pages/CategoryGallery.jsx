import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import '../styles/home.css';
import { productAPI } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CategoryGallery = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // backend accepts category slug now
        const { data } = await productAPI.getProducts({ category: slug, limit: 24 });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error loading category products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="section-title">{slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Category'}</h2>
        <Link to="/" className="btn btn-outline">Back</Link>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : products.length === 0 ? (
        <p>No products available for this category.</p>
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
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category_name}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span className="price-current">ETB {product.discount_price || product.price}</span>
                    {product.discount_price && <span className="price-original">ETB {product.price}</span>}
                  </div>
                </div>
              </Link>
              <div className="product-info">
                <div className="product-actions">
                  <button
                    className="btn-cart"
                    onClick={() => addToCart(product)}
                    title="Add to Cart"
                  >
                    Add to Cart
                  </button>
                  <button className="btn-wishlist">❤️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGallery;
