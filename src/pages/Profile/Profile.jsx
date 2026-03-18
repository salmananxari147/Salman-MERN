import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { userInfo, updateProfile } = useAuthStore();

    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const { data } = await api.get('/orders/myorders');
                    setOrders(data);
                } catch (error) {
                    console.error('Failed to fetch orders', error);
                }
            };
            fetchOrders();
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({ name, email, password });
            setMessage('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section container profile-page">
            <div className="profile-grid">
                {/* Profile Form */}
                <div className="profile-info-section">
                    <h2 className="title-serif">YOUR ACCOUNT</h2>
                    {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

                    <form onSubmit={submitHandler} className="profile-form">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="input-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>New Password (Optional)</label>
                            <input
                                type="password"
                                className="input-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                className="input-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Updating...' : 'SAVE CHANGES'}
                        </button>
                    </form>
                </div>

                {/* Orders History Preview */}
                <div className="order-history-section">
                    <h2 className="title-serif">ORDER HISTORY</h2>
                    {orders.length === 0 ? (
                        <div className="empty-orders">
                            <p>You haven't placed any orders yet.</p>
                            <Link to="/shop" className="btn-text">Start Shopping &rarr;</Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order._id} className="order-card-mini">
                                    <div className="order-header">
                                        <span className="order-id">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                        <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="order-total">Rs. {order.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
