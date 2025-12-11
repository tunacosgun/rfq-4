import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Settings, LogOut, Save, Mail, Phone, Building, Lock, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CustomerPanelNew = () => {
  const navigate = useNavigate();
  const { customer, logout, isAuthenticated, updateCustomer, loading: authLoading } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [editedQuantities, setEditedQuantities] = useState({}); // { quoteId: { productId: quantity } }
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/musteri-giris');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (customer) {
      setProfileData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
      });
      fetchQuotes();
      fetchSettings();
    }
  }, [customer]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/customer/quotes/${customer.email}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Quotes fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh customer data when component mounts
  useEffect(() => {
    const refreshCustomerData = async () => {
      if (customer && customer.id) {
        try {
          const response = await fetch(`${backendUrl}/api/customer/${customer.id}`);
          if (response.ok) {
            const data = await response.json();
            updateCustomer(data);
          }
        } catch (error) {
          console.error('Customer refresh error:', error);
        }
      }
    };
    
    refreshCustomerData();
  }, [customer?.id, backendUrl, updateCustomer]);

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${backendUrl}/api/customer/profile/${customer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const result = await response.json();
        updateCustomer(result.customer);
        toast.success('Profil bilgileri güncellendi');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Güncelleme başarısız');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToOrder = async (quoteId) => {
    const selected = selectedItems[quoteId] || [];
    
    if (selected.length === 0) {
      toast.error('Lütfen en az bir ürün seçin');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/customer/quotes/${quoteId}/convert-to-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_items: selected }),
      });

      if (response.ok) {
        toast.success('Sipariş başarıyla oluşturuldu!');
        fetchQuotes(); // Refresh quotes
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const toggleItemSelection = (quoteId, itemIndex) => {
    setSelectedItems(prev => {
      const quoteSelections = prev[quoteId] || [];
      const isSelected = quoteSelections.includes(itemIndex);
      
      return {
        ...prev,
        [quoteId]: isSelected
          ? quoteSelections.filter(i => i !== itemIndex)
          : [...quoteSelections, itemIndex]
      };
    });
  };

  const calculateSelectedTotal = (quote) => {
    const selected = selectedItems[quote.id] || [];
    if (!quote.pricing || selected.length === 0) return 0;
    
    return quote.pricing
      .filter((_, idx) => selected.includes(idx))
      .reduce((sum, p) => sum + p.total_price, 0);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${backendUrl}/api/customer/profile/${customer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordData.newPassword }),
      });

      if (response.ok) {
        toast.success('Şifre güncellendi');
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Şifre güncellenemedi');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      beklemede: { bg: '#FEF3C7', color: '#92400E', text: 'Beklemede', icon: Clock },
      inceleniyor: { bg: '#DBEAFE', color: '#1E40AF', text: 'İnceleniyor', icon: TrendingUp },
      fiyat_verildi: { bg: '#D1FAE5', color: '#065F46', text: 'Fiyat Verildi', icon: CheckCircle },
      onaylandi: { bg: '#D1FAE5', color: '#065F46', text: 'Onaylandı', icon: CheckCircle },
      reddedildi: { bg: '#FEE2E2', color: '#991B1B', text: 'Reddedildi', icon: AlertCircle },
    };

    const style = styles[status] || styles.beklemede;
    const IconComponent = style.icon;

    return (
      <span
        style={{
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          backgroundColor: style.bg,
          color: style.color,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <IconComponent size={14} />
        {style.text}
      </span>
    );
  };

  // Dashboard istatistikleri
  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter(
    (q) => q.status === 'beklemede' || q.status === 'inceleniyor'
  ).length;
  const pricedQuotes = quotes.filter((q) => q.status === 'fiyat_verildi').length;
  const approvedQuotes = quotes.filter((q) => q.status === 'onaylandi').length;

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F9FAFB' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to bottom, #F9FAFB 0%, #F3F4F6 100%)' }}>
      <Header settings={settings} />

      <div style={{ flex: 1, padding: '32px 24px 40px', marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Müşteri Paneli
            </h1>
            <p style={{ fontSize: '17px', color: '#6B7280', fontWeight: '500' }}>
              Hoş geldiniz, <span style={{ color: '#e06c1b', fontWeight: '600' }}>{customer?.name}</span>
            </p>
          </div>

          {/* Özet Kartlar (Dashboard) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid #E5E7EB',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Toplam Teklif</div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(224, 108, 27, 0.3)'
                }}>
                  <FileText size={20} style={{ color: 'white' }} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>{totalQuotes}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5' }}>
                Tüm zamanlardaki teklif sayınız
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid #FCD34D',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#92400E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bekleyen</div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
                }}>
                  <Clock size={20} style={{ color: 'white' }} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#92400E', marginBottom: '8px' }}>{pendingQuotes}</div>
              <div style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.5' }}>
                Değerlendirme sürecindeki teklifler
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid #6EE7B7',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#065F46', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fiyat Verildi</div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                }}>
                  <TrendingUp size={20} style={{ color: 'white' }} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#065F46', marginBottom: '8px' }}>{pricedQuotes}</div>
              <div style={{ fontSize: '13px', color: '#047857', lineHeight: '1.5' }}>
                Siparişe dönüştürebileceğiniz teklifler
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid #93C5FD',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Onaylanan</div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
                }}>
                  <CheckCircle size={20} style={{ color: 'white' }} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#1E40AF', marginBottom: '8px' }}>{approvedQuotes}</div>
              <div style={{ fontSize: '13px', color: '#1E3A8A', lineHeight: '1.5' }}>
                Siparişe dönüşmüş teklifleriniz
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            borderBottom: '2px solid #E5E7EB',
            marginBottom: '32px',
            overflowX: 'auto',
            padding: '0 4px'
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '14px 28px',
                background: activeTab === 'profile' ? 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)' : 'transparent',
                border: 'none',
                borderRadius: activeTab === 'profile' ? '12px 12px 0 0' : '0',
                color: activeTab === 'profile' ? 'white' : '#6B7280',
                fontWeight: activeTab === 'profile' ? '700' : '500',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'profile' ? '0 -4px 12px rgba(224, 108, 27, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'profile') {
                  e.currentTarget.style.color = '#e06c1b';
                  e.currentTarget.style.background = '#FFF7ED';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'profile') {
                  e.currentTarget.style.color = '#6B7280';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <User size={18} />
              Profil Bilgileri
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              style={{
                padding: '14px 28px',
                background: activeTab === 'quotes' ? 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)' : 'transparent',
                border: 'none',
                borderRadius: activeTab === 'quotes' ? '12px 12px 0 0' : '0',
                color: activeTab === 'quotes' ? 'white' : '#6B7280',
                fontWeight: activeTab === 'quotes' ? '700' : '500',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'quotes' ? '0 -4px 12px rgba(224, 108, 27, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'quotes') {
                  e.currentTarget.style.color = '#e06c1b';
                  e.currentTarget.style.background = '#FFF7ED';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'quotes') {
                  e.currentTarget.style.color = '#6B7280';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <FileText size={18} />
              Tekliflerim ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '14px 28px',
                background: activeTab === 'settings' ? 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)' : 'transparent',
                border: 'none',
                borderRadius: activeTab === 'settings' ? '12px 12px 0 0' : '0',
                color: activeTab === 'settings' ? 'white' : '#6B7280',
                fontWeight: activeTab === 'settings' ? '700' : '500',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === 'settings' ? '0 -4px 12px rgba(224, 108, 27, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'settings') {
                  e.currentTarget.style.color = '#e06c1b';
                  e.currentTarget.style.background = '#FFF7ED';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'settings') {
                  e.currentTarget.style.color = '#6B7280';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Settings size={18} />
              Güvenlik
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div>
              {/* Balance Display */}
              <div style={{
                background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
                padding: '32px',
                borderRadius: '20px',
                marginBottom: '28px',
                border: '2px solid #3B82F6',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: 'white',
                    fontWeight: '800',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                  }}>
                    ₺
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#1E40AF', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Mevcut Bakiyeniz</div>
                    <div style={{ fontSize: '40px', fontWeight: '900', color: '#1E3A8A', letterSpacing: '-1px' }}>
                      ₺{(customer?.balance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '36px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                border: '1px solid #E5E7EB'
              }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#111827' }}>
                  İletişim Bilgileri
                </h2>
              <form onSubmit={handleProfileUpdate}>
                <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      <User size={16} style={{ marginRight: '8px' }} />
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e06c1b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      <Mail size={16} style={{ marginRight: '8px' }} />
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e06c1b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      <Phone size={16} style={{ marginRight: '8px' }} />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e06c1b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      <Building size={16} style={{ marginRight: '8px' }} />
                      Şirket
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e06c1b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: saving ? '#D1D5DB' : 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)',
                      color: 'white',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '15px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      boxShadow: saving ? 'none' : '0 4px 12px rgba(224, 108, 27, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(224, 108, 27, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saving) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(224, 108, 27, 0.3)';
                      }
                    }}
                  >
                    <Save size={18} />
                    {saving ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
                  </Button>
                </div>
              </form>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {quotes.length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '80px 32px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  border: '2px dashed #E5E7EB'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <FileText size={40} style={{ color: '#9CA3AF' }} />
                  </div>
                  <p style={{ fontSize: '18px', color: '#6B7280', fontWeight: '600' }}>Henüz teklif talebiniz yok</p>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '8px' }}>Teklif oluşturduğunuzda burada görünecektir</p>
                </div>
              ) : (
                quotes.map((quote) => (
                  <div
                    key={quote.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid #E5E7EB'
                    }}
                    onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                          Teklif #{quote.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                          {new Date(quote.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      {getStatusBadge(quote.status)}
                    </div>

                    {expandedQuote === quote.id && (
                      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #F3F4F6' }}>
                        <div style={{ marginBottom: '20px' }}>
                          <strong style={{ display: 'block', marginBottom: '12px', color: '#374151', fontSize: '15px', fontWeight: '700' }}>Ürünler:</strong>
                          {quote.items.map((item, idx) => (
                            <div key={idx} style={{ 
                              padding: '12px 16px', 
                              background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', 
                              borderRadius: '10px',
                              marginBottom: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              border: '1px solid #E5E7EB'
                            }}>
                              <span style={{ fontWeight: '500', color: '#374151' }}>{item.product_name}</span>
                              <span style={{ fontWeight: '700', color: '#e06c1b', background: '#FFF7ED', padding: '4px 12px', borderRadius: '8px' }}>× {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {quote.pricing && quote.pricing.length > 0 && quote.status === 'fiyat_verildi' && (
                          <div style={{ 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', 
                            borderRadius: '16px',
                            border: '2px solid #86EFAC'
                          }}>
                            <strong style={{ display: 'block', marginBottom: '16px', color: '#065F46', fontSize: '16px', fontWeight: '700' }}>
                              Fiyat Detayları - Adet Düzenleyip Sipariş Verin:
                            </strong>
                            {quote.pricing.map((price, idx) => {
                              const currentQuantity = editedQuantities[quote.id]?.[price.product_id] !== undefined 
                                ? editedQuantities[quote.id][price.product_id]
                                : price.quantity;
                              const isIncluded = currentQuantity > 0;
                              
                              return (
                                <div 
                                  key={idx} 
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    background: isIncluded ? 'white' : '#FEE2E2', 
                                    borderRadius: '12px',
                                    marginBottom: '10px',
                                    border: isIncluded ? '2px solid #10B981' : '2px solid #EF4444',
                                    transition: 'all 0.2s',
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                      {price.product_name}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#6B7280' }}>
                                      Birim Fiyat: ₺{price.unit_price.toLocaleString('tr-TR')}
                                    </div>
                                  </div>
                                  
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(quote.id, price.product_id, Math.max(0, currentQuantity - 1));
                                      }}
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        background: '#E5E7EB',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#374151'
                                      }}
                                    >
                                      −
                                    </button>
                                    
                                    <input
                                      type="number"
                                      min="0"
                                      value={currentQuantity}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(quote.id, price.product_id, parseInt(e.target.value) || 0);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        width: '70px',
                                        padding: '8px',
                                        textAlign: 'center',
                                        border: '2px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                      }}
                                    />
                                    
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(quote.id, price.product_id, currentQuantity + 1);
                                      }}
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        background: '#10B981',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: 'white'
                                      }}
                                    >
                                      +
                                    </button>
                                    
                                    <div style={{ 
                                      marginLeft: '12px',
                                      fontWeight: '700',
                                      color: isIncluded ? '#10B981' : '#EF4444',
                                      minWidth: '100px',
                                      textAlign: 'right'
                                    }}>
                                      {isIncluded ? `₺${(currentQuantity * price.unit_price).toLocaleString('tr-TR')}` : 'Çıkarıldı'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div style={{
                              marginTop: '16px',
                              paddingTop: '16px',
                              borderTop: '2px solid #86EFAC',
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: '800',
                              fontSize: '18px',
                              color: '#065F46'
                            }}>
                              <span>Toplam:</span>
                              <span>
                                ₺{calculateUpdatedTotal(quote).toLocaleString('tr-TR')}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConvertToOrder(quote.id);
                              }}
                              disabled={calculateUpdatedTotal(quote) === 0}
                              style={{
                                width: '100%',
                                marginTop: '20px',
                                padding: '16px',
                                background: calculateUpdatedTotal(quote) === 0 ? '#D1D5DB' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: calculateUpdatedTotal(quote) === 0 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: calculateUpdatedTotal(quote) === 0 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                if (calculateUpdatedTotal(quote) > 0) {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (calculateUpdatedTotal(quote) > 0) {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                }
                              }}
                            >
                              Siparişi Onayla ve Gönder
                            </button>
                          </div>
                        )}
                        
                        {quote.pricing && quote.pricing.length > 0 && quote.status === 'onaylandi' && (
                          <div style={{ 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', 
                            borderRadius: '16px',
                            border: '2px solid #60A5FA'
                          }}>
                            <strong style={{ display: 'block', marginBottom: '16px', color: '#1E40AF', fontSize: '16px', fontWeight: '700' }}>
                              Sipariş Detayları:
                            </strong>
                            {quote.pricing.map((price, idx) => (
                              <div key={idx} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                                fontSize: '14px',
                                color: '#1E40AF',
                                padding: '12px 16px',
                                background: 'white',
                                borderRadius: '10px',
                                fontWeight: '500'
                              }}>
                                <span style={{ fontWeight: '600' }}>{price.product_name}</span>
                                <span style={{ fontWeight: '700', color: '#1E3A8A' }}>
                                  ₺{price.unit_price} × {price.quantity} = ₺{price.total_price}
                                </span>
                              </div>
                            ))}
                            <div style={{
                              marginTop: '16px',
                              paddingTop: '16px',
                              borderTop: '2px solid #60A5FA',
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: '800',
                              fontSize: '18px',
                              color: '#1E40AF'
                            }}>
                              <span>Toplam:</span>
                              <span>
                                ₺{quote.pricing.reduce((sum, p) => sum + p.total_price, 0).toLocaleString('tr-TR')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '36px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#111827' }}>
                Şifre Değiştir
              </h2>
              <form onSubmit={handlePasswordUpdate}>
                <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      <Lock size={16} style={{ marginRight: '8px' }} />
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e06c1b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      <Lock size={16} style={{ marginRight: '8px' }} />
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#e06c1b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(224, 108, 27, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
                    style={{
                      background: (saving || !passwordData.newPassword || !passwordData.confirmPassword) ? '#D1D5DB' : 'linear-gradient(135deg, #e06c1b 0%, #c75a14 100%)',
                      color: 'white',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '15px',
                      cursor: (saving || !passwordData.newPassword || !passwordData.confirmPassword) ? 'not-allowed' : 'pointer',
                      opacity: (saving || !passwordData.newPassword || !passwordData.confirmPassword) ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      boxShadow: (saving || !passwordData.newPassword || !passwordData.confirmPassword) ? 'none' : '0 4px 12px rgba(224, 108, 27, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (!saving && passwordData.newPassword && passwordData.confirmPassword) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(224, 108, 27, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saving && passwordData.newPassword && passwordData.confirmPassword) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(224, 108, 27, 0.3)';
                      }
                    }}
                  >
                    <Save size={18} />
                    {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </Button>
                </div>
              </form>

              <div style={{
                marginTop: '40px',
                paddingTop: '40px',
                borderTop: '2px solid #F3F4F6'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#374151' }}>Hesap İşlemleri</h3>
                <Button
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  <LogOut size={18} />
                  Çıkış Yap
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer settings={settings} />
    </div>
  );
};

export default CustomerPanelNew;