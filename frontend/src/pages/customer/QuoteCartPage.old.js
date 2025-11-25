import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, Trash2, Plus, Minus } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const QuoteCartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartCount } = useQuoteCart();

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} sepetten çıkarıldı`);
  };

  const handleClearCart = () => {
    if (window.confirm('Sepeti temizlemek istediğinizden emin misiniz?')) {
      clearCart();
      toast.success('Sepet temizlendi');
    }
  };

  const handleProceed = () => {
    if (cart.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }
    navigate('/teklif-gonder');
  };

  return (
    <div data-testid="quote-cart-page">
      <header style={styles.header}>
        <div className="container" style={styles.headerContainer}>
          <Link to="/" style={styles.logo}>
            <Package size={32} />
            <span style={styles.logoText}>Teklif Sistemi</span>
          </Link>
          <div style={styles.cartIndicator}>
            <ShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span style={styles.cartBadge}>{getCartCount()}</span>
            )}
          </div>
        </div>
      </header>

      <div className="container" style={styles.container}>
        <Link to="/" style={styles.backLink} data-testid="back-link">
          <ArrowLeft size={20} />
          <span>Alışverişe Devam Et</span>
        </Link>

        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Teklif Sepeti</h1>
          {cart.length > 0 && (
            <Button
              onClick={handleClearCart}
              variant="outline"
              style={styles.clearButton}
              data-testid="clear-cart-button"
            >
              Sepeti Temizle
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={styles.emptyCart}>
            <ShoppingCart size={80} style={{ color: '#7E7E7E' }} />
            <h2 style={styles.emptyTitle}>Sepetiniz Boş</h2>
            <p style={styles.emptyText}>
              Ürünleri inceleyip sepete ekleyerek teklif talebinde bulunabilirsiniz.
            </p>
            <Link to="/">
              <Button style={styles.shopButton}>Alışverişe Başla</Button>
            </Link>
          </div>
        ) : (
          <div style={styles.cartContent}>
            <div style={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.id} style={styles.cartItem} className="card" data-testid={`cart-item-${item.id}`}>
                  <div style={styles.itemImage}>
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.name} style={styles.itemImg} />
                    ) : (
                      <div style={styles.placeholderImg}>
                        <Package size={40} style={{ color: '#7E7E7E' }} />
                      </div>
                    )}
                  </div>

                  <div style={styles.itemInfo}>
                    <div>
                      <span style={styles.itemCategory}>{item.category}</span>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      {item.price_range && (
                        <p style={styles.itemPrice}>{item.price_range}</p>
                      )}
                    </div>
                  </div>

                  <div style={styles.quantitySection}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                      data-testid={`decrease-quantity-${item.id}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={styles.quantityValue} data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                      data-testid={`increase-quantity-${item.id}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    style={styles.removeButton}
                    data-testid={`remove-item-${item.id}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.cartSummary} className="card">
              <h2 style={styles.summaryTitle}>Sepet Özeti</h2>
              <div style={styles.summaryRow}>
                <span>Toplam Ürün:</span>
                <span style={styles.summaryValue}>{cart.length} çeşit</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Toplam Adet:</span>
                <span style={styles.summaryValue}>{getCartCount()} adet</span>
              </div>
              <div style={styles.summaryNote}>
                <p>ℹ️ Bu sayfada fiyatlandırma gösterimi yoktur. Teklif gönderdiğinizde ürünleriniz ve miktarları ilgili ekibe iletilir.</p>
              </div>
              <Button
                onClick={handleProceed}
                style={styles.proceedButton}
                data-testid="proceed-button"
              >
                Teklif Gönder
              </Button>
            </div>
          </div>
        )}
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
  cartIndicator: {
    position: 'relative',
    padding: '10px',
    color: '#253D4E',
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
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#253D4E',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  clearButton: {
    color: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#253D4E',
    margin: '24px 0 12px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#7E7E7E',
    marginBottom: '32px',
  },
  shopButton: {
    background: '#3BB77E',
    color: 'white',
  },
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '32px',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '24px',
  },
  itemImage: {
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImg: {
    width: '100%',
    height: '100%',
    background: '#F4F6FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemCategory: {
    fontSize: '12px',
    color: '#3BB77E',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#253D4E',
    margin: '8px 0',
  },
  itemPrice: {
    fontSize: '16px',
    color: '#7E7E7E',
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  quantityButton: {
    width: '36px',
    height: '36px',
    border: '2px solid #3BB77E',
    background: 'white',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3BB77E',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  quantityValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#253D4E',
    minWidth: '40px',
    textAlign: 'center',
  },
  removeButton: {
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: '#FF6B6B',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cartSummary: {
    height: 'fit-content',
    position: 'sticky',
    top: '100px',
  },
  summaryTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#253D4E',
    marginBottom: '24px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #ececec',
    fontSize: '16px',
    color: '#7E7E7E',
  },
  summaryValue: {
    fontWeight: '600',
    color: '#253D4E',
  },
  summaryNote: {
    background: '#F4F6FA',
    padding: '16px',
    borderRadius: '8px',
    margin: '24px 0',
    fontSize: '14px',
    color: '#7E7E7E',
    lineHeight: '1.6',
  },
  proceedButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: '600',
    background: '#3BB77E',
    color: 'white',
  },
};

export default QuoteCartPage;