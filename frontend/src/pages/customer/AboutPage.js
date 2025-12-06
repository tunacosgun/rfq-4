import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Award,
  Users,
  Target,
  CheckCircle2,
  Star,
  Shield,
  Globe,
  Rocket,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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
    {
      number: settings?.about_stat1_number || '10+',
      label: settings?.about_stat1_label || 'Yıllık Deneyim',
      icon: Award,
    },
    {
      number: settings?.about_stat2_number || '500+',
      label: settings?.about_stat2_label || 'Mutlu Müşteri',
      icon: Users,
    },
    {
      number: settings?.about_stat3_number || '1000+',
      label: settings?.about_stat3_label || 'Tamamlanan Proje',
      icon: Target,
    },
    {
      number: settings?.about_stat4_number || '98%',
      label: settings?.about_stat4_label || 'Müşteri Memnuniyeti',
      icon: Star,
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Misyonumuz',
      description:
        settings?.about_mission ||
        'Müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunarak, sektörde öncü olmak.',
    },
    {
      icon: Award,
      title: 'Vizyonumuz',
      description:
        settings?.about_vision ||
        'Global pazarda rekabetçi bir oyuncu olarak, sürdürülebilir büyüme sağlamak.',
    },
    {
      icon: Users,
      title: 'Değerlerimiz',
      description:
        settings?.about_values ||
        'Dürüstlük, kalite, müşteri odaklılık ve yenilikçilik temel değerlerimizdir.',
    },
  ];

  const faqItems = [
    {
      question: 'Teklif talebine ne kadar sürede dönüş yapıyorsunuz?',
      answer:
        'Çalışma saatleri içinde gelen taleplere genellikle aynı gün, en geç 24 saat içerisinde geri dönüş sağlıyoruz. Kurumsal ve yüksek hacimli alımlarda özel fiyat çalışması yaparak detaylı teklif iletiyoruz.',
    },
    {
      question: 'Minimum sipariş miktarı var mı?',
      answer:
        'Ürün grubuna ve marka anlaşmalarına göre değişmekle birlikte, standart ürünler için esnek sipariş politikası uyguluyoruz. Düzenli alım yapan kurumsal müşterilerimiz için özel MOQ (minimum sipariş) tanımlanabiliyor.',
    },
    {
      question: 'Teslimat ve lojistik süreçlerini siz mi yönetiyorsunuz?',
      answer:
        'Evet. Çoğu bölgede kendi lojistik ağımızı veya anlaşmalı nakliye firmalarını kullanıyoruz. Teslimat planı, teklif aşamasında netleştirilip size yazılı olarak iletiliyor.',
    },
    {
      question: 'Sadece kurumsal firmalarla mı çalışıyorsunuz?',
      answer:
        'Önceliğimiz kurumsal ve toplu alım yapan işletmeler olsa da, proje bazlı veya dönemsel ihtiyaçları olan işletmelerle de çalışıyoruz. İhtiyacınıza göre ölçeklenebilir çözümler sunuyoruz.',
    },
    {
      question: 'Ödemelerde hangi yöntemleri kullanabiliyorum?',
      answer:
        'Mutabakata göre havale/EFT, vadeli çalışma, çek veya sözleşmeli ödeme planları oluşturulabiliyor. Tüm süreç, teklif ve sözleşme aşamasında şeffaf şekilde belirleniyor.',
    },
  ];

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
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
      <Header settings={settings} />

      {/* HERO */}
      <section
        style={{
          marginTop: '72px',
          padding: '96px 24px 72px',
          background: 'linear-gradient(135deg,#111827 0%,#f97316 50%,#020617 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 15% 0%,rgba(224,108,27,0.35) 0%,transparent 55%)',
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
            gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
            gap: 40,
            alignItems: 'center',
          }}
          className="about-hero-grid"
        >
          {/* Left text */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 18px',
                borderRadius: 999,
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(148,163,184,0.7)',
                marginBottom: 20,
                fontSize: 13,
                fontWeight: 600,
                backdropFilter: 'blur(14px)',
              }}
            >
              <Shield size={16} />
              GÜVENİLİR TEDARİK ORTAĞINIZ
            </div>

            <h1
              style={{
                fontSize: 46,
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: '-1.2px',
                marginBottom: 16,
              }}
              className="about-hero-title"
            >
              {settings?.about_hero_title || 'Hakkımızda'}
              <span
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg,#f97316,#fb7185)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginTop: 6,
                }}
              >
                deneyim, kalite ve güven
              </span>
            </h1>

            <p
              style={{
                fontSize: 17,
                maxWidth: 580,
                lineHeight: 1.7,
                opacity: 0.95,
                marginBottom: 24,
              }}
            >
              {settings?.about_hero_subtitle ||
                'Yılların deneyimi ve mükemmellik anlayışıyla, müşterilerimize sadece ürün değil; süreç tasarımı, lojistik ve sürdürülebilir iş ortaklığı sunuyoruz.'}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                fontSize: 13,
                opacity: 0.95,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} />
                <span>Kurumsal tedarik için uçtan uca çözüm</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} />
                <span>Şeffaf süreçler ve güçlü raporlama</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} />
                <span>Uzun vadeli iş ortaklığı yaklaşımı</span>
              </div>
            </div>
          </div>

          {/* Right – stats card */}
          <div
            style={{
              borderRadius: 26,
              padding: 24,
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(148,163,184,0.5)',
              boxShadow: '0 22px 55px rgba(15,23,42,0.75)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Rocket size={22} color="#f97316" />
              <div style={{ fontSize: 14, fontWeight: 700 }}>Büyüme Yolculuğumuz</div>
            </div>

            <p
              style={{
                fontSize: 13,
                color: 'rgba(226,232,240,0.9)',
                lineHeight: 1.7,
              }}
            >
              {settings?.about_short_intro ||
                'Bölgesel bir tedarikçiden, ulusal ve uluslararası müşterilere hizmet veren güçlü bir iş ortağına dönüşen bir hikâye.'}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
                gap: 12,
              }}
            >
              {stats.slice(0, 4).map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 16,
                      border: '1px solid rgba(148,163,184,0.6)',
                      background:
                        'radial-gradient(circle at 0 0,rgba(251,191,36,0.25),transparent 60%)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(15,23,42,0.9)',
                        }}
                      >
                        <Icon size={16} color="#facc15" />
                      </div>
                      <div style={{ fontSize: 13, color: '#e5e7eb' }}>{stat.label}</div>
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#f9fafb',
                      }}
                    >
                      {stat.number}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: '#9ca3af',
                marginTop: 4,
              }}
            >
              <Globe size={14} />
              {settings?.about_geo_info || 'Türkiye genelinde ve seçili Avrupa ülkelerinde aktif operasyonlar.'}
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal hikâye – image + text */}
      <section
        style={{
          padding: '80px 24px',
          background: '#F9FAFB',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)',
              gap: 56,
              alignItems: 'center',
            }}
            className="about-main-grid"
          >
            {/* Image */}
            <div
              style={{
                borderRadius: 26,
                overflow: 'hidden',
                boxShadow: '0 22px 40px rgba(15,23,42,0.15)',
                position: 'relative',
                background: '#020617',
              }}
            >
              {settings?.about_image_url ? (
                <img
                  src={settings.about_image_url}
                  alt="Hakkımızda"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 360,
                    background: 'linear-gradient(135deg,#ea580c,#f97316,#f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={80} color="#f9fafb" />
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  bottom: 18,
                  padding: '10px 16px',
                  borderRadius: 16,
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(148,163,184,0.7)',
                  color: '#e5e7eb',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Globe size={16} />
                {settings?.about_badge || 'Global tedarik ağı & güçlü lojistik'}
              </div>
            </div>

            {/* Text */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 16px',
                  borderRadius: 999,
                  background: 'rgba(34,30,145,0.08)',
                  color: '#e06c1b',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                <Rocket size={15} />
                KURUMSAL KİMLİK
              </div>

              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  marginBottom: 12,
                  color: '#111827',
                }}
              >
                {settings?.company_name || 'Özmen Gıda'} kimdir?
              </h2>

              <p
                style={{
                  fontSize: 15,
                  color: '#4b5563',
                  lineHeight: 1.8,
                  marginBottom: 14,
                }}
              >
                {settings?.about_description ||
                  'Sektörde uzun yıllara dayanan deneyimimizle; gıda ve endüstriyel ürün gruplarında, zincir marketlerden yerel işletmelere kadar geniş bir müşteri portföyüne hizmet veriyoruz.'}
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: '#4b5563',
                  lineHeight: 1.8,
                }}
              >
                Geçmişten bugüne kazandığımız operasyonel tecrübe, güçlü tedarikçi ağımız ve teknolojik altyapımızla,
                müşterilerimizin satın alma süreçlerini sadeleştiren, maliyetlerini optimize eden ve risklerini azaltan
                çözümler üretiyoruz.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 14,
                  marginTop: 22,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 999,
                    background: 'rgba(34,30,145,0.08)',
                    color: '#e06c1b',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} />
                  Kalite & izlenebilir tedarik zinciri
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 999,
                    background: 'rgba(249,115,22,0.08)',
                    color: '#ea580c',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} />
                  Uzman ekip & danışmanlık
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misyon, vizyon, değerler */}
      <section
        style={{
          padding: '80px 24px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(34,30,145,0.08)',
                color: '#e06c1b',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <Target size={15} />
              KURUMSAL DEĞERLER
            </div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                marginBottom: 8,
                color: '#111827',
              }}
            >
              Misyon, vizyon ve değerlerimiz
            </h2>
            <p
              style={{
                fontSize: 15,
                color: '#6b7280',
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              Stratejilerimizi; sürdürülebilirlik, şeffaflık ve uzun vadeli iş birliği prensipleri üzerine inşa ediyoruz.
            </p>
          </div>

          <div
            className="about-values-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: 28,
            }}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '36px 28px',
                    background: '#ffffff',
                    borderRadius: 18,
                    border: '1px solid rgba(226,232,240,0.9)',
                    boxShadow: '0 12px 28px rgba(15,23,42,0.06)',
                    textAlign: 'left',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(15,23,42,0.18)';
                    e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(15,23,42,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(226,232,240,0.9)';
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg,#e06c1b,#f59e0b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                      boxShadow: '0 10px 22px rgba(67,56,202,0.45)',
                    }}
                  >
                    <Icon size={26} color="#ffffff" />
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 8,
                      color: '#111827',
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: '#6b7280',
                      lineHeight: 1.7,
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: '80px 24px 96px',
          background: 'linear-gradient(135deg,#eff6ff 0%,#eef2ff 100%)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(37,99,235,0.12)',
                color: '#f97316',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <HelpCircle size={15} />
              SIK SORULAN SORULAR
            </div>
            <h2
              style={{
                fontSize: 30,
                fontWeight: 800,
                marginBottom: 8,
                color: '#111827',
              }}
            >
              Sık Sorulan Sorular
            </h2>
            <p
              style={{
                fontSize: 15,
                color: '#6b7280',
                maxWidth: 540,
                margin: '0 auto',
              }}
            >
              Teklif süreçleri, teslimat ve çalışma modellerimizle ilgili aklınıza gelebilecek temel soruları burada
              toparladık.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {faqItems.map((item, index) => (
              <div
                key={index}
                style={{
                  borderRadius: 14,
                  background: '#ffffff',
                  border: '1px solid rgba(209,213,219,0.9)',
                  boxShadow: '0 8px 20px rgba(15,23,42,0.05)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex((prev) => (prev === index ? -1 : index))
                  }
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        background: 'rgba(37,99,235,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <HelpCircle size={18} color="#f97316" />
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <div
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown size={18} color="#6b7280" />
                  </div>
                </button>
                {openFaqIndex === index && (
                  <div
                    style={{
                      padding: '0 20px 16px 62px',
                      fontSize: 14,
                      color: '#4b5563',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
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

        @media (max-width: 1024px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .about-main-grid {
            grid-template-columns: 1fr !important;
          }
          .about-values-grid {
            grid-template-columns: repeat(2,minmax(0,1fr)) !important;
          }
        }

        @media (max-width: 768px) {
          .about-hero-title {
            font-size: 32px !important;
          }
          .about-values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;