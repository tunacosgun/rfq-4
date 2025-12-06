import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Settings, LogOut, Save, Mail, Phone, Building, Lock } from 'lucide-react';
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
      navigate('/musteri/giris');
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
      beklemede: { bg: '#FEF3C7', color: '#92400E', text: 'Beklemede' },
      inceleniyor: { bg: '#DBEAFE', color: '#1E40AF', text: 'İnceleniyor' },
      fiyat_verildi: { bg: '#D1FAE5', color: '#065F46', text: 'Fiyat Verildi' },
      onaylandi: { bg: '#D1FAE5', color: '#065F46', text: 'Onaylandı' },
      reddedildi: { bg: '#FEE2E2', color: '#991B1B', text: 'Reddedildi' },
    };

    const style = styles[status] || styles.beklemede;

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600',
          backgroundColor: style.bg,
          color: style.color,
        }}
      >
        {style.text}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
      <Header settings={settings} />

      <div style={{ flex: 1, padding: '100px 24px 40px', marginTop: '70px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Müşteri Paneli
            </h1>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              Hoş geldiniz, {customer?.name}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            borderBottom: '2px solid #E5E7EB',
            marginBottom: '32px',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'profile' ? '2px solid #e06c1b' : '2px solid transparent',
                color: activeTab === 'profile' ? '#e06c1b' : '#6B7280',
                fontWeight: activeTab === 'profile' ? '600' : '400',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <User size={18} />
              Profil Bilgileri
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              style={{
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'quotes' ? '2px solid #e06c1b' : '2px solid transparent',
                color: activeTab === 'quotes' ? '#e06c1b' : '#6B7280',
                fontWeight: activeTab === 'quotes' ? '600' : '400',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <FileText size={18} />
              Tekliflerim ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'settings' ? '2px solid #e06c1b' : '2px solid transparent',
                color: activeTab === 'settings' ? '#e06c1b' : '#6B7280',
                fontWeight: activeTab === 'settings' ? '600' : '400',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Settings size={18} />
              Güvenlik
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                İletişim Bilgileri
              </h2>
              <form onSubmit={handleProfileUpdate}>
                <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      <Mail size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      <Phone size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      <Building size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Şirket
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: '#e06c1b',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'center'
                    }}
                  >
                    <Save size={18} />
                    {saving ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {quotes.length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '64px 32px',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <FileText size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '16px', color: '#6B7280' }}>Henüz teklif talebiniz yok</p>
                </div>
              ) : (
                quotes.map((quote) => (
                  <div
                    key={quote.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
                          Teklif #{quote.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>
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
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <strong style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>Ürünler:</strong>
                          {quote.items.map((item, idx) => (
                            <div key={idx} style={{ 
                              padding: '8px 12px', 
                              background: '#F9FAFB', 
                              borderRadius: '6px',
                              marginBottom: '6px',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span>{item.product_name}</span>
                              <span style={{ fontWeight: '600' }}>× {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {quote.pricing && quote.pricing.length > 0 && quote.status === 'fiyat_verildi' && (
                          <div style={{ 
                            padding: '16px', 
                            background: '#F0FDF4', 
                            borderRadius: '8px',
                            border: '1px solid #BBF7D0'
                          }}>
                            <strong style={{ display: 'block', marginBottom: '12px', color: '#065F46' }}>
                              Fiyat Detayları - Ürün Seçin:
                            </strong>
                            {quote.pricing.map((price, idx) => {
                              const isSelected = (selectedItems[quote.id] || []).includes(idx);
                              return (
                                <div 
                                  key={idx} 
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    background: isSelected ? '#D1FAE5' : '#F9FAFB', 
                                    borderRadius: '6px',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    color: '#047857',
                                    cursor: 'pointer',
                                    border: isSelected ? '2px solid #10B981' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItemSelection(quote.id, idx);
                                  }}
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => toggleItemSelection(quote.id, idx)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                  />
                                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{price.product_name}</span>
                                    <span style={{ fontWeight: '600' }}>
                                      ₺{price.unit_price} × {price.quantity} = ₺{price.total_price}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                            <div style={{
                              marginTop: '12px',
                              paddingTop: '12px',
                              borderTop: '1px solid #BBF7D0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: '700',
                              fontSize: '16px',
                              color: '#065F46'
                            }}>
                              <span>Seçili Ürünler Toplamı:</span>
                              <span>
                                ₺{calculateSelectedTotal(quote).toLocaleString('tr-TR')}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConvertToOrder(quote.id);
                              }}
                              style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '14px',
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#059669'}
                              onMouseLeave={(e) => e.target.style.background = '#10B981'}
                            >
                              Seçili Ürünlerle Sipariş Oluştur ({(selectedItems[quote.id] || []).length} ürün)
                            </button>
                          </div>
                        )}
                        
                        {quote.pricing && quote.pricing.length > 0 && quote.status === 'onaylandi' && (
                          <div style={{ 
                            padding: '16px', 
                            background: '#DBEAFE', 
                            borderRadius: '8px',
                            border: '1px solid #93C5FD'
                          }}>
                            <strong style={{ display: 'block', marginBottom: '12px', color: '#1E40AF' }}>
                              Sipariş Detayları:
                            </strong>
                            {quote.pricing.map((price, idx) => (
                              <div key={idx} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                                fontSize: '14px',
                                color: '#1E40AF'
                              }}>
                                <span>{price.product_name}</span>
                                <span style={{ fontWeight: '600' }}>
                                  ₺{price.unit_price} × {price.quantity} = ₺{price.total_price}
                                </span>
                              </div>
                            ))}
                            <div style={{
                              marginTop: '12px',
                              paddingTop: '12px',
                              borderTop: '1px solid #93C5FD',
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontWeight: '700',
                              fontSize: '16px',
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
              borderRadius: '12px', 
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
                Şifre Değiştir
              </h2>
              <form onSubmit={handlePasswordUpdate}>
                <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
                    style={{
                      background: '#e06c1b',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: (saving || !passwordData.newPassword || !passwordData.confirmPassword) ? 'not-allowed' : 'pointer',
                      opacity: (saving || !passwordData.newPassword || !passwordData.confirmPassword) ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'center'
                    }}
                  >
                    <Save size={18} />
                    {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </Button>
                </div>
              </form>

              <div style={{
                marginTop: '32px',
                paddingTop: '32px',
                borderTop: '1px solid #E5E7EB'
              }}>
                <Button
                  onClick={handleLogout}
                  style={{
                    background: '#EF4444',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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
