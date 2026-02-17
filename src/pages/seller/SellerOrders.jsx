import { useEffect, useState } from 'react';
import '../../styles/dashboard.css';
import { orderAPI } from '../../utils/api';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await orderAPI.getSellerOrders();
        if (mounted) setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">📊 Seller Panel</div>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Orders</h1>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.order_number}</td>
                    <td>{o.product_name}</td>
                    <td>{o.quantity}</td>
                    <td>ETB {o.subtotal}</td>
                    <td><span className={`badge ${o.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>{o.status}</span></td>
                    <td>{o.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerOrders;
