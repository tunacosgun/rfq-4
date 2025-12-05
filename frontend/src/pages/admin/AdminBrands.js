import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tag, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    description: '',
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const auth = btoa('admin:admin123');
      const response = await fetch(`${backendUrl}/api/brands`, {
        headers: { 'Authorization': `Basic ${auth}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Brands fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = btoa('admin:admin123');
      const url = editingBrand
        ? `${backendUrl}/api/brands/${editingBrand.id}`
        : `${backendUrl}/api/brands`;
      const method = editingBrand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingBrand ? 'Marka güncellendi' : 'Marka eklendi');
        fetchBrands();
        handleCloseModal();
      }
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (brandId) => {
    if (!window.confirm('Bu markayı silmek istediğinizden emin misiniz?')) return;

    try {
      const auth = btoa('admin:admin123');
      const response = await fetch(`${backendUrl}/api/brands/${brandId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${auth}` },
      });

      if (response.ok) {
        toast.success('Marka silindi');
        fetchBrands();
      }
    } catch (error) {
      toast.error('Silme başarısız');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logo_url: brand.logo_url || '',
      description: brand.description || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({ name: '', logo_url: '', description: '' });
  };

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>Markalar</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#221E91',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Plus size={20} />
            Yeni Marka
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <div className="spinner"></div>
          </div>
        ) : brands.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            background: 'white',
            borderRadius: '12px',
          }}>
            <Tag size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
            <p>Henüz marka eklenmemiş</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {brands.map((brand) => (
              <div
                key={brand.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {brand.logo_url && (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'contain',
                      marginBottom: '16px',
                    }}
                  />
                )}
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {brand.name}
                </h3>
                {brand.description && (
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                    {brand.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(brand)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '500px',
                width: '90%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                  {editingBrand ? 'Marka Düzenle' : 'Yeni Marka'}
                </h2>
                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Marka Adı *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                      Açıklama
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      background: '#221E91',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    <Save size={18} />
                    {editingBrand ? 'Güncelle' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBrands;
