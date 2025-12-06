import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ITEMS_PER_PAGE = 12;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useQuoteCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.filter(p => p.is_active));
      }
    } catch (error) {
      console.error('Products fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Categories fetch error:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} sepete eklendi`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
      <Header settings={settings} />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #e06c1b 0%, #f97316 100%)',
          color: 'white',
          padding: '140px 24px 80px',
          textAlign: 'center',
          marginTop: '70px',
        }}
        className="hero-section"
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
            Ürünlerimiz
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Geniş ürün yelpazemizden ihtiyacınıza uygun olanı seçin
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Categories Filter */}
          <div style={{
            marginBottom: '32px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: selectedCategory === 'all' ? '2px solid #e06c1b' : '2px solid #E5E7EB',
                background: selectedCategory === 'all' ? '#e06c1b' : 'white',
                color: selectedCategory === 'all' ? 'white' : '#6B7280',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: selectedCategory === 'all' ? '0 4px 12px rgba(224, 108, 27, 0.3)' : 'none',
              }}
            >
              Tümü ({products.length})
            </button>
            {categories.map((category) => {
              const count = products.filter(p => p.category === category.name).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: selectedCategory === category.name ? '2px solid #e06c1b' : '2px solid #E5E7EB',
                    background: selectedCategory === category.name ? '#e06c1b' : 'white',
                    color: selectedCategory === category.name ? 'white' : '#6B7280',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: selectedCategory === category.name ? '0 4px 12px rgba(224, 108, 27, 0.3)' : 'none',
                  }}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & View Controls */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  background: viewMode === 'grid' ? '#e06c1b' : 'white',
                  cursor: 'pointer',
                }}
              >
                <Grid size={20} color={viewMode === 'grid' ? 'white' : '#374151'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '10px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  background: viewMode === 'list' ? '#e06c1b' : 'white',
                  cursor: 'pointer',
                }}
              >
                <List size={20} color={viewMode === 'list' ? 'white' : '#374151'} />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '64px',
              background: 'white',
              borderRadius: '12px',
            }}>
              <Package size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: '#6B7280' }}>Ürün bulunamadı</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid'
                    ? 'repeat(auto-fill, minmax(280px, 1fr))'
                    : '1fr',
                  gap: '24px',
                }}
              >
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: viewMode === 'grid' ? 'column' : 'row',
                      height: viewMode === 'grid' ? 'auto' : 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        width: viewMode === 'grid' ? '100%' : '200px',
                        height: viewMode === 'grid' ? '220px' : '180px',
                        background: '#F9FAFB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {product.images && product.images[0] ? (
                        <img
                          src={
                            product.images[0].startsWith('http')
                              ? product.images[0]
                              : `${BACKEND_URL}${product.images[0]}`
                          }
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <Package size={56} color="#D1D5DB" />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '8px',
                        lineHeight: '1.4',
                        minHeight: '44px',
                      }}>
                        {product.name}
                      </h3>

                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {product.description}
                      </p>

                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: '#EEF2FF',
                        color: '#4F46E5',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        alignSelf: 'flex-start',
                      }}>
                        {product.category}
                      </div>

                      <Button
                        onClick={() => handleAddToCart(product)}
                        style={{
                          marginTop: 'auto',
                          width: '100%',
                          padding: '12px',
                          background: '#E06C1B',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Sepete Ekle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '48px',
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      background: 'white',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        background: currentPage === page ? '#e06c1b' : 'white',
                        color: currentPage === page ? 'white' : '#374151',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      background: 'white',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer settings={settings} />
    </div>
  );
};

export default ProductsPage;