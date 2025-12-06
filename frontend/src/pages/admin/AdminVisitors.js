import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, Globe, Monitor, Smartphone, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    desktop: 0,
    mobile: 0,
    tablet: 0,
    topCountries: [],
    topBrowsers: []
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const credentials = btoa('admin:admin123');
      const response = await fetch(`${backendUrl}/api/admin/visitors`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
        calculateStats(data);
      } else {
        toast.error('Ziyaretçi verileri yüklenemedi');
      }
    } catch (error) {
      console.error('Visitors fetch error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const desktop = data.filter(v => v.device === 'Desktop').length;
    const mobile = data.filter(v => v.device === 'Mobile').length;
    const tablet = data.filter(v => v.device === 'Tablet').length;

    // Top countries
    const countryCounts = {};
    data.forEach(v => {
      countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Top browsers
    const browserCounts = {};
    data.forEach(v => {
      browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
    });
    const topBrowsers = Object.entries(browserCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([browser, count]) => ({ browser, count }));

    setStats({
      total: data.length,
      desktop,
      mobile,
      tablet,
      topCountries,
      topBrowsers
    });
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone size={16} color="#10B981" />;
      case 'Tablet':
        return <Monitor size={16} color="#F59E0B" />;
      default:
        return <Monitor size={16} color="#3B82F6" />;
    }
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
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', color: '#111827' }}>
          <Users size={32} style={{ display: 'inline-block', marginRight: '12px', verticalAlign: 'middle' }} />
          Ziyaretçiler
        </h1>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #e06c1b, #f59e0b)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(224, 108, 27, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Toplam Ziyaretçi</div>
            <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.total}</div>
          </div>

          <div style={{
            background: '#F3F4F6',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>Cihaz Dağılımı</div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Monitor size={16} />
                  Desktop
                </span>
                <span style={{ fontWeight: '600' }}>{stats.desktop}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smartphone size={16} />
                  Mobile
                </span>
                <span style={{ fontWeight: '600' }}>{stats.mobile}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Monitor size={16} />
                  Tablet
                </span>
                <span style={{ fontWeight: '600' }}>{stats.tablet}</span>
              </div>
            </div>
          </div>

          <div style={{
            background: '#F3F4F6',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} />
              En Çok Ziyaret Eden Ülkeler
            </div>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              {stats.topCountries.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{item.country}</span>
                  <span style={{ fontWeight: '600' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visitors Table */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Tarih & Saat
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    IP Adresi
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Konum
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Cihaz
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Tarayıcı
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Sayfa
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {formatDate(visitor.timestamp)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', fontFamily: 'monospace' }}>
                      {visitor.ip}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {visitor.city}, {visitor.country}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getDeviceIcon(visitor.device)}
                        {visitor.device}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {visitor.browser} ({visitor.os})
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', fontFamily: 'monospace', fontSize: '13px' }}>
                      {visitor.page}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
