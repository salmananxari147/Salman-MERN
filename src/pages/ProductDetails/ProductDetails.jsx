import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import useCartStore from '../../store/cartStore';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FiMinus, FiPlus, FiCheck, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Selection State
    const [selectedImage, setSelectedImage] = useState(null);
    const [gazSelected, setGazSelected] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [wishlist, setWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [imageZoom, setImageZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const { addToCart } = useCartStore();

    // ✅ Helper: Safe image URL
    const getImageUrl = (img) => {
        if (!img) return '/placeholder.png';
        return img.startsWith('http') ? img : `https://mern-website-ebon.vercel.app/${img}`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }

                // Fetch Related Products
                const relRes = await api.get(`/products?category=${data.category?._id || data.category}`);
                const related = relRes.data
                    .filter(p => p._id !== data._id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
                setRelatedProducts(related);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const basePrice = product.basePricePerGaz || 0;
    const unitPrice = basePrice * gazSelected;
    const totalPrice = unitPrice * quantity;

    const handleGazChange = (e) => setGazSelected(Number(e.target.value));

    const handleAddToCart = () => {
        if (product.countInStock <= 0) return;
        addToCart({
            product: product._id,
            name: product.name,
            image: selectedImage,
            price: totalPrice,
            gazSelected: gazSelected,
            quantity: quantity,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleImageZoom = (e) => {
        if (!imageZoom) return;
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const rating = 4.5;
    const reviews = 124;

    if (loading) return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Loading masterpiece...</p>
        </div>
    );

    if (error) return (
        <div className="error-container section">
            <div className="container text-center">
                <h3 style={{ color: 'red' }}>{error}</h3>
                <button onClick={() => navigate('/shop')} className="btn btn-primary mt-3">
                    Back to Shop
                </button>
            </div>
        </div>
    );

    return (
        <div className="product-details-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{' '}
                    <Link to={`/shop?category=${product.category?.slug}`}>{product.category?.name || 'Unstitched'}</Link> /{' '}
                    <span className="current">{product.name}</span>
                </nav>

                <div className="product-details-grid">
                    {/* Left: Images */}
                    <div className="product-images">
                        {product.images?.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        className={`thumbnail-container ${selectedImage === img ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(img)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img src={getImageUrl(img)} alt={`${product.name} view ${index + 1}`} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="main-image-wrapper">
                            <motion.div
                                className={`main-image-container ${imageZoom ? 'zoomed' : ''}`}
                                onMouseEnter={() => setImageZoom(true)}
                                onMouseLeave={() => setImageZoom(false)}
                                onMouseMove={handleImageZoom}
                            >
                                <img
                                    src={getImageUrl(selectedImage)}
                                    alt={product.name}
                                    className="main-image"
                                    style={imageZoom
                                        ? { transform: `scale(2)`, transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                                        : {}
                                    }
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="product-info-panel">
                        <div className="product-header">
                            <div className="brand-rating">
                                <span className="product-brand">ELÉGANCE</span>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => {
                                        if (i < Math.floor(rating)) return <FaStar key={i} className="star filled" />;
                                        if (i === Math.floor(rating) && rating % 1 !== 0) return <FaStarHalfAlt key={i} className="star half" />;
                                        return <FaRegStar key={i} className="star" />;
                                    })}
                                    <span className="rating-count">({reviews} reviews)</span>
                                </div>
                            </div>

                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-sku">SKU: <span>{product.sku || `ELG-${product._id?.slice(-6)}`}</span></div>

                            <div className="pricing-display">
                                <h2 className="current-price">Rs. {totalPrice.toLocaleString()}</h2>
                                <div className="price-breakdown">
                                    <p>Base: Rs. {basePrice.toLocaleString()} / Gaz</p>
                                    <p>Unit: Rs. {unitPrice.toLocaleString()} (for {gazSelected} Gaz)</p>
                                </div>
                            </div>

                            <div className="stock-status">
                                {product.countInStock > 10 ? (
                                    <span className="in-stock">✓ In Stock ({product.countInStock}+)</span>
                                ) : product.countInStock > 0 ? (
                                    <span className="low-stock">⚠️ Only {product.countInStock} left!</span>
                                ) : (
                                    <span className="out-of-stock">✗ Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="product-tabs">
                            <div className="tab-headers">
                                <button className={activeTab==='description'?'active':''} onClick={()=>setActiveTab('description')}>Description</button>
                                <button className={activeTab==='details'?'active':''} onClick={()=>setActiveTab('details')}>Details</button>
                                <button className={activeTab==='shipping'?'active':''} onClick={()=>setActiveTab('shipping')}>Shipping</button>
                            </div>
                            <div className="tab-content">
                                {activeTab==='description' && <motion.div>{product.description || "Beautifully crafted traditional wear."}</motion.div>}
                                {activeTab==='details' && <motion.div>
                                    <div>Fabric: {product.fabricDetails || "Premium Quality"}</div>
                                    <div>Category: {product.category?.name || "Unstitched"}</div>
                                    <div>Care: Dry Clean Only</div>
                                    <div>Collection: {product.collection || "Summer 2026"}</div>
                                </motion.div>}
                                {activeTab==='shipping' && <motion.div>
                                    <p>• Free shipping on orders above Rs. 5000</p>
                                    <p>• Estimated delivery: 5-7 business days</p>
                                    <p>• Easy returns within 7 days</p>
                                </motion.div>}
                            </div>
                        </div>

                        {/* Configuration & Actions */}
                        <div className="product-configuration">
                            <label>Select Gaz:</label>
                            <select value={gazSelected} onChange={handleGazChange}>
                                {[1,1.5,2,2.5,3,3.5,4,4.5,5].map(v=><option key={v} value={v}>{v} Gaz</option>)}
                            </select>

                            <label>Quantity:</label>
                            <div className="quantity-selector">
                                <button onClick={()=>setQuantity(Math.max(1,quantity-1))} disabled={quantity<=1}><FiMinus /></button>
                                <input type="number" value={quantity} readOnly />
                                <button onClick={()=>setQuantity(quantity+1)} disabled={quantity>=product.countInStock}><FiPlus /></button>
                            </div>
                        </div>

                        <div className="product-actions">
                            <button onClick={handleAddToCart} disabled={added || product.countInStock<=0}>
                                {product.countInStock<=0?'Sold Out':added?<><FiCheck /> Added</>: 'Add to Bag'}
                            </button>
                            <button onClick={()=>setWishlist(!wishlist)}>{wishlist?'❤️':'🤍'} Wishlist</button>
                            <button>Share</button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length>0 && (
                    <div className="related-section">
                        <h2>You may also like</h2>
                        <div className="product-grid">
                            {relatedProducts.map(p=> <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
