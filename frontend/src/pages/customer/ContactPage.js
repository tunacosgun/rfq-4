import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
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
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(settings?.contact_form_success_message || 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              marginBottom: '24px',
              letterSpacing: '-1px',
              lineHeight: '1.1'
            }}
          >
            İletişime Geçin
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            Sorularınız veya talepleriniz için bize ulaşabilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-3" style={{ gap: '32px', marginBottom: '64px' }}>
            {settings?.company_phone && (
              <div
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
                  <Phone size={32} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  Telefon
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{settings.company_phone}</p>
              </div>
            )}

            {settings?.company_email && (
              <div
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
                  <Mail size={32} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  E-posta
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{settings.company_email}</p>
              </div>
            )}

            {settings?.company_address && (
              <div
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
                  <MapPin size={32} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  Adres
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {settings.company_address}
                </p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'start'
            }}
            className="contact-form-grid"
          >
            {/* Form */}
            <div className="card" style={{ padding: '48px' }}>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  marginBottom: '8px',
                  color: 'var(--text-primary)'
                }}
              >
                Mesaj Gönderin
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Formu doldurarak bize ulaşabilirsiniz.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Adınız Soyadınız *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Örn: Ahmet Yılmaz"
                    required
                    style={{ height: '48px' }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    E-posta Adresiniz *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Örn: ahmet@example.com"
                    required
                    style={{ height: '48px' }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Telefon Numaranız
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Örn: 0532 123 45 67"
                    style={{ height: '48px' }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Konu *
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Mesajınızın konusu"
                    required
                    style={{ height: '48px' }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mesajınızı buraya yazın..."
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '15px',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: 'var(--primary-600)',
                    color: 'white',
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {submitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  <Send size={20} />
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <div
                className="card"
                style={{
                  padding: '32px',
                  marginBottom: '24px',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <Clock size={24} color="var(--primary-600)" />
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Çalışma Saatleri</h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Cumartesi: 09:00 - 14:00</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <MessageCircle size={24} color="var(--primary-600)" />
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Hızlı İletişim</h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
                      Acil durumlar için telefon veya e-posta ile bize ulaşabilirsiniz. Ortalama yanıt süremiz 2 saat
                      içindedir.
                    </p>
                    {settings?.company_phone && (
                      <a
                        href={`tel:${settings.company_phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: 'var(--primary-600)',
                          color: 'white',
                          borderRadius: 'var(--radius-lg)',
                          textDecoration: 'none',
                          fontSize: '15px',
                          fontWeight: '700',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Phone size={18} />
                        Hemen Ara
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .contact-form-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default ContactPage;
