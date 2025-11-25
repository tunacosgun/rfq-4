import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuoteCartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartCount } = useQuoteCart();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`).catch(() => ({ data: null }));
      setSettings(res.data);
    } catch (error) {
      console.error('Settings yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
      <Header settings={settings} />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          color: 'white',
          padding: '120px 24px 60px',
          marginTop: '72px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Link
            to="/urunler"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              textDecoration: 'none',
              marginBottom: '24px',
              fontSize: '15px',
              fontWeight: '600',
              opacity: 0.9,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
          >
            <ArrowLeft size={20} />
            Ürünlere Dön
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px'
              }}
            >
              <ShoppingCart size={32} />
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '900', margin: 0 }}>Teklif Sepetim</h1>
          </div>
          <p style={{ fontSize: '18px', opacity: 0.95 }}>
            {getCartCount() > 0
              ? `Sepetinizde ${getCartCount()} ürün var. Teklif almak için formu doldurun.`
              : 'Sepetiniz boş. Ürün ekleyerek başlayın.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '60px 24px', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {cart.length === 0 ? (
            <div className="card" style={{ padding: '80px 40px', textAlign: 'center' }}>
              <Package size={80} color="var(--text-tertiary)" style={{ margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
                Sepetiniz Boş
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Ürünleri inceleyip sepete ekleyerek teklif alabilirsiniz.
              </p>
              <Link to="/urunler">
                <Button
                  style={{
                    background: 'var(--primary-600)',
                    color: 'white',
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}
                >
                  Ürünleri İncele
                </Button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }} className="cart-grid">
              {/* Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item) => (
                  <div key={item.id} className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      {/* Product Image */}
                      <div
                        style={{
                          width: '120px',
                          height: '120px',
                          background: 'var(--gray-100)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Package size={40} color="var(--text-tertiary)" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'var(--primary-600)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {item.category}
                          </span>
                          <h3
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              margin: '4px 0',
                              color: 'var(--text-primary)'
                            }}
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                                marginTop: '8px'
                              }}
                            >
                              {item.description.substring(0, 100)}...
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'var(--gray-100)',
                              padding: '8px',
                              borderRadius: '8px'
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Minus size={16} />
                            </button>
                            <span
                              style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                minWidth: '40px',
                                textAlign: 'center'
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 16px',
                              background: 'transparent',
                              border: '1px solid #EF4444',
                              borderRadius: '8px',
                              color: '#EF4444',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#EF4444';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#EF4444';
                            }}
                          >
                            <Trash2 size={16} />
                            Kaldır
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                <button
                  onClick={handleClearCart}
                  style={{
                    padding: '12px 20px',
                    background: 'transparent',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    alignSelf: 'flex-start'
                  }}
                >
                  Sepeti Temizle
                </button>
              </div>

              {/* Summary Card */}
              <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Özet</h3>
                  
                  <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Toplam Ürün</span>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>{getCartCount()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Toplam Adet</span>
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--primary-50)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      💡 Teklif talebi gönderdikten sonra size özel fiyatlandırma ile dönüş yapılacaktır.
                    </p>
                  </div>

                  <Button
                    onClick={handleProceed}
                    style={{
                      width: '100%',
                      background: 'var(--primary-600)',
                      color: 'white',
                      height: '56px',
                      fontSize: '17px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}
                  >
                    Teklif Gönder
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
        @media (max-width: 1024px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuoteCartPage;
