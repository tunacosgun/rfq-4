import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Package, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { getAuthHeader } = useAdminAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    rejectedQuotes: 0,
    todayQuotes: 0,
    totalCustomers: 0
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, quotesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/quotes`, { headers: getAuthHeader() }),
      ]);

      const products = productsRes.data;
      const quotes = quotesRes.data;

      // Today's quotes
      const today = new Date().toISOString().split('T')[0];
      const todayQuotes = quotes.filter(q => q.created_at?.startsWith(today));

      // Unique customers
      const uniqueCustomers = new Set(quotes.map(q => q.email)).size;

      setStats({
        totalProducts: products.length,
        totalQuotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'beklemede').length,
        approvedQuotes: quotes.filter(q => q.status === 'onaylandi').length,
        rejectedQuotes: quotes.filter(q => q.status === 'reddedildi').length,
        todayQuotes: todayQuotes.length,
        totalCustomers: uniqueCustomers
      });

      setRecentQuotes(quotes.slice(0, 6));
    } catch (error) {
      toast.error('Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Toplam Ürün',
      value: stats.totalProducts,
      icon: Package,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      link: '/admin/urunler'
    },
    {
      title: 'Toplam Teklif',
      value: stats.totalQuotes,
      icon: FileText,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      link: '/admin/teklifler'
    },
    {
      title: 'Bekleyen',
      value: stats.pendingQuotes,
      icon: Clock,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      link: '/admin/teklifler'
    },
    {
      title: 'Onaylanan',
      value: stats.approvedQuotes,
      icon: CheckCircle,
      color: '#10B981',
      bgColor: '#D1FAE5',
      link: '/admin/teklifler'
    },
    {
      title: 'Bugün',
      value: stats.todayQuotes,
      icon: Calendar,
      color: '#EC4899',
      bgColor: '#FCE7F3',
      link: '/admin/teklifler'
    },
    {
      title: 'Müşteriler',
      value: stats.totalCustomers,
      icon: Users,
      color: '#06B6D4',
      bgColor: '#CFFAFE',
      link: '/admin/teklifler'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={styles.loading}>
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Hoş geldiniz! İşte platformunuzun genel durumu.</p>
          </div>
          <div style={styles.dateBox}>
            <Calendar size={18} color="#6B7280" />
            <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} to={card.link} style={{ textDecoration: 'none' }}>
                <div
                  className="card"
                  style={{
                    ...styles.statCard,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div style={styles.statCardContent}>
                    <div>
                      <p style={styles.statLabel}>{card.title}</p>
                      <h2 style={{ ...styles.statValue, color: card.color }}>{card.value}</h2>
                    </div>
                    <div style={{ ...styles.iconBox, background: card.bgColor }}>
                      <Icon size={28} color={card.color} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Quotes */}
        <div style={{ marginTop: '40px' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Son Teklifler</h2>
            <Link to="/admin/teklifler" style={styles.viewAllLink}>
              Tümünü Gör →
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <AlertCircle size={48} color="var(--text-tertiary)" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Henüz teklif bulunmuyor</p>
            </div>
          ) : (
            <div style={styles.quotesGrid}>
              {recentQuotes.map((quote) => (
                <Link key={quote.id} to={`/admin/teklifler/${quote.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    className="card"
                    style={{
                      padding: '24px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
                          {quote.customer_name}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{quote.email}</p>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(quote.status === 'beklemede' ? styles.statusPending : {}),
                          ...(quote.status === 'onaylandi' ? styles.statusApproved : {}),
                          ...(quote.status === 'reddedildi' ? styles.statusRejected : {})
                        }}
                      >
                        {quote.status === 'beklemede' && 'Beklemede'}
                        {quote.status === 'onaylandi' && 'Onaylandı'}
                        {quote.status === 'reddedildi' && 'Reddedildi'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {quote.items?.length || 0} ürün
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {new Date(quote.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={styles.sectionTitle}>Hızlı İşlemler</h2>
          <div style={styles.actionsGrid}>
            <Link to="/admin/urunler" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.actionCard}>
                <Package size={32} color="#3B82F6" style={{ marginBottom: '12px' }} />
                <h3 style={styles.actionTitle}>Yeni Ürün Ekle</h3>
                <p style={styles.actionDesc}>Kataloga yeni ürün ekleyin</p>
              </div>
            </Link>
            <Link to="/admin/teklifler" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.actionCard}>
                <FileText size={32} color="#8B5CF6" style={{ marginBottom: '12px' }} />
                <h3 style={styles.actionTitle}>Teklifleri Yönet</h3>
                <p style={styles.actionDesc}>Gelen teklifleri inceleyin</p>
              </div>
            </Link>
            <Link to="/admin/ayarlar" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.actionCard}>
                <TrendingUp size={32} color="#10B981" style={{ marginBottom: '12px' }} />
                <h3 style={styles.actionTitle}>Site Ayarları</h3>
                <p style={styles.actionDesc}>İçerikleri düzenleyin</p>
              </div>
            </Link>
            <Link to="/admin/renkler" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.actionCard}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                    borderRadius: '6px',
                    marginBottom: '12px'
                  }}
                />
                <h3 style={styles.actionTitle}>Renk Yönetimi</h3>
                <p style={styles.actionDesc}>Sitenin renklerini özelleştirin</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: { padding: '0' },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)'
  },
  dateBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'var(--gray-100)',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '16px'
  },
  statCard: {
    padding: '24px'
  },
  statCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    margin: 0
  },
  iconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  viewAllLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--primary-600)',
    textDecoration: 'none',
    transition: 'all 0.2s'
  },
  quotesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statusPending: {
    background: '#FEF3C7',
    color: '#D97706'
  },
  statusApproved: {
    background: '#D1FAE5',
    color: '#059669'
  },
  statusRejected: {
    background: '#FEE2E2',
    color: '#DC2626'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginTop: '20px'
  },
  actionCard: {
    padding: '28px 24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'var(--text-primary)'
  },
  actionDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5'
  }
};

export default AdminDashboard;
