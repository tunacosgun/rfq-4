import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    buton_yazisi: '',
    buton_linki: '',
    baslangic_tarihi: '',
    bitis_tarihi: '',
    aktif: true,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/campaigns`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      toast.error('Kampanyalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.baslik || !formData.aciklama || !formData.buton_yazisi || !formData.buton_linki) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (!formData.baslangic_tarihi || !formData.bitis_tarihi) {
      toast.error('Lütfen başlangıç ve bitiş tarihlerini girin');
      return;
    }

    // Convert dates to ISO format
    const payload = {
      ...formData,
      baslangic_tarihi: new Date(formData.baslangic_tarihi).toISOString(),
      bitis_tarihi: new Date(formData.bitis_tarihi).toISOString(),
    };

    try {
      const url = editingCampaign
        ? `${backendUrl}/api/campaigns/${editingCampaign.id}`
        : `${backendUrl}/api/campaigns`;
      
      const response = await fetch(url, {
        method: editingCampaign ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingCampaign ? 'Kampanya güncellendi' : 'Kampanya oluşturuldu');
        setShowModal(false);
        setEditingCampaign(null);
        resetForm();
        fetchCampaigns();
      } else {
        toast.error('Kampanya kaydedilemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      baslik: campaign.baslik,
      aciklama: campaign.aciklama,
      buton_yazisi: campaign.buton_yazisi,
      buton_linki: campaign.buton_linki,
      baslangic_tarihi: campaign.baslangic_tarihi ? new Date(campaign.baslangic_tarihi).toISOString().slice(0, 16) : '',
      bitis_tarihi: campaign.bitis_tarihi ? new Date(campaign.bitis_tarihi).toISOString().slice(0, 16) : '',
      aktif: campaign.aktif,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
      });

      if (response.ok) {
        toast.success('Kampanya silindi');
        fetchCampaigns();
      } else {
        toast.error('Kampanya silinemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      baslik: '',
      aciklama: '',
      buton_yazisi: '',
      buton_linki: '',
      baslangic_tarihi: '',
      bitis_tarihi: '',
      aktif: true,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCampaign(null);
    resetForm();
  };

  const isActive = (campaign) => {
    const now = new Date();
    const start = new Date(campaign.baslangic_tarihi);
    const end = new Date(campaign.bitis_tarihi);
    return campaign.aktif && now >= start && now <= end;
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
            <h1 style={styles.title}>Kampanyalar / Popup</h1>
            <p style={styles.subtitle}>Anasayfada görünecek popup kampanyalarını yönetin</p>
          </div>
          <Button onClick={() => setShowModal(true)} style={styles.addButton}>
            <Plus size={20} />
            Yeni Kampanya
          </Button>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Başlık</th>
                <th style={styles.th}>Açıklama</th>
                <th style={styles.th}>Başlangıç</th>
                <th style={styles.th}>Bitiş</th>
                <th style={styles.th}>Durum</th>
                <th style={styles.th}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>
                    Henüz kampanya eklenmemiş
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} style={styles.tr}>
                    <td style={styles.td}>{campaign.baslik}</td>
                    <td style={styles.td}>{campaign.aciklama.substring(0, 50)}...</td>
                    <td style={styles.td}>
                      {new Date(campaign.baslangic_tarihi).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={styles.td}>
                      {new Date(campaign.bitis_tarihi).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: isActive(campaign) ? '#D1FAE5' : '#FEE2E2',
                        color: isActive(campaign) ? '#047857' : '#DC2626',
                      }}>
                        {isActive(campaign) ? (
                          <>
                            <CheckCircle size={14} /> Aktif
                          </>
                        ) : (
                          <>
                            <XCircle size={14} /> Pasif
                          </>
                        )}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => handleEdit(campaign)}
                          style={styles.editButton}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          style={styles.deleteButton}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
                </h2>
                <button onClick={handleCloseModal} style={styles.closeButton}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Başlık *</label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama *</label>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                    style={{ ...styles.input, minHeight: '100px' }}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Buton Yazısı *</label>
                    <input
                      type="text"
                      value={formData.buton_yazisi}
                      onChange={(e) => setFormData({ ...formData, buton_yazisi: e.target.value })}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Buton Linki *</label>
                    <input
                      type="text"
                      value={formData.buton_linki}
                      onChange={(e) => setFormData({ ...formData, buton_linki: e.target.value })}
                      style={styles.input}
                      placeholder="/urunler"
                      required
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Başlangıç Tarihi *</label>
                    <input
                      type="datetime-local"
                      value={formData.baslangic_tarihi}
                      onChange={(e) => setFormData({ ...formData, baslangic_tarihi: e.target.value })}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bitiş Tarihi *</label>
                    <input
                      type="datetime-local"
                      value={formData.bitis_tarihi}
                      onChange={(e) => setFormData({ ...formData, bitis_tarihi: e.target.value })}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.aktif}
                      onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                      style={styles.checkbox}
                    />
                    Kampanya aktif
                  </label>
                </div>

                <div style={styles.modalFooter}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    style={styles.cancelButton}
                  >
                    İptal
                  </Button>
                  <Button type="submit" style={styles.submitButton}>
                    {editingCampaign ? 'Güncelle' : 'Oluştur'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#7E7E7E',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
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
  addButton: {
    background: '#22C55E',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    padding: '16px 24px',
    background: '#F9FAFB',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '1px solid #E5E7EB',
  },
  tr: {
    borderBottom: '1px solid #E5E7EB',
  },
  td: {
    padding: '16px 24px',
    color: '#374151',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#9CA3AF',
    fontSize: '16px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    padding: '8px',
    background: '#F3F4F6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#3BB77E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: '8px',
    background: '#FEE2E2',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#DC2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: '700px',
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
  form: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #E5E7EB',
  },
  cancelButton: {
    padding: '10px 20px',
  },
  submitButton: {
    background: '#22C55E',
    color: 'white',
    padding: '10px 20px',
  },
};

export default AdminCampaigns;
