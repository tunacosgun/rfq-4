import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Users, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
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
    { number: '10+', label: 'Yıllık Deneyim' },
    { number: '500+', label: 'Mutlu Müşteri' },
    { number: '1000+', label: 'Tamamlanan Proje' },
    { number: '98%', label: 'Müşteri Memnuniyeti' }
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
            Hakkımızda
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
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '32px 24px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xl)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'var(--primary-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    color: 'var(--primary-600)',
                    marginBottom: '8px'
                  }}
                >
                  {stat.number}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
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
            <div style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
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
                    background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Award size={80} color="white" />
                </div>
              )}
            </div>

            {/* Text */}
            <div>
              <h2
                style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  marginBottom: '24px',
                  color: 'var(--text-primary)'
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
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: '56px',
              color: 'var(--text-primary)'
            }}
          >
            Misyon, Vizyon & Değerlerimiz
          </h2>
          <div className="grid grid-3" style={{ gap: '32px' }}>
            {values.map((value, index) => {
              const Icon = value.icon;
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
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      color: 'var(--text-primary)'
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
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: '56px',
              color: 'var(--text-primary)'
            }}
          >
            Başarılarımız & Sertifikalarımız
          </h2>
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
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--primary-100)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <CheckCircle2 size={24} color="var(--primary-600)" />
                </div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default AboutPage;
