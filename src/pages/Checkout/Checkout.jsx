import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import api from '../../utils/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuthStore();
    const {
        cartItems,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        getTotals,
        clearCart
    } = useCartStore();

    const { totalPrice } = getTotals();

    // Redirect logic: If not logged in, go to login with redirect. If cart empty, go to cart.
    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=checkout');
        } else if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [userInfo, cartItems, navigate]);

    // Form states
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [payMethod, setPayMethod] = useState(paymentMethod || 'COD');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Save metadata to store
        saveShippingAddress({ address, city, postalCode, phone });
        savePaymentMethod(payMethod);

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item.product,
                    gaz: item.gazSelected
                })),
                shippingAddress: {
                    address,
                    city,
                    postalCode,
                    phone,
                    name: userInfo.name
                },
                paymentMethod: payMethod,
                totalPrice: totalPrice,
            };

            const { data } = await api.post('/orders', orderData);
            setOrderId(data._id);
            setIsSuccess(true);
            clearCart();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="section container text-center checkout-success-page">
                <div className="success-icon">✅</div>
                <h2 className="title-serif">Thank You for Your Order!</h2>
                <p>Your elegant pieces are being prepared with care.</p>
                <div className="order-info-box">
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Total Amount:</strong> Rs. {totalPrice.toLocaleString()}</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                    View Your Orders
                </button>
            </div>
        );
    }

    return (
        <div className="section container checkout-page">
            <h2 className="page-title text-center">Secure Checkout</h2>

            <div className="checkout-grid">
                {/* Left Side: Forms */}
                <div className="checkout-forms">

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={placeOrderHandler}>

                        <div className="checkout-card">
                            <h3>Shipping Information</h3>
                            <div className="input-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="input-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    placeholder="Street address, house number"
                                />
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        className="input-control"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        className="input-control"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    className="input-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="checkout-card">
                            <h3>Payment Method</h3>
                            <div className="payment-options">
                                <label className={`radio-label ${payMethod === 'COD' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={payMethod === 'COD'}
                                        onChange={(e) => setPayMethod(e.target.value)}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className={`radio-label ${payMethod === 'Stripe' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Stripe"
                                        checked={payMethod === 'Stripe'}
                                        onChange={(e) => setPayMethod(e.target.value)}
                                    />
                                    <span>Credit / Debit Card (Stripe)</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block place-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order (Rs. ${totalPrice.toLocaleString()})`}
                        </button>

                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="checkout-summary">
                    <div className="checkout-card">
                        <h3>Order Summary</h3>

                        <div className="checkout-items-preview">
                            {cartItems.map((item, index) => (
                                <div key={index} className="preview-row">
                                    <div className="preview-img-container">
                                        <img src={item.image} alt={item.name} />
                                        <span className="preview-badge">{item.quantity}</span>
                                    </div>
                                    <div className="preview-info">
                                        <span className="preview-name">{item.name}</span>
                                        <span className="preview-meta">{item.gazSelected} Gaz</span>
                                    </div>
                                    <div className="preview-price">
                                        Rs. {item.price.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-calculations">
                            <div className="calc-row">
                                <span>Subtotal</span>
                                <span>Rs. {totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="calc-row text-muted">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="calc-row total-row">
                                <span>Total</span>
                                <span className="text-primary">Rs. {totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
