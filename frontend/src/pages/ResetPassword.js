import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password })
      });

      if (response.ok) {
        setSuccess(true);
        toast.success('Şifreniz başarıyla değiştirildi');
        setTimeout(() => navigate('/customer/login'), 3000);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Şifre sıfırlanamadı');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Geçersiz Link</h1>
          <p style={styles.subtitle}>Şifre sıfırlama linki geçersiz.</p>
          <Button onClick={() => navigate('/customer/login')} style={{ width: '100%', marginTop: '24px' }}>
            Giriş Sayfasına Dön
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={styles.iconContainer}>
              <CheckCircle size={40} style={{ color: '#10B981' }} />
            </div>
            <h1 style={styles.title}>Şifre Değiştirildi!</h1>
            <p style={styles.subtitle}>Yeni şifrenizle giriş yapabilirsiniz.</p>
            <Button onClick={() => navigate('/customer/login')} style={{ width: '100%', marginTop: '24px' }}>
              Giriş Yap
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={styles.iconContainer}>
            <Lock size={40} style={{ color: '#e06c1b' }} />
          </div>
          <h1 style={styles.title}>Yeni Şifre Belirle</h1>
          <p style={styles.subtitle}>Güvenli bir şifre seçin.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Yeni Şifre</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Şifre Tekrar</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px'
  },
  subtitle: {
    color: '#6B7280',
    fontSize: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151'
  }
};

export default ResetPassword;