import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, Clock, Mail, Phone, Building2, MessageSquare, Package } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminQuoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader } = useAdminAuth();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [pricing, setPricing] = useState({});
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    try {
      const response = await axios.get(`${API}/quotes/${id}`, {
        headers: getAuthHeader(),
      });
      setQuote(response.data);
      setAdminNote(response.data.admin_note || '');
      
      // Initialize pricing from quote
      if (response.data.pricing && response.data.pricing.length > 0) {
        const pricingObj = {};
        response.data.pricing.forEach(p => {
          pricingObj[p.product_id] = p.unit_price;
        });
        setPricing(pricingObj);
        setShowPricing(true);
      }
    } catch (error) {
      toast.error('Teklif yüklenemedi');
      navigate('/admin/teklifler');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.put(
        `${API}/quotes/${id}`,
        { status: newStatus, admin_note: adminNote },
        { headers: getAuthHeader() }
      );
      toast.success('Teklif durumu güncellendi');
      fetchQuote();
    } catch (error) {
      toast.error('Durum güncellenemedi');
    } finally {
      setUpdating(false);
    }
  };

  const saveNote = async () => {
    setUpdating(true);
    try {
      await axios.put(
        `${API}/quotes/${id}`,
        { admin_note: adminNote },
        { headers: getAuthHeader() }
      );
      toast.success('Not kaydedildi');
      fetchQuote();
    } catch (error) {
      toast.error('Not kaydedilemedi');
    } finally {
      setUpdating(false);
    }
  };

  const savePricing = async () => {
    setUpdating(true);
    try {
      const pricingData = quote.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: parseFloat(pricing[item.product_id] || 0),
        total_price: parseFloat(pricing[item.product_id] || 0) * item.quantity
      }));

      await axios.put(
        `${API}/quotes/${id}`,
        { pricing: pricingData, status: 'fiyat_verildi' },
        { headers: getAuthHeader() }
      );
      toast.success('Fiyatlandırma kaydedildi');
      fetchQuote();
    } catch (error) {
      toast.error('Fiyatlandırma kaydedilemedi');
    } finally {
      setUpdating(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get(`${API}/quotes/${id}/pdf`, {
        headers: getAuthHeader(),
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `teklif_${id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF indirildi');
    } catch (error) {
      toast.error('PDF indirilemedi');
    }
  };

  const sendEmail = async () => {
    setUpdating(true);
    try {
      const response = await axios.post(`${API}/quotes/${id}/send-email`, {}, {
        headers: getAuthHeader(),
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Email gönderilemedi');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      beklemede: { label: 'Beklemede', color: '#FDC040', icon: Clock },
      onaylandi: { label: 'Onaylanдı', color: '#3BB77E', icon: CheckCircle },
      reddedildi: { label: 'Reddedildi', color: '#FF6B6B', icon: XCircle },
    };
    return configs[status] || configs.beklemede;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading"><div className="spinner"></div></div>
      </AdminLayout>
    );
  }

  const statusConfig = getStatusConfig(quote.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AdminLayout>
      <div data-testid="admin-quote-detail-page">
        <Link to="/admin/teklifler" style={styles.backLink} data-testid="back-link">
          <ArrowLeft size={20} />
          <span>Tekliflere Dön</span>
        </Link>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Teklif Detayı</h1>
            <p style={styles.subtitle}>
              {new Date(quote.created_at).toLocaleString('tr-TR')}
            </p>
          </div>
          <div style={{ ...styles.statusBadge, background: `${statusConfig.color}20`, color: statusConfig.color }}>
            <StatusIcon size={20} />
            <span style={{ fontSize: '18px', fontWeight: '600' }}>{statusConfig.label}</span>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.mainContent}>
            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>Müşteri Bilgileri</h2>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <Mail size={20} style={{ color: '#3BB77E' }} />
                  </div>
                  <div>
                    <p style={styles.infoLabel}>Ad Soyad</p>
                    <p style={styles.infoValue}>{quote.customer_name}</p>
                  </div>
                </div>
                {quote.company && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoIcon}>
                      <Building2 size={20} style={{ color: '#3BB77E' }} />
                    </div>
                    <div>
                      <p style={styles.infoLabel}>Firma</p>
                      <p style={styles.infoValue}>{quote.company}</p>
                    </div>
                  </div>
                )}
                <div style={styles.infoItem}>
                  <div style={styles.infoIcon}>
                    <Mail size={20} style={{ color: '#3BB77E' }} />
                  </div>
                  <div>
                    <p style={styles.infoLabel}>E-posta</p>
                    <p style={styles.infoValue}>{quote.email}</p>
                  </div>
                </div>
                {quote.phone && (
                  <div style={styles.infoItem}>
                    <div style={styles.infoIcon}>
                      <Phone size={20} style={{ color: '#3BB77E' }} />
                    </div>
                    <div>
                      <p style={styles.infoLabel}>Telefon</p>
                      <p style={styles.infoValue}>{quote.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {quote.message && (
              <div className="card" style={styles.section}>
                <div style={styles.messageHeader}>
                  <MessageSquare size={20} style={{ color: '#3BB77E' }} />
                  <h2 style={styles.sectionTitle}>Müşteri Mesajı</h2>
                </div>
                <p style={styles.messageText}>{quote.message}</p>
              </div>
            )}

            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>Talep Edilen Ürünler</h2>
              <div style={styles.productsList}>
                {quote.items.map((item, index) => (
                  <div key={index} style={styles.productItem} data-testid={`quote-item-${index}`}>
                    <div style={styles.productIcon}>
                      <Package size={24} style={{ color: '#3BB77E' }} />
                    </div>
                    <div style={styles.productInfo}>
                      <p style={styles.productName}>{item.product_name}</p>
                      <p style={styles.productQuantity}>Miktar: {item.quantity} adet</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.sidebar}>
            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>Durum Yönetimi</h2>
              <div style={styles.actionsGrid}>
                <Button
                  onClick={() => updateStatus('onaylandi')}
                  disabled={updating || quote.status === 'onaylandi'}
                  style={{ ...styles.actionButton, background: '#3BB77E', color: 'white' }}
                  data-testid="approve-button"
                >
                  <CheckCircle size={18} />
                  Onayla
                </Button>
                <Button
                  onClick={() => updateStatus('reddedildi')}
                  disabled={updating || quote.status === 'reddedildi'}
                  style={{ ...styles.actionButton, background: '#FF6B6B', color: 'white' }}
                  data-testid="reject-button"
                >
                  <XCircle size={18} />
                  Reddet
                </Button>
              </div>
            </div>

            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>Admin Notu</h2>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={5}
                placeholder="Teklif hakkında notlar ekleyin..."
                data-testid="admin-note-textarea"
              />
              <Button
                onClick={saveNote}
                disabled={updating}
                style={styles.saveNoteButton}
                data-testid="save-note-button"
              >
                Notu Kaydet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3BB77E', textDecoration: 'none', fontSize: '16px', fontWeight: '500', marginBottom: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' },
  title: { fontSize: '36px', fontWeight: '700', color: '#253D4E', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' },
  subtitle: { fontSize: '16px', color: '#7E7E7E' },
  statusBadge: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderRadius: '8px' },
  content: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
  mainContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '24px' },
  section: { padding: '24px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#253D4E', marginBottom: '16px', fontFamily: 'Space Grotesk, sans-serif' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  infoItem: { display: 'flex', gap: '12px' },
  infoIcon: { width: '40px', height: '40px', background: '#F0FDF4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoLabel: { fontSize: '12px', color: '#7E7E7E', marginBottom: '4px' },
  infoValue: { fontSize: '15px', fontWeight: '600', color: '#253D4E' },
  messageHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  messageText: { fontSize: '15px', color: '#7E7E7E', lineHeight: '1.8', padding: '16px', background: '#F4F6FA', borderRadius: '8px' },
  productsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  productItem: { display: 'flex', gap: '12px', padding: '16px', background: '#F4F6FA', borderRadius: '8px' },
  productIcon: { width: '48px', height: '48px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  productInfo: { flex: 1 },
  productName: { fontSize: '15px', fontWeight: '600', color: '#253D4E', marginBottom: '4px' },
  productQuantity: { fontSize: '14px', color: '#7E7E7E' },
  actionsGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '12px' },
  actionButton: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontWeight: '600' },
  saveNoteButton: { width: '100%', marginTop: '12px', background: '#3BB77E', color: 'white' },
};

export default AdminQuoteDetail;