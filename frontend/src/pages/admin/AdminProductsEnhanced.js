import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Search, AlertTriangle, Package, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const AdminProductsEnhanced = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showLowStock, setShowLowStock] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    images: '',
    price_range: '',
    stock_quantity: '',
    alis_fiyati: '',
    birim: 'adet',
    minimum_stok: '',
    is_active: true,
    is_featured: false,
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error('Kategoriler yüklenemedi');
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `${backendUrl}/api/products?`;
      
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
      if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (sortBy) url += `sort_by=${sortBy}&sort_order=${sortOrder}&`;
      if (showLowStock) url += `low_stock=true&`;

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      toast.error('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [searchTerm, selectedCategory, sortBy, sortOrder, showLowStock]);

  const handleImageUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // Create instant previews using object URLs
    const previewUrls = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    setImagePreviews((prev) => [...prev, ...previewUrls]);

    setUploadingImage(true);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${backendUrl}/api/upload-file`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        return data.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...imageUrls]);
      toast.success(`${imageUrls.length} resim yüklendi`);
    } catch (error) {
      toast.error('Resim yüklenirken hata oluştu');
      console.error(error);
      // Remove previews on error
      setImagePreviews((prev) => prev.filter(p => !previewUrls.some(pu => pu.url === p.url)));
    } finally {
      setUploadingImage(false);
    }
  };

  const removeUploadedImage = (url) => {
    setUploadedImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error('Lütfen ürün adı ve kategori seçin');
      return;
    }

    // Combine URL images and uploaded images
    const urlImages = formData.images ? formData.images.split(',').map(i => i.trim()).filter(i => i) : [];
    const allImages = [...urlImages, ...uploadedImages];

    const payload = {
      ...formData,
      images: allImages,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
      alis_fiyati: formData.alis_fiyati ? parseFloat(formData.alis_fiyati) : null,
      minimum_stok: formData.minimum_stok ? parseInt(formData.minimum_stok) : null,
    };

    try {
      const url = editingProduct
        ? `${backendUrl}/api/products/${editingProduct.id}`
        : `${backendUrl}/api/products`;
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Ürün güncellendi' : 'Ürün eklendi');
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        toast.error('Ürün kaydedilemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      images: product.images.join(', '),
      price_range: product.price_range || '',
      stock_quantity: product.stock_quantity || '',
      alis_fiyati: product.alis_fiyati || '',
      birim: product.birim || 'adet',
      minimum_stok: product.minimum_stok || '',
      is_active: product.is_active,
      is_featured: product.is_featured || false,
    });
    setUploadedImages([]); // Clear uploaded images when editing
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
      });

      if (response.ok) {
        toast.success('Ürün silindi');
        fetchProducts();
      } else {
        toast.error('Ürün silinemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      images: '',
      price_range: '',
      stock_quantity: '',
      alis_fiyati: '',
      birim: 'adet',
      minimum_stok: '',
      is_active: true,
      is_featured: false,
    });
    setUploadedImages([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const getStockStatus = (product) => {
    const stock = product.stock_quantity || 0;
    const minStock = product.minimum_stok || 0;
    
    if (!minStock) return null;
    
    if (stock === 0) {
      return { status: 'critical', color: '#DC2626', bg: '#FEE2E2', text: 'STOK YOK' };
    } else if (stock <= minStock) {
      return { status: 'low', color: '#D97706', bg: '#FEF3C7', text: 'DÜŞÜK STOK' };
    }
    return { status: 'ok', color: '#059669', bg: '#D1FAE5', text: 'NORMAL' };
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
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
            <h1 style={styles.title}>Ürün & Stok Yönetimi</h1>
            <p style={styles.subtitle}>Ürünleri yönetin ve stok durumunu takip edin</p>
          </div>
          <Button onClick={() => setShowModal(true)} style={styles.addButton}>
            <Plus size={20} />
            Yeni Ürün Ekle
          </Button>
        </div>

        {/* Filters */}
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <Search size={18} color="#6B7280" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowLowStock(!showLowStock)}
            style={{
              ...styles.filterButton,
              background: showLowStock ? '#FEF3C7' : 'white',
              color: showLowStock ? '#D97706' : '#6B7280',
              border: showLowStock ? '2px solid #D97706' : '1px solid #D1D5DB',
            }}
          >
            <AlertTriangle size={16} />
            Düşük Stok
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <Package size={20} color="#6B7280" />
            <span style={styles.statValue}>{products.length}</span>
            <span style={styles.statLabel}>Toplam Ürün</span>
          </div>
          <div style={styles.stat}>
            <AlertTriangle size={20} color="#D97706" />
            <span style={styles.statValue}>
              {products.filter(p => {
                const status = getStockStatus(p);
                return status && (status.status === 'low' || status.status === 'critical');
              }).length}
            </span>
            <span style={styles.statLabel}>Düşük Stok</span>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => toggleSort('name')}>
                  <div style={styles.thContent}>
                    Ürün Adı
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={styles.th}>Kategori</th>
                <th style={styles.th} onClick={() => toggleSort('stock_quantity')}>
                  <div style={styles.thContent}>
                    Stok Miktarı
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={styles.th}>Min. Stok</th>
                <th style={styles.th}>Birim</th>
                <th style={styles.th} onClick={() => toggleSort('alis_fiyati')}>
                  <div style={styles.thContent}>
                    Alış Fiyatı
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={styles.th}>Durum</th>
                <th style={styles.th}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={styles.emptyState}>
                    {searchTerm || selectedCategory || showLowStock
                      ? 'Filtreye uygun ürün bulunamadı'
                      : 'Henüz ürün eklenmemiş'}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const categoryName = categories.find(c => c.slug === product.category)?.name || product.category;
                  
                  return (
                    <tr key={product.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.productName}>
                          {product.name}
                          {product.is_featured && (
                            <span style={styles.featuredBadge}>⭐</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>{categoryName}</td>
                      <td style={styles.td}>
                        <span style={{ fontWeight: '600' }}>
                          {product.stock_quantity !== null ? product.stock_quantity : '-'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {product.minimum_stok || '-'}
                      </td>
                      <td style={styles.td}>
                        {product.birim || '-'}
                      </td>
                      <td style={styles.td}>
                        {product.alis_fiyati ? `₺${product.alis_fiyati.toLocaleString('tr-TR')}` : '-'}
                      </td>
                      <td style={styles.td}>
                        {stockStatus ? (
                          <span
                            style={{
                              ...styles.badge,
                              background: stockStatus.bg,
                              color: stockStatus.color,
                            }}
                          >
                            {stockStatus.status === 'critical' && <AlertTriangle size={12} />}
                            {stockStatus.text}
                          </span>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: '13px' }}>-</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button onClick={() => handleEdit(product)} style={styles.editButton}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} style={styles.deleteButton}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <button onClick={handleCloseModal} style={styles.closeButton}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Ürün Adı *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kategori *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={styles.input}
                      required
                    >
                      <option value="">Seçiniz</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ ...styles.input, minHeight: '80px' }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Görsel URL'leri (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    style={styles.input}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>veya Resim Yükle</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{
                      ...styles.input,
                      cursor: uploadingImage ? 'not-allowed' : 'pointer',
                      backgroundColor: uploadingImage ? '#f3f4f6' : 'white'
                    }}
                  />
                  {uploadingImage && (
                    <p style={{ fontSize: '13px', color: '#3BB77E', marginTop: '8px' }}>
                      Yükleniyor...
                    </p>
                  )}
                  {uploadedImages.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {uploadedImages.map((url, index) => (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            width: '100px',
                            height: '100px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '2px solid #E5E7EB'
                          }}
                        >
                          <img
                            src={`${backendUrl}${url}`}
                            alt={`Upload ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(url)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: '#DC2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                    Stok Bilgileri
                  </h3>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Stok Miktarı</label>
                      <input
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        style={styles.input}
                        min="0"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Minimum Stok</label>
                      <input
                        type="number"
                        value={formData.minimum_stok}
                        onChange={(e) => setFormData({ ...formData, minimum_stok: e.target.value })}
                        style={styles.input}
                        min="0"
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Birim</label>
                      <select
                        value={formData.birim}
                        onChange={(e) => setFormData({ ...formData, birim: e.target.value })}
                        style={styles.input}
                      >
                        <option value="adet">Adet</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="lt">Litre (lt)</option>
                        <option value="kutu">Kutu</option>
                        <option value="paket">Paket</option>
                        <option value="koli">Koli</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Alış Fiyatı (₺)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.alis_fiyati}
                        onChange={(e) => setFormData({ ...formData, alis_fiyati: e.target.value })}
                        style={styles.input}
                        min="0"
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Fiyat Aralığı (Satış)</label>
                    <input
                      type="text"
                      value={formData.price_range}
                      onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                      style={styles.input}
                      placeholder="₺10 - ₺20"
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '20px' }}>
                  <div style={styles.checkboxGroup}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        style={styles.checkbox}
                      />
                      Ürün aktif
                    </label>

                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        style={styles.checkbox}
                      />
                      Öne çıkarılmış ürün
                    </label>
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
                    {editingProduct ? 'Güncelle' : 'Ekle'}
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
    maxWidth: '1600px',
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
  addButton: {
    background: '#22C55E',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: 'white',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
  },
  select: {
    padding: '10px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
    minWidth: '180px',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
    cursor: 'pointer',
    userSelect: 'none',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tr: {
    borderBottom: '1px solid #E5E7EB',
    transition: 'background 0.2s',
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
  productName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
  },
  featuredBadge: {
    fontSize: '12px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
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
  checkboxGroup: {
    display: 'flex',
    gap: '24px',
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

export default AdminProductsEnhanced;
