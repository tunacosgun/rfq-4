import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProducts = () => {
  const { getAuthHeader } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    images: '',
    variation: '',
    variants: '',
    min_order_quantity: 1,
    price_range: '',
    stock_quantity: '',
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      images: formData.images ? formData.images.split(',').map(i => i.trim()) : [],
      variation: formData.variation || null,
      variants: formData.variants ? formData.variants.split(',').map(v => v.trim()) : [],
      min_order_quantity: parseInt(formData.min_order_quantity) || 1,
      price_range: formData.price_range || null,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
      is_active: formData.is_active,
    };

    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, data, {
          headers: getAuthHeader(),
        });
        toast.success('Ürün güncellendi');
      } else {
        await axios.post(`${API}/products`, data, {
          headers: getAuthHeader(),
        });
        toast.success('Ürün eklendi');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'İşlem başarısız');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      images: product.images.join(', '),
      variation: product.variation || '',
      variants: (product.variants || []).join(', '),
      min_order_quantity: product.min_order_quantity || 1,
      price_range: product.price_range || '',
      stock_quantity: product.stock_quantity || '',
      is_active: product.is_active !== undefined ? product.is_active : true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name} ürününü silmek istediğinizden emin misiniz?`)) return;

    try {
      await axios.delete(`${API}/products/${id}`, {
        headers: getAuthHeader(),
      });
      toast.success('Ürün silindi');
      fetchData();
    } catch (error) {
      toast.error('Ürün silinemedi');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      images: '',
      variation: '',
      variants: '',
      min_order_quantity: 1,
      price_range: '',
      stock_quantity: '',
      is_active: true,
    });
    setEditingProduct(null);
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
      <div data-testid="admin-products-page">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Ürün Yönetimi</h1>
            <p style={styles.subtitle}>Sistemdeki tüm ürünleri yönetin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} data-testid="add-product-button">
                <Plus size={20} style={{ marginRight: '8px' }} />
                Yeni Ürün
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ürün Adı *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="product-name-input" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama *</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required data-testid="product-description-input" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kategori *</label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required data-testid="product-category-input" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Görsel URL'leri (virgülle ayırın)</label>
                  <Input value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" data-testid="product-images-input" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Varyasyon</label>
                  <Input value={formData.variation} onChange={(e) => setFormData({ ...formData, variation: e.target.value })} data-testid="product-variation-input" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Minimum Sipariş Miktarı</label>
                  <Input type="number" value={formData.min_order_quantity} onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })} min="1" data-testid="product-min-quantity-input" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fiyat Aralığı</label>
                  <Input value={formData.price_range} onChange={(e) => setFormData({ ...formData, price_range: e.target.value })} placeholder="örn: 100-500 TL" data-testid="product-price-range-input" />
                </div>
                <div style={styles.dialogActions}>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>İptal</Button>
                  <Button type="submit" data-testid="save-product-button">{editingProduct ? 'Güncelle' : 'Ekle'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {products.length === 0 ? (
          <div style={styles.empty}>
            <Package size={64} style={{ color: '#7E7E7E' }} />
            <p style={styles.emptyText}>Henüz ürün eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-3" style={{ marginTop: '32px' }}>
            {products.map((product) => (
              <div key={product.id} className="card" style={styles.productCard} data-testid={`product-card-${product.id}`}>
                <div style={styles.productImage}>
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} style={styles.productImg} />
                  ) : (
                    <div style={styles.placeholderImage}><Package size={48} style={{ color: '#7E7E7E' }} /></div>
                  )}
                </div>
                <div style={styles.productInfo}>
                  <span style={styles.productCategory}>{product.category}</span>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDescription}>{product.description.substring(0, 100)}...</p>
                  {product.price_range && (<p style={styles.priceRange}>{product.price_range}</p>)}
                </div>
                <div style={styles.productActions}>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)} data-testid={`edit-product-${product.id}`}><Edit size={16} /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product.id, product.name)} style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }} data-testid={`delete-product-${product.id}`}><Trash2 size={16} /></Button>
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
  productCard: { display: 'flex', flexDirection: 'column' },
  productImage: { width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px', background: '#F4F6FA' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholderImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  productInfo: { flex: 1, marginBottom: '16px' },
  productCategory: { fontSize: '12px', color: '#3BB77E', fontWeight: '600', textTransform: 'uppercase' },
  productName: { fontSize: '18px', fontWeight: '600', margin: '8px 0', color: '#253D4E' },
  productDescription: { fontSize: '14px', color: '#7E7E7E', lineHeight: '1.6' },
  priceRange: { fontSize: '16px', color: '#3BB77E', fontWeight: '600', marginTop: '8px' },
  productActions: { display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #ececec' },
};

export default AdminProducts;