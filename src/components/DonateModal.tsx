import { useEffect } from 'react';
import donateImage from '../assets/45442422424.png';

interface DonateModalProps {
  show: boolean;
  onHide: () => void;
}

const DonateModal = ({ show, onHide }: DonateModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="donation-modal" onClick={onHide}>
      <div className="donation-content" onClick={e => e.stopPropagation()}>
        <h3 className="mb-4">i'm broke give me money</h3>
        <div className="qr-container">
          <img 
            src={donateImage} 
            alt="Donate QR Code" 
            className="donation-qr"
          />
        </div>
        <p className="donation-message">ขอขอบคุณ สำหรับค่ากาแฟ (และเบียร์)</p>
      </div>
    </div>
  );
};

export default DonateModal;
