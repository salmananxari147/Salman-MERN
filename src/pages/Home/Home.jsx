import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {

    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            title: "ELEGANCE IN EVERY STITCH",
            subtitle: "Luxury Summer Collection",
            image: "https://img.freepik.com/premium-photo/attractive-hot-girl-landscape-sitting-floor-wearing-desi-dress-fashion-photoshoot_658768-276.jpg",
            buttonText: "SHOP COLLECTION",
            link: "/shop"
        },
        {
            title: "UNVEIL YOUR STYLE",
            subtitle: "Modern Ready To Wear",
            image: "https://img.freepik.com/premium-photo/cute-girl-landscape-waving-her-dupatta-wearing-traditional-dress-fashion-photoshoot_658768-440.jpg",
            buttonText: "DISCOVER NOW",
            link: "/shop"
        },
        {
            title: "TIMELESS TRADITION",
            subtitle: "Luxury Wedding Wear",
            image: "https://img.freepik.com/premium-photo/beautiful-model-girl-landscape-waving-dupatta-wearing-desi-dress-garden_658768-350.jpg",
            buttonText: "VIEW COLLECTION",
            link: "/shop"
        }
    ];

   /* Fetch Products */
useEffect(() => {
    const fetchProducts = async () => {
        try {
            const { data: homeData } = await api.get('/products?showOnHome=true');
            const fixedHomeData = homeData.map(product => ({
                ...product,
                image: `https://mern-backend-six-amber.vercel.app${product.image}`
            }));
            setProducts(fixedHomeData);

            const { data: featData } = await api.get('/products?isFeatured=true');
            const fixedFeatData = featData.map(product => ({
                ...product,
                image: `https://mern-backend-six-amber.vercel.app${product.image}`
            }));
            setFeaturedProducts(fixedFeatData);

        } catch (error) {
            console.error('Failed to fetch home products:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
}, []);
    /* Carousel Auto Slide */

    useEffect(() => {

        const timer = setInterval(() => {

            if (!isPaused) {
                setCurrentSlide(prev => (prev + 1) % slides.length);
            }

        }, 6000);

        return () => clearInterval(timer);

    }, [isPaused, slides.length]);

    const newArrivals = products.slice(0, 3);
    const legacyPieces = products.slice(7, 10);

    return (
        <div className="home-page">

            {/* HERO CAROUSEL */}

            <section
                className="hero-section"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                <AnimatePresence mode="wait">

                    <motion.div
                        key={currentSlide}
                        className="hero-slide"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        style={{
                            backgroundImage: `url(${slides[currentSlide].image})`
                        }}
                    >

                        <div className="hero-overlay"></div>

                        <div className="container">

                            <motion.div
                                className="hero-content"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: { staggerChildren: 0.25 }
                                    }
                                }}
                            >

                                <motion.span
                                    className="hero-subtitle"
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {slides[currentSlide].subtitle}
                                </motion.span>

                                <motion.h1
                                    variants={{
                                        hidden: { opacity: 0, y: 50 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {slides[currentSlide].title}
                                </motion.h1>

                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ duration: 0.8 }}
                                >

                                    <Link
                                        to={slides[currentSlide].link}
                                        className="hero-btn"
                                    >
                                        {slides[currentSlide].buttonText}
                                    </Link>

                                </motion.div>

                            </motion.div>

                        </div>

                    </motion.div>

                </AnimatePresence>

                {/* ARROWS */}

                <button
                    className="carousel-arrow left"
                    onClick={() =>
                        setCurrentSlide(prev =>
                            (prev - 1 + slides.length) % slides.length
                        )
                    }
                >
                    ‹
                </button>

                <button
                    className="carousel-arrow right"
                    onClick={() =>
                        setCurrentSlide(prev =>
                            (prev + 1) % slides.length
                        )
                    }
                >
                    ›
                </button>

                {/* INDICATORS */}

                <div className="carousel-indicators">

                    {slides.map((_, index) => (

                        <button
                            key={index}
                            className={`indicator ${currentSlide === index ? "active" : ""}`}
                            onClick={() => setCurrentSlide(index)}
                        />

                    ))}

                </div>

            </section>

            {/* CATEGORY SHOWCASE - NEW SECTION */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-tag">SHOP BY</span>
                        <h2>OUR COLLECTIONS</h2>
                    </div>

                    <div className="categories-grid">
                        <Link to="/shop?category=western" className="category-card">
                            <div className="category-image">
                                <img src="https://i.etsystatic.com/25120921/r/il/70ba40/7243376117/il_fullxfull.7243376117_tvca.jpg" alt="Western Wear" />
                            </div>
                            <h3>WESTERN WEAR</h3>
                            <p>Contemporary & Chic</p>
                        </Link>
                        <Link to="/shop?category=ethnic" className="category-card">
                            <div className="category-image">
                                <img src="https://5.imimg.com/data5/SELLER/Default/2022/8/RP/VK/UM/39893521/9241de5a-ea6f-47f4-ad94-725d88525571-500x500.jpg" alt="Ethnic Wear" />
                            </div>
                            <h3>ETHNIC WEAR</h3>
                            <p>Timeless Tradition</p>
                        </Link>
                        <Link to="/shop?category=fusion" className="category-card">
                            <div className="category-image">
                                <img src="https://cpimg.tistatic.com/08799101/b/4/Ladies-Designer-Suits.jpg" alt="Fusion Wear" />
                            </div>
                            <h3>FUSION WEAR</h3>
                            <p>Modern Meets Ethnic</p>
                        </Link>
                        <Link to="/shop?category=accessories" className="category-card">
                            <div className="category-image">
                                <img src="https://5.imimg.com/data5/SELLER/Default/2022/8/MQ/DH/QA/39893521/61320d98-444a-4438-8d4a-7d7d6805a09f.jpg" alt="Accessories" />
                            </div>
                            <h3>ACCESSORIES</h3>
                            <p>Complete The Look</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* NEW ARRIVALS */}

            <section className="section new-arrivals-section">

                <div className="container">

                    <div className="section-header text-center">

                        <span className="section-tag">FRESH OFF THE LOOM</span>
                        <h2>NEW ARRIVALS</h2>

                    </div>

                    {!loading && newArrivals.length > 0 ? (

                        <div className="product-grid arrival-grid">

                            {newArrivals.map((product) => (

                                <ProductCard key={product._id} product={product} />

                            ))}

                        </div>

                    ) : (

                        <div className="empty-placeholder">
                            New curated pieces coming soon...
                        </div>

                    )}

                </div>

            </section>

            {/* SPECIAL OFFER BANNER - NEW SECTION */}
            <section className="section offer-banner-section">
                <div className="offer-banner-content">
                    <span className="offer-tag">LIMITED TIME OFFER</span>
                    <h2>SUMMER SALE</h2>
                    <p>UP TO 40% OFF ON SELECTED ITEMS</p>
                    <div className="offer-features">
                        <span>✨ Free Shipping</span>
                        <span>🔄 Easy Returns</span>
                        <span>💳 Secure Payment</span>
                    </div>
                    <Link to="/shop?sale=true" className="offer-btn">SHOP THE SALE</Link>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}

            <section className="section featured-section bg-surface">

                <div className="container">

                    <div className="flex-header">

                        <div className="section-header">

                            <span className="section-tag">MOST COVETED</span>
                            <h2>FEATURED PIECES</h2>

                        </div>

                        <Link to="/shop" className="view-all-link">
                            EXPLORE ALL →
                        </Link>

                    </div>

                    {!loading && featuredProducts.length > 0 ? (

                        <div className="featured-pattern-grid">

                            {featuredProducts.map((product) => (

                                <ProductCard key={product._id} product={product} />

                            ))}

                        </div>

                    ) : (

                        <div className="empty-placeholder">
                            Discovering beauty for you...
                        </div>

                    )}

                </div>

            </section>

            {/* BRAND STORY - NEW SECTION */}
            <section className="section brand-story-section">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <span className="section-tag">OUR LEGACY</span>
                            <h2>WHERE TRADITION MEETS TREND</h2>
                            <p>Since 2020, we've been curating the finest apparel that celebrates the rich heritage of craftsmanship while embracing contemporary aesthetics. Each piece tells a story of passion, precision, and perfection.</p>
                            <div className="story-stats">
                                <div className="stat">
                                    <h3>5000+</h3>
                                    <p>Happy Customers</p>
                                </div>
                                <div className="stat">
                                    <h3>1000+</h3>
                                    <p>Unique Designs</p>
                                </div>
                                <div className="stat">
                                    <h3>50+</h3>
                                    <p>Cities Covered</p>
                                </div>
                            </div>
                            {/* <Link to="/about" className="story-btn">DISCOVER OUR STORY →</Link> */}
                        </div>
                        <div className="story-image">
                            <img src="https://ellena.pk/cdn/shop/products/EZS-L3-06-01-d_50b5756a-d376-42b8-81eb-0a430695ad9b.jpg?v=1676701926&width=749" alt="Our Studio" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CUSTOMER REVIEWS - NEW SECTION */}
            <section className="section testimonials-section bg-surface">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-tag">HAPPY CUSTOMERS</span>
                        <h2>WHAT THEY SAY</h2>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="stars">★★★★★</div>
                            <p>"The quality is exceptional! The fabric feels luxurious and the fit is perfect. Definitely my new go-to for ethnic wear."</p>
                            <div className="customer">
                                <strong>- Ayesha K.</strong>
                                <span>Verified Buyer</span>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">★★★★★</div>
                            <p>"Beautiful designs and fast shipping. The outfit looked even better in person. Received so many compliments!"</p>
                            <div className="customer">
                                <strong>- Maham R.</strong>
                                <span>Verified Buyer</span>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">★★★★★</div>
                            <p>"Amazing customer service and stunning collection. The fusion wear is my absolute favorite! Will definitely order again."</p>
                            <div className="customer">
                                <strong>- salman k.</strong>
                                <span>Verified Buyer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INSTAGRAM FEED - NEW SECTION */}
            {/* <section className="section instagram-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-tag">@YOURBRAND</span>
                        <h2>INSTAGRAM INSPIRATION</h2>
                        <p>Tag us @yourbrand for a chance to be featured</p>
                    </div>

                    <div className="instagram-grid">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="insta-post" key={item}>
                                <img src={`https://img.freepik.com/premium-photo/fashion-instagram-style-post_658768-${item}123.jpg`} alt="Instagram" />
                                <div className="insta-overlay">
                                    <span>📷</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="text-center">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="insta-btn">
                            FOLLOW US @YOURBRAND
                        </a>
                    </div>
                </div>
            </section> */}

            {/* NEWSLETTER - NEW SECTION */}
            <section className="section newsletter-section">
                <div className="container">
                    <div className="newsletter-content">
                        <h2>JOIN THE CLUB</h2>
                        <p>Subscribe to get special offers, free giveaways, and exclusive deals.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <input type="email" placeholder="Enter your email address" required />
                                <button type="submit">SUBSCRIBE</button>
                            </div>
                            <label className="checkbox-label">
                                <input type="checkbox" /> I agree to receive marketing emails
                            </label>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
