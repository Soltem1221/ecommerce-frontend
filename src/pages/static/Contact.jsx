import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const Contact = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ padding: '48px 20px', maxWidth: '900px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '36px' }}>Contact Us</h1>

      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>📧 Email</h3>
          <p style={{ color: 'var(--gray)' }}>support@shophub.com</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>📞 Phone</h3>
          <p style={{ color: 'var(--gray)' }}>+251 11 123 4567</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>📍 Address</h3>
          <p style={{ color: 'var(--gray)' }}>Addis Ababa, Ethiopia</p>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>⏰ Hours</h3>
          <p style={{ color: 'var(--gray)' }}>Mon-Fri: 9AM - 6PM</p>
        </div>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Send us a Message</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-input form-textarea"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
