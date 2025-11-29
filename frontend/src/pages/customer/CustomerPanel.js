import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, LogOut, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CustomerPanel = () => {
  const navigate = useNavigate();
  const { customer, logout, isAuthenticated, loading: authLoading } = useCustomerAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Check if customer is logged in
    if (!authLoading && !isAuthenticated) {
      toast.error('Lütfen giriş yapın');
      navigate('/musteri-giris');
      return;
    }

    if (customer) {
      fetchQuotes(customer.email);
    }
  }, [customer, isAuthenticated, authLoading, navigate]);

  const fetchQuotes = async (email) => {
    try {
      const response = await fetch(`${backendUrl}/api/customer/quotes/${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      toast.error('Teklifler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/');
  };

  const handleDownloadPDF = async (quoteId) => {
    toast.info('PDF indirme özelliği admin tarafından hazırlanmalıdır');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'beklemede':
        return <Clock size={18} color="#D97706" />;
      case 'inceleniyor':
        return <AlertCircle size={18} color="#3B82F6" />;
      case 'fiyat_verildi':
        return <CheckCircle size={18} color="#22C55E" />;
      case 'onaylandi':
        return <CheckCircle size={18} color="#059669" />;
      case 'reddedildi':
        return <XCircle size={18} color="#DC2626" />;
      default:
        return <Clock size={18} color="#9CA3AF" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'beklemede':
        return 'Beklemede';
      case 'inceleniyor':
        return 'İnceleniyor';
      case 'fiyat_verildi':
        return 'Fiyat Verildi';
      case 'onaylandi':
        return 'Onaylandı';
      case 'reddedildi':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'beklemede':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'inceleniyor':
        return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'fiyat_verildi':
        return { bg: '#D1FAE5', text: '#22C55E' };
      case 'onaylandi':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'reddedildi':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.loading}>Yükleniyor...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.contentWrapper}>
        <div style={styles.content}>
          <div style={styles.wrapper}>
          {/* User Info Card */}
          <div style={styles.userCard}>
            <div style={styles.userHeader}>
              <div style={styles.userIcon}>
                <User size={32} color="#22C55E" />
              </div>
              <div>
                <h2 style={styles.userName}>{customer?.name}</h2>
                <p style={styles.userEmail}>{customer?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} style={styles.logoutButton}>
              <LogOut size={18} />
              Çıkış Yap
            </Button>
          </div>

          {/* Quotes Section */}
          <div style={styles.quotesSection}>
            <div style={styles.sectionHeader}>
              <h1 style={styles.title}>Tekliflerim</h1>
              <p style={styles.subtitle}>Gönderdiğiniz teklif taleplerini buradan takip edebilirsiniz</p>
            </div>

            {quotes.length === 0 ? (
              <div style={styles.emptyState}>
                <FileText size={64} color="#D1D5DB" />
                <p style={{ marginTop: '16px', fontSize: '18px', color: '#6B7280' }}>
                  Henüz teklif talebiniz bulunmuyor
                </p>
                <Button
                  onClick={() => navigate('/urunler')}
                  style={{ marginTop: '16px', background: '#22C55E', color: 'white' }}
                >
                  Ürünleri İnceleyin
                </Button>
              </div>
            ) : (
              <div style={styles.quotesList}>
                {quotes.map((quote) => {
                  const statusColor = getStatusColor(quote.status);
                  
                  return (
                    <div key={quote.id} style={styles.quoteCard}>
                      <div style={styles.quoteHeader}>
                        <div style={styles.quoteId}>
                          <FileText size={20} color="#6B7280" />
                          <span>#{quote.id.substring(0, 8)}</span>
                        </div>
                        <div
                          style={{
                            ...styles.statusBadge,
                            background: statusColor.bg,
                            color: statusColor.text,
                          }}
                        >
                          {getStatusIcon(quote.status)}
                          {getStatusText(quote.status)}
                        </div>
                      </div>

                      <div style={styles.quoteBody}>
                        <div style={styles.quoteInfo}>
                          <span style={styles.infoLabel}>Tarih:</span>
                          <span style={styles.infoValue}>
                            {new Date(quote.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div style={styles.quoteInfo}>
                          <span style={styles.infoLabel}>Ürün Sayısı:</span>
                          <span style={styles.infoValue}>{quote.items.length} ürün</span>
                        </div>

                        {quote.company && (
                          <div style={styles.quoteInfo}>
                            <span style={styles.infoLabel}>Şirket:</span>
                            <span style={styles.infoValue}>{quote.company}</span>
                          </div>
                        )}

                        {quote.message && (
                          <div style={{ ...styles.quoteInfo, marginTop: '12px' }}>
                            <span style={styles.infoLabel}>Mesaj:</span>
                            <p style={styles.message}>{quote.message}</p>
                          </div>
                        )}

                        {quote.admin_note && quote.status !== 'beklemede' && (
                          <div style={styles.adminNote}>
                            <strong>Admin Notu:</strong> {quote.admin_note}
                          </div>
                        )}

                        {/* Products List */}
                        <div style={styles.productsList}>
                          <p style={styles.productsTitle}>Ürünler:</p>
                          {quote.items.map((item, idx) => (
                            <div key={idx} style={styles.productItem}>
                              <span>{item.product_name}</span>
                              <span style={styles.quantity}>× {item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Pricing if available */}
                        {quote.pricing && quote.pricing.length > 0 && (
                          <div style={styles.pricingSection}>
                            <p style={styles.pricingTitle}>Fiyat Detayları:</p>
                            {quote.pricing.map((price, idx) => (
                              <div key={idx} style={styles.pricingItem}>
                                <span>{price.product_name}</span>
                                <span style={styles.price}>
                                  ₺{price.unit_price} × {price.quantity} = ₺{price.total_price}
                                </span>
                              </div>
                            ))}
                            <div style={styles.totalPrice}>
                              <span>Toplam:</span>
                              <span>
                                ₺
                                {quote.pricing
                                  .reduce((sum, p) => sum + p.total_price, 0)
                                  .toLocaleString('tr-TR')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {quote.status === 'fiyat_verildi' && (
                        <div style={styles.quoteFooter}>
                          <Button
                            onClick={() => handleDownloadPDF(quote.id)}
                            style={styles.downloadButton}
                          >
                            <Download size={18} />
                            PDF İndir
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#F9FAFB',
  },
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: '40px 20px',
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  userCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#F0FDF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#6B7280',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#FEE2E2',
    color: '#DC2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  quotesSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionHeader: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  quotesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  quoteCard: {
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  quoteHeader: {
    background: '#F9FAFB',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
  },
  quoteId: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
  quoteBody: {
    padding: '20px',
  },
  quoteInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6B7280',
    minWidth: '100px',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  message: {
    fontSize: '14px',
    color: '#374151',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  adminNote: {
    marginTop: '16px',
    padding: '12px',
    background: '#FFFBEB',
    borderLeft: '4px solid #F59E0B',
    fontSize: '14px',
    color: '#92400E',
  },
  productsList: {
    marginTop: '20px',
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '8px',
  },
  productsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#374151',
  },
  quantity: {
    fontWeight: '600',
    color: '#6B7280',
  },
  pricingSection: {
    marginTop: '20px',
    padding: '16px',
    background: '#F0FDF4',
    borderRadius: '8px',
  },
  pricingTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  pricingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#374151',
  },
  price: {
    fontWeight: '500',
    color: '#059669',
  },
  totalPrice: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    marginTop: '8px',
    borderTop: '2px solid #22C55E',
    fontSize: '16px',
    fontWeight: '700',
    color: '#059669',
  },
  quoteFooter: {
    padding: '16px 20px',
    background: '#F9FAFB',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#22C55E',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default CustomerPanel;
