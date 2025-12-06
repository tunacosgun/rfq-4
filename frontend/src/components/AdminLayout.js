import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  Package as PackageIcon,
  FileText,
  LogOut,
  FolderOpen,
  Menu,
  X,
  Bell,
  Settings,
  Users,
  Mail,
  Shield,
  Tag,
  Truck,
  Palette,
  Globe,
} from 'lucide-react';
import { Button } from './ui/button';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // route değişince mobile sidebar kapansın
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/kategoriler', label: 'Kategoriler', icon: FolderOpen },
    { path: '/admin/urunler', label: 'Ürünler', icon: PackageIcon },
    { path: '/admin/teklifler', label: 'Teklifler', icon: FileText },
    { path: '/admin/mesajlar', label: 'İletişim Mesajları', icon: Mail },
    { path: '/admin/markalar', label: 'Markalar', icon: Tag },
    { path: '/admin/kampanyalar', label: 'Kampanyalar', icon: Bell },
    { path: '/admin/araclar', label: 'Araçlar', icon: Truck },
    { path: '/admin/musteriler', label: 'Müşteriler', icon: Users },
    { path: '/admin/ziyaretciler', label: 'Ziyaretçiler', icon: Globe },
    { path: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
    { path: '/admin/guvenlik', label: 'Güvenlik', icon: Shield },
    { path: '/admin/renkler', label: 'Renk Yönetimi', icon: Palette },
  ];

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.appShell}>
      {/* Üst Admin Bar */}
      <header style={styles.topbar}>
        <div style={styles.topbarInner}>
          <div style={styles.topbarLeft}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={styles.menuButton}
              className="admin-mobile-menu-btn"
            >
              <Menu size={22} />
            </button>
            <div style={styles.brandArea}>
              <span style={styles.brandLogo}>Ö</span>
              <div>
                <div style={styles.brandTitle}>Özmen Gıda</div>
                <div style={styles.brandSubtitle}>Yönetim Paneli</div>
              </div>
            </div>
          </div>

          <div style={styles.topbarRight}>
            <div style={styles.adminInfo}>
              <div style={styles.adminAvatar}>
                {(admin?.username || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={styles.adminName}>{admin?.username || 'Admin'}</div>
                <div style={styles.adminRole}>Sistem Yöneticisi</div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              style={styles.logoutButton}
              data-testid="logout-button"
            >
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar + İçerik */}
      <div style={styles.layoutBody}>
        {/* Masaüstü Sidebar */}
        <aside style={styles.sidebar} className="admin-sidebar-desktop">
          <SidebarContent
            menuItems={menuItems}
            isActive={isActive}
            admin={admin}
          />
        </aside>

        {/* Mobil Sidebar Overlay */}
        {sidebarOpen && (
          <div
            style={styles.mobileOverlay}
            onClick={() => setSidebarOpen(false)}
            className="admin-sidebar-overlay"
          />
        )}

        {/* Mobil Sidebar */}
        <aside
          style={{
            ...styles.sidebar,
            ...styles.sidebarMobile,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
          className="admin-sidebar-mobile"
        >
          <div style={styles.mobileSidebarHeader}>
            <div style={styles.brandArea}>
              <span style={styles.brandLogo}>Ö</span>
              <div>
                <div style={styles.brandTitle}>Özmen Gıda</div>
                <div style={styles.brandSubtitle}>Admin Panel</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={styles.closeSidebarBtn}
            >
              <X size={20} />
            </button>
          </div>
          <SidebarContent
            menuItems={menuItems}
            isActive={isActive}
            admin={admin}
            compact
          />
          <div style={{ padding: '16px 20px' }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              style={{ ...styles.logoutButton, width: '100%' }}
            >
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </Button>
          </div>
        </aside>

        {/* Ana içerik */}
        <main style={styles.main}>
          <div style={styles.mainInner}>{children}</div>
        </main>
      </div>

      {/* Responsive inline CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar-desktop {
            display: none !important;
          }
          .admin-mobile-menu-btn {
            display: inline-flex !important;
          }
        }

        @media (min-width: 1025px) {
          .admin-sidebar-mobile {
            display: none !important;
          }
          .admin-sidebar-overlay {
            display: none !important;
          }
          .admin-mobile-menu-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .admin-main-inner {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

const SidebarContent = ({ menuItems, isActive, compact = false }) => {
  return (
    <div style={styles.sidebarInner}>
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
              }}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {!compact && (
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarFooterText}>© {new Date().getFullYear()} Özmen Gıda</div>
          <div style={styles.sidebarFooterSub}>Yönetim Paneli</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  appShell: {
    minHeight: '100vh',
    background: '#F4F6FA',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    background: 'white',
    borderBottom: '1px solid #E5E7EB',
  },
  topbarInner: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 20px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuButton: {
    border: 'none',
    background: 'white',
    borderRadius: '999px',
    padding: '8px',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    cursor: 'pointer',
  },
  brandArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #221E91, #E06C1B)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '800',
    fontSize: '16px',
  },
  brandTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#6B7280',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  adminAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    background: '#EEF2FF',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  adminName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  adminRole: {
    fontSize: '12px',
    color: '#6B7280',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderColor: '#EF4444',
    color: '#EF4444',
    paddingInline: '12px',
    height: '36px',
  },
  layoutBody: {
    display: 'flex',
    flex: 1,
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
  },
  sidebar: {
    width: '260px',
    background: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 20,
  },
  sidebarMobile: {
    position: 'fixed',
    top: 64,
    left: 0,
    height: 'calc(100vh - 64px)',
    transition: 'transform 0.25s ease',
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
  },
  sidebarInner: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  nav: {
    flex: 1,
    padding: '16px 0',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    background: '#EEF2FF',
    color: '#4F46E5',
    borderRight: '3px solid #4F46E5',
  },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #E5E7EB',
  },
  sidebarFooterText: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  sidebarFooterSub: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px',
  },
  mobileOverlay: {
    position: 'fixed',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 15,
  },
  mobileSidebarHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeSidebarBtn: {
    border: 'none',
    background: 'transparent',
    borderRadius: '999px',
    padding: '6px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  mainInner: {
    padding: '24px',
  },
};

export default AdminLayout;