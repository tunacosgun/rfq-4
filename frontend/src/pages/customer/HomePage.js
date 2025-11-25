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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart, getCartCount } = useQuoteCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
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
          <Link to="/" style={styles.logo}>
            <Package size={32} />
            <span style={styles.logoText}>Teklif Sistemi</span>
          </Link>
          <Link to="/teklif-sepeti" style={styles.cartButton} data-testid="cart-button">
            <ShoppingCart size={24} />
            {getCartCount() > 0 && (
              <span style={styles.cartBadge} data-testid="cart-count">{getCartCount()}</span>
            )}
          </Link>
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
          <p style={styles.footerText}>© 2025 Teklif Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  header: {
    background: 'white',
    borderBottom: '1px solid #ececec',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
  cartButton: {
    position: 'relative',
    padding: '10px',
    color: '#253D4E',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  cartBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: '#FF6B6B',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
  },
  hero: {
    background: 'linear-gradient(135deg, #3BB77E 0%, #2a9d67 100%)',
    padding: '80px 0',
    color: 'white',
  },
  heroContent: {
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '16px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  heroSubtitle: {
    fontSize: '20px',
    opacity: 0.95,
  },
  filtersSection: {
    padding: '32px 0',
    background: '#F4F6FA',
  },
  filters: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    minWidth: '300px',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#7E7E7E',
  },
  searchInput: {
    paddingLeft: '48px',
  },
  categorySelect: {
    minWidth: '200px',
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
    background: '#253D4E',
    color: 'white',
    padding: '32px 0',
    marginTop: '64px',
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.8,
  },
};

export default HomePage;