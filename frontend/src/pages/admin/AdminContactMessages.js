import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, Clock, Check, X } from 'lucide-react';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const fetchMessages = async () => {
    try {
      const auth = btoa('admin:admin123');
      const url = filterStatus 
        ? `${backendUrl}/api/contact-messages?status_filter=${filterStatus}`
        : `${backendUrl}/api/contact-messages`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      toast.error('Mesajlar yüklenemedi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const auth = btoa('admin:admin123');
      const response = await fetch(`${backendUrl}/api/contact-messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Durum güncellendi');
        fetchMessages();
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      }
    } catch (error) {
      toast.error('Durum güncellenemedi');
      console.error(error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const auth = btoa('admin:admin123');
      const response = await fetch(`${backendUrl}/api/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      if (response.ok) {
        toast.success('Mesaj silindi');
        fetchMessages();
        setShowModal(false);
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Mesaj silinemedi');
      console.error(error);
    }
  };

  const openMessageModal = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mark as read if it's new
    if (message.status === 'yeni') {
      await updateMessageStatus(message.id, 'okundu');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      yeni: { bg: '#FEF3C7', color: '#92400E', text: 'Yeni' },
      okundu: { bg: '#DBEAFE', color: '#1E40AF', text: 'Okundu' },
      yanıtlandı: { bg: '#D1FAE5', color: '#065F46', text: 'Yanıtlandı' },
    };

    const style = styles[status] || styles.yeni;

    return (
      <span
        style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: style.bg,
          color: style.color,
        }}
      >
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#6B7280' }}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>
          İletişim Mesajları
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '14px',
          }}
        >
          <option value="">Tüm Mesajlar</option>
          <option value="yeni">Yeni</option>
          <option value="okundu">Okundu</option>
          <option value="yanıtlandı">Yanıtlandı</option>
        </select>
      </div>

      {messages.length === 0 ? (
        <div style={{
          padding: '64px',
          textAlign: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
        }}>
          <Mail size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', color: '#6B7280' }}>Henüz mesaj yok</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                padding: '20px',
                backgroundColor: message.status === 'yeni' ? '#FFFBEB' : 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => openMessageModal(message)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                    {message.subject}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>{message.name}</p>
                </div>
                {getStatusBadge(message.status)}
              </div>

              <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#6B7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} />
                  {message.email}
                </div>
                {message.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} />
                    {message.phone}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} />
                  {new Date(message.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>

              <p style={{
                marginTop: '12px',
                fontSize: '14px',
                color: '#4B5563',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {selectedMessage.subject}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <strong>Gönderen:</strong>
                <span>{selectedMessage.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <strong>E-posta:</strong>
                <a href={`mailto:${selectedMessage.email}`} style={{ color: '#3B82F6' }}>
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <strong>Telefon:</strong>
                  <a href={`tel:${selectedMessage.phone}`} style={{ color: '#3B82F6' }}>
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <strong>Tarih:</strong>
                <span>{new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong>Durum:</strong>
                {getStatusBadge(selectedMessage.status)}
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              marginBottom: '24px',
            }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Mesaj:</strong>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedMessage.message}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {selectedMessage.status !== 'yanıtlandı' && (
                <button
                  onClick={() => updateMessageStatus(selectedMessage.id, 'yanıtlandı')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} />
                  Yanıtlandı Olarak İşaretle
                </button>
              )}
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                }}
              >
                <X size={16} />
                Mesajı Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
