import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Package, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
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

      setStats({
        totalProducts: products.length,
        totalQuotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'beklemede').length,
        approvedQuotes: quotes.filter(q => q.status === 'onaylandi').length,
        rejectedQuotes: quotes.filter(q => q.status === 'reddedildi').length,
      });

      setRecentQuotes(quotes.slice(0, 5));
    } catch (error) {
      toast.error('Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      beklemede: { label: 'Beklemede', color: '#FDC040', icon: Clock },
      onaylandi: { label: 'Onaylanдı', color: '#3BB77E', icon: CheckCircle },
      reddedildi: { label: 'Reddedildi', color: '#FF6B6B', icon: XCircle },
    };
    const config = statusMap[status] || statusMap.beklemede;
    const Icon = config.icon;
    return (
      <span style={{ ...styles.statusBadge, background: `${config.color}20`, color: config.color }}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="admin-dashboard">
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Genel sistem özeti ve son teklifler</p>

        <div style={styles.statsGrid}>
          <div style={styles.statCard} className="card">
            <div style={styles.statIcon} className="bg-blue">
              <Package size={28} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <p style={styles.statLabel}>Toplam Ürün</p>
              <p style={styles.statValue}>{stats.totalProducts}</p>
            </div>
          </div>

          <div style={styles.statCard} className="card">
            <div style={styles.statIcon} className="bg-green">
              <FileText size={28} style={{ color: '#3BB77E' }} />
            </div>
            <div>
              <p style={styles.statLabel}>Toplam Teklif</p>
              <p style={styles.statValue}>{stats.totalQuotes}</p>
            </div>
          </div>

          <div style={styles.statCard} className="card">
            <div style={styles.statIcon} className="bg-yellow">
              <Clock size={28} style={{ color: '#FDC040' }} />
            </div>
            <div>
              <p style={styles.statLabel}>Bekleyen</p>
              <p style={styles.statValue}>{stats.pendingQuotes}</p>
            </div>
          </div>

          <div style={styles.statCard} className="card">
            <div style={styles.statIcon} className="bg-success">
              <CheckCircle size={28} style={{ color: '#10B981' }} />
            </div>
            <div>
              <p style={styles.statLabel}>Onaylanan</p>
              <p style={styles.statValue}>{stats.approvedQuotes}</p>
            </div>
          </div>
        </div>

        <div className="card" style={styles.recentSection}>
          <h2 style={styles.sectionTitle}>Son Teklifler</h2>
          {recentQuotes.length === 0 ? (
            <p style={styles.emptyText}>Henüz teklif bulunmuyor</p>
          ) : (
            <div style={styles.quotesList}>
              {recentQuotes.map((quote) => (
                <div key={quote.id} style={styles.quoteItem}>
                  <div style={styles.quoteInfo}>
                    <p style={styles.quoteName}>{quote.customer_name}</p>
                    <p style={styles.quoteEmail}>{quote.email}</p>
                  </div>
                  <div style={styles.quoteDetails}>
                    <p style={styles.quoteItems}>{quote.items.length} ürün</p>
                    {getStatusBadge(quote.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#253D4E',
    marginBottom: '8px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7E7E7E',
    marginBottom: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
  },
  statIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '14px',
    color: '#7E7E7E',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#253D4E',
  },
  recentSection: {
    padding: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#253D4E',
    marginBottom: '24px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#7E7E7E',
  },
  quotesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  quoteItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#F4F6FA',
    borderRadius: '8px',
  },
  quoteInfo: {
    flex: 1,
  },
  quoteName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#253D4E',
    marginBottom: '4px',
  },
  quoteEmail: {
    fontSize: '14px',
    color: '#7E7E7E',
  },
  quoteDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  quoteItems: {
    fontSize: '14px',
    color: '#7E7E7E',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default AdminDashboard;