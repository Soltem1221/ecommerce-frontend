import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-logo">🛍️ ShopHub</h3>
            <p className="footer-desc">
              Your trusted marketplace for quality products from verified sellers across Ethiopia.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Sellers</h4>
            <ul className="footer-links">
              <li><Link to="/register?role=seller">Become a Seller</Link></li>
              <li><Link to="/seller/dashboard">Seller Dashboard</Link></li>
              <li><Link to="/faq">Seller Guide</Link></li>
              <li><Link to="/contact">Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/faq">Help Center</Link></li>
              <li><Link to="/orders">Track Order</Link></li>
              <li><Link to="/faq">Returns</Link></li>
              <li><Link to="/faq">Shipping Info</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 ShopHub Marketplace. All rights reserved.</p>
          <div className="payment-methods">
            <span>We Accept:</span>
            <span>💳 Chapa</span>
            <span>📱 Mobile Money</span>
            <span>🏦 Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
