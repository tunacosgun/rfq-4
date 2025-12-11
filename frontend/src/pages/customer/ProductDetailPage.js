import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Plus,
  Minus,
  Star,
  Shield,
  Truck,
  Award,
  Heart,
  Share2,
  Check
} from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useQuoteCart();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, settingsRes] = await Promise.all([
        axios.get(`${API}/products/${id}`),
        axios.get(`${API}/settings`).catch(() => ({ data: null }))
      ]);
      setProduct(productRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      toast.error('Ürün yüklenemedi');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    toast.success(`${quantity} adet ${product.name} sepete eklendi`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    toast.success(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı!');
    }
  };

  const features = [
    { icon: Shield, text: 'Kalite Garantili', description: 'Tüm ürünlerimiz test edilmiştir' },
    { icon: Truck, text: 'Hızlı Teslimat', description: '3-5 iş günü içinde' },
    { icon: Award, text: 'Uzman Destek', description: '7/24 müşteri hizmetleri' }
  ];

  if (loading || !product) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Yükleniyor...</p>
        </div>

        <style>{`
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          }
          .loading-content {
            text-align: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(224, 108, 27, 0.1);
            border-top-color: #e06c1b;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            font-size: 16px;
            color: #666;
            font-weight: 600;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0 ? product.images : [null];

  return (
    <div className="page-wrapper">
      <Header settings={settings} />

      <div className="container">
        <div className="breadcrumb">
          <Link to="/urunler" className="back-link">
            <ArrowLeft size={20} />
            <span>Ürünlere Geri Dön</span>
          </Link>
        </div>

        <div className="product-detail">
          {/* Image Section */}
          <div className="image-section">
            <div className="main-image-wrapper">
              {productImages[selectedImage] ? (
                <img
                  src={
                    productImages[selectedImage].startsWith('http')
                      ? productImages[selectedImage]
                      : `${BACKEND_URL}${productImages[selectedImage]}`
                  }
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder-image';
                    placeholder.innerHTML =
                      '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                    e.target.parentElement.replaceChild(placeholder, e.target);
                  }}
                />
              ) : (
                <div className="placeholder-image">
                  <Package size={80} style={{ color: '#7E7E7E' }} />
                </div>
              )}

              <div className="image-badges">
                <div className="quality-badge">
                  <Star size={14} />
                  <span>KALİTE GARANTİLİ</span>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={toggleFavorite}
                  className={`action-button ${isFavorite ? 'active' : ''}`}
                  title="Favorilere Ekle"
                >
                  <Heart size={18} fill={isFavorite ? '#e06c1b' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="action-button"
                  title="Paylaş"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="thumbnails-wrapper">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${
                      selectedImage === index ? 'active' : ''
                    }`}
                  >
                    {img ? (
                      <img
                        src={img.startsWith('http') ? img : `${BACKEND_URL}${img}`}
                        alt={`${product.name} ${index + 1}`}
                        className="thumbnail-image"
                      />
                    ) : (
                      <Package size={24} style={{ color: '#7E7E7E' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="header-section">
              {product.category && (
                <span className="category">{product.category}</span>
              )}
              <h1 className="product-name">{product.name}</h1>
              {product.description && (
                <p className="description">{product.description}</p>
              )}
            </div>

            {/* Features Grid */}
            <div className="features-grid">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">
                      <Icon size={20} />
                    </div>
                    <div className="feature-content">
                      <span className="feature-title">{feature.text}</span>
                      <span className="feature-description">
                        {feature.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Section */}
            {product.price_range && (
              <div className="price-section">
                <div className="price-content">
                  <span className="price-label">Fiyat Aralığı</span>
                  <span className="price-value">{product.price_range}</span>
                </div>
                <div className="price-note">
                  <Check size={14} />
                  <span>Toplu siparişlerde indirim fırsatı</span>
                </div>
              </div>
            )}

            {/* Product Info Cards */}
            <div className="info-cards">
              {product.min_order_quantity && (
                <div className="info-card">
                  <div className="info-card-header">
                    <Package size={16} />
                    <span className="info-card-title">Minimum Sipariş</span>
                  </div>
                  <span className="info-card-value">
                    {product.min_order_quantity} adet
                  </span>
                </div>
              )}

              {product.variation && (
                <div className="info-card">
                  <div className="info-card-header">
                    <Star size={16} />
                    <span className="info-card-title">Varyasyon</span>
                  </div>
                  <span className="info-card-value">{product.variation}</span>
                </div>
              )}
            </div>

            {/* Quantity Section */}
            <div className="quantity-section">
              <span className="quantity-label">Miktar Seçin</span>
              <div className="quantity-controls">
                <button
                  onClick={decrementQuantity}
                  className="quantity-button"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="quantity-display">
                  <span className="quantity-value">{quantity}</span>
                  <span className="quantity-unit">adet</span>
                </div>
                <button onClick={incrementQuantity} className="quantity-button">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} className="add-to-cart-button">
              {addedToCart ? (
                <>
                  <Check size={20} />
                  <span>Sepete Eklendi</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>Sepete Ekle</span>
                </>
              )}
            </Button>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="delivery-info">
                <div className="info-icon-wrapper">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="info-title">Ücretsiz Teslimat</h4>
                  <p className="info-text">
                    500 TL ve üzeri siparişlerde kargo bedava
                  </p>
                </div>
              </div>

              <div className="security-info">
                <div className="info-icon-wrapper">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="info-title">Güvenli Alışveriş</h4>
                  <p className="info-text">
                    256-bit SSL sertifikası ile korumalı altyapı
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 140px 40px 100px;
          flex: 1;
          width: 100%;
        }

        .breadcrumb {
          margin-bottom: 48px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #e06c1b;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 24px;
          background: white;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 12px rgba(34, 30, 145, 0.08);
          border: 2px solid transparent;
        }

        .back-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(34, 30, 145, 0.15);
          border-color: rgba(224, 108, 27, 0.2);
        }

        .product-detail {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        .image-section {
          position: sticky;
          top: 140px;
        }

        .main-image-wrapper {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: white;
          box-shadow: 0 20px 60px rgba(34, 30, 145, 0.12);
          border: 1px solid rgba(34, 30, 145, 0.05);
        }

        .product-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
        }

        .placeholder-image {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px dashed rgba(34, 30, 145, 0.15);
        }

        .image-badges {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 12px;
        }

        .quality-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          color: #e06c1b;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 2px solid rgba(224, 108, 27, 0.2);
        }

        .action-buttons {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-button {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          color: #e06c1b;
        }

        .action-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
        }

        .action-button.active {
          background: rgba(224, 108, 27, 0.1);
        }

        .thumbnails-wrapper {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          overflow-x: auto;
          padding: 4px;
          -webkit-overflow-scrolling: touch;
        }

        .thumbnails-wrapper::-webkit-scrollbar {
          height: 6px;
        }

        .thumbnails-wrapper::-webkit-scrollbar-track {
          background: rgba(34, 30, 145, 0.05);
          border-radius: 10px;
        }

        .thumbnails-wrapper::-webkit-scrollbar-thumb {
          background: #e06c1b;
          border-radius: 10px;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(34, 30, 145, 0.1);
        }

        .thumbnail:hover {
          transform: scale(1.05);
        }

        .thumbnail.active {
          border: 3px solid #e06c1b;
          transform: scale(1.05);
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .header-section {
          padding-bottom: 28px;
          border-bottom: 2px solid rgba(34, 30, 145, 0.08);
        }

        .category {
          display: inline-block;
          font-size: 12px;
          color: #e06c1b;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 14px;
          background: rgba(224, 108, 27, 0.1);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .product-name {
          font-size: 42px;
          font-weight: 900;
          color: #e06c1b;
          margin: 0 0 16px;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .description {
          font-size: 16px;
          color: #555;
          line-height: 1.7;
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px;
          background: white;
          border-radius: 14px;
          border: 2px solid rgba(34, 30, 145, 0.08);
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .feature-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .feature-icon {
          width: 42px;
          height: 42px;
          background: rgba(224, 108, 27, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #e06c1b;
        }

        .feature-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .feature-title {
          font-size: 14px;
          font-weight: 800;
          color: #e06c1b;
        }

        .feature-description {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        .price-section {
          background: linear-gradient(
            135deg,
            rgba(224, 108, 27, 0.08) 0%,
            rgba(224, 108, 27, 0.03) 100%
          );
          padding: 28px;
          border-radius: 18px;
          border: 2px solid rgba(224, 108, 27, 0.15);
        }

        .price-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .price-label {
          font-size: 13px;
          color: #666;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-value {
          font-size: 36px;
          font-weight: 900;
          color: #e06c1b;
          letter-spacing: -1px;
        }

        .price-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 8px;
          font-size: 13px;
          color: #059669;
          font-weight: 600;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
        }

        .info-card {
          padding: 20px;
          background: white;
          border-radius: 14px;
          border: 2px solid rgba(34, 30, 145, 0.08);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e06c1b;
        }

        .info-card-title {
          font-size: 12px;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-card-value {
          font-size: 18px;
          font-weight: 800;
          color: #e06c1b;
        }

        .quantity-section {
          padding: 28px;
          background: white;
          border-radius: 18px;
          border: 2px solid rgba(34, 30, 145, 0.08);
        }

        .quantity-label {
          font-size: 14px;
          font-weight: 800;
          color: #e06c1b;
          margin-bottom: 18px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }

        .quantity-button {
          width: 48px;
          height: 48px;
          border: 3px solid #e06c1b;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e06c1b;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 800;
        }

        .quantity-button:hover:not(:disabled) {
          background: #e06c1b;
          color: white;
          transform: scale(1.05);
        }

        .quantity-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .quantity-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 70px;
        }

        .quantity-value {
          font-size: 32px;
          font-weight: 900;
          color: #e06c1b;
          line-height: 1;
        }

        .quantity-unit {
          font-size: 12px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-to-cart-button {
          width: 100%;
          padding: 20px;
          font-size: 16px;
          font-weight: 800;
          background: linear-gradient(135deg, #e06c1b 0%, #d45a0a 100%);
          color: white;
          border: none;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 12px 32px rgba(224, 108, 27, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
        }

        .add-to-cart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(224, 108, 27, 0.45);
        }

        .additional-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          padding-top: 28px;
          border-top: 2px solid rgba(34, 30, 145, 0.08);
        }

        .delivery-info,
        .security-info {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: rgba(224, 108, 27, 0.05);
          border-radius: 14px;
          border: 2px solid rgba(224, 108, 27, 0.1);
        }

        .security-info {
          background: rgba(34, 30, 145, 0.04);
          border-color: rgba(34, 30, 145, 0.08);
        }

        .info-icon-wrapper {
          width: 44px;
          height: 44px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #e06c1b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .info-title {
          font-size: 14px;
          font-weight: 800;
          color: #e06c1b;
          margin: 0 0 4px;
        }

        .info-text {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        /* RESPONSIVE STYLES */
        @media (max-width: 1200px) {
          .container {
            padding: 120px 32px 80px;
          }

          .product-detail {
            gap: 60px;
          }

          .product-name {
            font-size: 38px;
          }
        }

        @media (max-width: 1024px) {
          .container {
            padding: 110px 24px 70px;
          }

          .product-detail {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .image-section {
            position: relative;
            top: 0;
          }

          .product-name {
            font-size: 36px;
          }

          .price-value {
            font-size: 32px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 100px 20px 60px;
          }

          .breadcrumb {
            margin-bottom: 32px;
          }

          .back-link {
            font-size: 14px;
            padding: 12px 18px;
          }

          .product-detail {
            gap: 32px;
          }

          .product-name {
            font-size: 28px;
          }

          .description {
            font-size: 15px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .price-section {
            padding: 24px;
          }

          .price-value {
            font-size: 28px;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }

          .quantity-section {
            padding: 24px;
          }

          .quantity-controls {
            gap: 20px;
          }

          .additional-info {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .image-badges {
            top: 16px;
            left: 16px;
          }

          .action-buttons {
            top: 16px;
            right: 16px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 90px 16px 50px;
          }

          .back-link {
            font-size: 13px;
            padding: 10px 16px;
            gap: 8px;
          }

          .back-link svg {
            width: 16px;
            height: 16px;
          }

          .product-name {
            font-size: 24px;
          }

          .category {
            font-size: 11px;
            padding: 6px 12px;
          }

          .description {
            font-size: 14px;
          }

          .quality-badge {
            padding: 8px 12px;
            font-size: 10px;
            gap: 6px;
          }

          .quality-badge svg {
            width: 12px;
            height: 12px;
          }

          .action-button {
            width: 40px;
            height: 40px;
          }

          .action-button svg {
            width: 16px;
            height: 16px;
          }

          .feature-item {
            padding: 14px;
            gap: 12px;
          }

          .feature-icon {
            width: 38px;
            height: 38px;
          }

          .feature-icon svg {
            width: 18px;
            height: 18px;
          }

          .feature-title {
            font-size: 13px;
          }

          .feature-description {
            font-size: 11px;
          }

          .price-section {
            padding: 20px;
          }

          .price-value {
            font-size: 26px;
          }

          .price-note {
            padding: 8px 12px;
            font-size: 12px;
            gap: 6px;
          }

          .info-card {
            padding: 16px;
          }

          .info-card-value {
            font-size: 16px;
          }

          .quantity-section {
            padding: 20px;
          }

          .quantity-button {
            width: 42px;
            height: 42px;
          }

          .quantity-button svg {
            width: 14px;
            height: 14px;
          }

          .quantity-controls {
            gap: 16px;
          }

          .quantity-display {
            min-width: 60px;
          }

          .quantity-value {
            font-size: 28px;
          }

          .quantity-unit {
            font-size: 11px;
          }

          .add-to-cart-button {
            padding: 18px;
            font-size: 14px;
            gap: 8px;
          }

          .add-to-cart-button svg {
            width: 18px;
            height: 18px;
          }

          .delivery-info,
          .security-info {
            padding: 16px;
            gap: 12px;
          }

          .info-icon-wrapper {
            width: 38px;
            height: 38px;
          }

          .info-icon-wrapper svg {
            width: 18px;
            height: 18px;
          }

          .info-title {
            font-size: 13px;
          }

          .info-text {
            font-size: 11px;
          }

          .thumbnail {
            width: 70px;
            height: 70px;
          }

          .thumbnail svg {
            width: 20px;
            height: 20px;
          }

          .thumbnails-wrapper {
            gap: 10px;
            margin-top: 12px;
          }
        }

        @media (max-width: 360px) {
          .container {
            padding: 80px 12px 40px;
          }

          .product-name {
            font-size: 22px;
          }

          .price-value {
            font-size: 24px;
          }

          .quantity-value {
            font-size: 24px;
          }

          .add-to-cart-button {
            font-size: 13px;
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;