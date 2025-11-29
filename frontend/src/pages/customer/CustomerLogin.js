import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useCustomerAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings could not be loaded');
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/musteri-panel');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Use context login
        login(data.customer);
        toast.success('Giriş başarılı!');
        navigate('/musteri-panel');
      } else {
        toast.error(data.detail || 'Giriş başarısız');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <LogIn size={32} color="#22C55E" />
            </div>
            <h1 style={styles.title}>Müşteri Girişi</h1>
            <p style={styles.subtitle}>Hesabınıza giriş yaparak tekliflerinizi görüntüleyin</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Mail size={18} />
                E-posta Adresiniz
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Lock size={18} />
                Şifreniz
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Hesabınız yok mu?{' '}
                <Link to="/musteri-kayit" style={styles.link}>
                  Kayıt Olun
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 20px 80px',
    background: '#F9FAFB',
    marginTop: '72px', // Header height
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
  },
  cardHeader: {
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
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    background: '#22C55E',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
  },
  footerText: {
    fontSize: '14px',
    color: '#6B7280',
  },
  link: {
    color: '#22C55E',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default CustomerLogin;
