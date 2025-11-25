import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Save, Palette } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ColorManagement = () => {
  const { getAuthHeader } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [colors, setColors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      
      // Extract all color fields
      const colorFields = {};
      Object.keys(response.data).forEach(key => {
        if (key.includes('color') || key.includes('bg_color') || key.includes('_bg') || key === 'home_hero_bg_color') {
          colorFields[key] = response.data[key] || '';
        }
      });
      
      setColors(colorFields);
    } catch (error) {
      toast.error('Renkler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Fetch full settings first
      const currentSettings = await axios.get(`${API}/settings`);
      
      // Merge with color updates
      const updatedSettings = { ...currentSettings.data, ...colors };
      
      await axios.post(`${API}/settings`, updatedSettings, { headers: getAuthHeader() });
      toast.success('Renkler başarıyla kaydedildi!');
    } catch (error) {
      toast.error('Renkler kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (field, value) => {
    setColors({ ...colors, [field]: value });
  };

  const colorSections = {
    'Ana Sayfa Hero': [
      { key: 'home_hero_bg_color', label: 'Hero Arkaplan Rengi' }
    ],
    'Header / Navbar': [
      { key: 'header_bg_color', label: 'Arkaplan Rengi' },
      { key: 'header_scrolled_bg_color', label: 'Scroll Sonrası Arkaplan' },
      { key: 'header_link_color', label: 'Link Rengi' },
      { key: 'header_link_active_color', label: 'Aktif Link Rengi' },
      { key: 'header_link_hover_color', label: 'Link Hover Rengi' },
      { key: 'header_cart_button_bg', label: 'Sepet Butonu Arkaplan' },
      { key: 'header_cart_button_text_color', label: 'Sepet Butonu Metin' }
    ],
    'Footer': [
      { key: 'footer_bg_color', label: 'Arkaplan Rengi' },
      { key: 'footer_text_color', label: 'Metin Rengi' },
      { key: 'footer_heading_color', label: 'Başlık Rengi' },
      { key: 'footer_link_color', label: 'Link Rengi' },
      { key: 'footer_link_hover_color', label: 'Link Hover Rengi' },
      { key: 'footer_divider_color', label: 'Ayırıcı Çizgi Rengi' }
    ],
    'İletişim Sayfası': [
      { key: 'contact_card_bg_color', label: 'Kart Arkaplan' },
      { key: 'contact_card_icon_bg_color', label: 'Kart İkon Arkaplan' },
      { key: 'contact_button_bg_color', label: 'Buton Arkaplan' },
      { key: 'contact_button_text_color', label: 'Buton Metin' }
    ]
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
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Palette size={28} color="white" />
            </div>
            <div>
              <h1 style={styles.title}>Renk Yönetimi</h1>
              <p style={styles.subtitle}>Sitenin tüm renklerini buradan yönetin</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...styles.saveButton,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={20} />
            {saving ? 'Kaydediliyor...' : 'Tüm Renkleri Kaydet'}
          </button>
        </div>

        <div className="card" style={styles.content}>
          {Object.entries(colorSections).map(([sectionName, fields]) => (
            <div key={sectionName} style={styles.section}>
              <h2 style={styles.sectionTitle}>{sectionName}</h2>
              <div style={styles.colorGrid}>
                {fields.map(({ key, label }) => (
                  <div key={key} style={styles.colorItem}>
                    <label style={styles.label}>{label}</label>
                    <div style={styles.colorInputWrapper}>
                      <Input
                        type="color"
                        value={colors[key] || '#000000'}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        style={styles.colorPicker}
                      />
                      <Input
                        value={colors[key] || ''}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        placeholder="#000000"
                        style={styles.colorTextInput}
                      />
                      <div
                        style={{
                          ...styles.colorPreview,
                          background: colors[key] || '#000000'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  subtitle: { fontSize: '16px', color: 'var(--text-secondary)' },
  saveButton: {
    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    padding: '14px 28px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
  },
  content: { padding: '40px' },
  section: {
    marginBottom: '48px',
    paddingBottom: '48px',
    borderBottom: '2px solid var(--border-light)'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  colorItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  colorInputWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  colorPicker: {
    width: '56px',
    height: '56px',
    padding: '4px',
    cursor: 'pointer',
    border: '2px solid var(--border-light)',
    borderRadius: '8px'
  },
  colorTextInput: {
    flex: 1,
    height: '56px',
    fontSize: '15px',
    fontFamily: 'monospace'
  },
  colorPreview: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    border: '2px solid var(--border-light)',
    flexShrink: 0
  }
};

export default ColorManagement;
