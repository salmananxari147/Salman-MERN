import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiBox,
    FiShoppingBag,
    FiUsers,
    FiTrendingUp,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiXCircle,
    FiGrid,
    FiSettings,
    FiLogOut
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { userInfo, logout } = useAuthStore();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const [analyticsRes, productsRes, ordersRes] = await Promise.all([
                    api.get('/analytics'),
                    api.get('/products'),
                    api.get('/orders')
                ]);
                setStats(analyticsRes.data);
                setProducts(productsRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error('Failed to load admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [userInfo, navigate]);

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you certain you want to remove this piece from the collection?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Establishing Secure Session...</p>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className={`stat-card ${color}`}>
            <div className="stat-content">
                <span className="stat-label">{title}</span>
                <h2 className="stat-number">{value}</h2>
            </div>
            <div className="stat-icon-wrap">
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            {/* Admin Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <span className="logo-text">ELÉGANCE</span>
                    <span className="admin-badge">ADMIN</span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        <FiGrid /> Overview
                    </button>
                    <button
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        <FiBox /> Products
                    </button>
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FiShoppingBag /> Orders
                    </button>
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FiSettings /> Profile
                    </button>
                </nav>

                <button className="sidebar-logout" onClick={() => { logout(); navigate('/'); }}>
                    <FiLogOut /> Logout
                </button>
            </aside>

            {/* Admin Main Body */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-greeting">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h1>
                        <p>Welcome back, {userInfo.name}</p>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    {activeTab === 'overview' && stats && (
                        <div className="tab-pane animate-fade-in">
                            <div className="stats-grid">
                                <StatCard
                                    title="Total Revenue"
                                    value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                                    icon={FiTrendingUp}
                                    color="gold"
                                />
                                <StatCard
                                    title="Total Orders"
                                    value={stats.totalOrders}
                                    icon={FiShoppingBag}
                                    color="blue"
                                />
                                <StatCard
                                    title="Active Inventory"
                                    value={stats.totalProducts}
                                    icon={FiBox}
                                    color="green"
                                />
                                <StatCard
                                    title="Registered Users"
                                    value={stats.totalUsers}
                                    icon={FiUsers}
                                    color="purple"
                                />
                            </div>

                            <div className="dashboard-row mt-4">
                                <div className="card recent-orders-card">
                                    <div className="card-header">
                                        <h3>Recent Orders</h3>
                                        <button className="btn-text" onClick={() => setActiveTab('orders')}>View All</button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Status</th>
                                                    <th>Total</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentOrders.map(order => (
                                                    <tr key={order._id}>
                                                        <td className="mono" data-label="Order ID">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                                        <td data-label="Customer">{order.user?.name || 'Guest'}</td>
                                                        <td data-label="Status">
                                                            <span className={`status-pill ${order.status.toLowerCase()}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="bold" data-label="Total">Rs. {order.totalPrice.toLocaleString()}</td>
                                                        <td data-label="Actions">
                                                            <button
                                                                className="btn-text"
                                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                            >
                                                                Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card analytics-mini-card">
                                    <div className="card-header">
                                        <h3>Sales Overview</h3>
                                    </div>
                                    <div className="mini-chart-placeholder">
                                        <div className="css-chart">
                                            {stats.salesByMonth.slice(-6).map((month, i) => (
                                                <div key={i} className="chart-bar-wrap">
                                                    <div className="chart-bar" style={{ height: `${(month.totalSales / stats.totalRevenue) * 100 + 20}%` }}>
                                                        <span className="bar-tooltip">Rs. {month.totalSales.toLocaleString()}</span>
                                                    </div>
                                                    <span className="bar-label">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month._id - 1]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="tab-pane animate-fade-in">
                            <div className="card full-width-card">
                                <div className="card-header">
                                    <h3>Product Inventory ({products.length})</h3>
                                    <button className="btn btn-primary" onClick={() => navigate('/admin/products/new')}>
                                        <FiPlus /> Add New Product
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Base Price</th>
                                                <th>Stock</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td data-label="Image">
                                                        <img src={product.images[0]} alt="" className="table-thumb" />
                                                    </td>
                                                    <td className="bold" data-label="Title">{product.name}</td>
                                                    <td data-label="Category">{product.category?.name || 'Unstitched'}</td>
                                                    <td data-label="Price">Rs. {product.basePricePerGaz.toLocaleString()}</td>
                                                    <td data-label="Stock">
                                                        <span className={`stock-indicator ${product.countInStock > 0 ? 'in' : 'out'}`}>
                                                            {product.countInStock} In Stock
                                                        </span>
                                                    </td>
                                                    <td data-label="Actions">
                                                        <div className="action-btns">
                                                            <button
                                                                className="icon-btn edit"
                                                                title="Edit"
                                                                onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                                                            >
                                                                <FiEdit2 />
                                                            </button>
                                                            <button
                                                                className="icon-btn delete"
                                                                title="Delete"
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="tab-pane animate-fade-in">
                            <div className="card full-width-card">
                                <div className="card-header">
                                    <h3>Order Management ({orders.length})</h3>
                                </div>
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Payment</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td className="mono" data-label="ID">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                                                    <td data-label="Customer">{order.user?.name || 'Guest'}</td>
                                                    <td className="bold" data-label="Total">Rs. {order.totalPrice.toLocaleString()}</td>
                                                    <td data-label="Status">
                                                        <span className={`status-pill ${order.status.toLowerCase()}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td data-label="Payment">
                                                        {order.isPaid ?
                                                            <span className="text-success small"><FiCheckCircle /> Paid</span> :
                                                            <span className="text-warning small"><FiXCircle /> Unpaid</span>
                                                        }
                                                    </td>
                                                    <td data-label="Actions">
                                                        <button
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                        >
                                                            Handle Order
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="tab-pane animate-fade-in">
                            <div className="admin-profile-container card">
                                <div className="profile-header">
                                    <div className="profile-avatar-large">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="profile-intro">
                                        <h3>Admin Profile Settings</h3>
                                        <p>Manage your account details and security</p>
                                    </div>
                                </div>

                                <form className="admin-profile-form" onSubmit={(e) => {
                                    e.preventDefault();
                                    alert('Profile updated successfully (Mock)');
                                }}>
                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                className="input-control"
                                                defaultValue={userInfo.name}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                className="input-control"
                                                defaultValue={userInfo.email}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                className="input-control"
                                                placeholder="Leave blank to keep current"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Confirm Password</label>
                                            <input
                                                type="password"
                                                className="input-control"
                                                placeholder="Repeat new password"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-actions mt-4">
                                        <button type="submit" className="btn btn-primary">
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
