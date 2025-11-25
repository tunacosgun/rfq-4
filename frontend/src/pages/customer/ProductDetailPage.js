import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Package, Plus, Minus } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getCartCount } = useQuoteCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="product-detail-page">
      {/* Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerContainer}>
          <Link to="/" style={styles.logo}>
            <Package size={32} />
            <span style={styles.logoText}>Teklif Sistemi</span>
          </Link>
          <Link to="/teklif-sepeti" style={styles.cartButton}>
            <ShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span style={styles.cartBadge}>{getCartCount()}</span>
            )}
          </Link>
        </div>
      </header>

      <div className="container" style={styles.container}>
        <Link to="/" style={styles.backLink} data-testid="back-link">
          <ArrowLeft size={20} />
          <span>Geri Dön</span>
        </Link>

        <div style={styles.productDetail}>
          <div style={styles.imageSection}>
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={styles.productImage}
                data-testid="product-image"
              />
            ) : (
              <div style={styles.placeholderImage}>
                <Package size={120} style={{ color: '#7E7E7E' }} />
              </div>
            )}
          </div>

          <div style={styles.infoSection}>
            <span style={styles.category} data-testid="product-category">{product.category}</span>
            <h1 style={styles.productName} data-testid="product-name">{product.name}</h1>
            <p style={styles.description} data-testid="product-description">{product.description}</p>

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
              Sepete Ekle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    background: 'white',
    borderBottom: '1px solid #ececec',
    padding: '16px 0',
    marginBottom: '32px',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#3BB77E',
    textDecoration: 'none',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '24px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  cartButton: {
    position: 'relative',
    padding: '10px',
    color: '#253D4E',
    textDecoration: 'none',
  },
  cartBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: '#FF6B6B',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
  },
  container: {
    padding: '32px 20px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3BB77E',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '32px',
  },
  productDetail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'start',
  },
  imageSection: {
    position: 'sticky',
    top: '100px',
  },
  productImage: {
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: '1',
    background: '#F4F6FA',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    paddingTop: '24px',
  },
  category: {
    fontSize: '14px',
    color: '#3BB77E',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#253D4E',
    margin: '12px 0 24px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  description: {
    fontSize: '16px',
    color: '#7E7E7E',
    lineHeight: '1.8',
    marginBottom: '32px',
  },
  priceBox: {
    background: '#F4F6FA',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  priceLabel: {
    fontSize: '14px',
    color: '#7E7E7E',
    display: 'block',
    marginBottom: '8px',
  },
  priceValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#3BB77E',
  },
  infoBox: {
    padding: '16px 0',
    borderBottom: '1px solid #ececec',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#7E7E7E',
    display: 'block',
    marginBottom: '8px',
  },
  infoValue: {
    fontSize: '16px',
    color: '#253D4E',
    fontWeight: '600',
  },
  quantitySection: {
    padding: '24px 0',
    borderBottom: '1px solid #ececec',
  },
  quantityLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#253D4E',
    marginBottom: '12px',
    display: 'block',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  quantityButton: {
    width: '40px',
    height: '40px',
    border: '2px solid #3BB77E',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3BB77E',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quantityValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#253D4E',
    minWidth: '60px',
    textAlign: 'center',
  },
  addToCartButton: {
    width: '100%',
    padding: '16px',
    marginTop: '32px',
    fontSize: '18px',
    fontWeight: '600',
    background: '#3BB77E',
    color: 'white',
  },
};

// Media queries
if (typeof window !== 'undefined' && window.innerWidth <= 768) {
  styles.productDetail.gridTemplateColumns = '1fr';
  styles.productDetail.gap = '32px';
}

export default ProductDetailPage;