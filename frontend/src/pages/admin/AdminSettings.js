import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Save, Home, ShoppingBag, Award, Users, Phone, Layout } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const { getAuthHeader } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Genel
    company_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    logo_url: '',
    
    // Ana Sayfa
    home_hero_title: '',
    home_hero_subtitle: '',
    home_features_title: '',
    home_features_subtitle: '',
    home_products_title: '',
    home_products_subtitle: '',
    home_cta_title: '',
    home_cta_subtitle: '',
    
    // Ürünler Sayfası
    products_hero_title: '',
    products_hero_subtitle: '',
    products_empty_text: '',
    
    // Özellikler Sayfası
    features_hero_title: '',
    features_hero_subtitle: '',
    features_cta_title: '',
    features_cta_subtitle: '',
    
    // Hakkımızda
    about_hero_title: '',
    about_hero_subtitle: '',
    about_title: '',
    about_description: '',
    about_image_url: '',
    about_stat1_number: '',
    about_stat1_label: '',
    about_stat2_number: '',
    about_stat2_label: '',
    about_stat3_number: '',
    about_stat3_label: '',
    about_stat4_number: '',
    about_stat4_label: '',
    about_mission: '',
    about_vision: '',
    about_values: '',
    
    // İletişim
    contact_hero_title: '',
    contact_hero_subtitle: '',
    contact_phone_card_title: '',
    contact_email_card_title: '',
    contact_address_card_title: '',
    contact_form_title: '',
    contact_form_subtitle: '',
    contact_form_name_label: '',
    contact_form_name_placeholder: '',
    contact_form_email_label: '',
    contact_form_email_placeholder: '',
    contact_form_phone_label: '',
    contact_form_phone_placeholder: '',
    contact_form_subject_label: '',
    contact_form_subject_placeholder: '',
    contact_form_message_label: '',
    contact_form_message_placeholder: '',
    contact_form_button_text: '',
    contact_form_button_sending: '',
    contact_form_success_message: '',
    contact_work_hours_title: '',
    contact_work_hours: '',
    contact_quick_contact_title: '',
    contact_quick_contact_description: '',
    contact_call_button_text: '',
    contact_card_bg_color: '',
    contact_card_icon_bg_color: '',
    contact_card_hover_shadow: '',
    contact_button_bg_color: '',
    contact_button_text_color: '',
    
    // Footer - Genel
    footer_company_description: '',
    footer_copyright_text: '',
    footer_powered_by_text: '',
    
    // Footer - Sosyal Medya
    footer_facebook_url: '',
    footer_twitter_url: '',
    footer_linkedin_url: '',
    footer_instagram_url: '',
    
    // Footer - Hızlı Erişim
    footer_quicklinks_title: '',
    footer_menu_home: '',
    footer_menu_products: '',
    footer_menu_features: '',
    footer_menu_about: '',
    footer_menu_contact: '',
    
    // Footer - İletişim
    footer_contact_title: '',
    
    // Footer - Bülten
    footer_newsletter_title: '',
    footer_newsletter_subtitle: '',
    footer_newsletter_button_text: '',
    
    // Footer - Renkler
    footer_bg_color: '',
    footer_text_color: '',
    footer_heading_color: '',
    footer_link_color: '',
    footer_link_hover_color: '',
    footer_divider_color: '',
    
    // Header
    header_logo_url: '',
    header_company_name: '',
    header_menu_home: '',
    header_menu_products: '',
    header_menu_features: '',
    header_menu_about: '',
    header_menu_contact: '',
    header_cart_button_text: '',
    
    // Header - Renkler
    header_bg_color: '',
    header_text_color: '',
    header_link_color: '',
    header_link_active_color: '',
    header_link_hover_color: '',
    header_scrolled_bg_color: '',
    header_cart_button_bg: '',
    header_cart_button_text_color: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      // Merge with default values to ensure all fields exist
      const defaultSettings = {
        company_name: '',
        company_address: '',
        company_phone: '',
        company_email: '',
        logo_url: '',
        home_hero_title: '',
        home_hero_subtitle: '',
        home_features_title: '',
        home_features_subtitle: '',
        home_products_title: '',
        home_products_subtitle: '',
        home_cta_title: '',
        home_cta_subtitle: '',
        products_hero_title: '',
        products_hero_subtitle: '',
        products_empty_text: '',
        features_hero_title: '',
        features_hero_subtitle: '',
        features_cta_title: '',
        features_cta_subtitle: '',
        about_hero_title: '',
        about_hero_subtitle: '',
        about_title: '',
        about_description: '',
        about_image_url: '',
        about_stat1_number: '',
        about_stat1_label: '',
        about_stat2_number: '',
        about_stat2_label: '',
        about_stat3_number: '',
        about_stat3_label: '',
        about_stat4_number: '',
        about_stat4_label: '',
        about_mission: '',
        about_vision: '',
        about_values: '',
        contact_hero_title: '',
        contact_hero_subtitle: '',
        contact_form_title: '',
        contact_form_subtitle: '',
        contact_phone_card_title: '',
        contact_email_card_title: '',
        contact_address_card_title: '',
        contact_form_name_label: '',
        contact_form_name_placeholder: '',
        contact_form_email_label: '',
        contact_form_email_placeholder: '',
        contact_form_phone_label: '',
        contact_form_phone_placeholder: '',
        contact_form_subject_label: '',
        contact_form_subject_placeholder: '',
        contact_form_message_label: '',
        contact_form_message_placeholder: '',
        contact_form_button_text: '',
        contact_form_button_sending: '',
        contact_form_success_message: '',
        contact_work_hours_title: '',
        contact_work_hours: '',
        contact_quick_contact_title: '',
        contact_quick_contact_description: '',
        contact_call_button_text: '',
        contact_card_bg_color: '',
        contact_card_icon_bg_color: '',
        contact_card_hover_shadow: '',
        contact_button_bg_color: '',
        contact_button_text_color: '',
        footer_company_description: '',
        footer_copyright_text: '',
        footer_powered_by_text: '',
        footer_facebook_url: '',
        footer_twitter_url: '',
        footer_linkedin_url: '',
        footer_instagram_url: '',
        footer_quicklinks_title: '',
        footer_menu_home: '',
        footer_menu_products: '',
        footer_menu_features: '',
        footer_menu_about: '',
        footer_menu_contact: '',
        footer_contact_title: '',
        footer_newsletter_title: '',
        footer_newsletter_subtitle: '',
        footer_newsletter_button_text: '',
        footer_bg_color: '',
        footer_text_color: '',
        footer_heading_color: '',
        footer_link_color: '',
        footer_link_hover_color: '',
        footer_divider_color: '',
        header_logo_url: '',
        header_company_name: '',
        header_menu_home: '',
        header_menu_products: '',
        header_menu_features: '',
        header_menu_about: '',
        header_menu_contact: '',
        header_cart_button_text: '',
        header_bg_color: '',
        header_text_color: '',
        header_link_color: '',
        header_link_active_color: '',
        header_link_hover_color: '',
        header_scrolled_bg_color: '',
        header_cart_button_bg: '',
        header_cart_button_text_color: ''
      };
      setSettings({ ...defaultSettings, ...response.data });
    } catch (error) {
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/settings`, settings, { headers: getAuthHeader() });
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const tabs = [
    { id: 'general', label: 'Genel Bilgiler', icon: Layout },
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'products', label: 'Ürünler Sayfası', icon: ShoppingBag },
    { id: 'features', label: 'Özellikler', icon: Award },
    { id: 'about', label: 'Hakkımızda', icon: Users },
    { id: 'contact', label: 'İletişim', icon: Phone },
    { id: 'header', label: 'Header/Navbar', icon: Layout },
    { id: 'footer', label: 'Footer', icon: Layout }
  ];

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
          <div>
            <h1 style={styles.title}>İçerik Yönetimi (CMS)</h1>
            <p style={styles.subtitle}>Tüm sayfa içeriklerini buradan yönetin</p>
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
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.tabActive : {})
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="card" style={styles.content}>
          {/* Genel Bilgiler */}
          {activeTab === 'general' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Şirket Bilgileri</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Şirket Adı *</label>
                <Input
                  value={settings.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="Örn: Özmen Gıda"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Logo URL</label>
                <Input
                  value={settings.logo_url}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  placeholder="Logo görsel linki"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefon</label>
                <Input
                  value={settings.company_phone}
                  onChange={(e) => handleChange('company_phone', e.target.value)}
                  placeholder="0532 123 45 67"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>E-posta</label>
                <Input
                  value={settings.company_email}
                  onChange={(e) => handleChange('company_email', e.target.value)}
                  placeholder="info@sirket.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Adres</label>
                <textarea
                  value={settings.company_address}
                  onChange={(e) => handleChange('company_address', e.target.value)}
                  placeholder="Tam adres..."
                  rows={3}
                  style={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* Ana Sayfa */}
          {activeTab === 'home' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Ana Sayfa İçerikleri</h2>
              
              <h3 style={styles.subsectionTitle}>Hero Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.home_hero_title}
                  onChange={(e) => handleChange('home_hero_title', e.target.value)}
                  placeholder="Teklif Alın, Kazanın"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alt Başlık</label>
                <Input
                  value={settings.home_hero_subtitle}
                  onChange={(e) => handleChange('home_hero_subtitle', e.target.value)}
                  placeholder="Ürünlerimizi inceleyin..."
                />
              </div>

              <h3 style={styles.subsectionTitle}>Özellikler Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.home_features_title}
                  onChange={(e) => handleChange('home_features_title', e.target.value)}
                  placeholder="Neden Bizi Seçmelisiniz?"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alt Başlık</label>
                <Input
                  value={settings.home_features_subtitle}
                  onChange={(e) => handleChange('home_features_subtitle', e.target.value)}
                  placeholder="Müşterilerimize sunduğumuz..."
                />
              </div>

              <h3 style={styles.subsectionTitle}>Ürünler Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.home_products_title}
                  onChange={(e) => handleChange('home_products_title', e.target.value)}
                  placeholder="Öne Çıkan Ürünler"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alt Başlık</label>
                <Input
                  value={settings.home_products_subtitle}
                  onChange={(e) => handleChange('home_products_subtitle', e.target.value)}
                  placeholder="En popüler ürünlerimizi..."
                />
              </div>

              <h3 style={styles.subsectionTitle}>CTA (Çağrı) Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.home_cta_title}
                  onChange={(e) => handleChange('home_cta_title', e.target.value)}
                  placeholder="Hemen Teklif Alın"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={settings.home_cta_subtitle}
                  onChange={(e) => handleChange('home_cta_subtitle', e.target.value)}
                  placeholder="Ürünlerimizi sepete ekleyin..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* Ürünler Sayfası */}
          {activeTab === 'products' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Ürünler Sayfası</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Hero Başlık</label>
                <Input
                  value={settings.products_hero_title}
                  onChange={(e) => handleChange('products_hero_title', e.target.value)}
                  placeholder="Ürünlerimiz"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hero Alt Başlık</label>
                <Input
                  value={settings.products_hero_subtitle}
                  onChange={(e) => handleChange('products_hero_subtitle', e.target.value)}
                  placeholder="Geniş ürün yelpazemizle..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ürün Bulunamadı Metni</label>
                <Input
                  value={settings.products_empty_text}
                  onChange={(e) => handleChange('products_empty_text', e.target.value)}
                  placeholder="Aramanızla eşleşen ürün bulunamadı"
                />
              </div>
            </div>
          )}

          {/* Özellikler Sayfası */}
          {activeTab === 'features' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Özellikler Sayfası</h2>
              
              <h3 style={styles.subsectionTitle}>Hero Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.features_hero_title}
                  onChange={(e) => handleChange('features_hero_title', e.target.value)}
                  placeholder="Özelliklerimiz"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alt Başlık</label>
                <Input
                  value={settings.features_hero_subtitle}
                  onChange={(e) => handleChange('features_hero_subtitle', e.target.value)}
                  placeholder="Müşterilerimize en iyi hizmeti..."
                />
              </div>

              <h3 style={styles.subsectionTitle}>CTA Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.features_cta_title}
                  onChange={(e) => handleChange('features_cta_title', e.target.value)}
                  placeholder="Hemen Teklif Alın"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Açıklama</label>
                <textarea
                  value={settings.features_cta_subtitle}
                  onChange={(e) => handleChange('features_cta_subtitle', e.target.value)}
                  placeholder="Ürünlerimizi inceleyip..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* Hakkımızda */}
          {activeTab === 'about' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Hakkımızda Sayfası</h2>
              
              <h3 style={styles.subsectionTitle}>Hero Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.about_hero_title}
                  onChange={(e) => handleChange('about_hero_title', e.target.value)}
                  placeholder="Hakkımızda"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alt Başlık</label>
                <textarea
                  value={settings.about_hero_subtitle}
                  onChange={(e) => handleChange('about_hero_subtitle', e.target.value)}
                  placeholder="Yılların deneyimi..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <h3 style={styles.subsectionTitle}>İstatistikler</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 1 - Sayı</label>
                  <Input
                    value={settings.about_stat1_number}
                    onChange={(e) => handleChange('about_stat1_number', e.target.value)}
                    placeholder="10+"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 1 - Etiket</label>
                  <Input
                    value={settings.about_stat1_label}
                    onChange={(e) => handleChange('about_stat1_label', e.target.value)}
                    placeholder="Yıllık Deneyim"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 2 - Sayı</label>
                  <Input
                    value={settings.about_stat2_number}
                    onChange={(e) => handleChange('about_stat2_number', e.target.value)}
                    placeholder="500+"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 2 - Etiket</label>
                  <Input
                    value={settings.about_stat2_label}
                    onChange={(e) => handleChange('about_stat2_label', e.target.value)}
                    placeholder="Mutlu Müşteri"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 3 - Sayı</label>
                  <Input
                    value={settings.about_stat3_number}
                    onChange={(e) => handleChange('about_stat3_number', e.target.value)}
                    placeholder="1000+"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 3 - Etiket</label>
                  <Input
                    value={settings.about_stat3_label}
                    onChange={(e) => handleChange('about_stat3_label', e.target.value)}
                    placeholder="Tamamlanan Proje"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 4 - Sayı</label>
                  <Input
                    value={settings.about_stat4_number}
                    onChange={(e) => handleChange('about_stat4_number', e.target.value)}
                    placeholder="98%"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İstatistik 4 - Etiket</label>
                  <Input
                    value={settings.about_stat4_label}
                    onChange={(e) => handleChange('about_stat4_label', e.target.value)}
                    placeholder="Müşteri Memnuniyeti"
                  />
                </div>
              </div>

              <h3 style={styles.subsectionTitle}>İçerik</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Şirket Açıklaması</label>
                <textarea
                  value={settings.about_description}
                  onChange={(e) => handleChange('about_description', e.target.value)}
                  placeholder="Sektörde uzun yıllara dayanan..."
                  rows={4}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Görsel URL</label>
                <Input
                  value={settings.about_image_url}
                  onChange={(e) => handleChange('about_image_url', e.target.value)}
                  placeholder="Hakkımızda görseli"
                />
              </div>

              <h3 style={styles.subsectionTitle}>Misyon, Vizyon, Değerler</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Misyon</label>
                <textarea
                  value={settings.about_mission}
                  onChange={(e) => handleChange('about_mission', e.target.value)}
                  placeholder="Misyonumuz..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Vizyon</label>
                <textarea
                  value={settings.about_vision}
                  onChange={(e) => handleChange('about_vision', e.target.value)}
                  placeholder="Vizyonumuz..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Değerler</label>
                <textarea
                  value={settings.about_values}
                  onChange={(e) => handleChange('about_values', e.target.value)}
                  placeholder="Değerlerimiz..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* İletişim */}
          {activeTab === 'contact' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>İletişim Sayfası Ayarları</h2>
              
              <h3 style={styles.subsectionTitle}>Hero Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Başlık</label>
                <Input
                  value={settings.contact_hero_title}
                  onChange={(e) => handleChange('contact_hero_title', e.target.value)}
                  placeholder="İletişime Geçin"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alt Başlık</label>
                <textarea
                  value={settings.contact_hero_subtitle}
                  onChange={(e) => handleChange('contact_hero_subtitle', e.target.value)}
                  placeholder="Sorularınız veya talepleriniz..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <h3 style={styles.subsectionTitle}>İletişim Kartları</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Telefon Kartı Başlık</label>
                  <Input
                    value={settings.contact_phone_card_title}
                    onChange={(e) => handleChange('contact_phone_card_title', e.target.value)}
                    placeholder="Telefon"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>E-posta Kartı Başlık</label>
                  <Input
                    value={settings.contact_email_card_title}
                    onChange={(e) => handleChange('contact_email_card_title', e.target.value)}
                    placeholder="E-posta"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Adres Kartı Başlık</label>
                <Input
                  value={settings.contact_address_card_title}
                  onChange={(e) => handleChange('contact_address_card_title', e.target.value)}
                  placeholder="Adres"
                />
              </div>

              <h3 style={styles.subsectionTitle}>İletişim Formu</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Form Başlık</label>
                <Input
                  value={settings.contact_form_title}
                  onChange={(e) => handleChange('contact_form_title', e.target.value)}
                  placeholder="Mesaj Gönderin"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Form Alt Başlık</label>
                <Input
                  value={settings.contact_form_subtitle}
                  onChange={(e) => handleChange('contact_form_subtitle', e.target.value)}
                  placeholder="Formu doldurarak..."
                />
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ad Soyad - Label</label>
                  <Input
                    value={settings.contact_form_name_label}
                    onChange={(e) => handleChange('contact_form_name_label', e.target.value)}
                    placeholder="Adınız Soyadınız *"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ad Soyad - Placeholder</label>
                  <Input
                    value={settings.contact_form_name_placeholder}
                    onChange={(e) => handleChange('contact_form_name_placeholder', e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>E-posta - Label</label>
                  <Input
                    value={settings.contact_form_email_label}
                    onChange={(e) => handleChange('contact_form_email_label', e.target.value)}
                    placeholder="E-posta Adresiniz *"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>E-posta - Placeholder</label>
                  <Input
                    value={settings.contact_form_email_placeholder}
                    onChange={(e) => handleChange('contact_form_email_placeholder', e.target.value)}
                    placeholder="Örn: ahmet@example.com"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Telefon - Label</label>
                  <Input
                    value={settings.contact_form_phone_label}
                    onChange={(e) => handleChange('contact_form_phone_label', e.target.value)}
                    placeholder="Telefon Numaranız"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Telefon - Placeholder</label>
                  <Input
                    value={settings.contact_form_phone_placeholder}
                    onChange={(e) => handleChange('contact_form_phone_placeholder', e.target.value)}
                    placeholder="Örn: 0532 123 45 67"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Konu - Label</label>
                  <Input
                    value={settings.contact_form_subject_label}
                    onChange={(e) => handleChange('contact_form_subject_label', e.target.value)}
                    placeholder="Konu *"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Konu - Placeholder</label>
                  <Input
                    value={settings.contact_form_subject_placeholder}
                    onChange={(e) => handleChange('contact_form_subject_placeholder', e.target.value)}
                    placeholder="Mesajınızın konusu"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mesaj - Label</label>
                  <Input
                    value={settings.contact_form_message_label}
                    onChange={(e) => handleChange('contact_form_message_label', e.target.value)}
                    placeholder="Mesajınız *"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mesaj - Placeholder</label>
                  <Input
                    value={settings.contact_form_message_placeholder}
                    onChange={(e) => handleChange('contact_form_message_placeholder', e.target.value)}
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gönder Butonu Metni</label>
                  <Input
                    value={settings.contact_form_button_text}
                    onChange={(e) => handleChange('contact_form_button_text', e.target.value)}
                    placeholder="Mesaj Gönder"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gönderiliyor Metni</label>
                  <Input
                    value={settings.contact_form_button_sending}
                    onChange={(e) => handleChange('contact_form_button_sending', e.target.value)}
                    placeholder="Gönderiliyor..."
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Başarı Mesajı</label>
                <Input
                  value={settings.contact_form_success_message}
                  onChange={(e) => handleChange('contact_form_success_message', e.target.value)}
                  placeholder="Mesajınız başarıyla gönderildi..."
                />
              </div>

              <h3 style={styles.subsectionTitle}>Yan Bilgi Kartları</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Çalışma Saatleri - Başlık</label>
                <Input
                  value={settings.contact_work_hours_title}
                  onChange={(e) => handleChange('contact_work_hours_title', e.target.value)}
                  placeholder="Çalışma Saatleri"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Çalışma Saatleri</label>
                <textarea
                  value={settings.contact_work_hours}
                  onChange={(e) => handleChange('contact_work_hours', e.target.value)}
                  placeholder="Pazartesi - Cuma: 09:00 - 18:00"
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hızlı İletişim - Başlık</label>
                <Input
                  value={settings.contact_quick_contact_title}
                  onChange={(e) => handleChange('contact_quick_contact_title', e.target.value)}
                  placeholder="Hızlı İletişim"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hızlı İletişim - Açıklama</label>
                <textarea
                  value={settings.contact_quick_contact_description}
                  onChange={(e) => handleChange('contact_quick_contact_description', e.target.value)}
                  placeholder="Acil durumlar için telefon veya e-posta ile..."
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ara Butonu Metni</label>
                <Input
                  value={settings.contact_call_button_text}
                  onChange={(e) => handleChange('contact_call_button_text', e.target.value)}
                  placeholder="Hemen Ara"
                />
              </div>

              <h3 style={styles.subsectionTitle}>Renkler</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kart Arkaplan Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.contact_card_bg_color || '#FFFFFF'}
                      onChange={(e) => handleChange('contact_card_bg_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.contact_card_bg_color}
                      onChange={(e) => handleChange('contact_card_bg_color', e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Kart İkon Arkaplan Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.contact_card_icon_bg_color || '#22C55E'}
                      onChange={(e) => handleChange('contact_card_icon_bg_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.contact_card_icon_bg_color}
                      onChange={(e) => handleChange('contact_card_icon_bg_color', e.target.value)}
                      placeholder="#22C55E"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Buton Arkaplan Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.contact_button_bg_color || '#22C55E'}
                      onChange={(e) => handleChange('contact_button_bg_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.contact_button_bg_color}
                      onChange={(e) => handleChange('contact_button_bg_color', e.target.value)}
                      placeholder="#22C55E"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Buton Metin Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.contact_button_text_color || '#FFFFFF'}
                      onChange={(e) => handleChange('contact_button_text_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.contact_button_text_color}
                      onChange={(e) => handleChange('contact_button_text_color', e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          {activeTab === 'header' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Header / Navbar Ayarları</h2>
              
              <h3 style={styles.subsectionTitle}>Logo ve Branding</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Logo URL</label>
                <Input
                  value={settings.header_logo_url}
                  onChange={(e) => handleChange('header_logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                <small style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  Logo görseli linki. Boş bırakırsanız varsayılan ikon gösterilir.
                </small>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Şirket Adı</label>
                <Input
                  value={settings.header_company_name}
                  onChange={(e) => handleChange('header_company_name', e.target.value)}
                  placeholder="Özmen Gıda"
                />
              </div>

              <h3 style={styles.subsectionTitle}>Menü Linkleri</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ana Sayfa Link Metni</label>
                  <Input
                    value={settings.header_menu_home}
                    onChange={(e) => handleChange('header_menu_home', e.target.value)}
                    placeholder="Ana Sayfa"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ürünler Link Metni</label>
                  <Input
                    value={settings.header_menu_products}
                    onChange={(e) => handleChange('header_menu_products', e.target.value)}
                    placeholder="Ürünler"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Özellikler Link Metni</label>
                  <Input
                    value={settings.header_menu_features}
                    onChange={(e) => handleChange('header_menu_features', e.target.value)}
                    placeholder="Özellikler"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hakkımızda Link Metni</label>
                  <Input
                    value={settings.header_menu_about}
                    onChange={(e) => handleChange('header_menu_about', e.target.value)}
                    placeholder="Hakkımızda"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İletişim Link Metni</label>
                  <Input
                    value={settings.header_menu_contact}
                    onChange={(e) => handleChange('header_menu_contact', e.target.value)}
                    placeholder="İletişim"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Sepet Butonu Metni</label>
                  <Input
                    value={settings.header_cart_button_text}
                    onChange={(e) => handleChange('header_cart_button_text', e.target.value)}
                    placeholder="Sepet"
                  />
                </div>
              </div>

              <h3 style={styles.subsectionTitle}>Renkler</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Arkaplan Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.header_bg_color || '#FFFFFF'}
                      onChange={(e) => handleChange('header_bg_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.header_bg_color}
                      onChange={(e) => handleChange('header_bg_color', e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Scroll Sonrası Arkaplan</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.header_scrolled_bg_color || '#FFFFFFFA'}
                      onChange={(e) => handleChange('header_scrolled_bg_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.header_scrolled_bg_color}
                      onChange={(e) => handleChange('header_scrolled_bg_color', e.target.value)}
                      placeholder="#FFFFFFFA"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Metin/Link Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.header_link_color || '#374151'}
                      onChange={(e) => handleChange('header_link_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.header_link_color}
                      onChange={(e) => handleChange('header_link_color', e.target.value)}
                      placeholder="#374151"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Aktif Link Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.header_link_active_color || '#22C55E'}
                      onChange={(e) => handleChange('header_link_active_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.header_link_active_color}
                      onChange={(e) => handleChange('header_link_active_color', e.target.value)}
                      placeholder="#22C55E"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Link Hover Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.header_link_hover_color || '#22C55E'}
                      onChange={(e) => handleChange('header_link_hover_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.header_link_hover_color}
                      onChange={(e) => handleChange('header_link_hover_color', e.target.value)}
                      placeholder="#22C55E"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Sepet Butonu Arkaplan</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.header_cart_button_bg || '#22C55E'}
                      onChange={(e) => handleChange('header_cart_button_bg', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.header_cart_button_bg}
                      onChange={(e) => handleChange('header_cart_button_bg', e.target.value)}
                      placeholder="#22C55E"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sepet Butonu Metin Rengi</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input
                    type="color"
                    value={settings.header_cart_button_text_color || '#FFFFFF'}
                    onChange={(e) => handleChange('header_cart_button_text_color', e.target.value)}
                    style={{ width: '60px', height: '44px', padding: '4px' }}
                  />
                  <Input
                    value={settings.header_cart_button_text_color}
                    onChange={(e) => handleChange('header_cart_button_text_color', e.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {activeTab === 'footer' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Footer Ayarları</h2>
              
              <h3 style={styles.subsectionTitle}>Genel Bilgiler</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Şirket Açıklaması</label>
                <textarea
                  value={settings.footer_company_description}
                  onChange={(e) => handleChange('footer_company_description', e.target.value)}
                  placeholder="Profesyonel B2B teklif yönetim platformu..."
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Copyright Metni</label>
                <Input
                  value={settings.footer_copyright_text}
                  onChange={(e) => handleChange('footer_copyright_text', e.target.value)}
                  placeholder="© 2025 RFQ Platform. Tüm hakları saklıdır."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>&quot;Made by&quot; Metni</label>
                <Input
                  value={settings.footer_powered_by_text}
                  onChange={(e) => handleChange('footer_powered_by_text', e.target.value)}
                  placeholder="Made with ❤️ by Emergent"
                />
              </div>

              <h3 style={styles.subsectionTitle}>Sosyal Medya Linkleri</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Facebook URL</label>
                  <Input
                    value={settings.footer_facebook_url}
                    onChange={(e) => handleChange('footer_facebook_url', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Twitter URL</label>
                  <Input
                    value={settings.footer_twitter_url}
                    onChange={(e) => handleChange('footer_twitter_url', e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>LinkedIn URL</label>
                  <Input
                    value={settings.footer_linkedin_url}
                    onChange={(e) => handleChange('footer_linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Instagram URL</label>
                  <Input
                    value={settings.footer_instagram_url}
                    onChange={(e) => handleChange('footer_instagram_url', e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <h3 style={styles.subsectionTitle}>Hızlı Erişim Menüsü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bölüm Başlığı</label>
                <Input
                  value={settings.footer_quicklinks_title}
                  onChange={(e) => handleChange('footer_quicklinks_title', e.target.value)}
                  placeholder="Hızlı Erişim"
                />
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ana Sayfa Link Metni</label>
                  <Input
                    value={settings.footer_menu_home}
                    onChange={(e) => handleChange('footer_menu_home', e.target.value)}
                    placeholder="Ana Sayfa"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ürünler Link Metni</label>
                  <Input
                    value={settings.footer_menu_products}
                    onChange={(e) => handleChange('footer_menu_products', e.target.value)}
                    placeholder="Ürünler"
                  />
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Özellikler Link Metni</label>
                  <Input
                    value={settings.footer_menu_features}
                    onChange={(e) => handleChange('footer_menu_features', e.target.value)}
                    placeholder="Özellikler"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hakkımızda Link Metni</label>
                  <Input
                    value={settings.footer_menu_about}
                    onChange={(e) => handleChange('footer_menu_about', e.target.value)}
                    placeholder="Hakkımızda"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>İletişim Link Metni</label>
                <Input
                  value={settings.footer_menu_contact}
                  onChange={(e) => handleChange('footer_menu_contact', e.target.value)}
                  placeholder="İletişim"
                />
              </div>

              <h3 style={styles.subsectionTitle}>İletişim Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bölüm Başlığı</label>
                <Input
                  value={settings.footer_contact_title}
                  onChange={(e) => handleChange('footer_contact_title', e.target.value)}
                  placeholder="İletişim"
                />
              </div>

              <h3 style={styles.subsectionTitle}>Bülten Bölümü</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bülten Başlığı</label>
                <Input
                  value={settings.footer_newsletter_title}
                  onChange={(e) => handleChange('footer_newsletter_title', e.target.value)}
                  placeholder="Bülten"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bülten Açıklaması</label>
                <textarea
                  value={settings.footer_newsletter_subtitle}
                  onChange={(e) => handleChange('footer_newsletter_subtitle', e.target.value)}
                  placeholder="Yeni ürünler ve kampanyalardan haberdar olmak için..."
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Buton Metni</label>
                <Input
                  value={settings.footer_newsletter_button_text}
                  onChange={(e) => handleChange('footer_newsletter_button_text', e.target.value)}
                  placeholder="Abone Ol"
                />
              </div>

              <h3 style={styles.subsectionTitle}>Renkler</h3>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Arkaplan Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.footer_bg_color || '#1F2937'}
                      onChange={(e) => handleChange('footer_bg_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.footer_bg_color}
                      onChange={(e) => handleChange('footer_bg_color', e.target.value)}
                      placeholder="#1F2937"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Metin Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.footer_text_color || '#9CA3AF'}
                      onChange={(e) => handleChange('footer_text_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.footer_text_color}
                      onChange={(e) => handleChange('footer_text_color', e.target.value)}
                      placeholder="#9CA3AF"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Başlık Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.footer_heading_color || '#FFFFFF'}
                      onChange={(e) => handleChange('footer_heading_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.footer_heading_color}
                      onChange={(e) => handleChange('footer_heading_color', e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Link Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.footer_link_color || '#9CA3AF'}
                      onChange={(e) => handleChange('footer_link_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.footer_link_color}
                      onChange={(e) => handleChange('footer_link_color', e.target.value)}
                      placeholder="#9CA3AF"
                    />
                  </div>
                </div>
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Link Hover Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.footer_link_hover_color || '#22C55E'}
                      onChange={(e) => handleChange('footer_link_hover_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.footer_link_hover_color}
                      onChange={(e) => handleChange('footer_link_hover_color', e.target.value)}
                      placeholder="#22C55E"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Ayırıcı Çizgi Rengi</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Input
                      type="color"
                      value={settings.footer_divider_color || '#374151'}
                      onChange={(e) => handleChange('footer_divider_color', e.target.value)}
                      style={{ width: '60px', height: '44px', padding: '4px' }}
                    />
                    <Input
                      value={settings.footer_divider_color}
                      onChange={(e) => handleChange('footer_divider_color', e.target.value)}
                      placeholder="#374151"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
    marginBottom: '8px'
  },
  subtitle: { fontSize: '16px', color: 'var(--text-secondary)' },
  saveButton: {
    background: 'var(--primary-600)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    borderBottom: '2px solid var(--border-light)',
    paddingBottom: '0'
  },
  tab: {
    padding: '14px 24px',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '-2px'
  },
  tabActive: {
    color: 'var(--primary-600)',
    borderBottomColor: 'var(--primary-600)'
  },
  content: { padding: '32px' },
  section: {},
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '24px'
  },
  subsectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: '32px',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-light)'
  },
  formGroup: { marginBottom: '20px' },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    fontSize: '15px',
    fontFamily: 'Inter, sans-serif',
    resize: 'vertical',
    lineHeight: '1.5'
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  }
};

export default AdminSettings;
