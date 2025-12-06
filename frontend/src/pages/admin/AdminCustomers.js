import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, FileText, Search, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerQuotes, setCustomerQuotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/customers`, {
        headers: {
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      }
    } catch (error) {
      toast.error('Müşteriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuotes = async (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/customers/${customer.id}/quotes`,
        {
          headers: {
            Authorization: 'Basic ' + btoa('admin:admin123'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCustomerQuotes(data.quotes);
      }
    } catch (error) {
      toast.error('Teklifler yüklenemedi');
    }
  };


  const handleEditBalance = (customer) => {
    setSelectedCustomer(customer);
    setBalanceAmount(customer.balance || 0);
    setShowBalanceModal(true);
  };

  const handleUpdateBalance = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify({ balance: parseFloat(balanceAmount) }),
      });

      if (response.ok) {
        toast.success('Bakiye güncellendi');
        setShowBalanceModal(false);
        fetchCustomers();
      } else {
        toast.error('Bakiye güncellenemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setCustomerQuotes([]);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={styles.loading}>Yükleniyor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Müşteri Arşivi</h1>
            <p style={styles.subtitle}>Tüm kayıtlı müşterileri ve teklif geçmişlerini görüntüleyin</p>
          </div>
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <Search size={18} color="#6B7280" />
          <input
            type="text"
            placeholder="Müşteri ara (isim, email, şirket)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Stats */}
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <Users size={20} color="#6B7280" />
            <span style={styles.statValue}>{filteredCustomers.length}</span>
            <span style={styles.statLabel}>Toplam Müşteri</span>
          </div>
          <div style={styles.stat}>
            <FileText size={20} color="#6B7280" />
            <span style={styles.statValue}>
              {filteredCustomers.reduce((sum, c) => sum + c.quote_count, 0)}
            </span>
            <span style={styles.statLabel}>Toplam Teklif</span>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Müşteri Adı</th>
                <th style={styles.th}>E-posta</th>
                <th style={styles.th}>Şirket</th>
                <th style={styles.th}>Telefon</th>
                <th style={styles.th}>Bakiye</th>
                <th style={styles.th}>Teklif Sayısı</th>
                <th style={styles.th}>Kayıt Tarihi</th>
                <th style={styles.th}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={styles.emptyState}>
                    {searchTerm ? 'Aramanıza uygun müşteri bulunamadı' : 'Henüz kayıtlı müşteri yok'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.customerName}>
                        <div style={styles.avatar}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        {customer.name}
                      </div>
                    </td>
                    <td style={styles.td}>{customer.email}</td>
                    <td style={styles.td}>{customer.company || '-'}</td>
                    <td style={styles.td}>{customer.phone || '-'}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '4px 10px', 
                        background: '#DBEAFE', 
                        color: '#1E40AF', 
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        ₺{(customer.balance || 0).toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.quoteBadge}>{customer.quote_count}</span>
                    </td>
                    <td style={styles.td}>
                      {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleViewQuotes(customer)}
                          style={styles.viewButton}
                          title="Teklifleri Görüntüle"
                        >
                          <Eye size={16} />
                          Teklifler
                        </button>
                        <button
                          onClick={() => handleEditBalance(customer)}
                          style={{ ...styles.viewButton, background: '#F59E0B', color: 'white' }}
                          title="Bakiye Düzenle"
                        >
                          ₺
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && selectedCustomer && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {selectedCustomer.name} - Teklifler
                </h2>
                <button onClick={handleCloseModal} style={styles.closeButton}>
                  ×
                </button>
              </div>

              <div style={styles.modalBody}>
                {customerQuotes.length === 0 ? (
                  <p style={styles.noQuotes}>Bu müşteriye ait teklif bulunmuyor</p>
                ) : (
                  <div style={styles.quotesList}>
                    {customerQuotes.map((quote) => (
                      <div key={quote.id} style={styles.quoteItem}>
                        <div style={styles.quoteHeader}>
                          <span style={styles.quoteId}>#{quote.id.substring(0, 8)}</span>
                          <span style={styles.quoteDate}>
                            {new Date(quote.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div style={styles.quoteInfo}>
                          <div style={styles.statusBadge}>{quote.status}</div>
                          <span style={styles.itemCount}>{quote.items.length} ürün</span>
                        </div>
                        {quote.message && (
                          <p style={styles.quoteMessage}>{quote.message}</p>
                        )}
                        <div style={styles.quoteProducts}>

        {/* Balance Edit Modal */}
        {showBalanceModal && (
          <div style={styles.modalOverlay} onClick={() => setShowBalanceModal(false)}>
            <div style={{ ...styles.modalContent, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
                Bakiye Düzenle
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
                <strong>{selectedCustomer?.name}</strong> için bakiye belirleyin
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Bakiye (₺)
                </label>
                <input
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                  }}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setShowBalanceModal(false)}
                  variant="outline"
                  style={{ padding: '10px 20px' }}
                >
                  İptal
                </Button>
                <Button
                  onClick={handleUpdateBalance}
                  style={{ 
                    padding: '10px 20px',
                    background: '#10B981',
                    color: 'white',
                  }}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        )}

                          {quote.items.map((item, idx) => (
                            <div key={idx} style={styles.productTag}>
                              {item.product_name} (×{item.quantity})
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    maxWidth: '1600px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#7E7E7E',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7E7E7E',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: 'white',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  statsBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '16px 20px',
    background: '#F9FAFB',
    color: '#6B7280',
    fontSize: '13px',
    fontWeight: '600',
    borderBottom: '1px solid #E5E7EB',
  },
  tr: {
    borderBottom: '1px solid #E5E7EB',
  },
  td: {
    padding: '16px 20px',
    color: '#374151',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#9CA3AF',
    fontSize: '16px',
  },
  customerName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '500',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#F0FDF4',
    color: '#22C55E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  quoteBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: '#F0FDF4',
    color: '#22C55E',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#9CA3AF',
    lineHeight: '1',
  },
  modalBody: {
    padding: '24px',
  },
  noQuotes: {
    textAlign: 'center',
    padding: '40px',
    color: '#9CA3AF',
    fontSize: '16px',
  },
  quotesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  quoteItem: {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '16px',
  },
  quoteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  quoteId: {
    fontWeight: '600',
    color: '#374151',
  },
  quoteDate: {
    fontSize: '13px',
    color: '#6B7280',
  },
  quoteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  statusBadge: {
    padding: '4px 10px',
    background: '#F0FDF4',
    color: '#22C55E',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  itemCount: {
    fontSize: '13px',
    color: '#6B7280',
  },
  quoteMessage: {
    fontSize: '14px',
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: '12px',
  },
  quoteProducts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  productTag: {
    padding: '4px 10px',
    background: '#F3F4F6',
    color: '#374151',
    borderRadius: '4px',
    fontSize: '12px',
  },
};

export default AdminCustomers;
