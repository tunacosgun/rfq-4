import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Truck, HeadphonesIcon, Award, Package, ShoppingCart, ArrowRight } from 'lucide-react';
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
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          color: 'white',
          padding: '140px 24px 100px',
          marginTop: '72px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              marginBottom: '24px',
              letterSpacing: '-1.5px',
              lineHeight: '1.1'
            }}
            className="hero-title"
          >
            {settings?.home_hero_title || 'Teklif Alın, Kazanın'}
          </h1>
          <p
            style={{
              fontSize: '22px',
              marginBottom: '40px',
              opacity: 0.95,
              maxWidth: '700px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}
          >
            {settings?.home_hero_subtitle || 'Ürünlerimizi inceleyin, ihtiyacınıza uygun teklifler alın'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: 'white',
                color: 'var(--primary-600)',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '17px',
                fontWeight: '700',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
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

      {/* Features Section */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
              style={{
                fontSize: '44px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}
            >
              {settings?.home_features_title || 'Neden Bizi Seçmelisiniz?'}
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              {settings?.home_features_subtitle || 'Müşterilerimize sunduğumuz benzersiz avantajlar'}
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
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
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
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
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
              <h2 style={{ fontSize: '44px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {settings?.home_products_title || 'Öne Çıkan Ürünler'}
              </h2>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                {settings?.home_products_subtitle || 'En popüler ürünlerimizi keşfedin'}
              </p>
            </div>
            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: 'var(--primary-600)',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.2s ease'
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
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Link to={`/urun/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '240px',
                        background: 'var(--gray-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Package size={56} color="var(--text-tertiary)" />
                      )}
                    </div>
                    <div style={{ padding: '24px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: 'var(--primary-600)',
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
                            color: 'var(--primary-600)'
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
                        background: 'var(--primary-600)',
                        color: 'white',
                        height: '48px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <ShoppingCart size={20} />
                      Sepete Ekle
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
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          color: 'white',
          padding: '100px 24px'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1px' }}>
            {settings?.home_cta_title || 'Hemen Teklif Alın'}
          </h2>
          <p style={{ fontSize: '20px', opacity: 0.95, marginBottom: '40px', lineHeight: '1.7' }}>
            {settings?.home_cta_subtitle || 'Ürünlerimizi sepete ekleyin ve size özel fiyat teklifi almak için formu doldurun.'}
          </p>
          <Link
            to="/urunler"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 40px',
              background: 'white',
              color: 'var(--primary-600)',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '800',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            }}
          >
            Ürünleri İncele
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
