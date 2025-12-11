// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Home, Package, Info, Mail, Tag } from 'lucide-react';
import { useQuoteCart } from '../context/QuoteCartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { toast } from 'sonner';

const ModernHeader = ({ settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getCartCount } = useQuoteCart();
  const { customer, logout, isAuthenticated } = useCustomerAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Route değişince drawer kapansın
    setIsDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Drawer açıkken body scroll kilitle
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/');
  };

  const menuItems = [
    { path: '/', label: settings?.header_menu_home || 'Ana Sayfa', icon: Home },
    { path: '/urunler', label: settings?.header_menu_products || 'Ürünler', icon: Package },
    { path: '/markalar', label: 'Markalar', icon: Tag },
    { path: '/hakkimizda', label: settings?.header_menu_about || 'Hakkımızda', icon: Info },
    { path: '/iletisim', label: settings?.header_menu_contact || 'İletişim', icon: Mail },
  ];

  // Add online catalog if URL is provided
  if (settings?.catalog_pdf_url) {
    menuItems.splice(2, 0, {
      path: settings.catalog_pdf_url,
      label: 'Online Katalog',
      icon: Package,
      isExternal: true
    });
  }

  const headerBgColor = settings?.header_bg_color || '#FFFFFF';
  const primaryColor = settings?.header_link_active_color || '#e06c1b';
  const cartBgColor = settings?.header_cart_button_bg || '#E06C1B';
  const cartText = settings?.header_cart_button_text || 'Sepet';

  return (
    <>
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: isScrolled ? (settings?.header_scrolled_bg_color || 'rgba(255, 255, 255, 0.98)') : headerBgColor,
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '70px',
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
              }}
            >
              {settings?.header_logo_url && (
                <img
                  src={settings.header_logo_url}
                  alt="Logo"
                  style={{
                    height: '40px',
                    maxHeight: '40px',
                    width: 'auto',
                    maxWidth: '120px',
                    objectFit: 'contain',
                  }}
                />
              )}
              {settings?.header_company_name && (
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: primaryColor,
                  }}
                >
                  {settings.header_company_name}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav
              style={{
                display: 'none',
                gap: '32px',
                alignItems: 'center',
              }}
              className="desktop-nav"
            >
              {menuItems.map((item) => {
                const linkStyle = {
                  fontSize: '15px',
                  fontWeight: isActive(item.path) ? '600' : '500',
                  color: isActive(item.path) ? primaryColor : (settings?.header_link_color || '#374151'),
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  borderBottom: isActive(item.path) ? `2px solid ${primaryColor}` : 'none',
                  paddingBottom: '4px',
                };

                return item.isExternal ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = primaryColor)}
                    onMouseLeave={(e) => (e.target.style.color = settings?.header_link_color || '#374151')}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = primaryColor)}
                    onMouseLeave={(e) =>
                      (e.target.style.color = isActive(item.path) ? primaryColor : (settings?.header_link_color || '#374151'))
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Cart Button */}
              <Link
                to="/teklif-sepeti"   // 🔴 ÖNEMLİ: /sepet değil, /teklif-sepeti
                style={{
                  position: 'relative',
                  background: cartBgColor,
                  color: settings?.header_cart_button_text_color || 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <ShoppingCart size={18} />
                <span className="cart-text">{cartText}</span>
                {getCartCount() > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#DC2626',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Menu - Desktop */}
              <div className="desktop-user-menu" style={{ display: 'none' }}>
                {isAuthenticated && customer ? (
                  <Link
                    to="/musteri-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      border: `1px solid ${primaryColor}`,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: primaryColor,
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    <User size={16} />
                    {customer.name}
                  </Link>
                ) : (
                  <Link
                    to="/musteri-giris"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      border: `1px solid ${primaryColor}`,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: primaryColor,
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    <User size={16} />
                    Müşteri Girişi
                  </Link>
                )}
              </div>

              {/* Hamburger Menu - Mobile */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="mobile-menu-button"
                aria-label="Open menu"
              >
                <Menu size={28} color={primaryColor} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1100,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isDrawerOpen ? 0 : '-100%',
          width: '320px',
          maxWidth: '85vw',
          height: '100vh',
          background: '#1F2937',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
          zIndex: 1200,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close menu"
        >
          <X size={24} color="white" />
        </button>

        {/* User Info */}
        {isAuthenticated && customer && (
          <div
            style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              marginBottom: '24px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '700',
                }}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                  {customer.name}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '13px' }}>{customer.email}</div>
              </div>
            </div>
            <Link
              to="/musteri-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: primaryColor,
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                justifyContent: 'center',
              }}
            >
              <User size={16} />
              Panelim
            </Link>
          </div>
        )}

        {/* Menu Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const itemStyle = {
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              color: isActive(item.path) ? 'white' : '#D1D5DB',
              background: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.2s',
            };
            
            const LinkComponent = item.isExternal ? 'a' : Link;
            const linkProps = item.isExternal 
              ? { href: item.path, target: '_blank', rel: 'noopener noreferrer' }
              : { to: item.path };
            
            return (
              <LinkComponent
                key={item.path}
                {...linkProps}
                style={itemStyle}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#D1D5DB';
                  }
                }}
              >
                <Icon size={22} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <Link
          to="/sepet"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            background: cartBgColor,
            color: '#FFFFFF',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '700',
            marginTop: '24px',
          }}
        >
          <ShoppingCart size={20} color="#FFFFFF" />
          <span style={{ color: '#FFFFFF' }}>{cartText}</span>
        </Link>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#EF4444',
              fontSize: '15px',
              fontWeight: '600',
              marginTop: '16px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        )}

        {/* Login Link */}
        {!isAuthenticated && (
          <Link
            to="/musteri-giris"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              marginTop: '24px',
            }}
          >
            <User size={18} />
            Müşteri Girişi
          </Link>
        )}
      </div>

      {/* Responsive Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-user-menu {
            display: block !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .cart-text {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          header img[alt="Logo"] {
            height: 32px !important;
            max-height: 32px !important;
            max-width: 100px !important;
          }
          
          header span {
            font-size: 13px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ModernHeader;