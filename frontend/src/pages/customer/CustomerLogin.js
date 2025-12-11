import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useCustomerAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/musteri-panel';
      navigate(from, { replace: true });
    }
    
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    // Initialize Google Sign-In after script loads
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '999451918468-j9gr7a8ak9tl6em78qfsq030aqr1birc.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: '100%',
            locale: 'tr'
          }
        );
      }
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthenticated, navigate, location]);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const res = await fetch(`${backendUrl}/api/customer/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.customer, data.token);
        toast.success('Google ile giriş başarılı!');
      } else {
        const error = await res.json();
        toast.error(error.detail || 'Google girişi başarısız');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Bir hata oluştu');
    }
  }, [backendUrl, login]);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.customer, data.token);
        toast.success('Giriş başarılı!');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Bir hata oluştu');
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
        background: 'linear-gradient(135deg, rgba(224, 108, 27, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
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
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(224, 108, 27, 0.08) 100%)',
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
          padding: '56px',
          maxWidth: '480px',
          width: '100%',
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
            background: 'linear-gradient(90deg, #e06c1b 0%, #3B82F6 100%)',
            borderRadius: '0 0 4px 4px'
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #e06c1b 0%, #c75a14 50%, #3B82F6 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(224, 108, 27, 0.3)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-4px',
                background: 'linear-gradient(135deg, #e06c1b 0%, #3B82F6 100%)',
                borderRadius: '22px',
                opacity: 0.2,
                filter: 'blur(8px)'
              }}></div>
              <User size={40} color="white" style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #e06c1b 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Müşteri Girişi
            </h1>
            <p style={{ 
              fontSize: '15px', 
              color: '#6B7280',
              fontWeight: '500'
            }}>
              Hesabınıza güvenli giriş yapın
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '24px' }}>
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
                  E-posta *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="ornek@email.com"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e06c1b';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(224, 108, 27, 0.1)';
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
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none',
                    background: '#F9FAFB'
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e06c1b';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(224, 108, 27, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.background = '#F9FAFB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: '#6B7280',
                    fontSize: '14px',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#e06c1b'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                >
                  Şifremi Unuttum?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #e06c1b 0%, #c75a14 50%, #3B82F6 100%)',
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
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(224, 108, 27, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(224, 108, 27, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(224, 108, 27, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap
                    <ArrowRight size={20} />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '24px 0 16px',
                gap: '16px'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)' }}></div>
                <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>VEYA</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)' }}></div>
              </div>

              {/* Google Sign-In Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <div id="googleSignInDiv" style={{ width: '100%' }}></div>
              </div>
            </div>
          </form>

          {/* Security Badge */}
          <div style={{
            marginTop: '28px',
            padding: '16px',
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: '12px',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#065F46', marginBottom: '2px' }}>
                Güvenli Bağlantı
              </div>
              <div style={{ fontSize: '12px', color: '#047857' }}>
                Bilgileriniz 256-bit SSL ile korunmaktadır
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0',
            gap: '16px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)' }}></div>
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>YENİ MİSİNİZ?</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%)' }}></div>
          </div>

          {/* Register Link */}
          <div style={{
            textAlign: 'center',
            fontSize: '15px',
            color: '#6B7280',
            fontWeight: '500'
          }}>
            Henüz hesabınız yok mu?{' '}
            <Link
              to="/musteri-kayit"
              style={{
                color: '#e06c1b',
                fontWeight: '700',
                textDecoration: 'none',
                position: 'relative',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#c75a14';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#e06c1b';
              }}
            >
              Hemen Kayıt Olun
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #e06c1b 0%, #3B82F6 100%)',
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

export default CustomerLogin;