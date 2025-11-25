import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, Package, Check, Mail, Phone, MapPin } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart, getCartCount } = useQuoteCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/settings`).catch(() => ({ data: null })),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      toast.error('Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} sepete eklendi`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <>
      <style>{`
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; }
        .product-card:hover img { transform: scale(1.05); }
        .add-to-cart-btn:hover { background: var(--primary-700) !important; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3); }
        .nav-link-item:hover { color: var(--primary-600) !important; }
        .nav-link-item::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--primary-600); transition: width 0.3s ease; }
        .nav-link-item:hover::after { width: 100%; }
        .contact-card:hover { transform: translateY(-4px); border-color: var(--primary-200); }
      `}</style>
      <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" style={styles.logoImg} />
            ) : (
              <Package size={32} style={{ color: 'var(--primary-600)' }} />
            )}
            <span style={styles.brandName}>{settings?.company_name || 'RFQ Platform'}</span>
          </Link>

          <div style={styles.navLinks}>
            <a href="#anasayfa" onClick={() => scrollToSection('hero')} style={styles.navLink} className="nav-link-item">Ana Sayfa</a>
            <a href="#urunler" onClick={() => scrollToSection('products')} style={styles.navLink} className="nav-link-item">Ürünler</a>
            <a href="#hakkimizda" onClick={() => scrollToSection('about')} style={styles.navLink} className="nav-link-item">Hakkımızda</a>
            <a href="#iletisim" onClick={() => scrollToSection('contact')} style={styles.navLink} className="nav-link-item">İletişim</a>
          </div>

          <Link to="/teklif-sepeti" style={styles.cartBtn}>
            <ShoppingCart size={20} />
            <span>Sepet</span>
            {getCartCount() > 0 && <span style={styles.cartBadge}>{getCartCount()}</span>}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{settings?.hero_title || 'Teklif Alın, Kazanın'}</h1>
          <p style={styles.heroSubtitle}>{settings?.hero_subtitle || 'Ürünlerimizi inceleyin, ihtiyacınıza uygun teklifler alın'}</p>
        </div>
      </section>

      {/* Search & Filters */}
      <section style={styles.filterSection}>
        <div className="container">
          <div style={styles.filters}>
            <div style={styles.searchBox}>
              <Search size={20} style={styles.searchIcon} />
              <Input
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.categorySelect}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" style={styles.productsSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Ürünlerimiz</h2>
          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <Package size={64} style={{ color: 'var(--gray-400)' }} />
              <p style={styles.emptyText}>Ürün bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card product-card" style={styles.productCard}>
                  <Link to={`/urun/${product.id}`} style={styles.productLink}>
                    <div style={styles.productImage}>
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} style={styles.productImg} />
                      ) : (
                        <div style={styles.placeholderImg}>
                          <Package size={48} style={{ color: 'var(--gray-400)' }} />
                        </div>
                      )}
                    </div>
                    <div style={styles.productInfo}>
                      <span style={styles.productCategory}>{product.category}</span>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productDesc}>{product.description.substring(0, 80)}...</p>
                      {product.price_range && <p style={styles.productPrice}>{product.price_range}</p>}
                    </div>
                  </Link>
                  <Button onClick={() => handleAddToCart(product)} style={styles.addToCartBtn} className="add-to-cart-btn">
                    Sepete Ekle
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      {settings?.about_description && (
        <section id="about" style={styles.aboutSection}>
          <div className="container">
            <div style={styles.aboutGrid}>
              {settings.about_image_url && (
                <div style={styles.aboutImage}>
                  <img src={settings.about_image_url} alt="Hakkımızda" style={styles.aboutImg} />
                </div>
              )}
              <div style={styles.aboutContent}>
                <h2 style={styles.sectionTitle}>{settings.about_title || 'Hakkımızda'}</h2>
                <p style={styles.aboutText}>{settings.about_description}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" style={styles.contactSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>İletişim</h2>
          <div style={styles.contactGrid}>
            {settings?.company_address && (
              <div style={styles.contactCard} className="card">
                <MapPin size={32} style={{ color: 'var(--primary-600)' }} />
                <h3 style={styles.contactCardTitle}>Adres</h3>
                <p style={styles.contactCardText}>{settings.company_address}</p>
              </div>
            )}
            {settings?.company_phone && (
              <div style={styles.contactCard} className="card">
                <Phone size={32} style={{ color: 'var(--primary-600)' }} />
                <h3 style={styles.contactCardTitle}>Telefon</h3>
                <p style={styles.contactCardText}>{settings.company_phone}</p>
              </div>
            )}
            {settings?.company_email && (
              <div style={styles.contactCard} className="card">
                <Mail size={32} style={{ color: 'var(--primary-600)' }} />
                <h3 style={styles.contactCardTitle}>E-posta</h3>
                <p style={styles.contactCardText}>{settings.company_email}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>{settings?.company_name || 'RFQ Platform'}</h3>
              <p style={styles.footerDesc}>Profesyonel teklif yönetim platformu</p>
            </div>
            {settings && (
              <>
                <div style={styles.footerSection}>
                  <h4 style={styles.footerHeading}>İletişim</h4>
                  {settings.company_phone && <p style={styles.footerLink}>{settings.company_phone}</p>}
                  {settings.company_email && <p style={styles.footerLink}>{settings.company_email}</p>}
                </div>
                <div style={styles.footerSection}>
                  <h4 style={styles.footerHeading}>Bilgiler</h4>
                  {settings.company_website && (
                    <a href={settings.company_website} style={styles.footerLink} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  )}
                  {settings.tax_number && <p style={styles.footerLink}>Vergi No: {settings.tax_number}</p>}
                </div>
              </>
            )}
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.footerCopy}>© 2025 {settings?.company_name || 'RFQ Platform'}. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

const styles = {
  page: { background: 'var(--bg-secondary)' },
  navbar: { background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' },
  navContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' },
  logo: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none' },
  logoImg: { height: '40px', width: 'auto' },
  brandName: { fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' },
  navLinks: { display: 'flex', gap: 'var(--space-8)' },
  navLink: { fontSize: '15px', fontWeight: '500', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.3s ease', position: 'relative', padding: '8px 0' },
  cartBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', background: 'var(--primary-600)', color: 'white', borderRadius: 'var(--radius-lg)', textDecoration: 'none', fontWeight: '600', fontSize: '15px', position: 'relative' },
  cartBadge: { position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', border: '2px solid white' },
  hero: { background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)', padding: 'var(--space-24) 0', color: 'white', textAlign: 'center' },
  heroContent: { maxWidth: '800px', margin: '0 auto' },
  heroTitle: { fontSize: '56px', fontWeight: '800', marginBottom: 'var(--space-6)', lineHeight: 1.1 },
  heroSubtitle: { fontSize: '20px', fontWeight: '400', opacity: 0.95, lineHeight: 1.6 },
  filterSection: { padding: 'var(--space-8) 0', background: 'white', borderBottom: '1px solid var(--border-light)' },
  filters: { display: 'flex', gap: 'var(--space-4)' },
  searchBox: { flex: 1, position: 'relative' },
  searchIcon: { position: 'absolute', left: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
  searchInput: { paddingLeft: '48px', height: '48px', fontSize: '15px' },
  categorySelect: { minWidth: '220px', height: '48px', fontSize: '15px', fontWeight: '500' },
  productsSection: { padding: 'var(--space-16) 0' },
  sectionTitle: { fontSize: '36px', fontWeight: '700', marginBottom: 'var(--space-10)', textAlign: 'center', color: 'var(--text-primary)' },
  emptyState: { textAlign: 'center', padding: 'var(--space-20)' },
  emptyText: { fontSize: '18px', color: 'var(--text-secondary)', marginTop: 'var(--space-4)' },
  productCard: { display: 'flex', flexDirection: 'column', padding: 'var(--space-5)', height: '100%', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' },
  productLink: { textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' },
  productImage: { width: '100%', height: '240px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-4)', background: 'var(--bg-secondary)' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' },
  placeholderImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  productInfo: { flex: 1 },
  productCategory: { fontSize: '12px', fontWeight: '700', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  productName: { fontSize: '18px', fontWeight: '700', margin: 'var(--space-2) 0', color: 'var(--text-primary)' },
  productDesc: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)' },
  productPrice: { fontSize: '18px', fontWeight: '700', color: 'var(--primary-600)' },
  addToCartBtn: { width: '100%', marginTop: 'var(--space-4)', background: 'var(--primary-600)', color: 'white', height: '44px', fontWeight: '600', transition: 'all 0.3s ease', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-lg)' },
  aboutSection: { padding: 'var(--space-20) 0', background: 'white' },
  aboutGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' },
  aboutImage: { borderRadius: 'var(--radius-2xl)', overflow: 'hidden' },
  aboutImg: { width: '100%', height: 'auto' },
  aboutContent: { padding: 'var(--space-8)' },
  aboutText: { fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8 },
  contactSection: { padding: 'var(--space-20) 0', background: 'var(--bg-secondary)' },
  contactGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' },
  contactCard: { padding: 'var(--space-8)', textAlign: 'center' },
  contactCardTitle: { fontSize: '18px', fontWeight: '600', margin: 'var(--space-4) 0 var(--space-2)', color: 'var(--text-primary)' },
  contactCardText: { fontSize: '15px', color: 'var(--text-secondary)' },
  footer: { background: '#171717', color: 'white', padding: 'var(--space-16) 0 var(--space-8)' },
  footerContent: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-12)', marginBottom: 'var(--space-8)' },
  footerSection: {},
  footerTitle: { fontSize: '20px', fontWeight: '700', marginBottom: 'var(--space-3)' },
  footerDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.7)' },
  footerHeading: { fontSize: '16px', fontWeight: '600', marginBottom: 'var(--space-3)' },
  footerLink: { fontSize: '14px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 'var(--space-2)', textDecoration: 'none' },
  footerBottom: { paddingTop: 'var(--space-8)', borderTop: '1px solid rgba(255,255,255,0.1)' },
  footerCopy: { textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)' },
};

export default HomePage;
