import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Shield,
  Truck,
  HeadphonesIcon,
  Award,
  Check,
  Zap,
  Users,
  TrendingUp,
  Clock,
  FileText,
  Settings,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FeaturesPage = () => {
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
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Kalite Garantisi',
      description: 'Tüm ürünlerimiz uluslararası kalite standartlarına uygun olarak üretilmektedir.'
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: 'Siparişleriniz en kısa sürede güvenli bir şekilde adresinize ulaştırılır.'
    },
    {
      icon: HeadphonesIcon,
      title: '7/24 Destek',
      description: 'Profesyonel müşteri hizmetleri ekibimiz her zaman yanınızda.'
    },
    {
      icon: Award,
      title: 'Uzman Ekip',
      description: 'Alanında uzman kadromuzla profesyonel çözümler sunuyoruz.'
    },
    {
      icon: Zap,
      title: 'Hızlı Teklif',
      description: 'Dakikalar içinde size özel teklif hazırlayıp gönderiyoruz.'
    },
    {
      icon: Users,
      title: 'Müşteri Odaklı',
      description: 'Müşteri memnuniyeti bizim öncelikli hedefimizdir.'
    },
    {
      icon: TrendingUp,
      title: 'Rekabetçi Fiyat',
      description: 'Piyasadaki en rekabetçi fiyatları sunuyoruz.'
    },
    {
      icon: Clock,
      title: 'Zamanlı Teslimat',
      description: 'Teslimat sürelerine her zaman uyum sağlarız.'
    },
    {
      icon: FileText,
      title: 'Detaylı Raporlama',
      description: 'Her sipariş için detaylı raporlama ve takip imkanı.'
    },
    {
      icon: Settings,
      title: 'Özelleştirilebilir',
      description: 'İhtiyaçlarınıza göre özel çözümler üretiyoruz.'
    },
    {
      icon: Lock,
      title: 'Güvenli İşlem',
      description: 'Tüm işlemleriniz en yüksek güvenlik standartlarıyla korunur.'
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Yüklenıyor...</p>
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
          padding: '140px 24px 80px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              marginBottom: '24px',
              letterSpacing: '-1px',
              lineHeight: '1.1'
            }}
          >
            Özelliklerimiz
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            Müşterilerimize en iyi hizmeti sunmak için sunduğumuz avantajları keşfedin.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-3" style={{ gap: '32px' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '40px',
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
                      fontSize: '22px',
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

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          color: 'white',
          padding: '80px 24px'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '24px' }}>
            Hemen Teklif Alın
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.95, marginBottom: '32px', lineHeight: '1.7' }}>
            Ürünlerimizi inceleyip size özel teklif almak için sepete ekleyin.
          </p>
          <a
            href="/urunler"
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
            Ürünleri Gör
            <Check size={22} />
          </a>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default FeaturesPage;
