import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../../store/cartStore';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCartStore();

    // Handle Quick Add button
    const handleQuickAdd = (e) => {
        e.preventDefault(); // Prevent navigating to product details
        addToCart({
            product: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 
                   ? `https://mern-backend-six-amber.vercel.app${product.images[0]}` 
                   : '/placeholder.jpg',
            price: product.basePricePerGaz * 1, // Default 1 Gaz
            gazSelected: 1,
            quantity: 1,
        });
    };

    // Build image URL
    const imageUrl = product.images && product.images.length > 0
        ? `https://mern-backend-six-amber.vercel.app${product.images[0]}`
        : '/placeholder.jpg';

    return (
        <motion.div
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Link to={`/product/${product._id}`} className="product-card-link">
                <div className="product-image-container">
                    <img src={imageUrl} alt={product.name} className="product-image" />

                    <div className="product-overlay">
                        <button className="btn btn-primary btn-quick-add" onClick={handleQuickAdd}>
                            Quick Add (1 Gaz)
                        </button>
                    </div>

                    {product.isFeatured && <span className="badge featured-badge">Featured</span>}
                    {!product.inStock && <span className="badge out-of-stock-badge">Sold Out</span>}
                </div>

                <div className="product-info">
                    <span className="product-category">{product.category?.name || 'Unstitched'}</span>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">
                        Rs. {product.basePricePerGaz.toLocaleString()} <span>/ Gaz</span>
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
