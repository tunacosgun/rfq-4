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
  Lock,
  Star,
  Target,
  Rocket
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
          background: 'linear-gradient(135deg, #e06c1b 0%, #f97316 100%)',
          color: 'white',
          padding: '140px 24px 80px',
          textAlign: 'center',
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
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
              AVANTAJLARIMIZ
            </span>
          </div>
          
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              marginBottom: '24px',
              letterSpacing: '-1px',
              lineHeight: '1.1',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ 
              background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              Özelliklerimiz
            </span>
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            Müşterilerimize en iyi hizmeti sunmak için sunduğumuz avantajları keşfedin.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-4" style={{ gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '800', 
                color: '#e06c1b',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #e06c1b, #e06c1b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                100%
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Müşteri Memnuniyeti
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '800', 
                color: '#e06c1b',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #e06c1b, #e06c1b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                24/7
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Destek Hizmeti
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '800', 
                color: '#e06c1b',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #e06c1b, #e06c1b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                500+
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Mutlu Müşteri
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '800', 
                color: '#e06c1b',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #e06c1b, #e06c1b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                10+
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Yıl Deneyim
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
              <Target size={16} />
              ÖNE ÇIKAN ÖZELLİKLER
            </div>
            
            <h2
              style={{
                fontSize: '44px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}
            >
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Sektördeki lider konumumuzu borçlu olduğumuz temel avantajlarımız
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '32px' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '48px 32px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid rgba(34, 30, 145, 0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
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
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(135deg, #e06c1b 0%, #e06c1b 100%)'
                  }}></div>
                  
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      background: 'linear-gradient(135deg, #e06c1b 0%, #e06c1b 100%)',
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
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#e06c1b'
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
          background: 'linear-gradient(135deg, #e06c1b 0%, #f97316 100%)',
          color: 'white',
          padding: '80px 24px',
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
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
            <Rocket size={16} />
            HIZLI BAŞLANGIÇ
          </div>
          
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
            Ürünleri Gör
            <Check size={22} />
          </a>
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
        @media (max-width: 768px) {
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

export default FeaturesPage;