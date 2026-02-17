import { useState } from 'react';
import '../../styles/dashboard.css';

const SellerSettings = () => {
  const [company, setCompany] = useState('');

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">📊 Seller Panel</div>
      </aside>
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Seller Settings</h1>
        </div>

        <div className="form-card">
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input className="form-input" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerSettings;
