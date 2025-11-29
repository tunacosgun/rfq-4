import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Search, Filter, ArrowRight, ShoppingCart, Star, Grid, List, Zap } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Yükleniyor...</p>
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
          background: 'linear-gradient(135deg, #221E91 0%, #1a1775 100%)',
          color: 'white',
          padding: '140px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(224, 108, 27, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            background: 'rgba(224, 108, 27, 0.15)',
            border: '1px solid rgba(224, 108, 27, 0.3)',
            borderRadius: '50px',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <Package size={18} fill="currentColor" />
            <span style={{ fontSize: '16px', fontWeight: '600' }}>
              ÜRÜN KATALOĞU
            </span>
          </div>
          
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '900',
              marginBottom: '24px',
              letterSpacing: '-1px',
              lineHeight: '1.1',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ 
              background: 'linear-gradient(135deg, #e06c1b, #f0833a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              Ürünlerimiz
            </span>
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, lineHeight: '1.6' }}>
            Geniş ürün yelpazemizle ihtiyacınıza en uygun çözümleri keşfedin.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)', 
        padding: '40px 24px', 
        borderBottom: '1px solid rgba(34, 30, 145, 0.1)' 
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }}
              />
              <Input
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  paddingLeft: '48px', 
                  height: '48px', 
                  fontSize: '16px',
                  border: '1px solid rgba(34, 30, 145, 0.2)',
                  borderRadius: '10px',
                  background: 'white'
                }}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                minWidth: '220px',
                height: '48px',
                fontSize: '16px',
                borderRadius: '10px',
                border: '1px solid rgba(34, 30, 145, 0.2)',
                padding: '0 16px',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div style={{ 
              display: 'flex', 
              border: '1px solid rgba(34, 30, 145, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'white'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '12px 16px',
                  background: viewMode === 'grid' ? '#221E91' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : '#221E91',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}
              >
                <Grid size={18} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '12px 16px',
                  background: viewMode === 'list' ? '#221E91' : 'transparent',
                  color: viewMode === 'list' ? 'white' : '#221E91',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}
              >
                <List size={18} />
                List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section style={{ padding: '80px 24px', background: 'white', flex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <Package size={64} color="#666" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '24px', color: '#221E91', marginBottom: '12px' }}>
                Ürün Bulunamadı
              </h3>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
                Aramanızla eşleşen ürün bulunamadı.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #221E91, #1a1775)',
                  color: 'white',
                  padding: '12px 24px',
                  fontWeight: '700'
                }}
              >
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '18px', color: '#666' }}>
                    <strong style={{ color: '#221E91' }}>{filteredProducts.length}</strong> ürün bulundu
                  </p>
                </div>
                
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(34, 30, 145, 0.1)',
                  color: '#221E91',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <Zap size={16} />
                  HIZLI TEKLİF AL
                </div>
              </div>

              <div className={viewMode === 'grid' ? "grid grid-4" : "list-view"} style={{ gap: '24px' }}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="card"
                    style={{
                      padding: '0',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      borderRadius: '16px',
                      border: '1px solid rgba(34, 30, 145, 0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      ...(viewMode === 'list' && {
                        display: 'flex',
                        height: '200px'
                      })
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 30, 145, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(224, 108, 27, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(34, 30, 145, 0.1)';
                    }}
                  >
                    <Link 
                      to={`/urun/${product.id}`} 
                      style={{ 
                        textDecoration: 'none', 
                        color: 'inherit',
                        ...(viewMode === 'list' && {
                          display: 'flex',
                          flex: 1
                        })
                      }}
                    >
                      <div
                        style={{
                          width: viewMode === 'grid' ? '100%' : '200px',
                          height: viewMode === 'grid' ? '240px' : '100%',
                          background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                          />
                        ) : (
                          <Package size={56} color="#221E91" />
                        )}
                      </div>
                    </Link>
                    
                    <div style={{ 
                      padding: '24px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#e06c1b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {product.category}
                        </span>
                        <h3
                          style={{
                            fontSize: viewMode === 'grid' ? '20px' : '24px',
                            fontWeight: '700',
                            margin: '8px 0 12px',
                            color: '#221E91'
                          }}
                        >
                          {product.name}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#666',
                            lineHeight: '1.6',
                            marginBottom: '16px',
                            ...(viewMode === 'list' && {
                              maxWidth: '600px'
                            })
                          }}
                        >
                          {product.description?.substring(0, viewMode === 'grid' ? 90 : 200)}...
                        </p>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}>
                        {product.price_range && (
                          <p
                            style={{
                              fontSize: '18px',
                              fontWeight: '800',
                              color: '#221E91',
                              margin: 0
                            }}
                          >
                            {product.price_range}
                          </p>
                        )}
                        
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #221E91, #1a1775)',
                            color: 'white',
                            height: '48px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0 20px',
                            minWidth: viewMode === 'grid' ? '100%' : 'auto',
                            marginTop: viewMode === 'grid' ? '16px' : '0'
                          }}
                        >
                          <ShoppingCart size={20} />
                          Sepete Ekle
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer settings={settings} />

      <style>{`
        @media (max-width: 1200px) {
          .grid-4 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 900px) {
          .grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .list-view .card {
            flex-direction: column;
            height: auto !important;
          }
          
          .list-view .card > a > div {
            width: 100% !important;
            height: 240px !important;
          }
        }
        
        @media (max-width: 600px) {
          .grid-4 {
            grid-template-columns: 1fr;
          }
        }
        
        .grid {
          display: grid;
        }
        
        .grid-4 {
          grid-template-columns: repeat(4, 1fr);
        }
        
        .list-view {
          display: flex;
          flex-direction: column;
        }
        
        .card {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;