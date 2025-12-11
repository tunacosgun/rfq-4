import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  User,
  Building,
  Zap,
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          settings?.contact_form_success_message ||
            'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.'
        );
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return (
      <div className="contact-loading">
        <div className="contact-loading-card">
          <div className="contact-spinner" />
          <p className="contact-loading-title">Sayfa yükleniyor</p>
          <p className="contact-loading-text">Lütfen birkaç saniye bekleyin…</p>
        </div>

        <style jsx>{`
          .contact-loading {
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
          .contact-loading-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px 30px;
            box-shadow: 0 22px 45px rgba(15, 23, 42, 0.16);
            border: 1px solid rgba(209, 213, 219, 0.85);
            text-align: center;
          }
          .contact-spinner {
            width: 40px;
            height: 40px;
            border-radius: 999px;
            border: 3px solid rgba(34, 30, 145, 0.16);
            border-top-color: #221e91;
            animation: spin 0.9s linear infinite;
            margin: 0 auto 10px;
          }
          .contact-loading-title {
            font-weight: 700;
            font-size: 16px;
            color: #111827;
          }
          .contact-loading-text {
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
    <div className="contact-page">
      <Header settings={settings} />

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-inner contact-animate-up">
          <div className="contact-hero-pill">
            <MessageCircle size={18} />
            <span>7/24 Destek & Kurumsal İletişim</span>
          </div>

          <h1 className="contact-hero-title">
            İletişime Geçin
            <span>tüm sorularınız için yanınızdayız</span>
          </h1>

          <p className="contact-hero-text">
            Ürünlerimiz, teklif süreçlerimiz veya iş birliği fırsatları hakkında bilgi almak için bizimle
            hemen iletişime geçin. Ekibimiz en kısa sürede size geri dönecektir.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Üst: iletişim kartları */}
          <div className="contact-info-grid contact-animate-up">
            {settings?.company_phone && (
              <div className="contact-card info-card">
                <div className="info-card-accent" />
                <div className="info-card-icon phone">
                  <Phone size={30} />
                </div>
                <h3>Telefon</h3>
                <p className="info-card-text">{settings.company_phone}</p>
              </div>
            )}

            {settings?.company_email && (
              <div className="contact-card info-card">
                <div className="info-card-accent" />
                <div className="info-card-icon email">
                  <Mail size={30} />
                </div>
                <h3>E-posta</h3>
                <p className="info-card-text">{settings.company_email}</p>
              </div>
            )}

            {settings?.company_address && (
              <div className="contact-card info-card">
                <div className="info-card-accent" />
                <div className="info-card-icon address">
                  <MapPin size={30} />
                </div>
                <h3>Adres</h3>
                <p className="info-card-text">{settings.company_address}</p>
              </div>
            )}
          </div>

          {/* Alt: form + ek bilgiler */}
          <div className="contact-main-grid">
            {/* FORM */}
            <div className="contact-card contact-form-card contact-animate-up">
              <div className="contact-form-pill">
                <User size={16} />
                <span>Mesaj Formu</span>
              </div>
              <h2 className="contact-form-title">Mesaj Gönderin</h2>
              <p className="contact-form-sub">
                Formu doldurarak bize ulaşabilirsiniz. Talebinizi ilgili birime yönlendirip en kısa sürede size dönüş
                yapacağız.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-group">
                  <label>Adınız Soyadınız *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Örn: Ahmet Yılmaz"
                    required
                    className="contact-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label>E-posta Adresiniz *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Örn: ahmet@example.com"
                    required
                    className="contact-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label>Telefon Numaranız</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Örn: 0532 123 45 67"
                    className="contact-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label>Konu *</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Mesajınızın konusu"
                    required
                    className="contact-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label>Mesajınız *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mesajınızı buraya yazın..."
                    required
                    rows={6}
                    className="contact-textarea"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="contact-submit-btn"
                >
                  {submitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  <Send size={20} />
                </Button>
              </form>
            </div>

            {/* SAĞ BLOK – çalışma saatleri / hızlı iletişim */}
            <div className="contact-side">
              <div className="contact-card side-card contact-animate-up">
                <div className="side-card-icon-wrap">
                  <Clock size={22} />
                </div>
                <div>
                  <h3>Çalışma Saatleri</h3>
                  <p>Pazartesi – Cuma: 09:00 – 18:00</p>
                  <p>Cumartesi: 09:00 – 14:00</p>
                </div>
              </div>

              <div className="contact-card side-card contact-animate-up">
                <div className="side-card-icon-wrap">
                  <Zap size={22} />
                </div>
                <div>
                  <h3>Hızlı İletişim</h3>
                  <p>
                    Acil durumlar için telefon veya e-posta ile bize
                    ulaşabilirsiniz. Ortalama yanıt süremiz 2 saat içindedir.
                  </p>
                  {settings?.company_phone && (
                    <a
                      href={`tel:${settings.company_phone}`}
                      className="contact-call-btn"
                    >
                      <Phone size={18} />
                      Hemen Ara
                    </a>
                  )}
                </div>
              </div>

              <div className="contact-card side-card contact-animate-up">
                <div className="side-card-icon-wrap">
                  <Building size={22} />
                </div>
                <div>
                  <h3>Ofis Ziyareti</h3>
                  <p>
                    Ofisimizi ziyaret etmek için randevu alabilirsiniz. Size en
                    uygun zamanı belirlemek için lütfen önceden arayın.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

          .contact-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: var(--bg-page);
          }

          .contact-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px 80px;
          }

          /* Animations */
          .contact-animate-up {
            opacity: 0;
            transform: translateY(18px);
            animation: fadeUp 0.6s ease forwards;
          }

          @keyframes fadeUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* HERO (açık tema) */
          .contact-hero {
            margin-top: 72px;
            padding: 90px 0 72px;
            position: relative;
            background: radial-gradient(
                circle at 0% 0%,
                rgba(249, 115, 22, 0.08),
                transparent 55%
              ),
              linear-gradient(135deg, #fff7ed 0%, #eef2ff 45%, #ffffff 100%);
            color: var(--text-primary);
            border-bottom: 1px solid #e5e7eb;
            overflow: hidden;
          }

          .contact-hero-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at 90% 0%,
              rgba(129, 140, 248, 0.16),
              transparent 55%
            );
            pointer-events: none;
          }

          .contact-hero-inner {
            position: relative;
            max-width: 960px;
            margin: 0 auto;
            padding: 0 24px;
            text-align: center;
          }

          .contact-hero-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 999px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            font-size: 13px;
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 16px;
            box-shadow: 0 6px 16px rgba(148, 163, 184, 0.4);
          }

          .contact-hero-title {
            font-size: 38px;
            font-weight: 900;
            letter-spacing: -0.8px;
            margin-bottom: 10px;
            color: var(--text-primary);
            line-height: 1.1;
          }

          .contact-hero-title span {
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

          .contact-hero-text {
            font-size: 15px;
            color: var(--text-secondary);
            max-width: 620px;
            margin: 0 auto;
            line-height: 1.8;
          }

          /* INFO CARDS */
          .contact-section {
            background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          }

          .contact-info-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 26px;
            padding: 40px 0 36px;
          }

          .contact-card {
            border-radius: 18px;
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.95);
            box-shadow: 0 14px 32px rgba(148, 163, 184, 0.35);
          }

          .info-card {
            position: relative;
            padding: 32px 24px 30px;
            text-align: center;
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease,
              border-color 0.2s ease, background 0.2s ease;
          }

          .info-card-accent {
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at top,
              rgba(249, 115, 22, 0.12),
              transparent 55%
            );
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .info-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 22px 44px rgba(148, 163, 184, 0.6);
            border-color: rgba(249, 115, 22, 0.5);
            background: linear-gradient(
              135deg,
              #ffffff,
              rgba(255, 247, 237, 0.96)
            );
          }

          .info-card:hover .info-card-accent {
            opacity: 1;
          }

          .info-card-icon {
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 18px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            box-shadow: 0 12px 26px rgba(249, 115, 22, 0.55);
            background: linear-gradient(
              135deg,
              var(--secondary),
              var(--secondary-light)
            );
          }

          .info-card h3 {
            position: relative;
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
          }

          .info-card-text {
            position: relative;
            font-size: 15px;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          /* MAIN GRID */
          .contact-main-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);
            gap: 40px;
            align-items: flex-start;
            padding-bottom: 24px;
          }

          .contact-form-card {
            padding: 34px 32px 32px;
          }

          .contact-form-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 16px;
            border-radius: 999px;
            background: rgba(224, 108, 27, 0.08);
            color: var(--secondary);
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 10px;
          }

          .contact-form-title {
            font-size: 26px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 6px;
          }

          .contact-form-sub {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 20px;
          }

          .contact-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .contact-form-group label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--text-primary);
          }

          .contact-input {
            height: 46px;
            border-radius: 8px;
            border: 1px solid rgba(34, 30, 145, 0.16);
            font-size: 14px;
          }

          .contact-input:focus-visible {
            outline: none;
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(224, 108, 27, 0.15);
          }

          .contact-textarea {
            width: 100%;
            border-radius: 8px;
            border: 1px solid rgba(34, 30, 145, 0.16);
            padding: 10px 14px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
          }

          .contact-textarea:focus {
            outline: none;
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(224, 108, 27, 0.15);
          }

          .contact-submit-btn {
            margin-top: 4px;
            height: 52px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(
              135deg,
              var(--secondary),
              var(--secondary-light)
            );
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
            border: none;
          }

          .contact-submit-btn:hover {
            filter: brightness(1.03);
            transform: translateY(-1px);
          }

          .contact-submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          /* SIDE CARDS */
          .contact-side {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .side-card {
            padding: 20px 18px;
            display: flex;
            gap: 14px;
            align-items: flex-start;
          }

          .side-card-icon-wrap {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              var(--secondary),
              var(--secondary-light)
            );
            color: #ffffff;
            flex-shrink: 0;
          }

          .side-card h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
          }

          .side-card p {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .contact-call-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
            padding: 9px 14px;
            border-radius: 8px;
            background: linear-gradient(
              135deg,
              var(--secondary),
              var(--secondary-light)
            );
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
          }

          .contact-call-btn:hover {
            filter: brightness(1.04);
            transform: translateY(-1px);
          }

          /* GRID HELPERS (genel) */
          .grid {
            display: grid;
          }

          .grid-3 {
            grid-template-columns: repeat(3, 1fr);
          }

          /* RESPONSIVE */
          @media (max-width: 1024px) {
            .contact-container {
              padding: 0 20px 72px;
            }
            .contact-info-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .contact-main-grid {
              grid-template-columns: 1fr;
              gap: 32px;
            }
          }

          @media (max-width: 768px) {
            .contact-hero {
              padding: 80px 0 60px;
            }
            .contact-hero-inner {
              padding: 0 16px;
            }
            .contact-container {
              padding: 0 16px 64px;
            }
            .contact-hero-title {
              font-size: 30px;
            }
            .contact-info-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default ContactPage;