import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCategories = () => {
  const { getAuthHeader } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id: editingCategory ? editingCategory.id : undefined,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      icon: formData.icon || null,
    };

    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, data, {
          headers: getAuthHeader(),
        });
        toast.success('Kategori güncellendi');
      } else {
        await axios.post(`${API}/categories`, data, {
          headers: getAuthHeader(),
        });
        toast.success('Kategori eklendi');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'İşlem başarısız');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name} kategorisini silmek istediğinizden emin misiniz?`)) return;

    try {
      await axios.delete(`${API}/categories/${id}`, {
        headers: getAuthHeader(),
      });
      toast.success('Kategori silindi');
      fetchCategories();
    } catch (error) {
      toast.error('Kategori silinemedi');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', icon: '' });
    setEditingCategory(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
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
      <div data-testid="admin-categories-page">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Kategori Yönetimi</h1>
            <p style={styles.subtitle}>Ürün kategorilerini yönetin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="add-category-button">
                <Plus size={20} style={{ marginRight: '8px' }} />
                Yeni Kategori
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: '500px' }}>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kategori Adı *</label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    data-testid="category-name-input" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Slug</label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                    placeholder="Otomatik oluşturulacak"
                    data-testid="category-slug-input" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>İkon (opsiyonel)</label>
                  <Input 
                    value={formData.icon} 
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })} 
                    placeholder="electronics, food, textile vb."
                    data-testid="category-icon-input" 
                  />
                </div>
                <div style={styles.dialogActions}>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>İptal</Button>
                  <Button type="submit" data-testid="save-category-button">{editingCategory ? 'Güncelle' : 'Ekle'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {categories.length === 0 ? (
          <div style={styles.empty}>
            <FolderOpen size={64} style={{ color: '#7E7E7E' }} />
            <p style={styles.emptyText}>Henüz kategori eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-3" style={{ marginTop: '32px' }}>
            {categories.map((category) => (
              <div key={category.id} className="card" style={styles.categoryCard} data-testid={`category-card-${category.id}`}>
                <div style={styles.categoryIcon}>
                  <FolderOpen size={32} style={{ color: '#3BB77E' }} />
                </div>
                <div style={styles.categoryInfo}>
                  <h3 style={styles.categoryName}>{category.name}</h3>
                  <p style={styles.categorySlug}>{category.slug}</p>
                  {category.icon && <p style={styles.categoryIconText}>İkon: {category.icon}</p>}
                </div>
                <div style={styles.categoryActions}>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)} data-testid={`edit-category-${category.id}`}>
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(category.id, category.name)} 
                    style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}
                    data-testid={`delete-category-${category.id}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' },
  title: { fontSize: '36px', fontWeight: '700', color: '#253D4E', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' },
  subtitle: { fontSize: '16px', color: '#7E7E7E' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#253D4E' },
  dialogActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyText: { fontSize: '18px', color: '#7E7E7E', marginTop: '16px' },
  categoryCard: { display: 'flex', flexDirection: 'column', padding: '24px' },
  categoryIcon: { width: '64px', height: '64px', background: '#F0FDF4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  categoryInfo: { flex: 1, marginBottom: '16px' },
  categoryName: { fontSize: '20px', fontWeight: '600', color: '#253D4E', marginBottom: '8px' },
  categorySlug: { fontSize: '14px', color: '#7E7E7E', marginBottom: '4px' },
  categoryIconText: { fontSize: '12px', color: '#3BB77E', fontWeight: '500' },
  categoryActions: { display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #ececec' },
};

export default AdminCategories;
