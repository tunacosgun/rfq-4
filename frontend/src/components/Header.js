import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Award, User, LogOut } from 'lucide-react';
import { useQuoteCart } from '../context/QuoteCartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'sonner';

const Header = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getCartCount } = useQuoteCart();
  const { customer, logout, isAuthenticated } = useCustomerAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Get colors from settings or use defaults
  const headerBgColor = settings?.header_bg_color || '#FFFFFF';
  const headerScrolledBgColor = settings?.header_scrolled_bg_color || 'rgba(255, 255, 255, 0.98)';
  const headerLinkColor = settings?.header_link_color || '#374151';
  const headerLinkActiveColor = settings?.header_link_active_color || '#22C55E';
  const headerLinkHoverColor = settings?.header_link_hover_color || '#22C55E';
  const headerCartButtonBg = settings?.header_cart_button_bg || '#22C55E';
  const headerCartButtonTextColor = settings?.header_cart_button_text_color || '#FFFFFF';

  return (
    <>
      <style>{`
        .header-nav-link {
          position: relative;
          padding-bottom: 4px;
          transition: all 0.3s ease;
          color: ${headerLinkColor};
        }
        .header-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: ${headerLinkActiveColor};
          transition: width 0.3s ease;
        }
        .header-nav-link:hover {
          color: ${headerLinkHoverColor};
        }
        .header-nav-link:hover::after,
        .header-nav-link.active::after {
          width: 100%;
        }
        .header-nav-link.active {
          color: ${headerLinkActiveColor};
        }
        .header-mobile-menu {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .cart-text {
            display: none;
          }
        }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: isScrolled ? headerScrolledBgColor : headerBgColor,
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '72px'
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none'
              }}
            >
              {settings?.header_logo_url ? (
                <img
                  src={settings.header_logo_url}
                  alt="Logo"
                  style={{ height: '42px', width: 'auto' }}
                />
              ) : (
                <div
                  style={{
                    padding: '8px',
                    background: headerCartButtonBg,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Award size={26} color="white" />
                </div>
              )}
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: headerLinkActiveColor,
                  letterSpacing: '-0.5px'
                }}
              >
                {settings?.header_company_name || settings?.company_name || 'Özmen Gıda'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                alignItems: 'center'
              }}
              className="desktop-nav"
            >
              <Link
                to="/"
                className={`header-nav-link ${isActive('/') ? 'active' : ''}`}
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                {settings?.header_menu_home || 'Ana Sayfa'}
              </Link>
              <Link
                to="/urunler"
                className={`header-nav-link ${isActive('/urunler') ? 'active' : ''}`}
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                {settings?.header_menu_products || 'Ürünler'}
              </Link>
              <Link
                to="/hakkimizda"
                className={`header-nav-link ${isActive('/hakkimizda') ? 'active' : ''}`}
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                {settings?.header_menu_about || 'Hakkımızda'}
              </Link>
              <Link
                to="/iletisim"
                className={`header-nav-link ${isActive('/iletisim') ? 'active' : ''}`}
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                {settings?.header_menu_contact || 'İletişim'}
              </Link>
            </div>

            {/* Cart, Customer Login/Badge & Mobile Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Customer Login or User Badge */}
              {isAuthenticated && customer ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="desktop-nav"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: headerCartButtonBg,
                      color: headerCartButtonTextColor,
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: headerCartButtonTextColor,
                        color: headerCartButtonBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{customer.name.split(' ')[0]}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 998,
                        }}
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          right: 0,
                          background: 'white',
                          borderRadius: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          minWidth: '200px',
                          zIndex: 999,
                          overflow: 'hidden',
                        }}
                      >
                        <Link
                          to="/musteri-panel"
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            color: '#374151',
                            textDecoration: 'none',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F3F4F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <User size={18} />
                          <span style={{ fontWeight: '500' }}>Panelim</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            toast.success('Çıkış yapıldı');
                            navigate('/');
                            setShowUserMenu(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            color: '#DC2626',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            borderTop: '1px solid #E5E7EB',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FEE2E2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <LogOut size={18} />
                          <span style={{ fontWeight: '500' }}>Çıkış Yap</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/musteri-giris"
                  className="desktop-nav"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    border: `2px solid ${headerCartButtonBg}`,
                    color: headerCartButtonBg,
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = headerCartButtonBg;
                    e.currentTarget.style.color = headerCartButtonTextColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = headerCartButtonBg;
                  }}
                >
                  Müşteri Girişi
                </Link>
              )}
              
              <Link
                to="/teklif-sepeti"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  background: headerCartButtonBg,
                  color: headerCartButtonTextColor,
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 2px 8px ${headerCartButtonBg}33`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${headerCartButtonBg}4D`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${headerCartButtonBg}33`;
                }}
              >
                <ShoppingCart size={20} />
                <span className="cart-text">{settings?.header_cart_button_text || 'Sepet'}</span>
                {getCartCount() > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#EF4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      border: '2px solid white'
                    }}
                  >
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mobile-menu-btn"
                style={{
                  display: 'none',
                  background: 'var(--gray-100)',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: headerLinkColor,
                  transition: 'all 0.2s ease'
                }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              className="header-mobile-menu"
              style={{
                padding: '20px 0',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isActive('/') ? headerLinkActiveColor : headerLinkColor,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  background: isActive('/') ? `${headerLinkActiveColor}1A` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {settings?.header_menu_home || 'Ana Sayfa'}
              </Link>
              <Link
                to="/urunler"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isActive('/urunler') ? headerLinkActiveColor : headerLinkColor,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  background: isActive('/urunler') ? `${headerLinkActiveColor}1A` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {settings?.header_menu_products || 'Ürünler'}
              </Link>
              <Link
                to="/ozellikler"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isActive('/ozellikler') ? headerLinkActiveColor : headerLinkColor,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  background: isActive('/ozellikler') ? `${headerLinkActiveColor}1A` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {settings?.header_menu_features || 'Özellikler'}
              </Link>
              <Link
                to="/hakkimizda"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isActive('/hakkimizda') ? headerLinkActiveColor : headerLinkColor,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  background: isActive('/hakkimizda') ? `${headerLinkActiveColor}1A` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {settings?.header_menu_about || 'Hakkımızda'}
              </Link>
              <Link
                to="/iletisim"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isActive('/iletisim') ? headerLinkActiveColor : headerLinkColor,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  background: isActive('/iletisim') ? `${headerLinkActiveColor}1A` : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {settings?.header_menu_contact || 'İletişim'}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
