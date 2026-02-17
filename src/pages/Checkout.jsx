import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { orderAPI, paymentAPI } from '../utils/api';
import '../styles/checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { fetchOrders } = useContext(OrderContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'chapa'
  });

  console.log('--- Checkout Component Rendered ---');
  console.log('Cart:', cart);
  console.log('Form Data:', formData);
  console.log('------------------------------------');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const { data } = await orderAPI.createOrder(orderData);

      if (formData.paymentMethod === 'chapa') {
        const paymentRes = await paymentAPI.initializePayment({ orderId: data.orderId });
        if (paymentRes.data.success) {
          fetchOrders(); // refresh global order list
          window.location.href = paymentRes.data.checkout_url;
          return;
        }
      }

      await fetchOrders(); // refresh global order list
      clearCart();
      navigate(`/orders/${data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
      console.log('--- Checkout Error ---');
      console.log('Error:', err);
      if (err.response?.data) {
        console.log('Response Data:', err.response.data);
      }
      console.log('----------------------');
    } finally {
      if (formData.paymentMethod !== 'chapa') {
        setLoading(false);
      }
    }
  };

  const subtotal = getCartTotal();
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 className="page-title">Checkout</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-section">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                className="form-input form-textarea"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State/Region</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-input"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="chapa"
                  checked={formData.paymentMethod === 'chapa'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
                <div className="payment-card">
                  <div className="payment-icon">💳</div>
                  <div>
                    <div className="payment-name">Chapa Payment</div>
                    <div className="payment-desc">Pay with mobile money or bank</div>
                  </div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
                <div className="payment-card">
                  <div className="payment-icon">💵</div>
                  <div>
                    <div className="payment-name">Cash on Delivery</div>
                    <div className="payment-desc">Pay when you receive</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : `Place Order - ETB ${total.toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary-checkout">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.map((item) => {
              const price = item.discount_price || item.price;
              return (
                <div key={item.id} className="order-item">
                  <img src={item.primary_image || `https://picsum.photos/80/80?random=${item.id}`} alt={item.name} />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="order-item-price">ETB {(price * item.quantity).toFixed(2)}</div>
                </div>
              );
            })}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal</span>
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
