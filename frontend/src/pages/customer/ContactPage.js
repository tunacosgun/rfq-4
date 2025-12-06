import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, User, Building, Zap } from 'lucide-react';
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
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(settings?.contact_form_success_message || 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            <MessageCircle size={18} fill="currentColor" />
            <span style={{ fontSize: '16px', fontWeight: '600' }}>
              7/24 DESTEK
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
              İletişime Geçin
            </span>
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            Sorularınız veya talepleriniz için bize ulaşabilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-3" style={{ gap: '32px', marginBottom: '64px' }}>
            {settings?.company_phone && (
              <div
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
                  <Phone size={32} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#e06c1b'
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
                  <Mail size={32} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#e06c1b'
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
                  <MapPin size={32} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#e06c1b'
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
            <div className="card" style={{ 
              padding: '48px',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(34, 30, 145, 0.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
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
                <User size={16} />
                MESAJ FORMU
              </div>
              
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  marginBottom: '8px',
                  color: '#e06c1b'
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
                    style={{ 
                      height: '48px',
                      border: '1px solid rgba(34, 30, 145, 0.2)',
                      borderRadius: '8px'
                    }}
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
                    style={{ 
                      height: '48px',
                      border: '1px solid rgba(34, 30, 145, 0.2)',
                      borderRadius: '8px'
                    }}
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
                    style={{ 
                      height: '48px',
                      border: '1px solid rgba(34, 30, 145, 0.2)',
                      borderRadius: '8px'
                    }}
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
                    style={{ 
                      height: '48px',
                      border: '1px solid rgba(34, 30, 145, 0.2)',
                      borderRadius: '8px'
                    }}
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
                      border: '1px solid rgba(34, 30, 145, 0.2)',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'vertical',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#e06c1b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(34, 30, 145, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: 'linear-gradient(135deg, #e06c1b 0%, #e06c1b 100%)',
                    color: 'white',
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    border: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(34, 30, 145, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 30, 145, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 30, 145, 0.3)';
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
                  background: 'linear-gradient(135deg, rgba(34, 30, 145, 0.05) 0%, rgba(224, 108, 27, 0.05) 100%)',
                  border: '1px solid rgba(34, 30, 145, 0.1)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #e06c1b 0%, #e06c1b 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Clock size={24} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#e06c1b' }}>Çalışma Saatleri</h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Cumartesi: 09:00 - 14:00</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ 
                padding: '32px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid rgba(34, 30, 145, 0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #e06c1b 0%, #e06c1b 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Zap size={24} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#e06c1b' }}>Hızlı İletişim</h3>
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
                          background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
                          color: 'white',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '15px',
                          fontWeight: '700',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(224, 108, 27, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(224, 108, 27, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(224, 108, 27, 0.3)';
                        }}
                      >
                        <Phone size={18} />
                        Hemen Ara
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="card" style={{ 
                padding: '32px',
                marginTop: '24px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid rgba(34, 30, 145, 0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #e06c1b 0%, #e06c1b 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Building size={24} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#e06c1b' }}>Ofis Ziyareti</h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                      Ofisimizi ziyaret etmek için randevu alabilirsiniz. Size en uygun zamanı belirlemek için lütfen önceden arayın.
                    </p>
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
          
          @media (max-width: 768px) {
            .grid-3 {
              grid-template-columns: 1fr;
            }
          }
          
          .grid {
            display: grid;
          }
          
          .grid-3 {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .card {
            transition: all 0.3s ease;
          }
        `}</style>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default ContactPage;