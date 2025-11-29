import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Upload, CheckCircle, Send, User, Mail, Phone, Building, MessageSquare, Shield, Zap, Star } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuoteFormPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartCount } = useQuoteCart();
  const { customer, isAuthenticated } = useCustomerAuth();
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Auto-fill form if customer is logged in
  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData(prev => ({
        ...prev,
        customer_name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || prev.company, // Keep current value if customer has no company
      }));
    }
  }, [isAuthenticated, customer]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/settings`).catch(() => ({ data: null }));
      setSettings(res.data);
    } catch (error) {
      console.error('Settings yüklenemedi');
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }

    if (!formData.customer_name || !formData.email) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    setLoading(true);

    try {
      const quoteData = {
        customer_name: formData.customer_name,
        company: formData.company || '',
        email: formData.email,
        phone: formData.phone || '',
        message: formData.message || '',
        items: cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
        })),
        attachments: file ? [file.name] : [],
      };

      const response = await axios.post(`${API}/quotes`, quoteData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        clearCart();
        toast.success('Teklif talebiniz başarıyla gönderildi!');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      toast.error('Teklif gönderilirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingSettings) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)' }}>
        <Header settings={settings} />
        
        <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 60px' }}>
          <div className="card" style={{ 
            maxWidth: '600px', 
            padding: '60px 40px', 
            textAlign: 'center',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(34, 30, 145, 0.1)',
            boxShadow: '0 8px 32px rgba(34, 30, 145, 0.15)'
          }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}
            >
              <CheckCircle size={40} color="white" />
            </div>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(34, 30, 145, 0.1)',
              color: '#221E91',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              <Star size={14} />
              TALEP GÖNDERİLDİ
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#221E91' }}>
              Teklif Talebiniz Alındı!
            </h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
              Teklif talebiniz başarıyla kaydedildi. En kısa sürede size dönüş yapacağız.
            </p>
            <Button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
                color: 'white',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '700',
                border: 'none',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(34, 30, 145, 0.3)'
              }}
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </section>

        <Footer settings={settings} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)' }}>
      <Header settings={settings} />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
          color: 'white',
          padding: '140px 24px 60px',
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
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link
            to="/teklif-sepeti"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              textDecoration: 'none',
              marginBottom: '24px',
              fontSize: '15px',
              fontWeight: '600',
              opacity: 0.9,
              transition: 'all 0.2s',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
          >
            <ArrowLeft size={20} />
            Sepete Dön
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div
              style={{
                padding: '16px',
                background: 'rgba(224, 108, 27, 0.2)',
                borderRadius: '16px',
                border: '1px solid rgba(224, 108, 27, 0.3)'
              }}
            >
              <Send size={32} color="#e06c1b" />
            </div>
            <div>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <Zap size={14} />
                TEKLİF FORMU
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: '900', margin: 0, lineHeight: 1.1 }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Teklif Gönder
                </span>
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '18px', opacity: 0.95 }}>
            Bilgilerinizi doldurun, en kısa sürede size özel fiyatlandırma ile dönüş yapalım.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '60px 24px', flex: 1 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }} className="form-grid">
              {/* Form Fields */}
              <div className="card" style={{ 
                padding: '40px',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(34, 30, 145, 0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(224, 108, 27, 0.1)',
                  color: '#e06c1b',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  <User size={14} />
                  İLETİŞİM BİLGİLERİ
                </div>
                
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#221E91' }}>İletişim Bilgileri</h2>
                <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
                  Lütfen aşağıdaki formu doldurun. * ile işaretli alanlar zorunludur.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#221E91'
                      }}
                    >
                      <User size={16} />
                      Adınız Soyadınız *
                    </label>
                    <Input
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Örn: Ahmet Yılmaz"
                      required
                      disabled={isAuthenticated}
                      style={{ 
                        height: '48px', 
                        fontSize: '15px',
                        border: '1px solid rgba(34, 30, 145, 0.2)',
                        borderRadius: '8px',
                        backgroundColor: isAuthenticated ? '#f3f4f6' : 'white',
                        cursor: isAuthenticated ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#221E91'
                      }}
                    >
                      <Building size={16} />
                      Şirket Adı
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Örn: ABC Ticaret Ltd."
                      style={{ 
                        height: '48px', 
                        fontSize: '15px',
                        border: '1px solid rgba(34, 30, 145, 0.2)',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#221E91'
                      }}
                    >
                      <Mail size={16} />
                      E-posta Adresiniz *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ornek@email.com"
                      required
                      disabled={isAuthenticated}
                      style={{ 
                        height: '48px', 
                        fontSize: '15px',
                        border: '1px solid rgba(34, 30, 145, 0.2)',
                        borderRadius: '8px',
                        backgroundColor: isAuthenticated ? '#f3f4f6' : 'white',
                        cursor: isAuthenticated ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#221E91'
                      }}
                    >
                      <Phone size={16} />
                      Telefon Numaranız
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0532 123 45 67"
                      style={{ 
                        height: '48px', 
                        fontSize: '15px',
                        border: '1px solid rgba(34, 30, 145, 0.2)',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#221E91'
                      }}
                    >
                      <MessageSquare size={16} />
                      Ek Notlar
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Varsa özel taleplerinizi buraya yazabilirsiniz..."
                      rows={4}
                      style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.6',
                        border: '1px solid rgba(34, 30, 145, 0.2)',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#221E91'
                      }}
                    >
                      <Upload size={16} />
                      Dosya Ekle (Opsiyonel)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid rgba(34, 30, 145, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        background: 'white'
                      }}
                    />
                    {file && (
                      <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                        Seçili: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                <div className="card" style={{ 
                  padding: '32px',
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid rgba(34, 30, 145, 0.1)',
                  boxShadow: '0 8px 32px rgba(34, 30, 145, 0.15)'
                }}>
                  <div style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'rgba(34, 30, 145, 0.1)',
                    color: '#221E91',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    <Package size={14} />
                    SİPARİŞ ÖZETİ
                  </div>
                  
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: '#221E91' }}>Sipariş Özeti</h3>
                  
                  <div style={{ marginBottom: '24px' }}>
                    {cart.map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          paddingBottom: '16px',
                          marginBottom: '16px',
                          borderBottom: index < cart.length - 1 ? '1px solid rgba(34, 30, 145, 0.1)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: '1px solid rgba(34, 30, 145, 0.1)'
                            }}
                          >
                            {item.images?.[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <Package size={24} color="#221E91" />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: '#221E91' }}>{item.name}</h4>
                            <p style={{ fontSize: '13px', color: '#666' }}>
                              Adet: <strong style={{ color: '#221E91' }}>{item.quantity}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      background: 'linear-gradient(135deg, rgba(34, 30, 145, 0.05) 0%, rgba(224, 108, 27, 0.05) 100%)',
                      borderRadius: '10px',
                      border: '1px solid rgba(34, 30, 145, 0.1)',
                      marginBottom: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Toplam Ürün</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#221E91' }}>{getCartCount()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Toplam Adet</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#221E91' }}>
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    marginBottom: '24px', 
                    padding: '16px', 
                    background: 'rgba(34, 30, 145, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 30, 145, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Shield size={16} color="#221E91" />
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#221E91' }}>Güvenli İletişim</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                      Bilgileriniz güvende! Size en kısa sürede dönüş yapacağız.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #221E91 0%, #e06c1b 100%)',
                      color: 'white',
                      height: '56px',
                      fontSize: '17px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 20px rgba(34, 30, 145, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(34, 30, 145, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 30, 145, 0.3)';
                      }
                    }}
                  >
                    {loading ? 'Gönderiliyor...' : 'Teklif Talebini Gönder'}
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .card {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QuoteFormPage;