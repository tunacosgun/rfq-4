import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

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
            <CheckCircle size={80} style={{ color: '#10B981', margin: '0 auto 24px' }} />
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

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return '#EF4444';
    if (passwordStrength <= 3) return '#F59E0B';
    return '#10B981';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Zayıf';
    if (passwordStrength <= 3) return 'Orta';
    return 'Güçlü';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <Lock size={48} style={{ color: '#e06c1b' }} />
        </div>
        <h1 style={styles.title}>Yeni Şifre Belirle</h1>
        <p style={styles.subtitle}>Güvenli bir şifre seçin.</p>
        <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifre (en az 6 karakter)"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6B7280'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {password && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Şifre Gücü</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: getStrengthColor() }}>{getStrengthText()}</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  height: '100%',
                  background: getStrengthColor(),
                  transition: 'all 0.3s'
                }} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifre tekrar"
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
    borderRadius: '20px',
    padding: '48px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
  },
  iconContainer: {
    width: '96px',
    height: '96px',
    background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 10px 25px rgba(224, 108, 27, 0.2)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#6B7280',
    fontSize: '16px',
    textAlign: 'center'
  }
};

export default ResetPassword;