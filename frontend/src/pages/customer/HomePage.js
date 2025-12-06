import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Shield,
  Truck,
  HeadphonesIcon,
  Award,
  Package,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CampaignPopup from '../../components/CampaignPopup';

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

  // Favicon
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
        axios.get(`${API}/settings`).catch(() => ({ data: null })),
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
      position: 'top-center',
    });
  };

  const features = [
    {
      icon: Shield,
      title: 'Kalite Garantisi',
      description: 'Tüm ürünlerimiz uluslararası kalite standartlarına uygundur',
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: 'Siparişleriniz en kısa sürede güvenle teslim edilir',
    },
    {
      icon: HeadphonesIcon,
      title: '7/24 Destek',
      description: 'Profesyonel müşteri hizmetleri ekibimiz yanınızda',
    },
    {
      icon: Award,
      title: 'Uzman Ekip',
      description: 'Alanında uzman kadromuzla profesyonel çözümler',
    },
  ];

  const stats = [
    { number: '500+', label: 'Mutlu Müşteri' },
    { number: '1000+', label: 'Tamamlanan Proje' },
    { number: '15+', label: 'Yıl Deneyim' },
    { number: '50+', label: 'Uzman Ekip' },
  ];

  // Öne çıkan ürünler (yoksa ilk 6 ürün)
  const featuredProducts = (
    products.filter((p) => p.is_featured).length > 0
      ? products.filter((p) => p.is_featured)
      : products
  ).slice(0, 6);

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
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F3F4F6',
      }}
    >
      <Header settings={settings} />

      {/* HERO – 2 kolonlu yeni stil */}
      <section
        style={{
          marginTop: '72px',
          padding: '96px 24px 72px',
          background:
            settings?.home_hero_bg_image && !settings?.home_hero_disable_color
              ? (() => {
                  const opacity = settings?.home_hero_overlay_opacity || 80;
                  const opacityHex1 = Math.round(
                    (opacity / 100) * 255,
                  )
                    .toString(16)
                    .padStart(2, '0');
                  const opacityHex2 = Math.round(
                    (Math.min(opacity + 10, 100) / 100) * 255,
                  )
                    .toString(16)
                    .padStart(2, '0');
                  return `linear-gradient(135deg,rgba(224,108,27,${opacity/100}) 0%,rgba(249,115,22,${Math.min(opacity+10,100)/100}) 100%), url(${settings.home_hero_bg_image})`;
                })()
              : settings?.home_hero_bg_image && settings?.home_hero_disable_color
              ? `url(${settings.home_hero_bg_image})`
              : 'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: settings?.home_hero_text_color || '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 0%, rgba(224,108,27,0.25) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)',
            gap: '40px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Sol taraf – metin */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.35)',
                marginBottom: '24px',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <Star size={16} />
              <span>
                {settings?.home_hero_badge ||
                  'Kurumsal tedarik için tek nokta'}
              </span>
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: '52px',
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: '-1.4px',
                marginBottom: '18px',
                textShadow: '0 12px 30px rgba(0,0,0,0.28)',
              }}
            >
              {settings?.home_hero_title || 'İşiniz için akıllı tedarik'}
              <span
                style={{
                  display: 'block',
                  background:
                    'linear-gradient(135deg,#fbbf24,#3b82f6,#fb7185)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                güvenilir ve hızlı çözümler
              </span>
            </h1>

            <p
              style={{
                fontSize: '18px',
                maxWidth: '580px',
                lineHeight: 1.7,
                opacity: 0.95,
                marginBottom: '28px',
              }}
            >
              {settings?.home_hero_subtitle ||
                'Gıda, endüstriyel ürünler ve tüketim malzemelerinde, stok derdi olmadan, adınıza özel fiyatlarla çalışıyoruz.'}
            </p>

            {/* Hero CTA’lar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              <Link
                to="/urunler"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 26px',
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg,#3b82f6,#3b82f6,#ec4899)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 12px 30px rgba(249,115,22,0.45)',
                  transition: 'transform .2s, box-shadow .2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 16px 38px rgba(249,115,22,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 30px rgba(249,115,22,0.45)';
                }}
              >
                Ürünleri Keşfet
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/iletisim"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 22px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.55)',
                  background: 'rgba(15,23,42,0.25)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  backdropFilter: 'blur(14px)',
                  transition:
                    'background .2s, border-color .2s, transform .2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'rgba(15,23,42,0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'rgba(15,23,42,0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Satış ile Görüş
              </Link>
            </div>

            {/* Hero küçük bullet’lar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '18px',
                fontSize: '13px',
                opacity: 0.92,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={16} />
                <span>Minimum bürokrasi, hızlı teklif</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={16} />
                <span>Esnek ödeme & sevkiyat planı</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={16} />
                <span>Uzun vadeli iş ortaklığı yaklaşımı</span>
              </div>
            </div>
          </div>

          {/* Sağ taraf – kart + mini ürün vitrini */}
          <div
            style={{
              background: 'rgba(15,23,42,0.72)',
              borderRadius: '26px',
              padding: '24px 22px',
              border: '1px solid rgba(148,163,184,0.4)',
              boxShadow: '0 22px 55px rgba(15,23,42,0.75)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
                gap: '12px',
                marginBottom: '4px',
              }}
            >
              {stats.slice(0, 4).map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '16px',
                    background:
                      'radial-gradient(circle at 0 0, rgba(251,191,36,0.3), transparent 60%)',
                    border: '1px solid rgba(148,163,184,0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      marginBottom: 2,
                    }}
                  >
                    {s.number}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(226,232,240,0.9)',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: '16px',
                background:
                  'linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,64,175,0.9))',
              }}
            >
              <Users size={18} />
              <span
                style={{
                  fontSize: '13px',
                  color: 'rgba(226,232,240,0.95)',
                }}
              >
                {settings?.home_cta_title ||
                  'Bölgenizde 200+ işletme bizimle çalışıyor.'}
              </span>
            </div>

            {/* Mini ürün scroller */}
            <div
              style={{
                background: '#020617',
                borderRadius: '18px',
                padding: '12px',
                border: '1px solid rgba(30,64,175,0.5)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <TrendingUp size={16} color="#4ade80" />
                <span
                  style={{
                    fontSize: 13,
                    color: 'rgba(226,232,240,0.95)',
                    fontWeight: 600,
                  }}
                >
                  Son eklenen ürünler
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  overflowX: 'auto',
                  paddingBottom: 4,
                }}
              >
                {featuredProducts.slice(0, 5).map((p) => (
                  <Link
                    key={p.id}
                    to={`/urun/${p.id}`}
                    style={{
                      minWidth: 120,
                      maxWidth: 160,
                      borderRadius: 14,
                      background: '#020617',
                      border: '1px solid rgba(51,65,85,0.9)',
                      textDecoration: 'none',
                      color: 'inherit',
                      padding: '8px 8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: 80,
                        borderRadius: 10,
                        background:
                          'linear-gradient(135deg,#f8fafc,#e5e7eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {p.images?.[0] ? (
                        <img
                          src={
                            p.images[0].startsWith('http')
                              ? p.images[0]
                              : `${BACKEND_URL}${p.images[0]}`
                          }
                          alt={p.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Package size={30} color="#1f2937" />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#e5e7eb',
                        lineHeight: 1.3,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#9ca3af',
                        lineHeight: 1.3,
                      }}
                    >
                      {p.category}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEDEN BİZ BLOĞU */}
      <section
        style={{
          padding: '64px 24px 40px',
          background: '#F9FAFB',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
              gap: 40,
              alignItems: 'center',
            }}
            className="why-grid"
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(34,30,145,0.08)',
                  color: '#1e3a8a',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                <CheckCircle size={14} />
                NEDEN BİZ?
              </div>
              <h2
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  marginBottom: 12,
                  color: 'var(--text-primary)',
                }}
              >
                {settings?.home_features_title ||
                  'Satın alma süreçlerinizi sadeleştirin'}
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: 24,
                  maxWidth: 520,
                }}
              >
                {settings?.home_features_subtitle ||
                  'Birden fazla tedarikçiyle uğraşmak yerine, stok yönetimi ve satın alma operasyonlarınızı tek merkezden yönetmenizi sağlıyoruz.'}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: '10px 10px',
                        borderRadius: 16,
                        background: '#fff',
                        border:
                          '1px solid rgba(148,163,184,0.45)',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background:
                            'linear-gradient(135deg,#1e3a8a,#60a5fa)',
                          boxShadow:
                            '0 6px 14px rgba(67,56,202,0.35)',
                        }}
                      >
                        <Icon size={18} color="#fff" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            marginBottom: 2,
                            color: '#111827',
                          }}
                        >
                          {f.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#6b7280',
                            lineHeight: 1.5,
                          }}
                        >
                          {f.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontSize: 13,
                  color: '#4b5563',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Shield size={16} color="#22c55e" />
                  <span>Uzun vadeli sözleşme opsiyonları</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Truck size={16} color="#2563eb" />
                  <span>Düzenli sevkiyat planlaması</span>
                </div>
              </div>
            </div>

            {/* Yan kutu */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: 24,
                border: '1px solid rgba(148,163,184,0.5)',
                boxShadow: '0 16px 40px rgba(15,23,42,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <HeadphonesIcon size={22} color="#3b82f6" />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  Satış ekibimizle hemen tanışın
                </div>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                İhtiyacınız olan ürün gruplarını paylaşın, sizin için özel
                fiyat çalışalım. Tüm süreci tek bir panel üzerinden takip
                edin.
              </p>
              <Link
                to="/iletisim"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  background:
                    'linear-gradient(135deg,#1e3a8a,#2563eb)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                İletişime Geç
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN ÜRÜNLER */}
      <section
        style={{
          padding: '56px 24px 80px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 16,
              marginBottom: 32,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(248,113,113,0.12)',
                  color: '#b91c1c',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                <TrendingUp size={15} />
                POPÜLER ÜRÜNLER
              </div>
              <h2
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                {settings?.home_products_title ||
                  'Öne çıkan ürün gruplarımız'}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                }}
              >
                {settings?.home_products_subtitle ||
                  'En çok tercih edilen ürünleri hızlıca sepete ekleyip fiyat teklifi isteyin.'}
              </p>
            </div>

            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 999,
                background: '#111827',
                color: '#f9fafb',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Tüm Ürünleri Gör
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
              }}
            >
              <Package
                size={56}
                color="var(--text-tertiary)"
                style={{ marginBottom: 12 }}
              />
              <p
                style={{
                  fontSize: 16,
                  color: 'var(--text-secondary)',
                }}
              >
                Henüz ürün eklenmemiş
              </p>
            </div>
          ) : (
            <div
              className="products-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3,minmax(0,1fr))',
                gap: 24,
              }}
            >
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card"
                  style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    border:
                      '1px solid rgba(226,232,240,0.9)',
                    background: '#fff',
                    boxShadow:
                      '0 10px 26px rgba(15,23,42,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Link
                    to={`/urun/${product.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: 210,
                        background:
                          'linear-gradient(135deg,#f8fafc,#e5e7eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={
                            product.images[0].startsWith('http')
                              ? product.images[0]
                              : `${BACKEND_URL}${product.images[0]}`
                          }
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Package size={56} color="#9ca3af" />
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          padding: '6px 10px',
                          borderRadius: 999,
                          background:
                            'linear-gradient(135deg,#3b82f6,#fb7185)',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        FİYAT TEKLİFİ AL
                      </div>
                    </div>

                    <div style={{ padding: '18px 18px 10px' }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '.05em',
                          color: '#3b82f6',
                          marginBottom: 4,
                        }}
                      >
                        {product.category}
                      </div>
                      <h3
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          marginBottom: 6,
                          color: '#111827',
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: '#6b7280',
                          lineHeight: 1.6,
                          marginBottom: 10,
                        }}
                      >
                        {product.description?.substring(
                          0,
                          100,
                        )}
                        {product.description &&
                          product.description.length > 100 &&
                          '...'}
                      </p>
                    </div>
                  </Link>

                  <div
                    style={{
                      padding: '0 18px 16px',
                      marginTop: 'auto',
                    }}
                  >
                    <Button
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      style={{
                        width: '100%',
                        height: 46,
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background:
                          'linear-gradient(135deg,#2563eb,#3b82f6)',
                        color: '#fff',
                        border: 'none',
                      }}
                    >
                      <ShoppingCart size={18} />
                      Teklif Sepetine Ekle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Alt CTA */}
      <section
        style={{
          padding: '72px 24px 96px',
          background:
            'radial-gradient(circle at top,#1e293b,#020617)',
          color: '#e5e7eb',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 80% 0%,rgba(249,115,22,0.22),transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            maxWidth: 880,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(148,163,184,0.6)',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            <Users size={15} />
            SİZE ÖZEL TEKLİF
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            {settings?.home_cta_title ||
              'Tüm tedarik sürecinizi birlikte planlayalım'}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              maxWidth: 620,
              margin: '0 auto 26px',
              color: '#cbd5f5',
            }}
          >
            {settings?.home_cta_subtitle ||
              'İhtiyaç listenizi iletin, ürün gruplarına göre ayrı ayrı fiyat çalışalım. Depo stok takibi, sevkiyat planı ve raporlama sürecini birlikte kurgulayalım.'}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <Link
              to="/urunler"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 30px',
                borderRadius: 999,
                background:
                  'linear-gradient(135deg,#3b82f6,#fb7185)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              Ürünleri İncele
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/iletisim"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 26px',
                borderRadius: 999,
                border: '1px solid rgba(148,163,184,0.9)',
                color: '#e5e7eb',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                background: 'rgba(15,23,42,0.75)',
              }}
            >
              Satış ile Hemen Görüş
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      {/* Responsive küçük dokunuşlar */}
      <style>{`
        .hero-title {
          font-size: 52px;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .why-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px !important;
          }
          .products-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 30px !important;
          }
        }
      `}</style>

      <CampaignPopup />
    </div>
  );
};

export default HomePage;