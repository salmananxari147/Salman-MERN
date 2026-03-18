import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">

                <div className="footer-brand">
                    <h3>ELÉGANCE</h3>
                    <p className="footer-tagline">Defining Grace & Sophistication since 2010.</p>
                    <p>
                        Our collections embody the timeless beauty of artisanal craft combined with modern silhouettes.
                    </p>
                    <div className="social-icons">
                        <a href="#"><FiInstagram size={20} /></a>
                        <a href="#"><FiFacebook size={20} /></a>
                        <a href="#"><FiTwitter size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Shop</h4>
                    <ul>
                        <li><Link to="/shop?category=unstitched">Unstitched Collection</Link></li>
                        <li><Link to="/shop?category=pret">Prêt Collection</Link></li>
                        <li><Link to="/shop?category=luxury">Luxury Formals</Link></li>
                        <li><Link to="/shop?category=sale">Sale</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Customer Care</h4>
                    <ul>
                        <li><Link to="/shipping">Shipping Policy</Link></li>
                        <li><Link to="/returns">Returns & Exchanges</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="footer-newsletter">
                    <h4>Newsletter</h4>
                    <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" className="input-control" />
                        <button type="submit" className="btn btn-primary">Subscribe</button>
                    </form>
                </div>

            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Elégance Suits. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
