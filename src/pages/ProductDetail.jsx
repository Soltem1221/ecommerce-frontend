import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showZoom, setShowZoom] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const { data } = await productAPI.getProduct(slug);
      setProduct(data.product);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product) return;
    const loadRelated = async () => {
      try {
        const { data } = await productAPI.getProducts({ category: product.category_id, limit: 6 });
        const others = data.products?.filter(p => p.id !== product.id) || [];
        setRelatedProducts(others);
      } catch (err) {
        console.error('Error loading related products', err);
      }
    };
    loadRelated();
  }, [product]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!product) {
    return <div className="container" style={{ padding: '48px 20px', textAlign: 'center' }}>
      <h2>Product not found</h2>
    </div>;
  }

  const images = product.images?.length > 0 ? product.images : [{ image_url: 'https://picsum.photos/600/400?random=1' }];
  const getDisplayedPrice = () => {
    if (selectedVariant && selectedVariant.price) return selectedVariant.price;
    return product.discount_price || product.price;
  };

  const formatCurrency = (value) => {
    if (value == null) return '';
    try {
      return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB', minimumFractionDigits: 2 }).format(value);
    } catch (e) {
      return `ETB ${value}`;
    }
  };

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
      </div>

      <div className="product-detail-layout">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={images[selectedImage]?.image_url || images[0].image_url}
              alt={product.name}
              onClick={() => setShowZoom(true)}
              style={{ cursor: 'zoom-in' }}
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.image_url}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta">
            <div className="product-rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span>{product.avg_rating || 5.0}</span>
              <span className="text-gray">({product.review_count || 0} reviews)</span>
            </div>
            <div className="product-sku">SKU: {product.sku}</div>
          </div>

          <div className="product-price-section">
            <div className="price-large">{formatCurrency(getDisplayedPrice())}</div>
            {product.discount_price && (
              <>
                <div className="price-original-large">{formatCurrency(product.price)}</div>
                <div className="discount-badge">
                  Save {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </div>
              </>
            )}
          </div>

          <div className="stock-status">
            {product.stock_quantity > 0 ? (
              <span className="badge badge-success">✓ In Stock ({product.stock_quantity} available)</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.variants?.length > 0 && (
            <div className="product-variants">
              <h3>Available Options</h3>
              <div className="variant-list">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`variant-item ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                    type="button"
                  >
                    <span>{variant.variant_name}: {variant.variant_value}</span>
                    <span>{formatCurrency(variant.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="product-actions-detail">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                const cartProduct = {
                  id: selectedVariant?.id || product.id,
                  name: product.name,
                  price: selectedVariant?.price || product.price,
                  discount_price: product.discount_price,
                  primary_image: images[0].image_url,
                  slug: product.slug
                };
                addToCart(cartProduct, quantity);
              }}
              title={product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              disabled={product.stock_quantity === 0}
            >
              🛒 Add to Cart
            </button>
            <button
              className="btn btn-lg"
              onClick={() => toggleWishlist(product.id)}
              style={{
                backgroundColor: isInWishlist(product.id) ? '#ff4d4d' : 'transparent',
                color: isInWishlist(product.id) ? 'white' : 'inherit',
                borderColor: isInWishlist(product.id) ? '#ff4d4d' : 'var(--primary)'
              }}
            >
              {isInWishlist(product.id) ? 'Saved' : '❤️ Add to Wishlist'}
            </button>
          </div>

          <div className="seller-info">
            <h3>Seller Information</h3>
            <div className="seller-card">
              <div className="seller-name">👤 {product.seller_name}</div>
              <Link to={`/seller/${product.seller_id}`} className="btn btn-sm btn-outline">
                View Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <div className="review-author">{review.user_name}</div>
                    <div className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                  <div className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                {review.title && <h4>{review.title}</h4>}
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {relatedProducts?.length > 0 && (
        <div className="related-section" style={{ marginTop: '48px' }}>
          <h2>Related Products</h2>
          <div className="grid grid-4" style={{ marginTop: '16px' }}>
            {relatedProducts.map((p) => (
              <div key={p.id} className="card">
                <Link to={`/products/${p.slug}`}>
                  <img src={p.primary_image || (p.images?.[0]?.image_url) || ('https://picsum.photos/300/200?random=' + p.id)} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                </Link>
                <div style={{ padding: '12px' }}>
                  <Link to={`/products/${p.slug}`}>
                    <h4 style={{ marginBottom: '8px' }}>{p.name}</h4>
                  </Link>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(p.discount_price || p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showZoom && (
        <div className="image-zoom-modal" onClick={() => setShowZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <img src={images[selectedImage]?.image_url || images[0].image_url} alt={product.name} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
