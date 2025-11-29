import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Footer = ({ settings }) => {
  const footerBgColor = settings?.footer_bg_color || '#1F2937';
  const footerTextColor = settings?.footer_text_color || '#9CA3AF';
  const footerHeadingColor = settings?.footer_heading_color || '#FFFFFF';
  const footerLinkColor = settings?.footer_link_color || '#9CA3AF';
  const footerLinkHoverColor = settings?.footer_link_hover_color || '#22C55E';
  const footerDividerColor = settings?.footer_divider_color || '#374151';

  return (
    <>
      <style>{`
        .footer-link {
          color: ${footerLinkColor};
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: ${footerLinkHoverColor};
          padding-left: 8px;
        }
        .footer-social-icon {
          color: white;
          transition: all 0.3s ease;
        }
        .footer-social-icon:hover {
          background: ${footerLinkHoverColor} !important;
          transform: translateY(-3px);
        }
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

      <footer
        style={{
          background: `linear-gradient(180deg, ${footerBgColor} 0%, ${footerBgColor}E6 100%)`,
          color: footerTextColor,
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
                  color: footerHeadingColor
                }}
              >
                {settings?.company_name || 'RFQ Platform'}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: footerTextColor,
                  lineHeight: '1.7',
                  marginBottom: '24px'
                }}
              >
                {settings?.footer_company_description || 'Profesyonel B2B teklif yönetim platformu. Hızlı, güvenilir ve modern çözümler sunuyoruz.'}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {settings?.footer_facebook_url && settings.footer_facebook_url !== '#' && (
                  <a
                    href={settings.footer_facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <Facebook size={18} />
                  </a>
                )}
                {settings?.footer_twitter_url && settings.footer_twitter_url !== '#' && (
                  <a
                    href={settings.footer_twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {settings?.footer_linkedin_url && settings.footer_linkedin_url !== '#' && (
                  <a
                    href={settings.footer_linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {settings?.footer_instagram_url && settings.footer_instagram_url !== '#' && (
                  <a
                    href={settings.footer_instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <Instagram size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: footerHeadingColor
                }}
              >
                {settings?.footer_quicklinks_title || 'Hızlı Erişim'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/" className="footer-link" style={{ textDecoration: 'none' }}>
                  {settings?.footer_menu_home || 'Ana Sayfa'}
                </Link>
                <Link to="/urunler" className="footer-link" style={{ textDecoration: 'none' }}>
                  {settings?.footer_menu_products || 'Ürünler'}
                </Link>
                <Link to="/ozellikler" className="footer-link" style={{ textDecoration: 'none' }}>
                  {settings?.footer_menu_features || 'Özellikler'}
                </Link>
                <Link to="/hakkimizda" className="footer-link" style={{ textDecoration: 'none' }}>
                  {settings?.footer_menu_about || 'Hakkımızda'}
                </Link>
                <Link to="/iletisim" className="footer-link" style={{ textDecoration: 'none' }}>
                  {settings?.footer_menu_contact || 'İletişim'}
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
                  color: footerHeadingColor
                }}
              >
                {settings?.footer_contact_title || 'İletişim'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {settings?.company_phone && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Phone size={18} style={{ color: footerLinkHoverColor, marginTop: '2px' }} />
                    <span style={{ fontSize: '14px', color: footerTextColor }}>
                      {settings.company_phone}
                    </span>
                  </div>
                )}
                {settings?.company_email && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Mail size={18} style={{ color: footerLinkHoverColor, marginTop: '2px' }} />
                    <span style={{ fontSize: '14px', color: footerTextColor }}>
                      {settings.company_email}
                    </span>
                  </div>
                )}
                {settings?.company_address && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <MapPin size={18} style={{ color: footerLinkHoverColor, marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: footerTextColor, lineHeight: '1.6' }}>
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
                  color: footerHeadingColor
                }}
              >
                {settings?.footer_newsletter_title || 'Bülten'}
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  color: footerTextColor,
                  marginBottom: '16px',
                  lineHeight: '1.6'
                }}
              >
                {settings?.footer_newsletter_subtitle || 'Yeni ürünler ve kampanyalardan haberdar olmak için bültene kaydolun.'}
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
                    background: footerLinkHoverColor,
                    color: 'white',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    padding: '0 20px'
                  }}
                >
                  {settings?.footer_newsletter_button_text || 'Abone Ol'}
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              paddingTop: '32px',
              borderTop: `1px solid ${footerDividerColor}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <p style={{ fontSize: '14px', color: footerTextColor }}>
              {settings?.footer_copyright_text || `© 2025 ${settings?.company_name || 'RFQ Platform'}. Tüm hakları saklıdır.`}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
