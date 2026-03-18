import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import useCartStore from '../../store/cartStore';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getTotals } = useCartStore();
    const { totalPrice, totalItems } = getTotals();

    const handleQuantityChange = (productId, gaz, currentQty, amount) => {
        const newQty = currentQty + amount;
        if (newQty > 0) {
            updateQuantity(productId, gaz, newQty);
        }
    };

    const checkoutHandler = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="section container text-center cart-empty">
                <h2 className="cart-title">Your Shopping Cart</h2>
                <div className="empty-cart-message">
                    <p>Your cart is currently empty.</p>
                    <Link to="/shop" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="section container cart-page">
            <h2 className="cart-title">Your Cart</h2>

            <div className="cart-layout">

                {/* Cart Items List */}
                <div className="cart-items">
                    <div className="cart-header hide-mobile">
                        <span className="col-product">Product</span>
                        <span className="col-price">Price</span>
                        <span className="col-qty">Quantity</span>
                        <span className="col-total">Total</span>
                    </div>

                    {cartItems.map((item) => (
                        <div key={`${item.product}-${item.gazSelected}`} className="cart-row">

                            <div className="col-product cart-product-info">
                                <Link to={`/product/${item.product}`}>
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                </Link>
                                <div className="cart-item-details">
                                    <Link to={`/product/${item.product}`} className="cart-item-name">{item.name}</Link>
                                    <p className="cart-item-meta">Gaz: {item.gazSelected}</p>
                                </div>
                            </div>

                            <div className="col-price cart-col-center">
                                <span className="mobile-label">Price:</span>
                                Rs. {(item.price / item.quantity).toLocaleString()}
                            </div>

                            <div className="col-qty cart-col-center">
                                <span className="mobile-label">Qty:</span>
                                <div className="quantity-selector cart-qty">
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.product, item.gazSelected, item.quantity, -1)}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.product, item.gazSelected, item.quantity, 1)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="col-total cart-col-center">
                                <span className="mobile-label">Total:</span>
                                <span className="cart-item-total">Rs. {item.price.toLocaleString()}</span>

                                <button
                                    className="btn-remove"
                                    onClick={() => removeFromCart(item.product, item.gazSelected)}
                                    title="Remove item"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="summary-row shipping-row">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <p className="taxes-info">Taxes and shipping calculated at checkout</p>

                    <button
                        className="btn btn-primary btn-block checkout-btn"
                        onClick={checkoutHandler}
                    >
                        Proceed to Checkout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Cart;
