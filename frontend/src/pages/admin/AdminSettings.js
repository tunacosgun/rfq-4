import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const { getAuthHeader } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    tax_number: '',
    logo_url: '',
    terms_and_conditions: '',
    bank_info: '',
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    about_description: '',
    about_image_url: '',
    features: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`, {
        headers: getAuthHeader(),
      });
      setSettings(response.data);
    } catch (error) {
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post(`${API}/settings`, settings, {
        headers: getAuthHeader(),
      });
      toast.success('Ayarlar kaydedildi');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading"><div className="spinner"></div></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="admin-settings-page">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Şirket Ayarları</h1>
            <p style={styles.subtitle}>PDF tekliflerinde görünecek bilgileri düzenleyin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <Settings size={20} style={{ marginRight: '8px' }} />
                Genel Bilgiler
              </h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Şirket Adı *</label>
                <Input
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  required
                  data-testid="company-name-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Adres</label>
                <Textarea
                  value={settings.company_address}
                  onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                  rows={3}
                  data-testid="company-address-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefon</label>
                <Input
                  value={settings.company_phone}
                  onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                  data-testid="company-phone-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>E-posta</label>
                <Input
                  type="email"
                  value={settings.company_email}
                  onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                  data-testid="company-email-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Website</label>
                <Input
                  value={settings.company_website}
                  onChange={(e) => setSettings({ ...settings, company_website: e.target.value })}
                  data-testid="company-website-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Vergi Numarası</label>
                <Input
                  value={settings.tax_number}
                  onChange={(e) => setSettings({ ...settings, tax_number: e.target.value })}
                  data-testid="tax-number-input"
                />
              </div>
            </div>

            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <Settings size={20} style={{ marginRight: '8px' }} />
                Logo & Ek Bilgiler
              </h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Logo URL</label>
                <Input
                  value={settings.logo_url}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  data-testid="logo-url-input"
                />
                {settings.logo_url && (
                  <div style={styles.logoPreview}>
                    <img src={settings.logo_url} alt="Logo" style={styles.logoImg} />
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Banka Bilgileri</label>
                <Textarea
                  value={settings.bank_info}
                  onChange={(e) => setSettings({ ...settings, bank_info: e.target.value })}
                  rows={4}
                  placeholder="Banka Adı: &#10;IBAN: &#10;Hesap Adı:"
                  data-testid="bank-info-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Şartlar ve Koşullar</label>
                <Textarea
                  value={settings.terms_and_conditions}
                  onChange={(e) => setSettings({ ...settings, terms_and_conditions: e.target.value })}
                  rows={6}
                  placeholder="Tekliflerinizde görünecek şartlar ve koşullar..."
                  data-testid="terms-input"
                />
              </div>
            </div>
            </div>

            <div className="card" style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <Settings size={20} style={{ marginRight: '8px' }} />
                Ana Sayfa İçerikleri
              </h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Hero Başlık</label>
                <Input
                  value={settings.hero_title}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  placeholder="Teklif Alın, Kazanın"
                  data-testid="hero-title-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hero Alt Başlık</label>
                <Input
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  placeholder="Ürünlerimizi inceleyin..."
                  data-testid="hero-subtitle-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hakkımızda Başlık</label>
                <Input
                  value={settings.about_title}
                  onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
                  placeholder="Hakkımızda"
                  data-testid="about-title-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hakkımızda Açıklama</label>
                <Textarea
                  value={settings.about_description}
                  onChange={(e) => setSettings({ ...settings, about_description: e.target.value })}
                  rows={5}
                  placeholder="Şirketiniz hakkında bilgi..."
                  data-testid="about-description-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hakkımızda Görsel URL</label>
                <Input
                  value={settings.about_image_url}
                  onChange={(e) => setSettings({ ...settings, about_image_url: e.target.value })}
                  placeholder="https://example.com/about.jpg"
                  data-testid="about-image-input"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Özellikler (virgülle ayırın)</label>
                <Textarea
                  value={settings.features}
                  onChange={(e) => setSettings({ ...settings, features: e.target.value })}
                  rows={4}
                  placeholder="Hızlı Teslimat, Güvenli Ödeme, 7/24 Destek"
                  data-testid="features-input"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            style={styles.saveButton}
            data-testid="save-settings-button"
          >
            <Save size={20} style={{ marginRight: '8px' }} />
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

const styles = {
  header: {
    marginBottom: 'var(--space-8)',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-2)',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
  section: {
    padding: 'var(--space-6)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-6)',
    display: 'flex',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 'var(--space-5)',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-2)',
  },
  logoPreview: {
    marginTop: 'var(--space-3)',
    padding: 'var(--space-4)',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
  },
  logoImg: {
    maxWidth: '200px',
    maxHeight: '80px',
    objectFit: 'contain',
  },
  saveButton: {
    marginTop: 'var(--space-6)',
    padding: 'var(--space-4) var(--space-8)',
    fontSize: '16px',
    fontWeight: '600',
    background: 'var(--primary)',
    color: 'white',
  },
};

export default AdminSettings;
