import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Search, Filter, ArrowRight, ShoppingCart } from 'lucide-react';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useQuoteCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/settings`).catch(() => ({ data: null }))
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Yüklenıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header settings={settings} />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          color: 'white',
          padding: '140px 24px 80px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              marginBottom: '24px',
              letterSpacing: '-1px',
              lineHeight: '1.1'
            }}
          >
            Ürünlerimiz
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            Geniş ürün yelpazemizle ihtiyacınıza en uygun çözümleri keşfedin.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section style={{ background: 'white', padding: '32px 24px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)'
                }}
              />
              <Input
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '48px', height: '48px', fontSize: '16px' }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                minWidth: '220px',
                height: '48px',
                fontSize: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '0 16px',
                background: 'white',
                cursor: 'pointer'
              }}
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

      {/* Products Section */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-secondary)', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <Package size={64} color="var(--text-tertiary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Ürün Bulunamadı
              </h3>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Aramanızla eşleşen ürün bulunamadı.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                style={{ background: 'var(--primary-600)', color: 'white' }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{filteredProducts.length}</strong> ürün bulundu
                </p>
              </div>

              <div className="grid grid-4" style={{ gap: '24px' }}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="card"
                    style={{
                      padding: '0',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <Link to={`/urun/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '240px',
                          background: 'var(--gray-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Package size={56} color="var(--text-tertiary)" />
                        )}
                      </div>
                      <div style={{ padding: '24px' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'var(--primary-600)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {product.category}
                        </span>
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            margin: '8px 0 12px',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {product.name}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            marginBottom: '16px'
                          }}
                        >
                          {product.description?.substring(0, 90)}...
                        </p>
                        {product.price_range && (
                          <p
                            style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: 'var(--primary-600)',
                              marginBottom: '16px'
                            }}
                          >
                            {product.price_range}
                          </p>
                        )}
                      </div>
                    </Link>
                    <div style={{ padding: '0 24px 24px' }}>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        style={{
                          width: '100%',
                          background: 'var(--primary-600)',
                          color: 'white',
                          height: '48px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShoppingCart size={20} />
                        Sepete Ekle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
};

export default ProductsPage;
