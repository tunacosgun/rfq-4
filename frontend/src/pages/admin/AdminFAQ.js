import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Save, X, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
    is_active: true
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/faqs`, {
        headers: {
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      toast.error('FAQ\'lar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.question || !formData.answer) {
      toast.error('Soru ve cevap zorunludur');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('FAQ eklendi!');
        setShowAddForm(false);
        setFormData({ question: '', answer: '', order: 0, is_active: true });
        fetchFAQs();
      } else {
        toast.error('FAQ eklenemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleUpdate = async (id) => {
    const faq = faqs.find(f => f.id === id);
    try {
      const response = await fetch(`${backendUrl}/api/admin/faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify({
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
          is_active: faq.is_active
        }),
      });

      if (response.ok) {
        toast.success('FAQ güncellendi!');
        setEditingId(null);
        fetchFAQs();
      } else {
        toast.error('FAQ güncellenemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu FAQ\'yu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
      });

      if (response.ok) {
        toast.success('FAQ silindi!');
        fetchFAQs();
      } else {
        toast.error('FAQ silinemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const updateFAQ = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Yükleniyor...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HelpCircle size={32} />
              Sıkça Sorulan Sorular (FAQ)
            </h1>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>FAQ listesini yönetin</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={20} />
            Yeni FAQ Ekle
          </Button>
        </div>

        {showAddForm && (
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Yeni FAQ Ekle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Soru *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB', 
                    borderRadius: '6px' 
                  }}
                  placeholder="Soru girin..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Cevap *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #D1D5DB', 
                    borderRadius: '6px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Cevap girin..."
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Sıra</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    style={{ 
                      width: '100px', 
                      padding: '10px', 
                      border: '1px solid #D1D5DB', 
                      borderRadius: '6px' 
                    }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Aktif</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button onClick={handleAdd}>
                  <Save size={16} />
                  Kaydet
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ question: '', answer: '', order: 0, is_active: true });
                  }}
                  style={{ background: '#6B7280' }}
                >
                  <X size={16} />
                  İptal
                </Button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.length === 0 ? (
            <div style={{ 
              background: 'white', 
              padding: '48px', 
              borderRadius: '12px', 
              textAlign: 'center',
              color: '#6B7280'
            }}>
              Henüz FAQ eklenmemiş
            </div>
          ) : (
            faqs.map((faq) => (
              <div 
                key={faq.id}
                style={{ 
                  background: 'white', 
                  padding: '24px', 
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  opacity: faq.is_active ? 1 : 0.6
                }}
              >
                {editingId === faq.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Soru</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #D1D5DB', 
                          borderRadius: '6px' 
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Cevap</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                        rows={4}
                        style={{ 
                          width: '100%', 
                          padding: '10px', 
                          border: '1px solid #D1D5DB', 
                          borderRadius: '6px',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Sıra</label>
                        <input
                          type="number"
                          value={faq.order}
                          onChange={(e) => updateFAQ(faq.id, 'order', parseInt(e.target.value))}
                          style={{ 
                            width: '100px', 
                            padding: '10px', 
                            border: '1px solid #D1D5DB', 
                            borderRadius: '6px' 
                          }}
                        />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={faq.is_active}
                          onChange={(e) => updateFAQ(faq.id, 'is_active', e.target.checked)}
                        />
                        <span>Aktif</span>
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Button onClick={() => handleUpdate(faq.id)}>
                        <Save size={16} />
                        Kaydet
                      </Button>
                      <Button 
                        onClick={() => {
                          setEditingId(null);
                          fetchFAQs();
                        }}
                        style={{ background: '#6B7280' }}
                      >
                        <X size={16} />
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ 
                            background: '#DBEAFE', 
                            color: '#1E40AF', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            #{faq.order}
                          </span>
                          {!faq.is_active && (
                            <span style={{ 
                              background: '#FEE2E2', 
                              color: '#DC2626', 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Pasif
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                          {faq.question}
                        </h3>
                        <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
                          {faq.answer}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <button
                          onClick={() => setEditingId(faq.id)}
                          style={{ 
                            padding: '8px 12px',
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Edit size={16} />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          style={{ 
                            padding: '8px 12px',
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Trash2 size={16} />
                          Sil
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
