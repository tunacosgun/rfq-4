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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
      <Header settings={settings} />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
          color: 'white',
          padding: '140px 24px 80px',
          textAlign: 'center',
          marginTop: '70px',
        }}
        className="hero-section"
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
            Markalarımız
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Çalıştığımız güvenilir markalar
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '48px',
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '12px',
                  fontSize: '16px',
                }}
              />
            </div>
          </div>

          {/* Brands Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '64px 32px',
              background: 'white',
              borderRadius: '12px',
            }}>
              <Tag size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '8px' }}>
                {searchQuery ? 'Marka bulunamadı' : 'Henüz tanımlı marka bulunmuyor'}
              </p>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                {searchQuery && 'Farklı bir arama terimi deneyin'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '24px',
            }}>
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/urunler?marka=${encodeURIComponent(brand.name)}`}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '120px',
                      height: '120px',
                      background: '#F3F4F6',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Tag size={48} color="#9CA3AF" />
                    </div>
                  )}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                  }}>
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      margin: 0,
                      lineHeight: '1.5',
                    }}>
                      {brand.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer settings={settings} />
    </div>
  );
};

export default BrandsPage;
