// src/pages/admin/AdminSecurity.js
import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminSecurity = () => {
  const { changePassword } = useAdminAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setSaving(true);

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);

      if (result.success) {
        toast.success(result.message || 'Şifre başarıyla güncellendi! Lütfen yeni şifre ile tekrar giriş yapın.');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.error || 'Şifre güncellenemedi');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#111827' }}>
          Güvenlik Ayarları
        </h1>

        <div style={{
          maxWidth: '600px',
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#111827' }}>
            Admin Şifresi Değiştir
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Mevcut Şifre *
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Yeni Şifre *
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Yeni Şifre (Tekrar) *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: '#221E91',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <Save size={18} />
                {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#FEF3C7',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#92400E',
          }}>
            <strong>Önemli:</strong> Şifrenizi değiştirdikten sonra yeni şifre ile tekrar giriş yapmanız gerekecektir.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;