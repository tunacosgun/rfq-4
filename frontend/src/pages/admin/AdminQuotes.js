import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { FileText, Clock, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminQuotes = () => {
  const { getAuthHeader } = useAdminAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  const fetchQuotes = async () => {
    try {
      const url = filter ? `${API}/quotes?status_filter=${filter}` : `${API}/quotes`;
      const response = await axios.get(url, { headers: getAuthHeader() });
      setQuotes(response.data);
    } catch (error) {
      toast.error('Teklifler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`${API}/quotes/${quoteId}`, { headers: getAuthHeader() });
      toast.success('Teklif başarıyla silindi');
      fetchQuotes();
    } catch (error) {
      toast.error('Teklif silinemedi');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      beklemede: { label: 'Beklemede', color: '#FDC040', icon: Clock },
      onaylandi: { label: 'Onaylandı', color: '#3BB77E', icon: CheckCircle },
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
        <div className="loading"><div className="spinner"></div></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="admin-quotes-page">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Teklifler</h1>
            <p style={styles.subtitle}>Gelen teklifleri yönetin ve durumlarını güncelleyin</p>
          </div>
        </div>

        <div style={styles.filters}>
          <button
            onClick={() => setFilter('')}
            style={{
              ...styles.filterButton,
              ...(filter === '' ? styles.filterButtonActive : {}),
            }}
            data-testid="filter-all"
          >
            Tümü ({quotes.length})
          </button>
          <button
            onClick={() => setFilter('beklemede')}
            style={{
              ...styles.filterButton,
              ...(filter === 'beklemede' ? styles.filterButtonActive : {}),
            }}
            data-testid="filter-pending"
          >
            Beklemede
          </button>
          <button
            onClick={() => setFilter('onaylandi')}
            style={{
              ...styles.filterButton,
              ...(filter === 'onaylandi' ? styles.filterButtonActive : {}),
            }}
            data-testid="filter-approved"
          >
            Onaylanış
          </button>
          <button
            onClick={() => setFilter('reddedildi')}
            style={{
              ...styles.filterButton,
              ...(filter === 'reddedildi' ? styles.filterButtonActive : {}),
            }}
            data-testid="filter-rejected"
          >
            Reddedilen
          </button>
        </div>

        {quotes.length === 0 ? (
          <div style={styles.empty}>
            <FileText size={64} style={{ color: '#7E7E7E' }} />
            <p style={styles.emptyText}>Teklif bulunamadı</p>
          </div>
        ) : (
          <div className="card" style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Müşteri</th>
                  <th style={styles.tableHeader}>Firma</th>
                  <th style={styles.tableHeader}>İletişim</th>
                  <th style={styles.tableHeader}>Ürün Sayısı</th>
                  <th style={styles.tableHeader}>Durum</th>
                  <th style={styles.tableHeader}>Tarih</th>
                  <th style={styles.tableHeader}></th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} style={styles.tableRow} data-testid={`quote-row-${quote.id}`}>
                    <td style={styles.tableCell}>
                      <p style={styles.customerName}>{quote.customer_name}</p>
                    </td>
                    <td style={styles.tableCell}>
                      <p style={styles.companyName}>{quote.company || '-'}</p>
                    </td>
                    <td style={styles.tableCell}>
                      <p style={styles.contactInfo}>{quote.email}</p>
                      {quote.phone && <p style={styles.contactInfo}>{quote.phone}</p>}
                    </td>
                    <td style={styles.tableCell}>
                      <p style={styles.itemCount}>{quote.items.length} çeşit</p>
                    </td>
                    <td style={styles.tableCell}>{getStatusBadge(quote.status)}</td>
                    <td style={styles.tableCell}>
                      <p style={styles.dateText}>
                        {new Date(quote.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </td>
                    <td style={styles.tableCell}>
                      <Link to={`/admin/teklifler/${quote.id}`}>
                        <Button variant="outline" size="sm" data-testid={`view-quote-${quote.id}`}>
                          <Eye size={16} style={{ marginRight: '6px' }} />
                          Görüntüle
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  header: { marginBottom: '32px' },
  title: { fontSize: '36px', fontWeight: '700', color: '#253D4E', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' },
  subtitle: { fontSize: '16px', color: '#7E7E7E' },
  filters: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  filterButton: { padding: '10px 20px', border: '2px solid #ececec', background: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#7E7E7E', cursor: 'pointer', transition: 'all 0.2s' },
  filterButtonActive: { borderColor: '#3BB77E', color: '#3BB77E', background: '#F0FDF4' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyText: { fontSize: '18px', color: '#7E7E7E', marginTop: '16px' },
  tableCard: { padding: '0', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeaderRow: { background: '#F4F6FA' },
  tableHeader: { padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#253D4E', borderBottom: '2px solid #ececec' },
  tableRow: { borderBottom: '1px solid #ececec', transition: 'background 0.2s' },
  tableCell: { padding: '16px', fontSize: '14px', color: '#7E7E7E' },
  customerName: { fontSize: '15px', fontWeight: '600', color: '#253D4E' },
  companyName: { fontSize: '14px', color: '#7E7E7E' },
  contactInfo: { fontSize: '13px', color: '#7E7E7E', lineHeight: '1.6' },
  itemCount: { fontSize: '14px', fontWeight: '600', color: '#253D4E' },
  dateText: { fontSize: '14px', color: '#7E7E7E' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' },
};

export default AdminQuotes;