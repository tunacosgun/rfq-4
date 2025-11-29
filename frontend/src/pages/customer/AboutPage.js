import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Users, Target, TrendingUp, CheckCircle2, Star, Shield, Globe, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutPage = () => {
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

  const stats = [
    { number: '10+', label: 'Yıllık Deneyim', icon: Award },
    { number: '500+', label: 'Mutlu Müşteri', icon: Users },
    { number: '1000+', label: 'Tamamlanan Proje', icon: Target },
    { number: '98%', label: 'Müşteri Memnuniyeti', icon: Star }
  ];

  const values = [
    {
      icon: Target,
      title: 'Misyonumuz',
      description: 'Müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunarak, sektörde öncü olmak.'
    },
    {
      icon: Award,
      title: 'Vizyonumuz',
      description: 'Global pazarda rekabetçi bir oyuncu olarak, sürdürülebilir büyüme sağlamak.'
    },
    {
      icon: Users,
      title: 'Değerlerimiz',
      description: 'Dorüstlük, kalite, müşteri odaklılık ve yenilikçilik temel değerlerimizdir.'
    }
  ];

  const achievements = [
    'ISO 9001:2015 Kalite Yönetim Sistemi Belgesi',
    'Çevre Yönetim Sistemi Sertifikası',
    'Sektörün En İyi Tedarikçisi Ödülü 2024',
    'İhraçat Performans Ödülü',
    'Müşteri Memnuniyeti Mükemmellik Belgesi'
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
          background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
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
            <Shield size={18} fill="currentColor" />
            <span style={{ fontSize: '16px', fontWeight: '600' }}>
              GÜVENİN ADRESİ
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
              Hakkımızda
            </span>
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            {settings?.about_title ||
              'Yılların deneyimi ve mükemmellik anlayışıyla, sektörün önde gelen firmalarından biriyiz.'}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-4" style={{ gap: '32px' }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    background: 'white',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
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
                    background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)'
                  }}></div>
                  
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 8px 20px rgba(34, 30, 145, 0.3)'
                    }}
                  >
                    <Icon size={28} color="white" />
                  </div>
                  
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: '900',
                      color: '#221E91',
                      marginBottom: '8px',
                      background: 'linear-gradient(135deg, #221E91, #e06c1b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'center'
            }}
            className="about-grid"
          >
            {/* Image */}
            <div style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(34, 30, 145, 0.15)',
              position: 'relative'
            }}>
              {settings?.about_image_url ? (
                <img
                  src={settings.about_image_url}
                  alt="Hakkımızda"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '400px',
                    background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Award size={80} color="white" />
                </div>
              )}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'linear-gradient(transparent, rgba(34, 30, 145, 0.8))',
                padding: '40px 32px',
                color: 'white'
              }}>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(224, 108, 27, 0.9)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <Globe size={16} />
                  GLOBAL ÇÖZÜMLER
                </div>
              </div>
            </div>

            {/* Text */}
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
                <Rocket size={16} />
                KURUMSAL KİMLİK
              </div>
              
              <h2
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  marginBottom: '24px',
                  color: '#221E91'
                }}
              >
                {settings?.company_name || 'Özmen Gıda'}
              </h2>
              <p
                style={{
                  fontSize: '17px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  marginBottom: '24px'
                }}
              >
                {settings?.about_description ||
                  'Sektörde uzun yıllara dayanan deneyimimiz ve mükemmellik anlayışımızla, müşterilerimize en kaliteli hizmeti sunmayı hedefliyoruz. Ürün kalitesinden müşteri memnuniyetine kadar her aşamada en yüksek standartları benimsiyoruz.'}
              </p>
              <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                Geçmişten bugüne kazandığımız deneyim ve uzmanlıkla, sektörün öncü firmalarından biri olarak
                geleceğe emin adımlarla ilerliyoruz.
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '32px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'rgba(34, 30, 145, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#221E91'
                }}>
                  <CheckCircle2 size={16} />
                  Kalite Garantisi
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'rgba(224, 108, 27, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#e06c1b'
                }}>
                  <CheckCircle2 size={16} />
                  Uzman Ekip
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .about-grid {
              grid-template-columns: 1fr !important;
              gap: 48px !important;
            }
          }
        `}</style>
      </section>

      {/* Values Section */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
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
              <Target size={16} />
              KURUMSAL DEĞERLER
            </div>
            
            <h2
              style={{
                fontSize: '40px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}
            >
              Misyon, Vizyon & Değerlerimiz
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Temel prensiplerimiz ve iş yapış şeklimiz, kurumsal kimliğimizin temelini oluşturur
            </p>
          </div>
          
          <div className="grid grid-3" style={{ gap: '32px' }}>
            {values.map((value, index) => {
              const Icon = value.icon;
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
                    background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)'
                  }}></div>
                  
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
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#221E91'
                    }}
                  >
                    {value.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
              <Award size={16} />
              BAŞARILARIMIZ
            </div>
            
            <h2
              style={{
                fontSize: '40px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'var(--text-primary)'
              }}
            >
              Sertifikalarımız & Ödüllerimiz
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Kalitemizi ve güvenilirliğimizi belgeleyen ulusal ve uluslararası sertifikalar
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '24px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'all 0.3s ease',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid rgba(34, 30, 145, 0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 30, 145, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(224, 108, 27, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(34, 30, 145, 0.1)';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(34, 30, 145, 0.3)'
                  }}
                >
                  <CheckCircle2 size={24} color="white" />
                </div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{achievement}</p>
              </div>
            ))}
          </div>
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

export default AboutPage;