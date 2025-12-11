import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, Plus, Edit, Trash2, Shield, Mail, Key } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: ['all']
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/users`, {
        headers: {
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Yetkisiz erişim');
      }
    } catch (error) {
      toast.error('Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingUser 
        ? `${backendUrl}/api/admin/users/${editingUser.id}`
        : `${backendUrl}/api/admin/users`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingUser ? 'Admin güncellendi' : 'Admin oluşturuldu');
        setShowModal(false);
        setEditingUser(null);
        setFormData({ username: '', email: '', password: '', role: 'admin', permissions: ['all'] });
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bu admin kullanıcısını silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
      });

      if (response.ok) {
        toast.success('Admin silindi');
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Silinemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      permissions: user.permissions
    });
    setShowModal(true);
  };

  const togglePermission = (perm) => {
    if (formData.permissions.includes('all')) {
      setFormData({ ...formData, permissions: [perm] });
    } else if (formData.permissions.includes(perm)) {
      const newPerms = formData.permissions.filter(p => p !== perm);
      setFormData({ ...formData, permissions: newPerms.length ? newPerms : ['all'] });
    } else {
      setFormData({ ...formData, permissions: [...formData.permissions, perm] });
    }
  };

  const allPermissions = ['messages', 'quotes', 'products', 'customers', 'categories', 'brands'];

  if (loading) {
    return <AdminLayout><div style={{ padding: '40px' }}>Yükleniyor...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={32} />
              Admin Kullanıcıları
            </h1>
            <p style={{ color: '#6B7280', marginTop: '8px' }}>Admin kullanıcılarını yönetin ve yetkilendirin</p>
          </div>
          <Button onClick={() => { setShowModal(true); setEditingUser(null); setFormData({ username: '', email: '', password: '', role: 'admin', permissions: ['all'] }); }}>
            <Plus size={20} />
            Yeni Admin Ekle
          </Button>
        </div>

        {/* Users Grid */}
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: user.role === 'super_admin' ? '2px solid #10B981' : '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{user.username}</h3>
                    <span style={{
                      background: user.role === 'super_admin' ? '#DCFCE7' : '#DBEAFE',
                      color: user.role === 'super_admin' ? '#065F46' : '#1E40AF',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.role === 'super_admin' ? 'Süper Admin' : 'Admin'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', marginBottom: '8px' }}>
                  <Mail size={16} />
                  <span style={{ fontSize: '14px' }}>{user.email || 'Email yok'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                  <Key size={16} />
                  <span style={{ fontSize: '14px' }}>Yetkiler: {user.permissions.includes('all') ? 'Tümü' : user.permissions.join(', ')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => openEditModal(user)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <Edit size={16} />
                  Düzenle
                </button>
                {user.role !== 'super_admin' && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: '10px',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
                {editingUser ? 'Admin Düzenle' : 'Yeni Admin Ekle'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Kullanıcı Adı</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={editingUser}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Şifre {editingUser && '(Değiştirmek için doldurun)'}
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Rol</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Süper Admin</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Yetkiler</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('all')}
                        onChange={() => setFormData({ ...formData, permissions: ['all'] })}
                      />
                      <span>Tümü</span>
                    </label>
                    {allPermissions.map(perm => (
                      <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm) || formData.permissions.includes('all')}
                          onChange={() => togglePermission(perm)}
                          disabled={formData.permissions.includes('all')}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button type="submit" style={{ flex: 1 }}>
                    {editingUser ? 'Güncelle' : 'Oluştur'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => { setShowModal(false); setEditingUser(null); }}
                    style={{ background: '#6B7280' }}
                  >
                    İptal
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

export default AdminUsers;