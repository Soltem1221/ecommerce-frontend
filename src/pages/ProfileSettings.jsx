import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authAPI } from '../utils/api';
import '../styles/dashboard.css';

const ProfileSettings = () => {
    const { user, setUser } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || ''
            });
            if (user.profileImage) {
                setPreview(user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`);
            }
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            if (profileImage) data.append('profileImage', profileImage);

            const response = await authAPI.updateProfile(data);
            if (response.data.success) {
                showNotification('Profile updated successfully', 'success');
                // Update local user state
                const updatedUser = { ...user, name: formData.name, phone: formData.phone };
                if (response.data.profileImage) {
                    updatedUser.profileImage = response.data.profileImage;
                }
                // Assuming AuthContext has a way to update user, or we just rely on loadUser
                // For now, let's assume we might need to refresh or if loadUser is available in context
            }
        } catch (err) {
            console.error(err);
            showNotification(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '48px 20px' }}>
            <div className="card" style={{ padding: '32px' }}>
                <h1 style={{ marginBottom: '24px' }}>Profile Settings</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                backgroundColor: '#f3f4f6',
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '2px solid var(--primary)',
                                position: 'relative'
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '32px' }}>{formData.name[0]?.toUpperCase()}</span>
                            )}
                            <div
                                onClick={() => document.getElementById('profile-image-input').click()}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    background: 'var(--primary)',
                                    color: 'white',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid white'
                                }}
                            >
                                📷
                            </div>
                        </div>
                        <input
                            id="profile-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            disabled
                            style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                        />
                        <small style={{ color: 'var(--gray)' }}>Email cannot be changed.</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-actions" style={{ marginTop: '32px' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
