import React, { useState } from 'react';
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
  User
} from 'lucide-react';
import { Button } from './ui/button';

const ModernAdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/kategoriler', label: 'Kategoriler', icon: FolderOpen },
    { path: '/admin/urunler', label: 'Ürünler', icon: PackageIcon },
    { path: '/admin/teklifler', label: 'Teklifler', icon: FileText },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? '280px' : '80px',
      }}>
        <div style={styles.sidebarHeader}>
          {sidebarOpen && (
            <>
              <h2 style={styles.logo}>RFQ Platform</h2>
              <p style={styles.adminBadge}>Admin Panel</p>
            </>
          )}
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              <User size={20} />
            </div>
            {sidebarOpen && (
              <div style={styles.userInfo}>
                <p style={styles.userName}>{admin?.username}</p>
                <p style={styles.userRole}>Administrator</p>
              </div>
            )}
          </div>
          <Button
            onClick={handleLogout}
            variant=\"outline\"
            style={styles.logoutButton}
            data-testid=\"logout-button\"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Çıkış</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        ...styles.main,
        marginLeft: sidebarOpen ? '280px' : '80px',
      }}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={styles.menuButton}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div style={styles.topBarRight}>
            <button style={styles.iconButton}>
              <Bell size={20} />
              <span style={styles.notificationBadge}>3</span>
            </button>
            <button style={styles.iconButton}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-secondary)',
  },
  sidebar: {
    background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    transition: 'width 0.3s ease',
    zIndex: 40,
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarHeader: {
    padding: 'var(--space-6)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 'var(--space-1)',
  },
  adminBadge: {
    fontSize: '12px',
    color: 'var(--gray-400)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  nav: {
    flex: 1,
    padding: 'var(--space-4) 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-6)',
    color: 'var(--gray-400)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all var(--transition-base)',
    borderLeft: '3px solid transparent',
  },
  navItemActive: {
    background: 'rgba(14, 165, 233, 0.1)',
    color: '#0EA5E9',
    borderLeftColor: '#0EA5E9',
  },
  sidebarFooter: {
    padding: 'var(--space-4)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3)',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 'var(--space-3)',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-full)',
    background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '2px',
  },
  userRole: {
    fontSize: '12px',
    color: 'var(--gray-400)',
  },
  logoutButton: {
    width: '100%',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    color: 'var(--gray-400)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    background: 'transparent',
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
  },
  topBar: {
    background: 'white',
    borderBottom: '1px solid var(--border-light)',
    padding: 'var(--space-4) var(--space-6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    boxShadow: 'var(--shadow-sm)',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    padding: 'var(--space-2)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background var(--transition-fast)',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
  },
  iconButton: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    padding: 'var(--space-2)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  notificationBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'var(--danger)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    borderRadius: 'var(--radius-full)',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 'var(--space-8)',
  },
};

export default ModernAdminLayout;
