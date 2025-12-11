import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Lütfen email adresinizi girin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSent(true);
        toast.success('Şifre sıfırlama linki email adresinize gönderildi');
      } else {
        toast.error('Bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={styles.iconContainer}>
              <Mail size={40} style={{ color: '#e06c1b' }} />
            </div>
            <h1 style={styles.title}>Email Gönderildi!</h1>
            <p style={styles.subtitle}>
              Şifre sıfırlama linki <strong>{email}</strong> adresine gönderildi.
            </p>
            <p style={{ color: '#6B7280', marginTop: '16px', fontSize: '14px' }}>
              Email gelmedi mi? Spam klasörünü kontrol edin.
            </p>
          </div>
          <Button onClick={() => navigate('/customer/login')} style={{ width: '100%' }}>
            Giriş Sayfasına Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button
          onClick={() => navigate('/customer/login')}
          style={styles.backButton}
        >
          <ArrowLeft size={20} />
          Geri
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={styles.iconContainer}>
            <Mail size={40} style={{ color: '#e06c1b' }} />
          </div>
          <h1 style={styles.title}>Şifremi Unuttum</h1>
          <p style={styles.subtitle}>
            Email adresinizi girin, size şifre sıfırlama linki gönderelim.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Email Adresi</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
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
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '24px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s'
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
    fontSize: '16px',
    lineHeight: '1.6'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151'
  }
};

export default ForgotPassword;