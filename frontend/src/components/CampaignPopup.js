import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const CampaignPopup = () => {
  const [campaign, setCampaign] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchActiveCampaign();
  }, []);

  const fetchActiveCampaign = async () => {
    try {
      // Check if popup was already shown in this session
      const popupShown = sessionStorage.getItem('campaignPopupShown');
      if (popupShown) {
        return;
      }

      const response = await fetch(`${backendUrl}/api/campaigns/active`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setCampaign(data);
          setIsVisible(true);
        }
      }
    } catch (error) {
      console.error('Kampanya yüklenemedi:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('campaignPopupShown', 'true');
  };

  const handleButtonClick = () => {
    handleClose();
    if (campaign.buton_linki.startsWith('http')) {
      window.location.href = campaign.buton_linki;
    } else {
      navigate(campaign.buton_linki);
    }
  };

  if (!isVisible || !campaign) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} style={styles.closeButton}>
          <X size={24} />
        </button>

        <div style={styles.content}>
          <h2 style={styles.title}>{campaign.baslik}</h2>
          <p style={styles.description}>{campaign.aciklama}</p>
          
          <Button onClick={handleButtonClick} style={styles.actionButton}>
            {campaign.buton_yazisi}
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
    animation: 'fadeIn 0.3s ease',
  },
  popup: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    padding: '32px',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s ease',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#F3F4F6',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6B7280',
    transition: 'all 0.2s',
  },
  content: {
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  description: {
    fontSize: '16px',
    color: '#6B7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  actionButton: {
    background: '#22C55E',
    color: 'white',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
};

export default CampaignPopup;
