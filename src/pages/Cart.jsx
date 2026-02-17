import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{padding: '80px 20px', textAlign: 'center'}}>
        <div style={{fontSize: '64px', marginBottom: '16px'}}>🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{color: 'var(--gray)', marginBottom: '24px'}}>
          Add some products to get started
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="container" style={{padding: '32px 20px'}}>
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => {
            const price = item.discount_price || item.price;
            return (
              <div key={item.id} className="cart-item">
                <img
                  src={item.primary_image || `https://picsum.photos/150/150?random=${item.id}`}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="text-gray">SKU: {item.sku}</p>
                  <div className="cart-item-price">ETB {price}</div>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">
                  ETB {(price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>ETB {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>ETB {shipping.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>ETB {total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-lg" style={{width: '100%'}} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
