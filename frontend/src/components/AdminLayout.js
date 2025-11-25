import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LayoutDashboard, Package as PackageIcon, FileText, LogOut, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated } = useAdminAuth();

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
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Admin Panel</h2>
          <p style={styles.adminName}>{admin?.username}</p>
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Button
          onClick={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          data-testid="logout-button"
        >
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </Button>
      </aside>

      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F4F6FA',
  },
  sidebar: {
    width: '280px',
    background: 'white',
    borderRight: '1px solid #ececec',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
  },
  sidebarHeader: {
    padding: '32px 24px',
    borderBottom: '1px solid #ececec',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#3BB77E',
    marginBottom: '8px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  adminName: {
    fontSize: '14px',
    color: '#7E7E7E',
  },
  nav: {
    flex: 1,
    padding: '24px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 24px',
    color: '#7E7E7E',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navItemActive: {
    background: '#F0FDF4',
    color: '#3BB77E',
    borderLeft: '4px solid #3BB77E',
    paddingLeft: '20px',
  },
  logoutButton: {
    margin: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    padding: '32px',
  },
};

export default AdminLayout;