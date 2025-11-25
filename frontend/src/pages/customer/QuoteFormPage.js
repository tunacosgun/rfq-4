import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Upload, CheckCircle } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuoteFormPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartCount } = useQuoteCart();
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
      let fileUrl = null;
      if (file) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        const uploadRes = await axios.post(`${API}/upload`, fileFormData);
        fileUrl = uploadRes.data.url;
      }

      const quoteData = {
        customer_name: formData.customer_name,
        company: formData.company || null,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        items: cart.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
        })),
      };

      await axios.post(`${API}/quotes`, quoteData);
      setSubmitted(true);
      clearCart();
      toast.success('Teklifiniz başarıyla gönderildi!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Teklif gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div data-testid="quote-form-success">
        <header style={styles.header}>
          <div className="container" style={styles.headerContainer}>
            <Link to="/" style={styles.logo}>
              <Package size={32} />
              <span style={styles.logoText}>Teklif Sistemi</span>
            </Link>
          </div>
        </header>

        <div className="container" style={styles.container}>
          <div style={styles.successCard} className="card">
            <CheckCircle size={80} style={{ color: '#3BB77E' }} />
            <h1 style={styles.successTitle}>Teklifiniz Alındı!</h1>
            <p style={styles.successText}>
              Talebiniz başarıyla ilgili ekibe iletildi. En kısa sürede sizinle iletişime geçilecektir.
            </p>
            <Link to="/">
              <Button style={styles.homeButton}>Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/teklif-sepeti');
    return null;
  }

  return (
    <div data-testid="quote-form-page">
      <header style={styles.header}>
        <div className="container" style={styles.headerContainer}>
          <Link to="/" style={styles.logo}>
            <Package size={32} />
            <span style={styles.logoText}>Teklif Sistemi</span>
          </Link>
        </div>
      </header>

      <div className="container" style={styles.container}>
        <Link to="/teklif-sepeti" style={styles.backLink} data-testid="back-link">
          <ArrowLeft size={20} />
          <span>Sepete Dön</span>
        </Link>

        <h1 style={styles.pageTitle}>Teklif Gönder</h1>
        <p style={styles.pageSubtitle}>
          Seçtiğiniz ürünlerle birlikte talebinizi iletin; ekibimiz kısa sürede dönüş yapacaktır.
        </p>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="card" style={styles.formCard}>
              <h2 style={styles.sectionTitle}>İletişim Bilgileri</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ad Soyad *</label>
                <Input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  data-testid="customer-name-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Firma</label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  data-testid="company-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>E-posta *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="email-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefon</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  data-testid="phone-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mesaj / Açıklama</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  data-testid="message-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Dosya Ekle (opsiyonel)</label>
                <div style={styles.fileInput}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={styles.fileInputHidden}
                    id="file-upload"
                    data-testid="file-input"
                  />
                  <label htmlFor="file-upload" style={styles.fileLabel}>
                    <Upload size={20} />
                    <span>{file ? file.name : 'Dosya Seçin'}</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={styles.submitButton}
                data-testid="submit-button"
              >
                {loading ? 'Gönderiliyor...' : 'Teklifi Gönder'}
              </Button>
            </div>
          </form>

          <div className="card" style={styles.summaryCard}>
            <h2 style={styles.sectionTitle}>Seçili Ürünler</h2>
            <div style={styles.productsList}>
              {cart.map((item) => (
                <div key={item.id} style={styles.productItem} data-testid={`quote-item-${item.id}`}>
                  <div style={styles.productThumb}>
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.name} style={styles.productThumbImg} />
                    ) : (
                      <div style={styles.productThumbPlaceholder}>
                        <Package size={24} style={{ color: '#7E7E7E' }} />
                      </div>
                    )}
                  </div>
                  <div style={styles.productDetails}>
                    <p style={styles.productItemName}>{item.name}</p>
                    <p style={styles.productItemQuantity}>Miktar: {item.quantity} adet</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.summaryTotal}>
              <div style={styles.summaryRow}>
                <span>Toplam Ürün:</span>
                <span style={styles.summaryValue}>{cart.length} çeşit</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Toplam Adet:</span>
                <span style={styles.summaryValue}>{getCartCount()} adet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    background: 'white',
    borderBottom: '1px solid #ececec',
    padding: '16px 0',
    marginBottom: '32px',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#3BB77E',
    textDecoration: 'none',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '24px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  container: {
    padding: '32px 20px',
    maxWidth: '1200px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3BB77E',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#253D4E',
    marginBottom: '12px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  pageSubtitle: {
    fontSize: '18px',
    color: '#7E7E7E',
    marginBottom: '48px',
  },
  formContainer: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '32px',
  },
  form: {
    width: '100%',
  },
  formCard: {
    padding: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#253D4E',
    marginBottom: '24px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#253D4E',
    marginBottom: '8px',
  },
  fileInput: {
    position: 'relative',
  },
  fileInputHidden: {
    display: 'none',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: '2px dashed #ececec',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#7E7E7E',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: '600',
    background: '#3BB77E',
    color: 'white',
    marginTop: '16px',
  },
  summaryCard: {
    padding: '32px',
    height: 'fit-content',
    position: 'sticky',
    top: '100px',
  },
  productsList: {
    marginBottom: '24px',
  },
  productItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderBottom: '1px solid #ececec',
  },
  productThumb: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  productThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productThumbPlaceholder: {
    width: '100%',
    height: '100%',
    background: '#F4F6FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#253D4E',
    marginBottom: '4px',
  },
  productItemQuantity: {
    fontSize: '13px',
    color: '#7E7E7E',
  },
  summaryTotal: {
    paddingTop: '16px',
    borderTop: '2px solid #ececec',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '16px',
    color: '#7E7E7E',
  },
  summaryValue: {
    fontWeight: '600',
    color: '#253D4E',
  },
  successCard: {
    textAlign: 'center',
    padding: '80px 40px',
    maxWidth: '600px',
    margin: '80px auto',
  },
  successTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#253D4E',
    margin: '24px 0 16px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  successText: {
    fontSize: '18px',
    color: '#7E7E7E',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  homeButton: {
    background: '#3BB77E',
    color: 'white',
    padding: '16px 48px',
    fontSize: '18px',
  },
};

export default QuoteFormPage;