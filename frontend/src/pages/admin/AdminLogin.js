import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      toast.success('Giriş başarılı!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container} data-testid="admin-login-page">
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <Lock size={32} style={{ color: '#3BB77E' }} />
          </div>
          <h1 style={styles.title}>Admin Paneli</h1>
          <p style={styles.subtitle}>Teklif yönetim sistemine giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Kullanıcı Adı</label>
            <div style={styles.inputWrapper}>
              <User size={20} style={styles.inputIcon} />
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                style={styles.input}
                data-testid="username-input"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Şifre</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.inputIcon} />
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={styles.input}
                data-testid="password-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
            data-testid="login-button"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Varsayılan: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
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
    padding: '20px',
  },
  loginCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '48px',
    width: '100%',
    maxWidth: '450px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#F0FDF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#253D4E',
    marginBottom: '8px',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7E7E7E',
  },
  form: {
    marginBottom: '24px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#253D4E',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#7E7E7E',
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '48px',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    background: '#3BB77E',
    color: 'white',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '1px solid #ececec',
  },
  footerText: {
    fontSize: '14px',
    color: '#7E7E7E',
  },
};

export default AdminLogin;