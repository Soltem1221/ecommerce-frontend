import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { OrderContext } from '../context/OrderContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { ordersCount } = useContext(OrderContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            🛍️ ShopHub
          </Link>

          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/products?search=${encodeURIComponent(query)}`); }}
            />
            <button onClick={() => navigate(`/products?search=${encodeURIComponent(query)}`)}>Search</button>
          </div>

          <ul className="navbar-menu">
            {user ? (
              <>
                <li className="navbar-icon">
                  <Link to="/wishlist">
                    ❤️ Wishlist
                    {wishlist.length > 0 && (
                      <span className="navbar-badge">{wishlist.length}</span>
                    )}
                  </Link>
                </li>
                <li className="navbar-icon">
                  <Link to="/cart">
                    🛒 Cart
                    {getCartCount() > 0 && (
                      <span className="navbar-badge">{getCartCount()}</span>
                    )}
                  </Link>
                </li>
                <li className="navbar-icon">
                  <Link to="/orders">
                    📦 Orders
                    {ordersCount > 0 && (
                      <span className="navbar-badge">{ordersCount}</span>
                    )}
                  </Link>
                </li>
                {user.role === 'seller' && (
                  <li>
                    <Link to="/seller/dashboard">📊 Dashboard</Link>
                  </li>
                )}
                <li className="navbar-user">
                  <Link to="/profile/settings" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                        alt="Profile"
                        className="navbar-avatar"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="navbar-avatar">{user.name[0].toUpperCase()}</div>
                    )}
                    <span>{user.name}</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-sm btn-secondary">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-search">
          <input
            type="text"
            placeholder="Search products..."
            value={mobileQuery}
            onChange={(e) => setMobileQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { navigate(`/products?search=${encodeURIComponent(mobileQuery)}`); setMobileMenuOpen(false); } }}
          />
        </div>
        <ul className="mobile-menu-list">
          {user ? (
            <>
              <li>
                <Link to="/wishlist" onClick={closeMobileMenu}>
                  ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={closeMobileMenu}>
                  🛒 Cart {getCartCount() > 0 && `(${getCartCount()})`}
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={closeMobileMenu}>
                  📦 Orders {ordersCount > 0 && `(${ordersCount})`}
                </Link>
              </li>
              {user.role === 'seller' && (
                <li>
                  <Link to="/seller/dashboard" onClick={closeMobileMenu}>
                    📊 Seller Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/profile/settings" onClick={closeMobileMenu}>
                  ⚙️ Profile Settings
                </Link>
              </li>
              <li>
                <Link to="#" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                  🚪 Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMobileMenu}>
                  🔐 Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMobileMenu}>
                  📝 Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
