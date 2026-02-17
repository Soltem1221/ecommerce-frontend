import { useEffect, useState } from 'react';
import { walletAPI } from '../../utils/api';
import '../../styles/dashboard.css';

const SellerEarnings = () => {
  const [stats, setStats] = useState({ balance: 0, pending_balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data } = await walletAPI.getWallet();
      if (data.success) {
        setStats({ balance: data.balance, pending_balance: data.pending_balance });
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load wallet', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const { data } = await walletAPI.withdraw({
        amount: Number(withdrawAmount),
        bankName: 'Commercial Bank of Ethiopia', // Hardcoded for now or add form fields
        accountNumber: '1000123456789'
      });
      if (data.success) {
        setMessage('Withdrawal request submitted!');
        setWithdrawAmount('');
        fetchWallet();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">📊 Seller Panel</div>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Earnings</h1>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <div className="stat-value">ETB {Number(stats.balance).toLocaleString()}</div>
              <div className="stat-label">Available Balance</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-details">
              <div className="stat-value">ETB {Number(stats.pending_balance).toLocaleString()}</div>
              <div className="stat-label">Pending Balance</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <h2>Withdraw Funds</h2>
          <form onSubmit={handleWithdraw} style={{ maxWidth: '400px', marginTop: '16px' }}>
            <div className="form-group">
              <label>Amount (ETB)</label>
              <input
                type="number"
                className="form-input"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                max={stats.balance}
                min="10"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Request Withdrawal</button>
          </form>
        </div>

        <div style={{ marginTop: 32 }}>
          <h2>Recent Transactions</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>{t.type}</td>
                  <td>ETB {t.amount}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default SellerEarnings;
