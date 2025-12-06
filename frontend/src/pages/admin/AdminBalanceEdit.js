import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminBalanceEdit = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balanceAction, setBalanceAction] = useState('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/customers`, {
        headers: {
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
      });

      if (response.ok) {
        const customers = await response.json();
        const found = customers.find(c => c.id === customerId);
        setCustomer(found);
      }
    } catch (error) {
      toast.error('Müşteri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum) || amountNum < 0) {
      toast.error('Geçerli bir tutar girin');
      return;
    }

    setSaving(true);

    try {
      let newBalance = customer.balance || 0;

      if (balanceAction === 'add') {
        newBalance = newBalance + amountNum;
      } else if (balanceAction === 'subtract') {
        newBalance = newBalance - amountNum;
        if (newBalance < 0) {
          toast.error('Bakiye eksi olamaz');
          setSaving(false);
          return;
        }
      } else if (balanceAction === 'set') {
        newBalance = amountNum;
      }

      // Update balance
      const response = await fetch(`${backendUrl}/api/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify({ balance: newBalance }),
      });

      if (response.ok) {
        // Log transaction
        await fetch(`${backendUrl}/api/admin/balance-log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('admin:admin123'),
          },
          body: JSON.stringify({
            customer_id: customerId,
            customer_name: customer.name,
            action: balanceAction,
            amount: amountNum,
            old_balance: customer.balance || 0,
            new_balance: newBalance,
            note: note,
          }),
        });

        toast.success('Bakiye güncellendi!');
        setTimeout(() => {
          navigate('/admin/musteriler');
        }, 1000);
      } else {
        toast.error('Bakiye güncellenemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const calculateNewBalance = () => {
    const amountNum = parseFloat(amount) || 0;
    const currentBalance = customer?.balance || 0;

    if (balanceAction === 'add') {
      return currentBalance + amountNum;
    } else if (balanceAction === 'subtract') {
      return currentBalance - amountNum;
    } else if (balanceAction === 'set') {
      return amountNum;
    }
    return currentBalance;
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

  if (!customer) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Müşteri bulunamadı</p>
          <button onClick={() => navigate('/admin/musteriler')} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Geri Dön
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/musteriler')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: '#F3F4F6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={18} />
          Müşterilere Dön
        </button>

        {/* Header */}
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>
          💰 Bakiye İşlemi
        </h1>

        {/* Customer Info */}
        <div style={{
          background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid #93C5FD'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#1E40AF', marginBottom: '4px' }}>Müşteri</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1E3A8A' }}>{customer.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#1E40AF', marginBottom: '4px' }}>Mevcut Bakiye</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1E3A8A' }}>
                ₺{(customer.balance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          
          {/* Action Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              İşlem Tipi
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setBalanceAction('add')}
                style={{
                  padding: '16px',
                  border: balanceAction === 'add' ? '2px solid #10B981' : '2px solid #E5E7EB',
                  background: balanceAction === 'add' ? '#D1FAE5' : 'white',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: balanceAction === 'add' ? '#059669' : '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ➕ Ekle
              </button>
              <button
                onClick={() => setBalanceAction('subtract')}
                style={{
                  padding: '16px',
                  border: balanceAction === 'subtract' ? '2px solid #EF4444' : '2px solid #E5E7EB',
                  background: balanceAction === 'subtract' ? '#FEE2E2' : 'white',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: balanceAction === 'subtract' ? '#DC2626' : '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ➖ Düş
              </button>
              <button
                onClick={() => setBalanceAction('set')}
                style={{
                  padding: '16px',
                  border: balanceAction === 'set' ? '2px solid #F59E0B' : '2px solid #E5E7EB',
                  background: balanceAction === 'set' ? '#FEF3C7' : 'white',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: balanceAction === 'set' ? '#D97706' : '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ⚙️ Belirle
              </button>
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              {balanceAction === 'add' ? 'Eklenecek Tutar (₺)' : 
               balanceAction === 'subtract' ? 'Düşülecek Tutar (₺)' : 
               'Yeni Bakiye (₺)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '20px',
                fontWeight: '600',
                border: '2px solid #D1D5DB',
                borderRadius: '8px',
              }}
              placeholder="0.00"
              step="0.01"
              min="0"
            />

            {/* Preview */}
            {amount > 0 && balanceAction !== 'set' && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                background: '#F9FAFB',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#374151'
              }}>
                Yeni bakiye: <strong style={{ fontSize: '16px' }}>
                  ₺{calculateNewBalance().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            )}
          </div>

          {/* Note */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Not (Opsiyonel)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
              }}
              placeholder="Ödeme, sipariş, iade vb."
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              padding: '18px',
              background: balanceAction === 'add' ? '#10B981' : 
                          balanceAction === 'subtract' ? '#EF4444' : '#F59E0B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Kaydediliyor...' : 
             balanceAction === 'add' ? '➕ Ekle ve Kaydet' : 
             balanceAction === 'subtract' ? '➖ Düş ve Kaydet' : 
             '⚙️ Güncelle'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBalanceEdit;
