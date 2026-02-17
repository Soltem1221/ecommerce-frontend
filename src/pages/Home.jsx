import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// Use real category images from Unsplash by query (falls back to random relevant images)
import { productAPI, categoryAPI } from "../utils/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [flashItems, setFlashItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [
        { data: pData },
        { data: fData },
        { data: nData },
        { data: bData },
        { data: sData },
        { data: cData },
      ] = await Promise.all(
        [
          productAPI.getProducts({ limit: 12 }),
          productAPI.getProducts({ featured: true, limit: 8 }),
          productAPI.getProducts({ sort: "newest", limit: 8 }),
          productAPI.getProducts({ sort: "best_sellers", limit: 8 }),
          productAPI.getProducts({ sale: true, limit: 8 }),
          categoryAPI.getCategories(),
        ].map((p) => (p.catch ? p : p)),
      );

      setProducts(pData?.products || []);
      setCategories(cData?.categories || []);
      setFeatured(
        fData?.products ||
        (pData?.products || []).filter((p) => p.is_featured).slice(0, 8),
      );
      setNewArrivals(
        nData?.products ||
        (pData?.products || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8),
      );
      setBestSellers(
        bData?.products ||
        (pData?.products || [])
          .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
          .slice(0, 8),
      );
      setFlashItems(
        sData?.products ||
        (pData?.products || []).filter((p) => p.on_sale).slice(0, 8),
      );
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };



  const banners = [
    {
      id: 1,
      title: "Big Summer Sale",
      subtitle: "Up to 50% off selected items",
      image: `https://picsum.photos/1200/300?random=11`,
      link: "/products?promo=summer",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh products every week",
      image: `https://picsum.photos/1200/300?random=12`,
      link: "/products?sort=newest",
    },
  ];

  const formatCurrency = (value) => {
    if (value == null) return "";
    try {
      return new Intl.NumberFormat("en-ET", {
        style: "currency",
        currency: "ETB",
        minimumFractionDigits: 2,
      }).format(value);
    } catch (e) {
      return `ETB ${value}`;
    }
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Welcome to ShopHub Marketplace</h1>
          <p>Discover amazing products from trusted sellers</p>
          <div className="hero-buttons">
            <Link
              to="/products"
              className="btn btn-lg"
              style={{ background: "white", color: "var(--primary)" }}
            >
              Shop Now
            </Link>
            <Link
              to="/register?role=seller"
              className="btn btn-lg btn-outline"
              style={{ borderColor: "white", color: "white" }}
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                to={`/category/${category.slug}`}
                key={category.id || index}
                className="category-card"
              >
                <div className="category-icon">
                  <img
                    src={category.image_url || `https://source.unsplash.com/600x400/?${category.name.replace(/\s+/g, ',')}`}
                    alt={category.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=" + category.name;
                    }}
                  />
                </div>
                <div className="category-name">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="promo-banners">
        <div className="container">
          {banners.map((b) => (
            <Link to={b.link} key={b.id} className="promo-card">
              <img src={b.image} alt={b.title} loading="lazy" />
              <div className="promo-text">
                <h3>{b.title}</h3>
                <p>{b.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Featured Products
            </h2>
            <Link to="/products?featured=true" className="btn btn-outline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-4">
              {featured.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.slug}`}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          product.primary_image ||
                          `https://picsum.photos/300/250?random=${product.id}`
                        }
                        alt={product.name}
                        className="product-image"
                      />
                      {product.discount_price && (
                        <div className="product-badge">
                          {Math.round(
                            ((product.price - product.discount_price) /
                              product.price) *
                            100,
                          )}
                          % OFF
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category">
                        {product.category_name}
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="text-gray">
                          ({product.review_count || 0})
                        </span>
                      </div>
                      <div className="product-price">
                        <span className="price-current">
                          {formatCurrency(
                            product.discount_price || product.price,
                          )}
                        </span>
                        {product.discount_price && (
                          <span className="price-original">
                            ETB {product.price}
                          </span>
                        )}
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
          ) : (
            <div className="empty-state">
              <p>No featured products found.</p>
            </div>
          )}
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products?sort=newest" className="btn btn-outline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-4">
              {newArrivals.map((p) => (
                <div key={p.id} className="product-card">
                  <Link to={`/products/${p.slug}`}>
                    <img
                      src={
                        p.primary_image ||
                        `https://picsum.photos/300/200?random=${p.id}`
                      }
                      alt={p.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <div className="product-category">{p.category_name}</div>
                      <h3 className="product-name">{p.name}</h3>
                      <div className="product-price">
                        {formatCurrency(p.discount_price || p.price)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No new arrivals yet.</p>
          )}
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/products?sort=best_sellers" className="btn btn-outline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : bestSellers.length > 0 ? (
            <div className="grid grid-4">
              {bestSellers.map((p) => (
                <div key={p.id} className="product-card">
                  <Link to={`/products/${p.slug}`}>
                    <img
                      src={
                        p.primary_image ||
                        `https://picsum.photos/300/200?random=${p.id}`
                      }
                      alt={p.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <div className="product-category">{p.category_name}</div>
                      <h3 className="product-name">{p.name}</h3>
                      <div className="product-price">
                        {formatCurrency(p.discount_price || p.price)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No best sellers yet.</p>
          )}
        </div>
      </section>

      {flashItems.length > 0 && (
        <section className="flash-sale">
          <div className="container" style={{ textAlign: "center" }}>
            <h2 className="section-title" style={{ color: "white", marginBottom: 24 }}>⚡ Flash Sale</h2>

            <div className="flash-timer" style={{ marginBottom: 32, justifyContent: "center" }}>
              <div className="timer-box">
                <span className="timer-value">12</span>
                <span className="timer-label">Hours</span>
              </div>
              <div className="timer-box">
                <span className="timer-value">34</span>
                <span className="timer-label">Minutes</span>
              </div>
              <div className="timer-box">
                <span className="timer-value">56</span>
                <span className="timer-label">Seconds</span>
              </div>
            </div>

            <div className="grid grid-4" style={{ marginBottom: 32, textAlign: "left" }}>
              {flashItems.map((p) => (
                <div key={p.id} className="product-card">
                  <Link to={`/products/${p.slug}`}>
                    <img
                      src={
                        p.primary_image ||
                        `https://picsum.photos/300/200?random=${p.id}`
                      }
                      alt={p.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h3 className="product-name">{p.name}</h3>
                      <div className="product-price">
                        {formatCurrency(p.discount_price || p.price)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <Link
              to="/products?sale=true"
              className="btn btn-lg"
              style={{ background: "white", color: "var(--primary)" }}
            >
              Shop All Deals
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
