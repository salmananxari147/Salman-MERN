import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiX, FiArrowLeft, FiPlus } from 'react-icons/fi';
import api from '../../utils/api';
import './AdminProductEdit.css';

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fabricDetails, setFabricDetails] = useState('');
    const [basePricePerGaz, setBasePricePerGaz] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]); // File objects for upload
    const [previewImages, setPreviewImages] = useState([]); // URLs/Base64 for preview
    const [existingImages, setExistingImages] = useState([]); // URLs for already uploaded images
    const [showOnHome, setShowOnHome] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        const fetchProductData = async () => {
            if (!isEdit) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${id}`);
                setName(data.name);
                setDescription(data.description);
                setFabricDetails(data.fabricDetails);
                setBasePricePerGaz(data.basePricePerGaz);
                setDiscountPrice(data.discountPrice || 0);
                setCountInStock(data.countInStock || 0);
                setCategory(data.category?._id || data.category);
                setExistingImages(data.images);
                setShowOnHome(data.showOnHome || false);
                setIsFeatured(data.isFeatured || false);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchProductData();
    }, [id, isEdit]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);

        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...previews]);
    };

    const removeNewImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const removeExistingImage = (index) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('fabricDetails', fabricDetails);
        formData.append('basePricePerGaz', basePricePerGaz);
        formData.append('discountPrice', discountPrice);
        formData.append('countInStock', countInStock);
        formData.append('category', category);

        // Append existing images that were NOT removed
        existingImages.forEach(img => formData.append('existingImages', img));

        // Append new images
        images.forEach(img => formData.append('images', img));
        formData.append('showOnHome', showOnHome);
        formData.append('isFeatured', isFeatured);

        try {
            if (isEdit) {
                await api.put(`/products/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Save failed:', error);
            alert(error.response?.data?.message || 'Failed to save product');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="loader">Loading Product...</div>;

    return (
        <div className="admin-edit-page container section">
            <header className="page-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back to Dashboard
                </button>
                <h1>{isEdit ? 'Edit Piece' : 'Add New Masterpiece'}</h1>
            </header>

            <form className="admin-product-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Left: General Info */}
                    <div className="form-column">
                        <section className="form-section">
                            <h3>General Information</h3>
                            <div className="input-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    className="input-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="e.g. Signature Crimson Silk Unstitched"
                                />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    className="input-control"
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="input-group">
                                <label>Fabric & Craft Details</label>
                                <textarea
                                    className="input-control"
                                    rows="3"
                                    value={fabricDetails}
                                    onChange={(e) => setFabricDetails(e.target.value)}
                                    placeholder="e.g. Pure 100% Raw Silk with hand-woven Tilla work"
                                ></textarea>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3>Pricing & Inventory</h3>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Base Price (1 Gaz)</label>
                                    <input
                                        type="number"
                                        className="input-control"
                                        value={basePricePerGaz}
                                        onChange={(e) => setBasePricePerGaz(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Discount Price (Optional)</label>
                                    <input
                                        type="number"
                                        className="input-control"
                                        value={discountPrice}
                                        onChange={(e) => setDiscountPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Stock Count</label>
                                    <input
                                        type="number"
                                        className="input-control"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <select
                                        className="input-control"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={showOnHome}
                                            onChange={(e) => setShowOnHome(e.target.checked)}
                                        />
                                        <span>Show on Home Page</span>
                                    </label>
                                </div>
                                <div className="input-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                        />
                                        <span>Featured Product (Most Coveted)</span>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Media Management */}
                    <div className="form-column">
                        <section className="form-section media-section">
                            <h3>Product Imagery</h3>
                            <p className="helper-text">Add up to 8 high-resolution images. The first image will be the primary view.</p>

                            <div className="image-manager-grid">
                                {/* Upload Trigger */}
                                <label className="upload-trigger">
                                    <input type="file" multiple onChange={handleFileChange} accept="image/*" hidden />
                                    <FiPlus size={32} />
                                    <span>Add Images</span>
                                </label>

                                {/* Previews of new images */}
                                {previewImages.map((src, idx) => (
                                    <div key={`new-${idx}`} className="image-preview-card">
                                        <img src={src} alt="" />
                                        <button type="button" className="remove-btn" onClick={() => removeNewImage(idx)}>
                                            <FiX />
                                        </button>
                                        {idx === 0 && !existingImages.length && <span className="main-tag">MAIN</span>}
                                    </div>
                                ))}

                                {/* Previews of existing images */}
                                {existingImages.map((src, idx) => (
                                    <div key={`old-${idx}`} className="image-preview-card existing">
                                        <img src={src} alt="" />
                                        <button type="button" className="remove-btn" onClick={() => removeExistingImage(idx)}>
                                            <FiX />
                                        </button>
                                        {idx === 0 && <span className="main-tag">MAIN</span>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="form-actions mt-4">
                            <button type="submit" className="btn btn-primary btn-block" disabled={uploading}>
                                {uploading ? 'Processing Masterpiece...' : isEdit ? 'Update Collection' : 'Release to Collection'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEdit;
