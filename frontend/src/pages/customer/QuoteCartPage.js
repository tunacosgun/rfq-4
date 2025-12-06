import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
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
  const { cart, removeFromCart, updateQuantity, clearCart, getCartCount } =
    useQuoteCart();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios
        .get(`${API}/settings`)
        .catch(() => ({ data: null }));
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
      }}
    >
      <Header settings={settings} />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
          color: 'white',
          padding: '140px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 30% 50%, rgba(224, 108, 27, 0.15) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        ></div>

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
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
              transition: 'all 0.2s',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
          >
            <ArrowLeft size={20} />
            Ürünlere Dön
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'rgba(224, 108, 27, 0.2)',
                borderRadius: '16px',
                border: '1px solid rgba(224, 108, 27, 0.3)',
              }}
            >
              <ShoppingCart size={32} color="#e06c1b" />
            </div>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Star size={14} />
                TEKLİF SEPETİ
              </div>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #e06c1b, #f0833a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Teklif Sepetim
                </span>
              </h1>
            </div>
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
            <div
              className="card"
              style={{
                padding: '80px 40px',
                textAlign: 'center',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(34, 30, 145, 0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <Package
                size={80}
                color="#221E91"
                style={{ margin: '0 auto 24px' }}
              />
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#221E91',
                }}
              >
                Sepetiniz Boş
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: '#666',
                  marginBottom: '32px',
                }}
              >
                Ürünleri inceleyip sepete ekleyerek teklif alabilirsiniz.
              </p>
              <Link to="/urunler">
                <Button
                  style={{
                    background:
                      'linear-gradient(135deg, #221E91, #1a1775)',
                    color: 'white',
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow:
                      '0 4px 12px rgba(34, 30, 145, 0.3)',
                  }}
                >
                  Ürünleri İncele
                </Button>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '32px',
              }}
              className="cart-grid"
            >
              {/* Cart Items */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '24px',
                      background: 'white',
                      borderRadius: '16px',
                      border:
                        '1px solid rgba(34, 30, 145, 0.1)',
                      boxShadow:
                        '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{ display: 'flex', gap: '24px' }}
                      className="cart-item"
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          width: '120px',
                          height: '120px',
                          background:
                            'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border:
                            '1px solid rgba(34, 30, 145, 0.1)',
                        }}
                      >
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain', // <=== burada da taşma yok
                              display: 'block',
                            }}
                          />
                        ) : (
                          <Package
                            size={40}
                            color="#221E91"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#e06c1b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {item.category}
                          </span>
                          <h3
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              margin: '4px 0',
                              color: '#221E91',
                            }}
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              style={{
                                fontSize: '14px',
                                color: '#666',
                                marginTop: '8px',
                                lineHeight: 1.5,
                              }}
                            >
                              {item.description.substring(
                                0,
                                100,
                              )}
                              ...
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginTop: '16px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background:
                                'rgba(34, 30, 145, 0.05)',
                              padding: '8px',
                              borderRadius: '10px',
                              border:
                                '1px solid rgba(34, 30, 145, 0.1)',
                            }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(
                                    1,
                                    item.quantity - 1,
                                  ),
                                )
                              }
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                border:
                                  '1px solid #221E91',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: '#221E91',
                                fontWeight: '700',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  '#221E91';
                                e.currentTarget.style.color =
                                  'white';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  'white';
                                e.currentTarget.style.color =
                                  '#221E91';
                              }}
                            >
                              <Minus size={16} />
                            </button>
                            <span
                              style={{
                                fontSize: '16px',
                                fontWeight: '800',
                                minWidth: '40px',
                                textAlign: 'center',
                                color: '#221E91',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                )
                              }
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                border:
                                  '1px solid #221E91',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: '#221E91',
                                fontWeight: '700',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  '#221E91';
                                e.currentTarget.style.color =
                                  'white';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  'white';
                                e.currentTarget.style.color =
                                  '#221E91';
                              }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              handleRemove(
                                item.id,
                                item.name,
                              )
                            }
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 16px',
                              background: 'transparent',
                              border:
                                '1px solid #EF4444',
                              borderRadius: '8px',
                              color: '#EF4444',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                '#EF4444';
                              e.currentTarget.style.color =
                                'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                'transparent';
                              e.currentTarget.style.color =
                                '#EF4444';
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
                    border:
                      '1px solid rgba(34, 30, 145, 0.2)',
                    borderRadius: '8px',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    alignSelf: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor =
                      '#EF4444';
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'transparent';
                    e.currentTarget.style.borderColor =
                      'rgba(34, 30, 145, 0.2)';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  Sepeti Temizle
                </button>
              </div>

              {/* Summary Card */}
              <div
                style={{
                  position: 'sticky',
                  top: '100px',
                  height: 'fit-content',
                }}
              >
                <div
                  className="card"
                  style={{
                    padding: '32px',
                    background: 'white',
                    borderRadius: '16px',
                    border:
                      '1px solid rgba(34, 30, 145, 0.1)',
                    boxShadow:
                      '0 8px 32px rgba(34, 30, 145, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      background:
                        'rgba(224, 108, 27, 0.1)',
                      color: '#e06c1b',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    <Zap size={14} />
                    SİPARİŞ ÖZETİ
                  </div>

                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      marginBottom: '24px',
                      color: '#221E91',
                    }}
                  >
                    Özet
                  </h3>

                  <div
                    style={{
                      marginBottom: '24px',
                      paddingBottom: '24px',
                      borderBottom:
                        '1px solid rgba(34, 30, 145, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '15px',
                          color: '#666',
                        }}
                      >
                        Toplam Ürün
                      </span>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#221E91',
                        }}
                      >
                        {getCartCount()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '15px',
                          color: '#666',
                        }}
                      >
                        Toplam Adet
                      </span>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#221E91',
                        }}
                      >
                        {cart.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: '24px',
                      padding: '16px',
                      background:
                        'linear-gradient(135deg, rgba(34, 30, 145, 0.05) 0%, rgba(224, 108, 27, 0.05) 100%)',
                      borderRadius: '10px',
                      border:
                        '1px solid rgba(34, 30, 145, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <Shield
                        size={18}
                        color="#221E91"
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#221E91',
                        }}
                      >
                        Hızlı Teklif
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.6',
                        margin: 0,
                      }}
                    >
                      Teklif talebi gönderdikten sonra size
                      özel fiyatlandırma ile dönüş
                      yapılacaktır.
                    </p>
                  </div>

                  <Button
                    onClick={handleProceed}
                    style={{
                      width: '100%',
                      background:
                        'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                      color: 'white',
                      height: '56px',
                      fontSize: '17px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow:
                        '0 8px 20px rgba(34, 30, 145, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 24px rgba(34, 30, 145, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 20px rgba(34, 30, 145, 0.3)';
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
        
        @media (max-width: 768px) {
          .card {
            padding: 20px !important;
          }
          
          .cart-item {
            flex-direction: column;
          }
          
          .cart-item > div:first-child {
            width: 100% !important;
            height: 200px !important;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuoteCartPage;