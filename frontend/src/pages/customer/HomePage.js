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
  Sparkles,
  Clock,
  Globe,
  ChevronRight,
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
      description: 'Tüm ürünlerimiz uluslararası kalite standartlarına uygundur.',
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: 'Siparişleriniz en kısa sürede güvenle teslim edilir.',
    },
    {
      icon: HeadphonesIcon,
      title: '7/24 Destek',
      description: 'Profesyonel müşteri hizmetleri ekibimiz her zaman yanınızda.',
    },
    {
      icon: Award,
      title: 'Uzman Ekip',
      description: 'Alanında uzman kadromuzla profesyonel çözümler sunuyoruz.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Mutlu Müşteri', icon: Users },
    { number: '1000+', label: 'Tamamlanan Proje', icon: CheckCircle },
    { number: '15+', label: 'Yıl Deneyim', icon: Clock },
    { number: '50+', label: 'Uzman Ekip', icon: Globe },
  ];

if (loading) {
  return (
    <div className="page-loading">
      <div className="page-loading-card">
        <div className="page-spinner" />
        <p className="page-loading-title">Yükleniyor</p>
        <p className="page-loading-text">Lütfen birkaç saniye bekleyin...</p>
      </div>

      <style jsx>{`
        .page-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top left,
              rgba(224, 108, 27, 0.06),
              transparent 55%),
            radial-gradient(circle at bottom right,
              rgba(34, 30, 145, 0.06),
              transparent 55%),
            #ffffff;
        }

        .page-loading-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 24px 28px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.15);
          border: 1px solid rgba(209, 213, 219, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          min-width: 260px;
        }

        .page-spinner {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 3px solid rgba(34, 30, 145, 0.18);
          border-top-color: #221e91;
          animation: spin 0.9s linear infinite;
        }

        .page-loading-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .page-loading-text {
          font-size: 13px;
          color: #6b7280;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

  const featuredProducts =
    products.filter((p) => p.is_featured).length > 0
      ? products.filter((p) => p.is_featured)
      : products;

  return (
    <div className="homepage-container">
      <Header settings={settings} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={18} />
              <span>{settings?.home_hero_badge || 'Kurumsal Çözüm Ortağınız'}</span>
            </div>

            <h1 className="hero-title">
              {settings?.home_hero_title || 'Profesyonel Çözümler, '}
              <span className="gradient-text">Güvenilir Hizmet</span>
            </h1>

            <p className="hero-subtitle">
              {settings?.home_hero_subtitle ||
                'Sektörünüz için özel çözümler ve en iyi fiyat garantisi ile yanınızdayız.'}
            </p>

            <div className="hero-buttons">
              <Link to="/urunler" className="btn-primary">
                Ürünleri Keşfet
                <ArrowRight size={22} />
              </Link>
              <Link to="/iletisim" className="btn-secondary">
                İletişime Geç
              </Link>
            </div>

            {/* Hero alt mini istatistikler */}
            <div className="hero-mini-stats">
              <div className="hero-mini-item">
                <Users size={18} />
                <span>Kurumsal firmalara özel teklifler</span>
              </div>
              <div className="hero-mini-item">
                <Shield size={18} />
                <span>Güvenli tedarik ve kalite kontrol</span>
              </div>
              <div className="hero-mini-item">
                <Truck size={18} />
                <span>Türkiye geneli hızlı teslimat</span>
              </div>
            </div>
          </div>

          {/* Hero sağ taraf vitrin kartı */}
          <div className="hero-showcase-card">
            <div className="showcase-header">
              <div className="showcase-label">
                <Star size={16} />
                Öne Çıkan Ürünler
              </div>
              <span className="showcase-note">Seçili ürünlerde avantajlı teklif</span>
            </div>

            <div className="showcase-products">
              {featuredProducts.slice(0, 3).map((p) => (
                <Link
                  to={`/urun/${p.id}`}
                  key={p.id}
                  className="showcase-product-row"
                >
                  <div className="showcase-thumb">
                    {p.images?.[0] ? (
                      <img
                        src={
                          p.images[0].startsWith('http')
                            ? p.images[0]
                            : `${BACKEND_URL}${p.images[0]}`
                        }
                        alt={p.name}
                      />
                    ) : (
                      <div className="showcase-thumb-fallback">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="showcase-info">
                    <div className="showcase-name">{p.name}</div>
                    <div className="showcase-meta">
                      <span className="showcase-category">{p.category}</span>
                      {p.price_range && (
                        <span className="showcase-price">{p.price_range}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="showcase-arrow" />
                </Link>
              ))}

              {featuredProducts.length === 0 && (
                <div className="showcase-empty">
                  <Package size={32} />
                  <p>Öne çıkan ürün bulunmuyor.</p>
                </div>
              )}
            </div>

            <Link to="/urunler" className="showcase-footer">
              Tüm ürünleri görüntüle
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Güven şeridi */}
      <section className="trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-item">
            <Shield size={20} />
            <div>
              <p className="trust-title">Güvenli Tedarik</p>
              <p className="trust-text">Tüm süreçleriniz kayıt altında ve izlenebilir.</p>
            </div>
          </div>
          <div className="trust-item">
            <TrendingUp size={20} />
            <div>
              <p className="trust-title">Verimli Teklif Yönetimi</p>
              <p className="trust-text">Teklif sürecinizi tek panelden yönetin.</p>
            </div>
          </div>
          <div className="trust-item">
            <HeadphonesIcon size={20} />
            <div>
              <p className="trust-title">Öncelikli Destek</p>
              <p className="trust-text">İhtiyaç halinde uzman ekip yanınızda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="stat-icon">
                    <Icon size={22} />
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <CheckCircle size={16} />
              NEDEN BİZ?
            </div>
            <h2 className="section-title">
              {settings?.home_features_title || 'Üstün Hizmet Kalitesi'}
            </h2>
            <p className="section-subtitle">
              {settings?.home_features_subtitle ||
                'Müşteri memnuniyetini her şeyin üzerinde tutan profesyonel yaklaşımımız.'}
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <Icon size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="products-header">
            <div className="products-header-content">
              <div className="section-badge orange">
                <TrendingUp size={16} />
                POPÜLER ÜRÜNLER
              </div>
              <h2 className="section-title">
                {settings?.home_products_title || 'Öne Çıkan Ürünlerimiz'}
              </h2>
              <p className="section-subtitle">
                {settings?.home_products_subtitle ||
                  'Kalite ve güvenin bir araya geldiği seçkin ürün yelpazemiz.'}
              </p>
            </div>
            <Link to="/urunler" className="view-all-btn">
              Tüm Ürünler
              <ChevronRight size={20} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="empty-products">
              <Package size={64} />
              <p>Henüz ürün eklenmemiş</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/urun/${product.id}`} className="product-link">
                    <div className="product-image">
                      {product.images?.[0] ? (
                        <img
                          src={
                            product.images[0].startsWith('http')
                              ? product.images[0]
                              : `${BACKEND_URL}${product.images[0]}`
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML =
                              '<div class="image-fallback"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#221E91" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="image-fallback">
                          <Package size={56} />
                        </div>
                      )}
                      <div className="product-badge">FİYAT TEKLİFİ AL</div>
                    </div>
                    <div className="product-content">
                      <span className="product-category">{product.category}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">
                        {product.description?.substring(0, 90)}...
                      </p>
                      {product.price_range && (
                        <p className="product-price">{product.price_range}</p>
                      )}
                    </div>
                  </Link>
                  <div className="product-actions">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
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
      <section className="cta-section">
        <div className="cta-overlay" />

        <div className="cta-content">
          <div className="cta-badge">
            <Users size={16} />
            SİZE ÖZEL ÇÖZÜMLER
          </div>

          <h2 className="cta-title">
            {settings?.home_cta_title || 'Profesyonel Çözüm Ortağınız Hazır'}
          </h2>
          <p className="cta-subtitle">
            {settings?.home_cta_subtitle ||
              'İhtiyaçlarınıza özel çözümler ve rekabetçi fiyatlar için hemen teklif alın.'}
          </p>
          <div className="cta-buttons">
            <Link to="/urunler" className="btn-primary">
              Ürünleri İncele
              <ArrowRight size={24} />
            </Link>
            <Link to="/iletisim" className="btn-secondary">
              Hemen Arayın
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <CampaignPopup />

      <style jsx>{`
        :root {
          --primary: #221e91;
          --primary-dark: #1a1775;
          --secondary: #e06c1b;
          --secondary-light: #f0833a;
          --white: #ffffff;
          --text-primary: #1a1a1a;
          --text-secondary: #666666;
          --text-tertiary: #999999;
          --bg-light: #f8faff;
          --bg-lighter: #f0f4ff;
          --border: rgba(34, 30, 145, 0.1);
          --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 20px 40px rgba(34, 30, 145, 0.15);
          --shadow-lg: 0 8px 16px rgba(224, 108, 27, 0.3);
          --radius-sm: 10px;
          --radius-md: 16px;
          --radius-lg: 24px;
          --radius-xl: 50px;
        }

        .homepage-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: radial-gradient(
              circle at top left,
              rgba(224, 108, 27, 0.06),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(34, 30, 145, 0.06),
              transparent 55%
            ),
            #ffffff;
        }

        /* Loading Styles */
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .loading-content {
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--primary);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Hero Section */
        .hero-section {
          background: ${
            settings?.home_hero_bg_image
              ? settings?.home_hero_disable_color
                ? `url(${settings.home_hero_bg_image})`
                : (() => {
                    const opacity = settings?.home_hero_overlay_opacity || 80;
                    const opacityHex1 = Math.round(
                      (opacity / 100) * 255
                    )
                      .toString(16)
                      .padStart(2, '0');
                    const opacityHex2 = Math.round(
                      (Math.min(opacity + 10, 100) / 100) * 255
                    )
                      .toString(16)
                      .padStart(2, '0');
                    return `linear-gradient(135deg, #221E91${opacityHex1} 0%, #1a1775${opacityHex2} 100%), url(${settings.home_hero_bg_image})`;
                  })()
              : `linear-gradient(135deg, #221E91 0%, #1a1775 100%)`
          };
          background-size: cover;
          background-position: center;
          color: var(--white);
          padding: 140px 24px 110px;
          margin-top: 72px;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 120px 20px 80px;
            margin-top: 64px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 100px 16px 64px;
          }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 30% 20%,
              rgba(224, 108, 27, 0.25),
              transparent 55%
            ),
            radial-gradient(
              circle at 80% 90%,
              rgba(255, 255, 255, 0.12),
              transparent 55%
            );
          pointer-events: none;
        }

        .hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
          gap: 40px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .hero-inner {
            grid-template-columns: 1fr;
          }
        }

        .hero-content {
          text-align: left;
        }

        @media (max-width: 1024px) {
          .hero-content {
            text-align: center;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 22px;
          background: rgba(224, 108, 27, 0.18);
          border: 1px solid rgba(224, 108, 27, 0.4);
          border-radius: var(--radius-xl);
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
          font-size: 15px;
          font-weight: 600;
        }

        .hero-title {
          font-size: 58px;
          font-weight: 800;
          margin-bottom: 18px;
          letter-spacing: -1.4px;
          line-height: 1.08;
          color: ${settings?.home_hero_text_color || 'var(--white)'};
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
        }

        @media (max-width: 1200px) {
          .hero-title {
            font-size: 50px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 38px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px;
            margin-bottom: 14px;
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .hero-subtitle {
          font-size: 19px;
          margin-bottom: 32px;
          opacity: 0.96;
          max-width: 560px;
          line-height: 1.7;
          color: ${settings?.home_hero_text_color || 'var(--white)'};
        }

        @media (max-width: 1024px) {
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 768px) {
          .hero-subtitle {
            font-size: 17px;
          }
        }

        .hero-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        @media (max-width: 1024px) {
          .hero-buttons {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .hero-mini-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .hero-mini-stats {
            justify-content: center;
          }
        }

        .hero-mini-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(148, 163, 184, 0.4);
          font-size: 13px;
        }

        .hero-mini-item svg {
          color: #e5e7eb;
        }

        /* Hero vitrin kartı */
        .hero-showcase-card {
          background: rgba(15, 23, 42, 0.86);
          border-radius: 24px;
          padding: 22px 22px 18px;
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.4);
          backdrop-filter: blur(12px);
        }

        @media (max-width: 1024px) {
          .hero-showcase-card {
            max-width: 520px;
            margin: 0 auto;
          }
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          gap: 8px;
        }

        .showcase-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(55, 65, 81, 0.6);
          font-size: 13px;
          font-weight: 600;
        }

        .showcase-label svg {
          color: #fde68a;
        }

        .showcase-note {
          font-size: 12px;
          color: #cbd5f5;
          opacity: 0.9;
        }

        .showcase-products {
          margin-top: 10px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .showcase-product-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 10px;
          border-radius: 14px;
          text-decoration: none;
          color: #e5e7eb;
          background: rgba(15, 23, 42, 0.72);
          border: 1px solid rgba(75, 85, 99, 0.9);
          transition: all 0.2s ease;
        }

        .showcase-product-row:hover {
          transform: translateY(-2px);
          background: rgba(15, 23, 42, 0.95);
          border-color: rgba(239, 246, 255, 0.7);
        }

        .showcase-thumb {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          overflow: hidden;
          background: radial-gradient(circle at 30% 0%, #e06c1b, #1f2937);
          flex-shrink: 0;
        }

        .showcase-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .showcase-thumb-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #e5e7eb;
        }

        .showcase-info {
          flex: 1;
          min-width: 0;
        }

        .showcase-name {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .showcase-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .showcase-category {
          color: #9ca3af;
        }

        .showcase-price {
          color: #fbbf24;
          font-weight: 600;
          white-space: nowrap;
        }

        .showcase-arrow {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .showcase-empty {
          text-align: center;
          padding: 26px 10px 18px;
          color: #9ca3af;
        }

        .showcase-empty p {
          margin-top: 8px;
          font-size: 13px;
        }

        .showcase-footer {
          margin-top: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(55, 65, 81, 0.9);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          text-decoration: none;
          color: #e5e7eb;
          opacity: 0.9;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .showcase-footer:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        /* Button Styles */
        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
          color: var(--white);
          box-shadow: var(--shadow-lg);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(224, 108, 27, 0.45);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.18);
          color: var(--white);
          border: 2px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.26);
          border-color: rgba(255, 255, 255, 0.7);
        }

        @media (max-width: 480px) {
          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }

        /* Güven Şeridi */
        .trust-strip {
          padding: 18px 24px 10px;
          background: linear-gradient(
            90deg,
            rgba(34, 30, 145, 0.04),
            rgba(224, 108, 27, 0.03)
          );
        }

        .trust-strip-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        @media (max-width: 900px) {
          .trust-strip-inner {
            grid-template-columns: 1fr;
          }
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: #ffffff;
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(148, 163, 184, 0.35);
        }

        .trust-item svg {
          color: var(--primary);
        }

        .trust-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .trust-text {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Stats Section */
        .stats-section {
          padding: 70px 24px 70px;
          background: var(--white);
        }

        @media (max-width: 768px) {
          .stats-section {
            padding: 60px 20px;
          }
        }

        .stats-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 26px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          text-align: center;
          padding: 22px 20px 26px;
          background: radial-gradient(
              circle at 0 0,
              rgba(224, 108, 27, 0.08),
              transparent 55%
            ),
            var(--bg-light);
          border-radius: 22px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(209, 213, 219, 0.9);
        }

        .stat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 120% -10%,
            rgba(34, 30, 145, 0.15),
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
        }

        .stat-card:hover::after {
          opacity: 1;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(34, 30, 145, 0.1),
            rgba(224, 108, 27, 0.18)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: var(--primary);
        }

        .stat-number {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 6px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 15px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Features Section */
        .features-section {
          padding: 90px 24px 100px;
          background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-lighter) 100%);
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 80px 20px;
          }
        }

        @media (max-width: 480px) {
          .features-section {
            padding: 64px 16px;
          }
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 58px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(34, 30, 145, 0.08);
          color: var(--primary);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
        }

        .section-badge.orange {
          background: rgba(224, 108, 27, 0.08);
          color: var(--secondary);
        }

        .section-title {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 14px;
          color: var(--text-primary);
        }

        @media (max-width: 1024px) {
          .section-title {
            font-size: 36px;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 30px;
          }
        }

        .section-subtitle {
          font-size: 17px;
          color: var(--text-secondary);
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .section-subtitle {
            font-size: 15px;
          }
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          padding: 34px 26px 30px;
          text-align: left;
          transition: all 0.3s ease;
          background: var(--white);
          border-radius: 22px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 0 0,
            rgba(224, 108, 27, 0.12),
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-md);
          border-color: rgba(224, 108, 27, 0.4);
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-icon-wrapper {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          box-shadow: 0 18px 35px rgba(34, 30, 145, 0.35);
          color: white;
        }

        .feature-title {
          font-size: 19px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .feature-description {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* Products Section */
        .products-section {
          padding: 96px 24px 96px;
          background: var(--white);
        }

        @media (max-width: 768px) {
          .products-section {
            padding: 80px 20px;
          }
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 44px;
          flex-wrap: wrap;
          gap: 18px;
        }

        @media (max-width: 768px) {
          .products-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .products-header-content {
          flex: 1;
          min-width: 0;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          border-radius: 999px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 6px 16px rgba(34, 30, 145, 0.4);
          white-space: nowrap;
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(34, 30, 145, 0.55);
        }

        .empty-products {
          text-align: center;
          padding: 70px 20px;
        }

        .empty-products svg {
          margin: 0 auto 16px;
          color: var(--text-tertiary);
        }

        .empty-products p {
          font-size: 17px;
          color: var(--text-secondary);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-card {
          overflow: hidden;
          transition: all 0.3s ease;
          background: var(--white);
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-md);
          border-color: rgba(34, 30, 145, 0.2);
        }

        .product-link {
          text-decoration: none;
          color: inherit;
          flex: 1;
        }

        .product-image {
          width: 100%;
          height: 240px;
          background: radial-gradient(
            circle at 20% 0,
            rgba(224, 108, 27, 0.2),
            var(--bg-lighter)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        @media (max-width: 768px) {
          .product-image {
            height: 210px;
          }
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .image-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: var(--primary);
        }

        .product-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
          color: var(--white);
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .product-content {
          padding: 22px 22px 18px;
          flex: 1;
        }

        .product-category {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 700;
          margin: 4px 0 10px;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .product-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .product-price {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary);
          margin-top: 4px;
        }

        .product-actions {
          padding: 0 22px 20px;
        }

        .add-to-cart-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          height: 46px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 999px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .add-to-cart-btn:hover {
          background: linear-gradient(135deg, var(--primary-dark), #15135c);
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(34, 30, 145, 0.45);
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: var(--white);
          padding: 96px 24px 96px;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .cta-section {
            padding: 80px 20px;
          }
        }

        .cta-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 80% 20%,
              rgba(224, 108, 27, 0.15),
              transparent 55%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(255, 255, 255, 0.18),
              transparent 55%
            );
          pointer-events: none;
        }

        .cta-content {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.16);
          border-radius: var(--radius-xl);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 14px;
          backdrop-filter: blur(10px);
        }

        .cta-title {
          font-size: 44px;
          font-weight: 900;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        @media (max-width: 1024px) {
          .cta-title {
            font-size: 38px;
          }
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 30px;
          }
        }

        .cta-subtitle {
          font-size: 19px;
          opacity: 0.96;
          margin-bottom: 36px;
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .cta-subtitle {
            font-size: 17px;
          }
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;