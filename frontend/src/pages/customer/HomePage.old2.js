import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, 
  Search, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Star,
  Menu,
  X,
  Shield,
  Truck,
  HeadphonesIcon,
  Award,
  Check
} from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { addToCart, getCartCount } = useQuoteCart();

  // Yeşil renk paleti
  const colors = {
    primary: 'rgb(59, 183, 126)',
    primaryDark: 'rgb(47, 146, 101)',
    primaryLight: 'rgb(235, 250, 242)',
    gradient: 'linear-gradient(135deg, rgb(59, 183, 126) 0%, rgb(47, 146, 101) 100%)',
    lightGradient: 'linear-gradient(135deg, rgb(245, 252, 248) 0%, rgb(235, 250, 242) 100%)'
  };

  useEffect(() => {
    fetchData();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
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
    toast.success(`${product.name} sepete eklendi`, {
      position: 'top-center'
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .scale-in {
          animation: scaleIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .product-card {
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-color: ${colors.primary};
        }
        .nav-link-item {
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: ${colors.primary};
          transition: width 0.3s ease;
        }
        .nav-link-item:hover::after {
          width: 100%;
        }
      `}</style>

      <div style={styles.page}>
        {/* Navbar */}
        <nav style={{
          ...styles.navbar,
          background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        }}>
          <div style={styles.navContainer}>
            <Link to="/" style={styles.logo}>
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" style={styles.logoImg} />
              ) : (
                <div style={{...styles.logoPlaceholder, background: colors.primary}}>
                  <Award size={24} color="white" />
                </div>
              )}
              <span style={styles.brandName}>{settings?.company_name || 'Özmen Gıda'}</span>
            </Link>

            <div style={styles.navLinks}>
              <a href="#anasayfa" onClick={() => scrollToSection('hero')} style={styles.navLink} className="nav-link-item">
                Ana Sayfa
              </a>
              <a href="#urunler" onClick={() => scrollToSection('products')} style={styles.navLink} className="nav-link-item">
                Ürünler
              </a>
              <a href="#ozellikler" onClick={() => scrollToSection('features')} style={styles.navLink} className="nav-link-item">
                Özellikler
              </a>
              <a href="#hakkimizda" onClick={() => scrollToSection('about')} style={styles.navLink} className="nav-link-item">
                Hakkımızda
              </a>
              <a href="#iletisim" onClick={() => scrollToSection('contact')} style={styles.navLink} className="nav-link-item">
                İletişim
              </a>
            </div>

            <div style={styles.navActions}>
              <Link to="/teklif-sepeti" style={styles.cartBtn}>
                <ShoppingCart size={20} />
                <span>Sepet</span>
                {getCartCount() > 0 && (
                  <span style={styles.cartBadge}>{getCartCount()}</span>
                )}
              </Link>

              <button 
                style={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div style={styles.mobileMenu}>
              <a href="#anasayfa" onClick={() => scrollToSection('hero')} style={styles.mobileNavLink}>
                Ana Sayfa
              </a>
              <a href="#urunler" onClick={() => scrollToSection('products')} style={styles.mobileNavLink}>
                Ürünler
              </a>
              <a href="#ozellikler" onClick={() => scrollToSection('features')} style={styles.mobileNavLink}>
                Özellikler
              </a>
              <a href="#hakkimizda" onClick={() => scrollToSection('about')} style={styles.mobileNavLink}>
                Hakkımızda
              </a>
              <a href="#iletisim" onClick={() => scrollToSection('contact')} style={styles.mobileNavLink}>
                İletişim
              </a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="hero" style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>
                {settings?.hero_title || 'Teklif Alın, Kazanın'}
              </h1>
              <p style={styles.heroSubtitle}>
                {settings?.hero_subtitle || 'Ürünlerimizi inceleyin, ihtiyacınıza uygun teklifler alın'}
              </p>
              <div style={styles.heroActions}>
                <Button 
                  onClick={() => scrollToSection('products')} 
                  style={{...styles.primaryButton, background: colors.primary}}
                >
                  Ürünleri Keşfet
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={styles.featuresSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Neden Bizi Seçmelisiniz?</h2>
            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, background: colors.primary}}>
                  <Shield size={24} color="white" />
                </div>
                <h3 style={styles.featureTitle}>Kalite Garantisi</h3>
                <p style={styles.featureDesc}>Tüm ürünlerimiz uluslararası kalite standartlarına uygundur</p>
              </div>
              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, background: colors.primary}}>
                  <Truck size={24} color="white" />
                </div>
                <h3 style={styles.featureTitle}>Hızlı Teslimat</h3>
                <p style={styles.featureDesc}>Siparişleriniz en kısa sürede güvenle teslim edilir</p>
              </div>
              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, background: colors.primary}}>
                  <HeadphonesIcon size={24} color="white" />
                </div>
                <h3 style={styles.featureTitle}>7/24 Destek</h3>
                <p style={styles.featureDesc}>Profesyonel müşteri hizmetleri ekibimiz yanınızda</p>
              </div>
              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, background: colors.primary}}>
                  <Award size={24} color="white" />
                </div>
                <h3 style={styles.featureTitle}>Uzman Ekip</h3>
                <p style={styles.featureDesc}>Alanında uzman kadromuzla profesyonel çözümler</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section style={styles.filterSection}>
          <div style={styles.container}>
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

        {/* Products Section */}
        <section id="products" style={styles.productsSection}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Ürünlerimiz</h2>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <Package size={64} color="#9ca3af" />
                <p style={styles.emptyText}>Aramanızla eşleşen ürün bulunamadı</p>
                <Button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                  style={{...styles.resetButton, background: colors.primary}}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            ) : (
              <div style={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <div key={product.id} style={styles.productCard} className="product-card">
                    <Link to={`/urun/${product.id}`} style={styles.productLink}>
                      <div style={styles.productImage}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} style={styles.productImg} />
                        ) : (
                          <div style={styles.placeholderImg}>
                            <Package size={48} color="#9ca3af" />
                          </div>
                        )}
                      </div>
                      <div style={styles.productInfo}>
                        <span style={styles.productCategory}>{product.category}</span>
                        <h3 style={styles.productName}>{product.name}</h3>
                        <p style={styles.productDesc}>
                          {product.description?.substring(0, 80)}...
                        </p>
                        {product.price_range && (
                          <p style={{...styles.productPrice, color: colors.primary}}>{product.price_range}</p>
                        )}
                      </div>
                    </Link>
                    <Button 
                      onClick={() => handleAddToCart(product)} 
                      style={{...styles.addToCartBtn, background: colors.primary}}
                    >
                      Sepete Ekle
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        {settings?.about_description && (
          <section id="about" style={styles.aboutSection}>
            <div style={styles.container}>
              <div style={styles.aboutGrid}>
                {settings.about_image_url && (
                  <div style={styles.aboutImage}>
                    <img src={settings.about_image_url} alt="Hakkımızda" style={styles.aboutImg} />
                  </div>
                )}
                <div style={styles.aboutContent}>
                  <h2 style={styles.sectionTitle}>
                    {settings.about_title || 'Hakkımızda'}
                  </h2>
                  <p style={styles.aboutText}>{settings.about_description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" style={styles.contactSection}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>İletişime Geçin</h2>
              <p style={styles.sectionSubtitle}>Size nasıl yardımcı olabiliriz?</p>
            </div>
            <div style={styles.contactGrid}>
              {settings?.company_address && (
                <div style={styles.contactCard}>
                  <div style={{...styles.contactIcon, background: colors.primary}}>
                    <MapPin size={24} color="white" />
                  </div>
                  <h3 style={styles.contactCardTitle}>Adres</h3>
                  <p style={styles.contactCardText}>{settings.company_address}</p>
                </div>
              )}
              {settings?.company_phone && (
                <div style={styles.contactCard}>
                  <div style={{...styles.contactIcon, background: colors.primary}}>
                    <Phone size={24} color="white" />
                  </div>
                  <h3 style={styles.contactCardTitle}>Telefon</h3>
                  <p style={styles.contactCardText}>{settings.company_phone}</p>
                </div>
              )}
              {settings?.company_email && (
                <div style={styles.contactCard}>
                  <div style={{...styles.contactIcon, background: colors.primary}}>
                    <Mail size={24} color="white" />
                  </div>
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
                <p style={styles.footerDesc}>Profesyonel teklif yönetim platformu. Hızlı, güvenilir ve kolay kullanım.</p>
                <div style={styles.socialLinks}>
                  <a href="#" style={styles.socialIcon}>📘</a>
                  <a href="#" style={styles.socialIcon}>🐦</a>
                  <a href="#" style={styles.socialIcon}>💼</a>
                  <a href="#" style={styles.socialIcon}>📷</a>
                </div>
              </div>
              
              <div style={styles.footerSection}>
                <h4 style={styles.footerHeading}>Sayfalar</h4>
                <Link to="/urunler" style={styles.footerLink}>Ürünler</Link>
                <Link to="/ozellikler" style={styles.footerLink}>Özellikler</Link>
                <Link to="/hakkimizda" style={styles.footerLink}>Hakkımızda</Link>
                <Link to="/iletisim" style={styles.footerLink}>İletişim</Link>
              </div>
              
              {settings && (
                <div style={styles.footerSection}>
                  <h4 style={styles.footerHeading}>İletişim</h4>
                  {settings.company_phone && <p style={styles.footerLink}>📞 {settings.company_phone}</p>}
                  {settings.company_email && <p style={styles.footerLink}>✉️ {settings.company_email}</p>}
                  {settings.company_address && <p style={styles.footerLink}>📍 {settings.company_address}</p>}
                </div>
              )}
              
              <div style={styles.footerSection}>
                <h4 style={styles.footerHeading}>Bülten</h4>
                <p style={styles.footerDesc}>Yeni ürünler ve fırsatlardan haberdar olun</p>
                <div style={styles.newsletterForm}>
                  <Input placeholder="Email adresiniz" style={styles.newsletterInput} />
                  <Button style={styles.newsletterBtn}>Abone Ol</Button>
                </div>
              </div>
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
  page: { 
    background: 'white',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  
  // Navbar
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    borderBottom: '1px solid #e5e7eb'
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
    padding: '0 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  },
  logoImg: {
    height: '40px',
    width: 'auto'
  },
  logoPlaceholder: {
    padding: '8px',
    borderRadius: '8px'
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'rgb(59, 183, 126)'
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  navLink: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgb(59, 183, 126)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700'
  },
  menuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#374151',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  mobileNavLink: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    ':hover': {
      background: '#f3f4f6'
    }
  },

  // Hero Section
  hero: {
    background: 'linear-gradient(135deg, rgb(59, 183, 126) 0%, rgb(47, 146, 101) 100%)',
    padding: '140px 0 80px',
    color: 'white',
    marginTop: '70px'
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    lineHeight: 1.2
  },
  heroSubtitle: {
    fontSize: '20px',
    fontWeight: '400',
    marginBottom: '32px',
    opacity: 0.9
  },
  heroActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px'
  },
  primaryButton: {
    color: 'white',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  // Features Section
  featuresSection: {
    padding: '80px 0',
    background: '#f8fafc'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '48px',
    color: '#1f2937'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr'
    }
  },
  featureCard: {
    padding: '32px',
    textAlign: 'center',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  featureIcon: {
    width: '60px',
    height: '60px',
    margin: '0 auto 16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1f2937'
  },
  featureDesc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: 1.6
  },

  // Filter Section
  filterSection: {
    padding: '32px 0',
    background: 'white',
    borderBottom: '1px solid #e5e7eb'
  },
  filters: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    maxWidth: '500px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  },
  searchInput: {
    paddingLeft: '40px',
    height: '48px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    width: '100%'
  },
  categorySelect: {
    minWidth: '200px',
    height: '48px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    padding: '0 12px',
    background: 'white'
  },

  // Products Section
  productsSection: {
    padding: '80px 0',
    background: 'white'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#6b7280',
    marginTop: '16px',
    marginBottom: '24px'
  },
  resetButton: {
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr'
    }
  },
  productCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e5e7eb'
  },
  productLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  productImage: {
    width: '100%',
    height: '200px',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '16px',
    background: '#f3f4f6'
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productInfo: {
    marginBottom: '16px'
  },
  productCategory: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'rgb(59, 183, 126)',
    textTransform: 'uppercase',
    marginBottom: '8px'
  },
  productName: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1f2937'
  },
  productDesc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '12px'
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: '700'
  },
  addToCartBtn: {
    width: '100%',
    color: 'white',
    height: '44px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  },

  // About Section
  aboutSection: {
    padding: '80px 0',
    background: '#f8fafc'
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '32px'
    }
  },
  aboutImage: {
    borderRadius: '12px',
    overflow: 'hidden'
  },
  aboutImg: {
    width: '100%',
    height: 'auto',
    borderRadius: '12px'
  },
  aboutContent: {
    padding: '0 20px'
  },
  aboutText: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: 1.8
  },

  // Contact Section
  contactSection: {
    padding: '80px 0',
    background: 'white'
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '48px'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '20px'
    }
  },
  contactCard: {
    padding: '32px',
    textAlign: 'center',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  contactIcon: {
    width: '60px',
    height: '60px',
    margin: '0 auto 16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contactCardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1f2937'
  },
  contactCardText: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: 1.6
  },

  // Footer
  footer: {
    background: '#1f2937',
    color: 'white',
    padding: '60px 0 20px'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '48px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '32px'
    }
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  footerTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  footerDesc: {
    fontSize: '14px',
    color: '#9ca3af'
  },
  footerHeading: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  footerLink: {
    fontSize: '14px',
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    ':hover': {
      color: 'rgb(59, 183, 126)'
    }
  },
  footerBottom: {
    paddingTop: '20px',
    borderTop: '1px solid #374151'
  },
  footerCopy: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#9ca3af'
  },
  socialLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  socialIcon: {
    fontSize: '20px',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'scale(1.2)'
    }
  },
  newsletterForm: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  newsletterInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #374151',
    background: '#374151',
    color: 'white',
    fontSize: '14px'
  },
  newsletterBtn: {
    padding: '8px 16px',
    background: 'rgb(59, 183, 126)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  // Loading
  loadingScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'white'
  },
  loadingSpinner: {
    textAlign: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f4f6',
    borderTop: '3px solid rgb(59, 183, 126)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  }
};

export default HomePage;