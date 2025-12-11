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
      const res = await axios
        .get(`${API}/settings`)
        .catch(() => ({ data: null }));
      setSettings(res.data);
    } catch (error) {
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      number: settings?.about_stat1_number || '50+',
      label: settings?.about_stat1_label || 'Yıllık Deneyim',
      icon: Award,
    },
    {
      number: settings?.about_stat2_number || '100+',
      label: settings?.about_stat2_label || 'Kurumsal Müşteri',
      icon: Users,
    },
    {
      number: settings?.about_stat3_number || '1000+',
      label: settings?.about_stat3_label || 'Tamamlanan Sipariş',
      icon: Target,
    },
    {
      number: settings?.about_stat4_number || '95%',
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
        'Müşterilerimize en kaliteli ürünleri, sürdürülebilir ve izlenebilir tedarik zinciriyle sunmak.',
    },
    {
      icon: Award,
      title: 'Vizyonumuz',
      description:
        settings?.about_vision ||
        'Bölgesel bir oyuncudan, global arenada çözüm ortağı olarak tercih edilen kurumsal tedarikçi olmak.',
    },
    {
      icon: Users,
      title: 'Değerlerimiz',
      description:
        settings?.about_values ||
        'Dürüstlük, şeffaflık, kalite, sürdürülebilirlik ve uzun vadeli iş ortaklığı temel değerlerimizdir.',
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
      <div className="about-loading">
        <div className="about-loading-card">
          <div className="about-spinner" />
          <p className="about-loading-title">Sayfa yükleniyor</p>
          <p className="about-loading-text">Lütfen birkaç saniye bekleyin…</p>
        </div>

        <style jsx>{`
          .about-loading {
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
          .about-loading-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px 30px;
            box-shadow: 0 22px 45px rgba(15, 23, 42, 0.16);
            border: 1px solid rgba(209, 213, 219, 0.85);
            text-align: center;
          }
          .about-spinner {
            width: 40px;
            height: 40px;
            border-radius: 999px;
            border: 3px solid rgba(34, 30, 145, 0.16);
            border-top-color: #221e91;
            animation: spin 0.9s linear infinite;
            margin: 0 auto 10px;
          }
          .about-loading-title {
            font-weight: 700;
            font-size: 16px;
            color: #111827;
          }
          .about-loading-text {
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
    <div className="about-page">
      <Header settings={settings} />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-gradient" />
        <div className="about-hero-inner about-animate-up">
          <div className="about-hero-left">
            <div className="about-hero-pill">
              <Shield size={16} />
              <span>Güvenilir Tedarik Ortağınız</span>
            </div>

            <h1 className="about-hero-title">
              {settings?.about_hero_title || 'Özmen Gıda 53 yıldır yanınızda'}
              <span className="about-hero-title-accent">
                {settings?.about_hero_subtitle_main ||
                  'deneyim, kalite ve güven'}
              </span>
            </h1>

            <p className="about-hero-text">
              {settings?.about_hero_subtitle ||
                'Güvene bağlı tedarik anlayışımızla; ürün, marka ve hizmet portföyümüzü sürekli geliştirerek müşterilerimizin tüm tedarik süreçlerinde uçtan uca çözüm ortağı oluyoruz.'}
            </p>

            <div className="about-hero-badges">
              <div className="about-hero-badge">
                <CheckCircle2 size={16} />
                Kurumsal tedarik için uçtan uca çözüm
              </div>
              <div className="about-hero-badge">
                <CheckCircle2 size={16} />
                Şeffaf süreçler ve güçlü raporlama
              </div>
              <div className="about-hero-badge">
                <CheckCircle2 size={16} />
                Uzun vadeli iş ortaklığı yaklaşımı
              </div>
            </div>
          </div>

          {/* Sağ: istatistik kartı */}
          <div className="about-hero-right about-animate-up-delayed">
            <div className="about-stats-card">
              <div className="about-stats-header">
                <div className="about-stats-pill">
                  <Rocket size={16} />
                  <span>Büyüme Yolculuğumuz</span>
                </div>
                <p className="about-stats-sub">
                  {settings?.about_short_intro ||
                    'Bölgesel bir tedarikçiden, ulusal ve uluslararası müşterilere hizmet veren güçlü bir iş ortağına dönüşen bir hikâye.'}
                </p>
              </div>

              <div className="about-stats-grid">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="about-stat-item">
                      <div className="about-stat-top">
                        <div className="about-stat-icon">
                          <Icon size={16} />
                        </div>
                        <span className="about-stat-label">{stat.label}</span>
                      </div>
                      <div className="about-stat-number">{stat.number}</div>
                    </div>
                  );
                })}
              </div>

              <div className="about-stats-footer">
                <Globe size={14} />
                <span>
                  {settings?.about_geo_info ||
                    'Türkiye genelinde ve seçili Avrupa ülkelerinde aktif operasyonlar.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KURUMSAL HİKÂYE */}
      <section className="about-story">
        <div className="about-container about-animate-up">
          <div className="about-main-grid">
            {/* Görsel */}
            <div className="about-story-image-wrapper">
              {settings?.about_image_url ? (
                <img
                  src={settings.about_image_url}
                  alt="Özmen Gıda"
                  className="about-story-image"
                />
              ) : (
                <div className="about-story-placeholder">
                  <Award size={72} color="#fefce8" />
                </div>
              )}
              <div className="about-story-badge">
                <Globe size={16} />
                <span>
                  {settings?.about_badge ||
                    'Global tedarik ağı ve güçlü lojistik altyapı'}
                </span>
              </div>
            </div>

            {/* Metin */}
            <div className="about-story-text">
              <div className="about-section-pill">
                <Rocket size={16} />
                <span>Kurumsal Kimlik</span>
              </div>

              <h2 className="about-section-title">
                {settings?.company_name || 'Özmen Gıda'} kimdir?
              </h2>

              <p className="about-story-paragraph">
                {settings?.about_description ||
                  'Sektörde uzun yıllara dayanan deneyimimizle; gıda ve temizlik ürün gruplarında, zincir marketlerden yerel işletmelere kadar geniş bir müşteri portföyüne hizmet veriyoruz.'}
              </p>

              <p className="about-story-paragraph">
                Geçmişten bugüne kazandığımız operasyonel tecrübe, güçlü
                tedarikçi ağımız ve teknolojik altyapımızla; müşterilerimizin
                satın alma süreçlerini sadeleştiren, maliyetlerini optimize
                eden ve risklerini azaltan çözümler geliştiriyoruz.
              </p>

              <div className="about-story-tags">
                <div className="about-story-tag">
                  <CheckCircle2 size={16} />
                  Kalite & izlenebilir tedarik zinciri
                </div>
                <div className="about-story-tag orange">
                  <CheckCircle2 size={16} />
                  Uzman ekip & danışmanlık
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MİSYON – VİZYON – DEĞERLER */}
      <section className="about-values">
        <div className="about-container">
          <div className="about-values-header about-animate-up">
            <div className="about-section-pill">
              <Target size={16} />
              <span>Kurumsal Değerler</span>
            </div>
            <h2 className="about-section-title">
              Misyon, vizyon ve değerlerimiz
            </h2>
            <p className="about-section-sub">
              Stratejilerimizi; sürdürülebilirlik, şeffaflık ve uzun vadeli iş
              birliği prensipleri üzerine inşa ediyoruz.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="about-value-card about-animate-up">
                  <div className="about-value-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="about-value-title">{value.title}</h3>
                  <p className="about-value-text">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq">
        <div className="about-container">
          <div className="about-faq-header about-animate-up">
            <div className="about-faq-header-left">
              <div className="about-faq-pill">
                <HelpCircle size={16} />
                <span>Sık Sorulan Sorular</span>
              </div>
              <h2 className="about-section-title">Sık Sorulan Sorular</h2>
              <p className="about-section-sub">
                Teklif süreçleri, teslimat ve çalışma modellerimizle ilgili
                aklınıza gelebilecek temel soruları burada topladık.
              </p>
            </div>
          </div>

          <div className="about-faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="about-faq-item about-animate-up">
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex((prev) => (prev === index ? -1 : index))
                  }
                  className="about-faq-question"
                >
                  <div className="about-faq-question-left">
                    <div className="about-faq-icon">
                      <HelpCircle size={18} />
                    </div>
                    <span>{item.question}</span>
                  </div>
                  <div
                    className={`about-faq-arrow ${
                      openFaqIndex === index ? 'open' : ''
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>
                {openFaqIndex === index && (
                  <div className="about-faq-answer">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <style jsx>{`
        :root {
          --primary: #221e91;
          --primary-dark: #1a1775;
          --secondary: #e06c1b;
          --secondary-light: #f97316;
          --bg-page: #f5f5f7;
          --card-radius: 22px;
        }

        .about-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-page);
        }

        .about-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ANIMATIONS */
        .about-animate-up {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.6s ease forwards;
        }

        .about-animate-up-delayed {
          opacity: 0;
          transform: translateY(18px);
          animation: fadeUp 0.6s ease 0.15s forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* HERO – AÇIK TEMA */
        .about-hero {
          margin-top: 72px;
          padding: 90px 0 70px;
          position: relative;
          background: radial-gradient(
              circle at 0% 0%,
              rgba(244, 114, 182, 0.08),
              transparent 55%
            ),
            linear-gradient(135deg, #fff7ed 0%, #eef2ff 40%, #ffffff 100%);
          color: #0f172a;
          overflow: hidden;
          border-bottom: 1px solid #e5e7eb;
        }

        .about-hero-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 90% 0%,
            rgba(244, 114, 182, 0.16),
            transparent 55%
          );
          pointer-events: none;
        }

        .about-hero-inner {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
          gap: 40px;
          align-items: center;
        }

        .about-hero-left {
          z-index: 1;
        }

        .about-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(209, 213, 219, 0.9);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
          color: #4b5563;
        }

        .about-hero-title {
          font-size: 38px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.8px;
          margin-bottom: 10px;
          color: #111827;
        }

        .about-hero-title-accent {
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

        .about-hero-text {
          font-size: 15px;
          line-height: 1.8;
          max-width: 560px;
          color: #4b5563;
          margin-bottom: 18px;
        }

        .about-hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 13px;
        }

        .about-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          color: #374151;
          box-shadow: 0 4px 10px rgba(148, 163, 184, 0.3);
        }

        .about-hero-right {
          z-index: 1;
          display: flex;
          justify-content: flex-end;
        }

        .about-stats-card {
          width: 100%;
          max-width: 380px;
          border-radius: var(--card-radius);
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 18px 40px rgba(148, 163, 184, 0.45);
          padding: 18px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .about-stats-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .about-stats-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid rgba(226, 232, 240, 1);
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
        }

        .about-stats-sub {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.7;
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .about-stat-item {
          padding: 10px 11px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            #ffffff,
            rgba(249, 250, 251, 0.96)
          );
          border: 1px solid rgba(226, 232, 240, 1);
          transition: transform 0.18s ease, box-shadow 0.18s ease,
            border-color 0.18s ease, background 0.18s ease;
        }

        .about-stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(148, 163, 184, 0.6);
          border-color: rgba(249, 115, 22, 0.7);
          background: linear-gradient(
            135deg,
            #ffffff,
            rgba(255, 247, 237, 0.95)
          );
        }

        .about-stat-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .about-stat-icon {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(249, 250, 251, 1);
          color: var(--secondary);
        }

        .about-stat-label {
          font-size: 12px;
          color: #4b5563;
        }

        .about-stat-number {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
        }

        .about-stats-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid rgba(229, 231, 235, 0.95);
          padding-top: 10px;
        }

        /* STORY */
        .about-story {
          padding: 76px 0 70px;
          background: #f9fafb;
        }

        .about-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 52px;
          align-items: center;
        }

        .about-story-image-wrapper {
          border-radius: 26px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 22px 44px rgba(148, 163, 184, 0.5);
          background: #ffffff;
        }

        .about-story-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .about-story-placeholder {
          width: 100%;
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            var(--secondary),
            var(--secondary-light)
          );
        }

        .about-story-badge {
          position: absolute;
          left: 18px;
          bottom: 18px;
          padding: 9px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 1);
          color: #374151;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          backdrop-filter: blur(10px);
        }

        .about-story-text {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .about-section-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(34, 30, 145, 0.06);
          color: var(--secondary);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .about-section-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
        }

        .about-section-sub {
          font-size: 15px;
          color: #6b7280;
          max-width: 580px;
          margin-top: 4px;
        }

        .about-story-paragraph {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.8;
          margin-top: 8px;
        }

        .about-story-tags {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .about-story-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(34, 30, 145, 0.06);
          color: var(--secondary);
          font-size: 13px;
          font-weight: 600;
        }

        .about-story-tag.orange {
          background: rgba(249, 115, 22, 0.09);
          color: #ea580c;
        }

        /* VALUES */
        .about-values {
          padding: 72px 0 80px;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
        }

        .about-values-header {
          text-align: center;
          margin-bottom: 42px;
        }

        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
        }

        .about-value-card {
          padding: 32px 26px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 14px 32px rgba(148, 163, 184, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            border-color 0.2s ease, background 0.2s ease;
        }

        .about-value-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 44px rgba(148, 163, 184, 0.6);
          border-color: rgba(249, 115, 22, 0.55);
          background: linear-gradient(
            135deg,
            #ffffff,
            rgba(255, 247, 237, 0.96)
          );
        }

        .about-value-icon {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            var(--secondary),
            var(--secondary-light)
          );
          color: #ffffff;
          margin-bottom: 12px;
          box-shadow: 0 12px 26px rgba(249, 115, 22, 0.5);
        }

        .about-value-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
        }

        .about-value-text {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.7;
        }

        /* FAQ */
        .about-faq {
          padding: 80px 0 96px;
          background: linear-gradient(135deg, #f3f4ff 0%, #e5edff 100%);
        }

        .about-faq-header {
          margin-bottom: 32px;
        }

        .about-faq-header-left {
          max-width: 560px;
        }

        .about-faq-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.12);
          color: var(--secondary);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .about-faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .about-faq-item {
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid rgba(209, 213, 219, 0.9);
          box-shadow: 0 10px 26px rgba(148, 163, 184, 0.4);
          overflow: hidden;
        }

        .about-faq-question {
          width: 100%;
          padding: 16px 20px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .about-faq-question-left {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }

        .about-faq-icon {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
        }

        .about-faq-question span {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
        }

        .about-faq-arrow {
          transition: transform 0.2s ease;
          color: #6b7280;
        }

        .about-faq-arrow.open {
          transform: rotate(180deg);
        }

        .about-faq-answer {
          padding: 0 20px 16px 62px;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.7;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .about-hero-inner {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .about-hero-right {
            justify-content: flex-start;
          }
          .about-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-values-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .about-hero {
            padding: 80px 0 60px;
          }
          .about-hero-inner {
            padding: 0 16px;
          }
          .about-container {
            padding: 0 16px;
          }
          .about-hero-title {
            font-size: 30px;
          }
          .about-story {
            padding: 64px 0 56px;
          }
          .about-values {
            padding: 64px 0 72px;
          }
          .about-faq {
            padding: 64px 0 80px;
          }
          .about-values-grid {
            grid-template-columns: 1fr;
          }
          .about-faq-answer {
            padding-left: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;