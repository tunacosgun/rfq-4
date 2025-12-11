import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Building, Phone, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings could not be loaded');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/customer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
        navigate('/musteri-giris');
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }}></div>

      <Header settings={settings} />
      
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px 48px',
        marginTop: '80px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '560px',
          padding: '56px',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          {/* Top Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #22C55E 0%, #3B82F6 100%)',
            borderRadius: '0 0 4px 4px'
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #3B82F6 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-4px',
                background: 'linear-gradient(135deg, #22C55E 0%, #3B82F6 100%)',
                borderRadius: '22px',
                opacity: 0.2,
                filter: 'blur(8px)'
              }}></div>
              <UserPlus size={40} color="white" style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #22C55E 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Müşteri Kaydı
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#6B7280',
              fontWeight: '500'
            }}>
              Hesap oluşturarak tekliflerinizi kolayca takip edin
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '22px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  <User size={16} style={{ marginRight: '8px' }} />
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="Ali Veli"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22C55E';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  <Mail size={16} style={{ marginRight: '8px' }} />
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="ornek@email.com"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22C55E';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  <Lock size={16} style={{ marginRight: '8px' }} />
                  Şifre *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22C55E';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <span style={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontWeight: '500',
                  marginTop: '6px',
                  display: 'block'
                }}>
                  En az 6 karakter olmalıdır
                </span>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  <Building size={16} style={{ marginRight: '8px' }} />
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="Şirket A.Ş."
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22C55E';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  <Phone size={16} style={{ marginRight: '8px' }} />
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="0532 123 45 67"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22C55E';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #3B82F6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(34, 197, 94, 0.3)',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                    Kayıt yapılıyor...
                  </>
                ) : (
                  <>
                    Kayıt Ol
                    <ArrowRight size={20} />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Benefits Section */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: '12px',
            border: '1px solid #86EFAC'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={18} color="white" />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#065F46' }}>
                Üyelik Avantajları
              </div>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                'Tekliflerinizi anında takip edin',
                'Geçmiş siparişlerinize erişin',
                'Özel kampanyalardan yararlanın',
                'Hızlı ve güvenli ödeme'
              ].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#047857', fontWeight: '500' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0 24px',
            gap: '16px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)' }}></div>
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>ZATEN ÜYE MİSİNİZ?</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)' }}></div>
          </div>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            fontSize: '15px',
            color: '#6B7280',
            fontWeight: '500'
          }}>
            Zaten bir hesabınız var mı?{' '}
            <Link
              to="/musteri-giris"
              style={{
                color: '#22C55E',
                fontWeight: '700',
                textDecoration: 'none',
                position: 'relative',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#16A34A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#22C55E';
              }}
            >
              Giriş Yapın
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #22C55E 0%, #3B82F6 100%)',
                borderRadius: '2px'
              }}></div>
            </Link>
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </div>
  );
};

export default CustomerRegister;