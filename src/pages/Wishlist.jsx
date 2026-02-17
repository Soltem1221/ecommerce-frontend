import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import '../styles/cart.css';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const moveToCart = (item) => {
    addToCart({
      id: item.product_id,
      name: item.name,
      price: item.price,
      discount_price: item.discount_price,
      primary_image: item.image,
      slug: item.slug
    });
    removeFromWishlist(item.product_id);
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '48px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--gray)' }}>Your wishlist is empty</h2>
          <p style={{ marginBottom: '24px', color: 'var(--gray)' }}>
            Save items you love for later
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-4">
          {wishlist.map((item) => (
            <div key={item.id} className="card">
              <Link to={`/products/${item.slug}`}>
                <img
                  src={item.image || 'https://picsum.photos/300/200?random=' + item.product_id}
                  alt={item.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </Link>
              <div style={{ padding: '16px' }}>
                <Link to={`/products/${item.slug}`}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>{item.name}</h3>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                    ETB {item.discount_price || item.price}
                  </span>
                  {item.discount_price && (
                    <span style={{ fontSize: '14px', color: 'var(--gray)', textDecoration: 'line-through' }}>
                      ETB {item.price}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => moveToCart(item)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="btn btn-sm"
                    style={{ background: 'var(--light-gray)', color: 'var(--gray)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
