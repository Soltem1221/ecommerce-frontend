import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import '../styles/orders.css';

const Orders = () => {
  const { orders, loading, fetchOrders } = useContext(OrderContext);

  useEffect(() => {
    fetchOrders(); // Ensure fresh data on mount
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      processing: 'badge-primary',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
      returned: 'badge-danger'
    };
    return badges[status] || 'badge-primary';
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
        <h2>No orders yet</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
          Start shopping to see your orders here
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <h1 className="page-title">My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-number">Order #{order.order_number}</div>
                <div className="order-date">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className={`badge ${getStatusBadge(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-body">
              <div className="order-info">
                <div className="order-info-item">
                  <span className="order-label">Items:</span>
                  <span>{order.items_count}</span>
                </div>
                <div className="order-info-item">
                  <span className="order-label">Total:</span>
                  <span className="order-total">ETB {order.total}</span>
                </div>
                <div className="order-info-item">
                  <span className="order-label">Payment:</span>
                  <span>{order.payment_method.toUpperCase()}</span>
                </div>
                <div className="order-info-item">
                  <span className="order-label">Delivery:</span>
                  <span>{order.city}</span>
                </div>
              </div>

              <div className="order-actions">
                <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">
                  View Details
                </Link>
                {order.status === 'delivered' && (
                  <button className="btn btn-primary btn-sm">Write Review</button>
                )}
                {order.status === 'pending' && (
                  <button className="btn btn-danger btn-sm">Cancel Order</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
