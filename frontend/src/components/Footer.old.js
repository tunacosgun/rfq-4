import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Footer = ({ settings }) => {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
        color: 'white',
        paddingTop: '80px',
        paddingBottom: '32px',
        marginTop: 'auto'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
            marginBottom: '48px'
          }}
          className="footer-grid"
        >
          {/* Company Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'white'
              }}
            >
              {settings?.company_name || 'RFQ Platform'}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#9CA3AF',
                lineHeight: '1.7',
                marginBottom: '24px'
              }}
            >
              Profesyonel B2B teklif yönetim platformu. Hızlı, güvenilir ve modern çözümler sunuyoruz.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="#"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-600)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-600)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-600)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-600)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '20px',
                color: 'white'
              }}
            >
              Hızlı Erişim
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/"
                style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-400)';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/urunler"
                style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-400)';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                Ürünler
              </Link>
              <Link
                to="/ozellikler"
                style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-400)';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                Özellikler
              </Link>
              <Link
                to="/hakkimizda"
                style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-400)';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                Hakkımızda
              </Link>
              <Link
                to="/iletisim"
                style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-400)';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                İletişim
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '20px',
                color: 'white'
              }}
            >
              İletişim
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {settings?.company_phone && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Phone size={18} style={{ color: 'var(--primary-400)', marginTop: '2px' }} />
                  <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
                    {settings.company_phone}
                  </span>
                </div>
              )}
              {settings?.company_email && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Mail size={18} style={{ color: 'var(--primary-400)', marginTop: '2px' }} />
                  <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
                    {settings.company_email}
                  </span>
                </div>
              )}
              {settings?.company_address && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={18} style={{ color: 'var(--primary-400)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
                    {settings.company_address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '20px',
                color: 'white'
              }}
            >
              Bülten
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: '#9CA3AF',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}
            >
              Yeni ürünler ve kampanyalardan haberdar olmak için bültene kaydolun.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                placeholder="E-posta adresiniz"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
              <Button
                style={{
                  background: 'var(--primary-600)',
                  color: 'white',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  padding: '0 20px'
                }}
              >
                Abone Ol
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            © 2025 {settings?.company_name || 'RFQ Platform'}. Tüm hakları saklıdır.
          </p>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Made with <span style={{ color: '#EF4444' }}>❤</span> by Emergent
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
