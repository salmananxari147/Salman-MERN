import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Shop.css';

const DUMMY_CATEGORIES = [
    { _id: 'c1', name: 'Unstitched' },
    { _id: 'c2', name: 'Prêt' },
    { _id: 'c3', name: 'Luxury Options' }
];

const DUMMY_PRODUCTS = [
    {
        _id: 'd1',
        name: 'Crimson Velvet Ensemble',
        basePricePerGaz: 3500,
        images: ['https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2670&auto=format&fit=crop'],
        category: { name: 'Unstitched' },
        inStock: true
    },
    {
        _id: 'd2',
        name: 'Midnight Blue Silk',
        basePricePerGaz: 2800,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059f581ce?q=80&w=2670&auto=format&fit=crop'],
        category: { name: 'Unstitched' },
        inStock: true
    },
    {
        _id: 'd4',
        name: 'Pastel Garden Organza',
        basePricePerGaz: 1950,
        images: ['https://images.unsplash.com/photo-1610419355150-13f88f000302?q=80&w=2670&auto=format&fit=crop'],
        category: { name: 'Unstitched' },
        inStock: true
    },
    {
        _id: 'd3',
        name: 'Stitched Emerald Elegance',
        basePricePerGaz: 9500,
        images: ['https://images.unsplash.com/photo-1613061527119-568ef968da0e?q=80&w=2670&auto=format&fit=crop'],
        category: { name: 'Prêt' },
        inStock: true
    }
];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    const location = useLocation();

    useEffect(() => {
        // Check URL for category query param
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');

        if (categoryParam) {
            setActiveCategory(categoryParam.toLowerCase());
        } else {
            setActiveCategory('all');
        }
    }, [location]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Categories
                const { data: cats } = await api.get('/categories');
                setCategories(cats);

                // Map activeCategory literal (e.g. 'unstitched') to its Mongo ID if exists
                let categoryId = '';
                if (activeCategory !== 'all') {
                    const matchedCategory = cats.find(
                        (c) => c.name.toLowerCase() === activeCategory
                    );
                    if (matchedCategory) {
                        categoryId = matchedCategory._id;
                    }
                }

                // Fetch Products
                const endpoint = categoryId ? `/products?category=${categoryId}` : '/products';
                const { data: prods } = await api.get(endpoint);
                setProducts(prods);

            } catch (error) {
                console.error('Error fetching shop data:', error);

                // Fallback to dummy data
                setCategories(DUMMY_CATEGORIES);
                if (activeCategory === 'all') {
                    setProducts(DUMMY_PRODUCTS);
                } else {
                    const filtered = DUMMY_PRODUCTS.filter(p => p.category.name.toLowerCase() === activeCategory);
                    setProducts(filtered);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeCategory]);

    return (
        <div className="shop-page container section">
            <div className="shop-header text-center">
                <h1 className="shop-title">Our Collection</h1>
                <p className="shop-subtitle">Discover handcrafted elegance tailored for every occasion.</p>
            </div>

            <div className="shop-layout">
                {/* Sidebar Filters */}
                <aside className="shop-sidebar">
                    <h3>Categories</h3>
                    <ul className="category-filters">
                        <li
                            className={activeCategory === 'all' ? 'active' : ''}
                            onClick={() => setActiveCategory('all')}
                        >
                            All Collections
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat._id}
                                className={activeCategory === cat.name.toLowerCase() ? 'active' : ''}
                                onClick={() => setActiveCategory(cat.name.toLowerCase())}
                            >
                                {cat.name}
                            </li>
                        ))}
                        {/* Fallback hardcoded for frontend UI if DB is empty during dev */}
                        {categories.length === 0 && (
                            <>
                                <li
                                    className={activeCategory === 'unstitched' ? 'active' : ''}
                                    onClick={() => setActiveCategory('unstitched')}
                                >
                                    Unstitched
                                </li>
                                <li
                                    className={activeCategory === 'pret' ? 'active' : ''}
                                    onClick={() => setActiveCategory('pret')}
                                >
                                    Prêt
                                </li>
                            </>
                        )}
                    </ul>
                </aside>

                {/* Product Grid */}
                <div className="shop-main">
                    {loading ? (
                        <div className="loader-container">Loading collection...</div>
                    ) : products.length > 0 ? (
                        <div className="grid shop-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <h3>No products found in this category.</h3>
                            <p>Please check back later or browse our other collections.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setActiveCategory('all')}
                                style={{ marginTop: '1rem' }}
                            >
                                View All
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
