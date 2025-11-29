import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle, Clock, Car } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    plaka: '',
    marka_model: '',
    kilometre: '',
    hat_depo: '',
    not_: '',
    bakim_tarihi: '',
    muayene_tarihi: '',
    kasko_tarihi: '',
    sigorta_tarihi: '',
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/vehicles`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      toast.error('Araçlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.plaka || !formData.marka_model) {
      toast.error('Lütfen plaka ve marka/model alanlarını doldurun');
      return;
    }

    const payload = {
      ...formData,
      kilometre: formData.kilometre ? parseInt(formData.kilometre) : null,
      bakim_tarihi: formData.bakim_tarihi ? new Date(formData.bakim_tarihi).toISOString() : null,
      muayene_tarihi: formData.muayene_tarihi ? new Date(formData.muayene_tarihi).toISOString() : null,
      kasko_tarihi: formData.kasko_tarihi ? new Date(formData.kasko_tarihi).toISOString() : null,
      sigorta_tarihi: formData.sigorta_tarihi ? new Date(formData.sigorta_tarihi).toISOString() : null,
    };

    try {
      const url = editingVehicle
        ? `${backendUrl}/api/vehicles/${editingVehicle.id}`
        : `${backendUrl}/api/vehicles`;
      
      const response = await fetch(url, {
        method: editingVehicle ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingVehicle ? 'Araç güncellendi' : 'Araç eklendi');
        setShowModal(false);
        setEditingVehicle(null);
        resetForm();
        fetchVehicles();
      } else {
        toast.error('Araç kaydedilemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plaka: vehicle.plaka,
      marka_model: vehicle.marka_model,
      kilometre: vehicle.kilometre || '',
      hat_depo: vehicle.hat_depo || '',
      not_: vehicle.not_ || '',
      bakim_tarihi: vehicle.bakim_tarihi ? new Date(vehicle.bakim_tarihi).toISOString().slice(0, 16) : '',
      muayene_tarihi: vehicle.muayene_tarihi ? new Date(vehicle.muayene_tarihi).toISOString().slice(0, 16) : '',
      kasko_tarihi: vehicle.kasko_tarihi ? new Date(vehicle.kasko_tarihi).toISOString().slice(0, 16) : '',
      sigorta_tarihi: vehicle.sigorta_tarihi ? new Date(vehicle.sigorta_tarihi).toISOString().slice(0, 16) : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
      });

      if (response.ok) {
        toast.success('Araç silindi');
        fetchVehicles();
      } else {
        toast.error('Araç silinemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      plaka: '',
      marka_model: '',
      kilometre: '',
      hat_depo: '',
      not_: '',
      bakim_tarihi: '',
      muayene_tarihi: '',
      kasko_tarihi: '',
      sigorta_tarihi: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    resetForm();
  };

  const getDateStatus = (dateStr) => {
    if (!dateStr) return null;
    
    const now = new Date();
    const date = new Date(dateStr);
    const daysUntil = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { status: 'overdue', color: '#DC2626', bg: '#FEE2E2', text: 'GEÇMİŞ', days: Math.abs(daysUntil) };
    } else if (daysUntil <= 30) {
      return { status: 'warning', color: '#D97706', bg: '#FEF3C7', text: 'YAKLŞIYOR', days: daysUntil };
    }
    return { status: 'ok', color: '#059669', bg: '#D1FAE5', text: 'NORMAL', days: daysUntil };
  };

  const renderDateBadge = (dateStr, label) => {
    const status = getDateStatus(dateStr);
    if (!status) return null;

    return (
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
          {label}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            background: status.bg,
            color: status.color,
          }}
        >
          {status.status === 'overdue' && <AlertTriangle size={14} />}
          {status.status === 'warning' && <Clock size={14} />}
          {status.status === 'ok' && <CheckCircle size={14} />}
          <span>
            {new Date(dateStr).toLocaleDateString('tr-TR')} 
            {status.status !== 'ok' && ` (${status.days} gün)`}
          </span>
        </div>
      </div>
    );
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
            <h1 style={styles.title}>Araç & Bakım Takip</h1>
            <p style={styles.subtitle}>Araç filosunu ve bakım tarihlerini yönetin</p>
          </div>
          <Button onClick={() => setShowModal(true)} style={styles.addButton}>
            <Plus size={20} />
            Yeni Araç Ekle
          </Button>
        </div>

        <div style={styles.gridContainer}>
          {vehicles.length === 0 ? (
            <div style={styles.emptyState}>
              <Car size={64} color="#D1D5DB" />
              <p style={{ marginTop: '16px', fontSize: '18px', color: '#6B7280' }}>
                Henüz araç eklenmemiş
              </p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.plateNumber}>{vehicle.plaka}</div>
                  <div style={styles.actions}>
                    <button onClick={() => handleEdit(vehicle)} style={styles.editButton}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(vehicle.id)} style={styles.deleteButton}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.vehicleInfo}>
                    <Car size={20} color="#6B7280" />
                    <span style={{ fontWeight: '600', color: '#1F2937' }}>
                      {vehicle.marka_model}
                    </span>
                  </div>

                  {vehicle.kilometre && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Kilometre:</span>
                      <span style={styles.infoValue}>{vehicle.kilometre.toLocaleString('tr-TR')} km</span>
                    </div>
                  )}

                  {vehicle.hat_depo && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Hat/Depo:</span>
                      <span style={styles.infoValue}>{vehicle.hat_depo}</span>
                    </div>
                  )}

                  {vehicle.not_ && (
                    <div style={{ ...styles.infoRow, marginTop: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
                        {vehicle.not_}
                      </span>
                    </div>
                  )}

                  <div style={styles.dateSection}>
                    {renderDateBadge(vehicle.bakim_tarihi, 'Bakım')}
                    {renderDateBadge(vehicle.muayene_tarihi, 'Muayene')}
                    {renderDateBadge(vehicle.kasko_tarihi, 'Kasko')}
                    {renderDateBadge(vehicle.sigorta_tarihi, 'Sigorta')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingVehicle ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}
                </h2>
                <button onClick={handleCloseModal} style={styles.closeButton}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Plaka *</label>
                    <input
                      type="text"
                      value={formData.plaka}
                      onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
                      style={styles.input}
                      placeholder="34 ABC 123"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Marka / Model *</label>
                    <input
                      type="text"
                      value={formData.marka_model}
                      onChange={(e) => setFormData({ ...formData, marka_model: e.target.value })}
                      style={styles.input}
                      placeholder="Mercedes-Benz Sprinter"
                      required
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kilometre</label>
                    <input
                      type="number"
                      value={formData.kilometre}
                      onChange={(e) => setFormData({ ...formData, kilometre: e.target.value })}
                      style={styles.input}
                      placeholder="125000"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bağlı Hat / Depo</label>
                    <input
                      type="text"
                      value={formData.hat_depo}
                      onChange={(e) => setFormData({ ...formData, hat_depo: e.target.value })}
                      style={styles.input}
                      placeholder="Hat 5 - Merkez Depo"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Not</label>
                  <textarea
                    value={formData.not_}
                    onChange={(e) => setFormData({ ...formData, not_: e.target.value })}
                    style={{ ...styles.input, minHeight: '80px' }}
                    placeholder="Düzenli bakım yapılıyor..."
                  />
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                    Tarih Bilgileri
                  </h3>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Bakım Tarihi</label>
                      <input
                        type="datetime-local"
                        value={formData.bakim_tarihi}
                        onChange={(e) => setFormData({ ...formData, bakim_tarihi: e.target.value })}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Muayene Tarihi</label>
                      <input
                        type="datetime-local"
                        value={formData.muayene_tarihi}
                        onChange={(e) => setFormData({ ...formData, muayene_tarihi: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Kasko Tarihi</label>
                      <input
                        type="datetime-local"
                        value={formData.kasko_tarihi}
                        onChange={(e) => setFormData({ ...formData, kasko_tarihi: e.target.value })}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Sigorta Tarihi</label>
                      <input
                        type="datetime-local"
                        value={formData.sigorta_tarihi}
                        onChange={(e) => setFormData({ ...formData, sigorta_tarihi: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>
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
                    {editingVehicle ? 'Güncelle' : 'Ekle'}
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '12px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
  },
  cardHeader: {
    background: '#F9FAFB',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
  },
  plateNumber: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'monospace',
    padding: '6px 12px',
    background: 'white',
    border: '2px solid #1F2937',
    borderRadius: '4px',
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
  cardBody: {
    padding: '20px',
  },
  vehicleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E7EB',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  dateSection: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
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
    maxWidth: '800px',
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
    flex: 1,
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

export default AdminVehicles;
