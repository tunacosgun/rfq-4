import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useQuoteCart } from '../../context/QuoteCartContext';
import { Button } from '../../components/ui/button';
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
        setProducts(data.filter((p) => p.is_active));
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

  // filtre
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // sayfalama
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // AYNI (şık) LOADING
  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading-card">
          <div className="page-spinner" />
          <p className="page-loading-title">Ürünler yükleniyor</p>
          <p className="page-loading-text">Lütfen birkaç saniye bekleyin...</p>
        </div>

        <style jsx>{`
          .page-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(
                circle at top left,
                rgba(224, 108, 27, 0.06),
                transparent 55%
              ),
              radial-gradient(
                circle at bottom right,
                rgba(34, 30, 145, 0.06),
                transparent 55%
              ),
              #ffffff;
          }

          .page-loading-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px 28px;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.15);
            border: 1px solid rgba(209, 213, 219, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            min-width: 260px;
          }

          .page-spinner {
            width: 40px;
            height: 40px;
            border-radius: 999px;
            border: 3px solid rgba(34, 30, 145, 0.18);
            border-top-color: #221e91;
            animation: spin 0.9s linear infinite;
          }

          .page-loading-title {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
          }

          .page-loading-text {
            font-size: 13px;
            color: #6b7280;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Header settings={settings} />

      {/* HERO */}
      <section className="products-hero">
        <div className="products-hero-inner">
          <p className="products-hero-badge">Ürün Kataloğu</p>
          <h1 className="products-hero-title">Ürünlerimiz</h1>
          <p className="products-hero-subtitle">
            Geniş ürün yelpazemizden ihtiyacınıza uygun olanları keşfedin,
            teklif sepetinize ekleyin.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="products-main">
        <div className="products-container">
          {/* ÜST BAR: kategori chipleri + arama + görünüm */}
          <div className="products-toolbar">
            <div className="products-categories">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`cat-chip ${
                  selectedCategory === 'all' ? 'cat-chip-active' : ''
                }`}
              >
                Tümü ({products.length})
              </button>

              {categories.map((category) => {
                const count = products.filter(
                  (p) => p.category === category.name
                ).length;
                if (!count) return null;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.name)}
                    className={`cat-chip ${
                      selectedCategory === category.name
                        ? 'cat-chip-active'
                        : ''
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>

            <div className="products-actions">
              <div className="products-search">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="view-toggle">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${
                    viewMode === 'grid' ? 'view-btn-active' : ''
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${
                    viewMode === 'list' ? 'view-btn-active' : ''
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ÜRÜNLER */}
          {paginatedProducts.length === 0 ? (
            <div className="products-empty">
              <div className="products-empty-icon">
                <Package size={40} />
              </div>
              <p>Filtrelere uygun ürün bulunamadı.</p>
            </div>
          ) : (
            <>
              <div
                className={`products-grid ${
                  viewMode === 'list' ? 'products-grid-list' : ''
                }`}
              >
                {paginatedProducts.map((product) => (
                  <article
                    key={product.id}
                    className={`product-card ${
                      viewMode === 'list' ? 'product-card-list' : ''
                    }`}
                  >
                    {/* Kartın tıklanabilir kısmı -> ürün detayı */}
                    <Link
                      to={`/urun/${product.id}`}
                      className="product-main"
                    >
                      <div className="product-image-container">
                        <div className="product-image">
                          {product.images && product.images[0] ? (
                            <img
                              src={
                                product.images[0].startsWith('http')
                                  ? product.images[0]
                                  : `${BACKEND_URL}${product.images[0]}`
                              }
                              alt={product.name}
                              loading="lazy"
                              className="product-image-element"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="product-image-fallback">
                              <Package size={40} />
                            </div>
                          )}
                        </div>
                        <span className="product-tag">Tekliflik Ürün</span>
                      </div>

                      <div className="product-body">
                        <span className="product-category">
                          {product.category}
                        </span>
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-desc">
                          {product.description}
                        </p>
                      </div>
                    </Link>

                    {/* Sepete ekle butonu (linkin DIŞINDA, event bozulmasın) */}
                    <div className="product-footer">
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="product-btn"
                      >
                        Teklif Sepetine Ekle
                      </Button>
                    </div>
                  </article>
                ))}
              </div>

              {/* SAYFALAMA */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="page-arrow"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`page-btn ${
                          currentPage === page ? 'page-btn-active' : ''
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages, prev + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="page-arrow"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer settings={settings} />

      {/* STYLES */}
      <style jsx>{`
        :root {
          --primary: #221e91;
          --primary-dark: #1a1775;
          --secondary: #e06c1b;
          --secondary-light: #f97316;
          --bg-page: #f9fafb;
          --card-radius: 18px;
          --image-height: 220px;
        }

        .products-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-page);
        }

        .products-hero {
          margin-top: 72px;
          padding: 120px 24px 80px;
          background: linear-gradient(
            135deg,
            var(--secondary) 0%,
            var(--secondary-light) 100%
          );
          color: #ffffff;
          text-align: center;
        }

        .products-hero-inner {
          max-width: 960px;
          margin: 0 auto;
        }

        .products-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.12);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
        }

        .products-hero-title {
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
        }

        .products-hero-subtitle {
          font-size: 17px;
          opacity: 0.95;
          max-width: 640px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .products-hero {
            padding: 100px 16px 64px;
          }
          .products-hero-title {
            font-size: 32px;
          }
          .products-hero-subtitle {
            font-size: 15px;
          }
        }

        .products-main {
          padding: 40px 24px 56px;
          flex: 1;
        }

        .products-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .products-toolbar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 28px;
        }

        .products-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cat-chip {
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          font-size: 13px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cat-chip:hover {
          border-color: var(--secondary);
          color: var(--secondary);
        }

        .cat-chip-active {
          background: linear-gradient(
            135deg,
            var(--secondary),
            var(--secondary-light)
          );
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(224, 108, 27, 0.35);
        }

        .products-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .products-search {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 380px;
        }

        .products-search input {
          width: 100%;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          padding: 10px 14px 10px 38px;
          font-size: 14px;
          outline: none;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .products-search input:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(224, 108, 27, 0.15);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .view-toggle {
          display: flex;
          gap: 8px;
        }

        .view-btn {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          border-color: var(--secondary);
          color: var(--secondary);
        }

        .view-btn-active {
          background: var(--secondary);
          border-color: var(--secondary);
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(224, 108, 27, 0.35);
        }

        @media (max-width: 768px) {
          .products-main {
            padding: 32px 16px 48px;
          }

          .products-actions {
            align-items: stretch;
          }

          .view-toggle {
            justify-content: flex-end;
          }
        }

        .products-empty {
          background: #ffffff;
          border-radius: var(--card-radius);
          padding: 52px 24px;
          text-align: center;
          border: 1px dashed #e5e7eb;
          color: #6b7280;
        }

        .products-empty-icon {
          width: 70px;
          height: 70px;
          border-radius: 999px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #9ca3af;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .products-grid-list {
          grid-template-columns: 1fr;
        }

        .product-card {
          background: #ffffff;
          border-radius: var(--card-radius);
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.09);
          border: 1px solid rgba(229, 231, 235, 0.9);
          display: flex;
          flex-direction: column;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16);
        }

        .product-card-list {
          flex-direction: row;
          align-items: stretch;
        }

        .product-main {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          flex: 1;
        }

        .product-card-list .product-main {
          flex-direction: row;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #f9fafb,
            rgba(224, 108, 27, 0.06)
          );
        }

        .product-image {
          width: 100%;
          height: var(--image-height);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-card-list .product-image {
          width: 240px;
          min-width: 240px;
          height: 200px;
        }

        .product-image-element {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          padding: 12px;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image-element {
          transform: scale(1.05);
        }

        .product-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          padding: 16px;
        }

        .product-tag {
          position: absolute;
          left: 14px;
          top: 14px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(34, 30, 145, 0.9);
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          z-index: 2;
        }

        .product-body {
          padding: 18px 18px 10px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-card-list .product-body {
          padding: 18px 20px;
          flex: 1;
        }

        .product-category {
          display: inline-block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 700;
          color: #4f46e5;
          padding: 4px 8px;
          border-radius: 999px;
          background: #eef2ff;
          margin-bottom: 8px;
          align-self: flex-start;
        }

        .product-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .product-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
          flex: 1;
          max-height: 3.2em;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-footer {
          padding: 0 18px 18px;
          margin-top: auto;
        }

        .product-card-list .product-footer {
          padding: 18px 18px 18px 0;
          display: flex;
          align-items: center;
          margin-top: 0;
          width: 220px;
          min-width: 220px;
        }

        .product-btn {
          width: 100%;
          font-weight: 700;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          min-height: 40px;
        }

        .product-btn:hover {
          filter: brightness(1.03);
        }

        .pagination {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .page-btn,
        .page-arrow {
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          padding: 7px 13px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          min-width: 34px;
          transition: all 0.2s ease;
        }

        .page-btn-active {
          background: linear-gradient(
            135deg,
            var(--secondary),
            var(--secondary-light)
          );
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(224, 108, 27, 0.35);
        }

        .page-arrow[disabled],
        .page-btn[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-btn:not(.page-btn-active):hover,
        .page-arrow:not([disabled]):hover {
          border-color: var(--secondary);
          color: var(--secondary);
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          }

          .product-card-list {
            flex-direction: column;
          }

          .product-card-list .product-main {
            flex-direction: column;
          }

          .product-card-list .product-image {
            width: 100%;
            height: var(--image-height);
          }

          .product-card-list .product-footer {
            padding: 0 18px 18px;
            width: 100%;
            min-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          
          :root {
            --image-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;