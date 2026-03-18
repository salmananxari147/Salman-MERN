import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { cartItems } = useCartStore();
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const { userInfo, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">ELÉGANCE</span>
                    <span className="logo-subtext">COUTURE</span>
                </Link>

                {/* Desktop Menu */}
                <nav className="desktop-nav">
                    <ul className="nav-links">
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/shop">SHOP ALL</Link></li>
                        <li><Link to="/shop?category=unstitched">UNSTITCHED</Link></li>
                        <li><Link to="/shop?category=pret">READY TO WEAR</Link></li>
                    </ul>
                </nav>

                {/* Icons */}
                <div className="navbar-icons">
                    <div className="user-menu-container">
                        {userInfo ? (
                            <div className="dropdown">
                                <span className="user-greeting">Hi, {userInfo.name.split(' ')[0]}</span>
                                <div className="dropdown-content">
                                    <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
                                    {userInfo.role === 'admin' && (
                                        <Link to="/admin/dashboard">Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="icon-link">
                                <FiUser size={22} />
                            </Link>
                        )}
                    </div>

                    <Link to="/cart" className="icon-link cart-link">
                        <FiShoppingCart size={22} />
                        {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                <ul className="mobile-nav-links">
                    <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop Collection</Link></li>
                    <li><Link to="/shop?category=unstitched" onClick={() => setIsMenuOpen(false)}>Unstitched</Link></li>
                    <li><Link to="/shop?category=pret" onClick={() => setIsMenuOpen(false)}>Prêt</Link></li>

                    {!userInfo && (
                        <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login / Register</Link></li>
                    )}

                    {userInfo && userInfo.role === 'admin' && (
                        <li><Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link></li>
                    )}

                    {userInfo && (
                        <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
                    )}

                    {userInfo && (
                        <li><button onClick={handleLogout} className="mobile-logout">Logout</button></li>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;