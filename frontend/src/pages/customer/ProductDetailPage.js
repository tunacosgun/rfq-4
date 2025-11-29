import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Package, Plus, Minus, Star, Shield, Truck, Award } from 'lucide-react';
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
  const { addToCart, getCartCount } = useQuoteCart();

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
    addToCart(product, quantity);
    toast.success(`${quantity} adet ${product.name} sepete eklendi`);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const features = [
    { icon: Shield, text: 'Kalite Garantili' },
    { icon: Truck, text: 'Hızlı Teslimat' },
    { icon: Award, text: 'Uzman Destek' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header settings={settings} />

      <div className="container" style={styles.container}>
        <Link to="/" style={styles.backLink} data-testid="back-link">
          <ArrowLeft size={20} />
          <span>Ürünlere Geri Dön</span>
        </Link>

        <div style={styles.productDetail}>
          <div style={styles.imageSection}>
            {product.images && product.images[0] ? (
              <img
                src={product.images[0].startsWith('http') ? product.images[0] : `${BACKEND_URL}${product.images[0]}`}
                alt={product.name}
                style={styles.productImage}
                data-testid="product-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);min-height:500px;';
                  placeholder.innerHTML = '<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#7E7E7E" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                  e.target.parentElement.replaceChild(placeholder, e.target);
                }}
              />
            ) : (
              <div style={styles.placeholderImage}>
                <Package size={120} style={{ color: '#7E7E7E' }} />
              </div>
            )}
            
            {/* Features Badge */}
            <div style={styles.featuresBadge}>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(224, 108, 27, 0.1)',
                color: '#e06c1b',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                <Star size={16} />
                KALİTE GARANTİLİ
              </div>
            </div>
          </div>

          <div style={styles.infoSection}>
            <span style={styles.category} data-testid="product-category">{product.category}</span>
            <h1 style={styles.productName} data-testid="product-name">{product.name}</h1>
            <p style={styles.description} data-testid="product-description">{product.description}</p>

            {/* Features */}
            <div style={styles.featuresGrid}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} style={styles.featureItem}>
                    <div style={styles.featureIcon}>
                      <Icon size={20} color="#221E91" />
                    </div>
                    <span style={styles.featureText}>{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {product.price_range && (
              <div style={styles.priceBox}>
                <span style={styles.priceLabel}>Fiyat Aralığı:</span>
                <span style={styles.priceValue} data-testid="price-range">{product.price_range}</span>
              </div>
            )}

            {product.min_order_quantity && (
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Minimum Sipariş Miktarı:</span>
                <span style={styles.infoValue}>{product.min_order_quantity} adet</span>
              </div>
            )}

            {product.variation && (
              <div style={styles.infoBox}>
                <span style={styles.infoLabel}>Varyasyon:</span>
                <span style={styles.infoValue}>{product.variation}</span>
              </div>
            )}

            <div style={styles.quantitySection}>
              <span style={styles.quantityLabel}>Miktar:</span>
              <div style={styles.quantityControls}>
                <button
                  onClick={decrementQuantity}
                  style={styles.quantityButton}
                  data-testid="decrease-quantity"
                >
                  <Minus size={16} />
                </button>
                <span style={styles.quantityValue} data-testid="quantity-value">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  style={styles.quantityButton}
                  data-testid="increase-quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              style={styles.addToCartButton}
              data-testid="add-to-cart-button"
            >
              <ShoppingCart size={20} />
              Sepete Ekle
            </Button>

            {/* Additional Info */}
            <div style={styles.additionalInfo}>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <Truck size={20} color="#221E91" />
                </div>
                <div>
                  <h4 style={styles.infoTitle}>Hızlı Teslimat</h4>
                  <p style={styles.infoDescription}>Siparişleriniz 3-5 iş günü içinde teslim edilir</p>
                </div>
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <Shield size={20} color="#221E91" />
                </div>
                <div>
                  <h4 style={styles.infoTitle}>Güvenli Alışveriş</h4>
                  <p style={styles.infoDescription}>%100 güvenli ödeme ve iade garantisi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '140px 24px 80px',
    flex: 1
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#221E91',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '32px',
    padding: '12px 20px',
    background: 'rgba(34, 30, 145, 0.05)',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  },
  productDetail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'start'
  },
  imageSection: {
    position: 'relative'
  },
  productImage: {
    width: '100%',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(34, 30, 145, 0.15)',
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: '1',
    background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed rgba(34, 30, 145, 0.2)'
  },
  featuresBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px'
  },
  infoSection: {
    paddingTop: '24px',
  },
  category: {
    fontSize: '14px',
    color: '#e06c1b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  productName: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#221E91',
    margin: '16px 0 24px',
    lineHeight: '1.2'
  },
  description: {
    fontSize: '17px',
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '32px',
  },
  featuresGrid: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(34, 30, 145, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(34, 30, 145, 0.1)'
  },
  featureIcon: {
    width: '32px',
    height: '32px',
    background: 'white',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  featureText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#221E91'
  },
  priceBox: {
    background: 'linear-gradient(135deg, rgba(34, 30, 145, 0.05) 0%, rgba(224, 108, 27, 0.05) 100%)',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid rgba(34, 30, 145, 0.1)'
  },
  priceLabel: {
    fontSize: '14px',
    color: '#666',
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600'
  },
  priceValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#221E91',
    background: 'linear-gradient(135deg, #221E91, #e06c1b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  infoBox: {
    padding: '20px 0',
    borderBottom: '1px solid rgba(34, 30, 145, 0.1)',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: '16px',
    color: '#221E91',
    fontWeight: '700',
  },
  quantitySection: {
    padding: '32px 0',
    borderBottom: '1px solid rgba(34, 30, 145, 0.1)',
  },
  quantityLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#221E91',
    marginBottom: '16px',
    display: 'block',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  quantityButton: {
    width: '48px',
    height: '48px',
    border: '2px solid #221E91',
    background: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#221E91',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '700',
    fontSize: '18px'
  },
  quantityValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#221E91',
    minWidth: '60px',
    textAlign: 'center',
  },
  addToCartButton: {
    width: '100%',
    padding: '20px',
    marginTop: '32px',
    fontSize: '18px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(34, 30, 145, 0.3)'
  },
  additionalInfo: {
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'rgba(34, 30, 145, 0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(34, 30, 145, 0.1)'
  },
  infoIcon: {
    width: '48px',
    height: '48px',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flexShrink: 0
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#221E91',
    marginBottom: '4px'
  },
  infoDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5'
  }
};

// Media queries
const mediaQueries = `
  @media (max-width: 1024px) {
    .container {
      padding: 120px 20px 60px;
    }
    
    .product-detail {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    
    .product-name {
      font-size: 36px;
    }
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 100px 16px 40px;
    }
    
    .product-name {
      font-size: 32px;
    }
    
    .price-value {
      font-size: 28px;
    }
    
    .features-grid {
      flex-direction: column;
    }
    
    .additional-info {
      flex-direction: column;
    }
  }
  
  @media (max-width: 480px) {
    .product-name {
      font-size: 28px;
    }
    
    .quantity-controls {
      gap: 12px;
    }
    
    .quantity-button {
      width: 40px;
      height: 40px;
    }
  }
`;

// Add media queries to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = mediaQueries;
  document.head.appendChild(style);
}

export default ProductDetailPage;