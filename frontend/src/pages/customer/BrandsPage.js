import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Search } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBrands();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`);
      if (response.ok) {
      const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/brands`);
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Brands fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="brands-loading">
        <div className="brands-loading-card">
          <div className="brands-spinner" />
          <p className="brands-loading-title">Markalar yükleniyor</p>
          <p className="brands-loading-text">Lütfen birkaç saniye bekleyin…</p>
        </div>

        <style jsx>{`
          .brands-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(
                circle at top left,
                rgba(224, 108, 27, 0.08),
                transparent 55%
              ),
              #f3f4f6;
          }
          .brands-loading-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px 30px;
            box-shadow: 0 22px 45px rgba(15, 23, 42, 0.16);
            border: 1px solid rgba(209, 213, 219, 0.85);
            text-align: center;
          }
          .brands-spinner {
            width: 40px;
            height: 40px;
            border-radius: 999px;
            border: 3px solid rgba(34, 30, 145, 0.16);
            border-top-color: #221e91;
            animation: spin 0.9s linear infinite;
            margin: 0 auto 10px;
          }
          .brands-loading-title {
            font-weight: 700;
            font-size: 16px;
            color: #111827;
          }
          .brands-loading-text {
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

  return (
    <div className="brands-page">
      <Header settings={settings} />

      {/* HERO */}
      <section className="brands-hero">
        <div className="brands-hero-overlay" />
        <div className="brands-hero-inner brands-animate-up">
          <div className="brands-hero-pill">
            <Tag size={16} />
            <span>Ürünlerimizde yer alan güvenilir markalar</span>
          </div>

          <h1 className="brands-hero-title">
            Markalarımız
            <span>birlikte çalıştığımız tedarikçiler</span>
          </h1>

          <p className="brands-hero-text">
            Yerel ve global ölçekte birlikte çalıştığımız markalarla, geniş ve
            güncel bir ürün portföyü sunuyoruz.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="brands-main">
        <div className="brands-container">
          {/* Search Card */}
          <div className="brands-search-card brands-animate-up">
            <div className="brands-search-info">
              <h2>Marka arayın</h2>
              <p>
                Toplam{' '}
                <strong>
                  {filteredBrands.length}/{brands.length}
                </strong>{' '}
                marka listeleniyor.
              </p>
            </div>
            <div className="brands-search-input-wrap">
              <Search className="brands-search-icon" size={18} />
              <input
                type="text"
                placeholder="Örn: Barilla, Tat, Berrak…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* GRID */}
          {filteredBrands.length === 0 ? (
            <div className="brands-empty-card brands-animate-up">
              <div className="brands-empty-icon">
                <Tag size={42} />
              </div>
              <p className="brands-empty-title">
                {searchQuery ? 'Marka bulunamadı' : 'Henüz tanımlı marka bulunmuyor'}
              </p>
              {searchQuery && (
                <p className="brands-empty-text">
                  Yazımınızı kontrol ederek farklı bir arama deneyebilirsiniz.
                </p>
              )}
            </div>
          ) : (
            <div className="brands-grid">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/urunler?marka=${encodeURIComponent(brand.name)}`}
                  className="brand-card brands-animate-up"
                >
                  <div className="brand-logo-wrap">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="brand-logo-fallback">
                        <Tag size={32} />
                      </div>
                    )}
                  </div>

                  <div className="brand-content">
                    <h3>{brand.name}</h3>
                    {brand.description && (
                      <p className="brand-desc">{brand.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          :root {
            --primary: #221e91;
            --secondary: #e06c1b;
            --secondary-light: #f97316;
            --bg-page: #f5f5f7;
            --text-primary: #111827;
            --text-secondary: #4b5563;
          }

          .brands-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: var(--bg-page);
          }

          .brands-main {
            flex: 1;
            padding-bottom: 72px;
          }

          .brands-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Animations */
          .brands-animate-up {
            opacity: 0;
            transform: translateY(18px);
            animation: fadeUp 0.5s ease forwards;
          }
          .brands-animate-up:nth-of-type(2) {
            animation-delay: 0.04s;
          }

          @keyframes fadeUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* HERO */
          .brands-hero {
            margin-top: 72px;
            padding: 86px 0 70px;
            position: relative;
            background: radial-gradient(
                circle at 0% 0%,
                rgba(249, 115, 22, 0.16),
                transparent 55%
              ),
              linear-gradient(135deg, #fff7ed 0%, #eef2ff 45%, #ffffff 100%);
            color: var(--text-primary);
            border-bottom: 1px solid #e5e7eb;
            overflow: hidden;
          }

          .brands-hero-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at 85% 0%,
              rgba(129, 140, 248, 0.18),
              transparent 55%
            );
            pointer-events: none;
          }

          .brands-hero-inner {
            position: relative;
            max-width: 960px;
            margin: 0 auto;
            padding: 0 24px;
            text-align: center;
          }

          .brands-hero-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 16px;
            border-radius: 999px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            font-size: 13px;
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 14px;
            box-shadow: 0 6px 16px rgba(148, 163, 184, 0.4);
          }

          .brands-hero-title {
            font-size: 36px;
            font-weight: 900;
            letter-spacing: -0.8px;
            margin-bottom: 8px;
            color: var(--text-primary);
            line-height: 1.1;
          }

          .brands-hero-title span {
            display: block;
            background: linear-gradient(
              135deg,
              var(--secondary),
              var(--secondary-light)
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-top: 6px;
          }

          .brands-hero-text {
            font-size: 15px;
            color: var(--text-secondary);
            max-width: 580px;
            margin: 0 auto;
            line-height: 1.8;
          }

          /* SEARCH CARD */
          .brands-search-card {
            margin-top: 40px;
            margin-bottom: 28px;
            padding: 18px 22px;
            background: #ffffff;
            border-radius: 18px;
            border: 1px solid rgba(226, 232, 240, 0.95);
            box-shadow: 0 12px 28px rgba(148, 163, 184, 0.4);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 16px;
            justify-content: space-between;
          }

          .brands-search-info h2 {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
          }

          .brands-search-info p {
            font-size: 13px;
            color: var(--text-secondary);
          }

          .brands-search-input-wrap {
            position: relative;
            min-width: 220px;
            max-width: 360px;
            flex: 1;
          }

          .brands-search-input-wrap input {
            width: 100%;
            border-radius: 999px;
            border: 1px solid #d1d5db;
            padding: 9px 14px 9px 36px;
            font-size: 14px;
            outline: none;
            background: #ffffff;
            transition: all 0.2s ease;
          }

          .brands-search-input-wrap input:focus {
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(224, 108, 27, 0.15);
          }

          .brands-search-icon {
            position: absolute;
            left: 11px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
          }

          /* EMPTY STATE */
          .brands-empty-card {
            margin-top: 10px;
            padding: 48px 24px 44px;
            text-align: center;
            border-radius: 18px;
            border: 1px dashed #d1d5db;
            background: #ffffff;
            color: var(--text-secondary);
          }

          .brands-empty-icon {
            width: 70px;
            height: 70px;
            border-radius: 999px;
            margin: 0 auto 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            color: #9ca3af;
          }

          .brands-empty-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
          }

          .brands-empty-text {
            font-size: 14px;
            color: var(--text-secondary);
          }

          /* GRID */
          .brands-grid {
            margin-top: 10px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 22px;
          }

          .brand-card {
            text-decoration: none;
            color: inherit;
            padding: 20px 18px 18px;
            border-radius: 18px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.98);
            box-shadow: 0 12px 28px rgba(148, 163, 184, 0.45);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            transition: transform 0.18s ease, box-shadow 0.18s ease,
              border-color 0.18s ease, background 0.18s ease;
          }

          .brand-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(148, 163, 184, 0.75);
            border-color: rgba(249, 115, 22, 0.55);
            background: linear-gradient(
              135deg,
              #ffffff,
              rgba(255, 247, 237, 0.96)
            );
          }

          .brand-logo-wrap {
            width: 100%;
            height: 110px;
            border-radius: 14px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .brand-logo-wrap img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            padding: 8px;
            display: block;
          }

          .brand-logo-fallback {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            background: linear-gradient(
              135deg,
              var(--secondary),
              var(--secondary-light)
            );
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
          }

          .brand-content h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
          }

          .brand-desc {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          /* RESPONSIVE */
          @media (max-width: 1024px) {
            .brands-container {
              padding: 0 20px;
            }
            .brands-hero-inner {
              padding: 0 20px;
            }
            .brands-hero-title {
              font-size: 32px;
            }
          }

          @media (max-width: 768px) {
            .brands-container {
              padding: 0 16px;
            }
            .brands-hero {
              padding: 80px 0 56px;
            }
            .brands-hero-inner {
              padding: 0 16px;
            }
            .brands-hero-title {
              font-size: 28px;
            }
            .brands-search-card {
              flex-direction: column;
              align-items: flex-start;
            }
            .brands-search-input-wrap {
              max-width: 100%;
            }
          }
        `}</style>
      </main>

      <Footer settings={settings} />
    </div>
  );
};

export default BrandsPage;