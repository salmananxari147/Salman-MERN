import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTruck, FiCheck, FiX, FiPrinter } from 'react-icons/fi';
import api from '../../utils/api';
import './AdminOrderDetails.css';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async (status) => {
        setUpdating(true);
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status });
            setOrder(data);
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="loader">Filing Order History...</div>;
    if (!order) return <div className="error">Order record not found.</div>;

    return (
        <div className="admin-order-details container section">
            <header className="page-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>
                <div className="header-info">
                    <h1>Order #{order._id.toUpperCase()}</h1>
                    <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <button className="btn btn-outline" onClick={() => window.print()}>
                    <FiPrinter /> Print Invoice
                </button>
            </header>

            <div className="order-grid">
                {/* Main Content */}
                <div className="order-main">
                    <section className="order-section">
                        <h3>Customer Information</h3>
                        <div className="info-card">
                            <p><strong>Name:</strong> {order.user?.name || 'Guest User'}</p>
                            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                            <p><strong>Contact:</strong> {order.shippingAddress.phone}</p>
                        </div>
                    </section>

                    <section className="order-section">
                        <h3>Shipping Address</h3>
                        <div className="info-card">
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </section>

                    <section className="order-section">
                        <h3>Order Items</h3>
                        <div className="items-list">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                    <img src={item.image} alt="" className="item-thumb" />
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>{item.gazSelected} Gaz x Rs. {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="item-total">
                                        Rs. {(item.gazSelected * item.price).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Status Controls */}
                <aside className="order-sidebar">
                    <section className="order-section summary-card">
                        <h3>Financial Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>Rs. {order.itemsPrice.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Rs. {order.shippingPrice.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Revenue</span>
                            <span>Rs. {order.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className={`payment-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                            {order.isPaid ? `Paid via ${order.paymentMethod}` : 'Payment Pending'}
                        </div>
                    </section>

                    <section className="order-section status-controls">
                        <h3>Flow Management</h3>
                        <div className="status-actions">
                            {order.status === 'Pending' && (
                                <button className="btn btn-primary btn-block" onClick={() => handleUpdateStatus('Paid')} disabled={updating}>
                                    Mark as Paid
                                </button>
                            )}
                            {order.status === 'Paid' && (
                                <button className="btn btn-blue btn-block" onClick={() => handleUpdateStatus('Shipped')} disabled={updating}>
                                    <FiTruck /> Ship Order
                                </button>
                            )}
                            {order.status === 'Shipped' && (
                                <button className="btn btn-success btn-block" onClick={() => handleUpdateStatus('Delivered')} disabled={updating}>
                                    <FiCheck /> Mark Delivered
                                </button>
                            )}
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button className="btn btn-outline btn-block text-danger" onClick={() => handleUpdateStatus('Cancelled')} disabled={updating}>
                                    <FiX /> Cancel Order
                                </button>
                            )}
                            {order.status === 'Delivered' && (
                                <p className="completion-text">Order completed and archived.</p>
                            )}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
