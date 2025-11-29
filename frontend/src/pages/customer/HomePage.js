import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Truck, HeadphonesIcon, Award, Package, ShoppingCart, ArrowRight, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useQuoteCart();

  useEffect(() => {
    fetchData();
  }, []);

  // Update favicon dynamically
  useEffect(() => {
    if (settings?.site_favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.site_favicon_url;
    }
  }, [settings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, settingsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/settings`).catch(() => ({ data: null }))
      ]);
      setProducts(productsRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      toast.error('Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} sepete eklendi`, {
      position: 'top-center'
    });
  };

  const features = [
    {
      icon: Shield,
      title: 'Kalite Garantisi',
      description: 'Tüm ürünlerimiz uluslararası kalite standartlarına uygundur'
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: 'Siparişleriniz en kısa sürede güvenle teslim edilir'
    },
    {
      icon: HeadphonesIcon,
      title: '7/24 Destek',
      description: 'Profesyonel müşteri hizmetleri ekibimiz yanınızda'
    },
    {
      icon: Award,
      title: 'Uzman Ekip',
      description: 'Alanında uzman kadromuzla profesyonel çözümler'
    }
  ];

  const stats = [
    { number: '500+', label: 'Mutlu Müşteri' },
    { number: '1000+', label: 'Tamamlanan Proje' },
    { number: '15+', label: 'Yıl Deneyim' },
    { number: '50+', label: 'Uzman Ekip' }
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

      {/* Hero Section */}
      <section
        style={{
          background: settings?.home_hero_bg_image 
            ? (settings?.home_hero_disable_color 
                ? `url(${settings.home_hero_bg_image})` 
                : (() => {
                    const opacity = settings?.home_hero_overlay_opacity || 80;
                    const opacityHex1 = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
                    const opacityHex2 = Math.round((Math.min(opacity + 10, 100) / 100) * 255).toString(16).padStart(2, '0');
                    return `linear-gradient(135deg, #221E91${opacityHex1} 0%, #1a1775${opacityHex2} 100%), url(${settings.home_hero_bg_image})`;
                  })())
            : `linear-gradient(135deg, #221E91 0%, #1a1775 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '140px 24px 100px',
          marginTop: '72px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(224, 108, 27, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            background: 'rgba(224, 108, 27, 0.15)',
            border: '1px solid rgba(224, 108, 27, 0.3)',
            borderRadius: '50px',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <Star size={18} fill="currentColor" />
            <span style={{ fontSize: '16px', fontWeight: '600' }}>
              {settings?.home_hero_badge || 'Kurumsal Çözüm Ortağınız'}
            </span>
          </div>
          
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '800',
              marginBottom: '24px',
              letterSpacing: '-1.5px',
              lineHeight: '1.1',
              color: settings?.home_hero_text_color || '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            className="hero-title"
          >
            {settings?.home_hero_title || 'Profesyonel Çözümler, '}
            <span style={{ 
              background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              Güvenilir Hizmet
            </span>
          </h1>
          <p
            style={{
              fontSize: '22px',
              marginBottom: '40px',
              opacity: 0.95,
              maxWidth: '700px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
              color: settings?.home_hero_text_color || '#FFFFFF'
            }}
          >
            {settings?.home_hero_subtitle || 'Sektörünüz için özel çözümler ve en iyi fiyat garantisi ile yanınızdayız'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '17px',
                fontWeight: '700',
                boxShadow: '0 8px 16px rgba(224, 108, 27, 0.3)',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(224, 108, 27, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(224, 108, 27, 0.3)';
              }}
            >
              Ürünleri Keşfet
              <ArrowRight size={22} />
            </Link>
            <Link
              to="/iletisim"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '17px',
                fontWeight: '700',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-4" style={{ gap: '32px' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '800', 
                  color: '#221E91',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #221E91, #e06c1b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: 'rgba(34, 30, 145, 0.1)',
              color: '#221E91',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              <CheckCircle size={16} />
              NEDEN BİZ?
            </div>
            <h2
              style={{
                fontSize: '44px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}
            >
              {settings?.home_features_title || 'Üstün Hizmet Kalitesi'}
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              {settings?.home_features_subtitle || 'Müşteri memnuniyetini her şeyin üzerinde tutan profesyonel yaklaşımımız'}
            </p>
          </div>

          <div className="grid grid-4" style={{ gap: '32px' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '40px 32px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid rgba(34, 30, 145, 0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 30, 145, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(224, 108, 27, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(34, 30, 145, 0.1)';
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: '0 8px 20px rgba(34, 30, 145, 0.3)'
                    }}
                  >
                    <Icon size={32} color="white" />
                  </div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '48px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                background: 'rgba(224, 108, 27, 0.1)',
                color: '#e06c1b',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                <TrendingUp size={16} />
                POPÜLER ÜRÜNLER
              </div>
              <h2 style={{ fontSize: '44px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {settings?.home_products_title || 'Öne Çıkan Ürünlerimiz'}
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                {settings?.home_products_subtitle || 'Kalite ve güvenin bir araya geldiği seçkin ürün yelpazemiz'}
              </p>
            </div>
            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #221E91, #1a1775)',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(34, 30, 145, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 30, 145, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 30, 145, 0.3)';
              }}
            >
              Tüm Ürünler
              <ArrowRight size={20} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <Package size={64} color="var(--text-tertiary)" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Henüz ürün eklenmemiş</p>
            </div>
          ) : (
            <div className="grid grid-3" style={{ gap: '32px' }}>
              {products.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="card"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid rgba(34, 30, 145, 0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 30, 145, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                  }}
                >
                  <Link to={`/urun/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '240px',
                        background: 'linear-gradient(135deg, #f8faff, #f0f4ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Package size={56} color="#221E91" />
                      )}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        FİYAT TEKLİFİ AL
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#e06c1b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {product.category}
                      </span>
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '8px 0 12px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.6',
                          marginBottom: '16px'
                        }}
                      >
                        {product.description?.substring(0, 90)}...
                      </p>
                      {product.price_range && (
                        <p
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#221E91'
                          }}
                        >
                          {product.price_range}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div style={{ padding: '0 24px 24px' }}>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #221E91, #1a1775)',
                        color: 'white',
                        height: '48px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: 'none',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #1a1775, #15135c)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #221E91, #1a1775)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <ShoppingCart size={20} />
                      Teklif Sepetine Ekle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
          color: 'white',
          padding: '100px 24px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(224, 108, 27, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <Users size={16} />
            SİZE ÖZEL ÇÖZÜMLER
          </div>
          
          <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1px' }}>
            {settings?.home_cta_title || 'Profesyonel Çözüm Ortağınız Hazır'}
          </h2>
          <p style={{ fontSize: '20px', opacity: 0.95, marginBottom: '40px', lineHeight: '1.7' }}>
            {settings?.home_cta_subtitle || 'İhtiyaçlarınıza özel çözümler ve rekabetçi fiyatlar için hemen teklif alın.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 40px',
                background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '800',
                boxShadow: '0 8px 16px rgba(224, 108, 27, 0.3)',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(224, 108, 27, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(224, 108, 27, 0.3)';
              }}
            >
              Ürünleri İncele
              <ArrowRight size={24} />
            </Link>
            <Link
              to="/iletisim"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 40px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '800',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Hemen Arayın
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px !important;
          }
          .grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .grid-4 {
            grid-template-columns: 1fr;
          }
        }
        
        .grid {
          display: grid;
        }
        
        .grid-4 {
          grid-template-columns: repeat(4, 1fr);
        }
        
        .grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .card {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default HomePage;