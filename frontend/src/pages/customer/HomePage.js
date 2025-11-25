import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, Package } from 'lucide-react';
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
      toast.error('Ürünler yüklenemedi');
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="home-page">
      {/* Header */}
      <header style={styles.header}>
        <div className="container" style={styles.headerContainer}>
          {/* Logo Section */}
          <Link to="/" style={styles.logoSection}>
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" style={styles.logoImage} />
            ) : (
              <div style={styles.logoIcon}>
                <Package size={28} />
              </div>
            )}
            <div style={styles.brandInfo}>
              <span style={styles.brandName}>
                {settings?.company_name || 'Teklif Sistemi'}
              </span>
              <span style={styles.brandTagline}>Profesyonel Teklif Platformu</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav style={styles.nav}>
            <Link to="/" style={styles.navLink}>Ana Sayfa</Link>
            <a href="#urunler" style={styles.navLink}>Ürünler</a>
            <a href="#hakkimizda" style={styles.navLink}>Hakkımızda</a>
            {settings?.company_email && (
              <a href={`mailto:${settings.company_email}`} style={styles.navLink}>İletişim</a>
            )}
          </nav>

          {/* Actions */}
          <div style={styles.headerActions}>
            <Link to="/teklif-sepeti" style={styles.cartButton} data-testid="cart-button">
              <div style={styles.cartIcon}>
                <ShoppingCart size={22} />
                {getCartCount() > 0 && (
                  <span style={styles.cartBadge} data-testid="cart-count">{getCartCount()}</span>
                )}
              </div>
              <span style={styles.cartText}>Sepet</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Teklif Alın, Kazanın</h1>
          <p style={styles.heroSubtitle}>
            Ürünlerimizi inceleyin, ihtiyacınıza uygun teklifler alın
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section style={styles.filtersSection}>
        <div className="container">
          <div style={styles.filters}>
            <div style={styles.searchBox}>
              <Search style={styles.searchIcon} size={20} />
              <Input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                data-testid="search-input"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.categorySelect}
              data-testid="category-filter"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={styles.productsSection}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <Package size={64} style={{ color: '#7E7E7E' }} />
              <p style={styles.emptyText}>Ürün bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-4">
              {filteredProducts.map((product) => (
                <div key={product.id} style={styles.productCard} className="card" data-testid={`product-card-${product.id}`}>
                  <Link to={`/urun/${product.id}`} style={styles.productLink}>
                    <div style={styles.productImage}>
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={styles.productImg}
                        />
                      ) : (
                        <div style={styles.placeholderImage}>
                          <Package size={48} style={{ color: '#7E7E7E' }} />
                        </div>
                      )}
                    </div>
                    <div style={styles.productInfo}>
                      <span style={styles.productCategory}>{product.category}</span>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productDescription}>
                        {product.description.substring(0, 80)}...
                      </p>
                      {product.price_range && (
                        <p style={styles.priceRange}>{product.price_range}</p>
                      )}
                    </div>
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    style={styles.addButton}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    Sepete Ekle
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>
                {settings?.company_name || 'Teklif Sistemi'}
              </h3>
              <p style={styles.footerDesc}>
                Profesyonel teklif yönetim platformu
              </p>
            </div>

            {settings && (
              <>
                <div style={styles.footerSection}>
                  <h4 style={styles.footerHeading}>İletişim</h4>
                  {settings.company_address && (
                    <p style={styles.footerLink}>📍 {settings.company_address}</p>
                  )}
                  {settings.company_phone && (
                    <p style={styles.footerLink}>📞 {settings.company_phone}</p>
                  )}
                  {settings.company_email && (
                    <p style={styles.footerLink}>✉️ {settings.company_email}</p>
                  )}
                </div>

                <div style={styles.footerSection}>
                  <h4 style={styles.footerHeading}>Bilgiler</h4>
                  {settings.company_website && (
                    <a href={settings.company_website} style={styles.footerLink} target="_blank" rel="noopener noreferrer">
                      🌐 Website
                    </a>
                  )}
                  {settings.tax_number && (
                    <p style={styles.footerLink}>🏢 Vergi No: {settings.tax_number}</p>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div style={styles.footerBottom}>
            <p style={styles.footerText}>
              © 2025 {settings?.company_name || 'Teklif Sistemi'}. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  logoImage: {
    height: '48px',
    width: 'auto',
    objectFit: 'contain',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    lineHeight: 1,
  },
  brandTagline: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '500',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#475569',
    textDecoration: 'none',
    transition: 'all 0.2s',
    position: 'relative',
    padding: '8px 0',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
    fontWeight: '600',
  },
  cartIcon: {
    position: 'relative',
  },
  cartText: {
    fontSize: '15px',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: 'linear-gradient(135deg, #EC4899 0%, #EF4444 100%)',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    border: '2px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  hero: {
    background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    padding: '120px 0 100px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    marginBottom: '24px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    lineHeight: 1.1,
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  heroSubtitle: {
    fontSize: '22px',
    opacity: 0.95,
    fontWeight: '400',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  filtersSection: {
    padding: '40px 0',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-light)',
  },
  filters: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    minWidth: '320px',
  },
  searchIcon: {
    position: 'absolute',
    left: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)',
  },
  searchInput: {
    paddingLeft: '52px',
    height: '48px',
    borderRadius: 'var(--radius-lg)',
    border: '2px solid var(--border)',
    fontSize: '15px',
  },
  categorySelect: {
    minWidth: '220px',
    height: '48px',
    borderRadius: 'var(--radius-lg)',
    border: '2px solid var(--border)',
    fontSize: '15px',
    fontWeight: '500',
  },
  productsSection: {
    padding: '64px 0',
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  productLink: {
    textDecoration: 'none',
    color: 'inherit',
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: '240px',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '16px',
    background: '#F4F6FA',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: '12px',
    color: '#3BB77E',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '8px 0',
    color: '#253D4E',
  },
  productDescription: {
    fontSize: '14px',
    color: '#7E7E7E',
    lineHeight: '1.6',
  },
  priceRange: {
    fontSize: '16px',
    color: '#3BB77E',
    fontWeight: '600',
    marginTop: '12px',
  },
  addButton: {
    width: '100%',
    marginTop: '16px',
    background: '#3BB77E',
    color: 'white',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#7E7E7E',
    marginTop: '16px',
  },
  footer: {
    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    color: 'white',
    padding: '64px 0 24px',
    marginTop: '80px',
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '48px',
    marginBottom: '48px',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  footerDesc: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
  },
  footerHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '8px',
  },
  footerLink: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    lineHeight: '1.8',
    transition: 'color 0.2s',
  },
  footerBottom: {
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
};

export default HomePage;