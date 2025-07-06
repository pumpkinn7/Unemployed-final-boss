import { useEffect, useState } from 'react';
import donateImage from '../assets/45442422424.png';

interface DonateModalProps {
  show: boolean;
  onHide: () => void;
}

const DonateModal = ({ show, onHide }: DonateModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      const img = new window.Image();
      img.src = donateImage;
      img.onload = () => setImageLoaded(true);
    } else {
      document.body.style.overflow = 'unset';
      setImageLoaded(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      setImageLoaded(false);
    };
  }, [show]);

  if (!show) return null;
  if (!imageLoaded) {
    return (
      <div className="donation-modal" onClick={onHide}>
        <div className="donation-content" onClick={e => e.stopPropagation()}>
          <p className="text-center">รอสักครู่...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-modal" onClick={onHide}>
      <div className="donation-content" onClick={e => e.stopPropagation()}>
        <h3 className="text-center">i'm broke give me money😭</h3>
        <div className="qr-container">
          <img 
            src={donateImage} 
            alt="Donate QR Code" 
            className="donation-qr"
          />
        </div>
        <p className="donation-message text-center">ขอขอบคุณ <br /> สำหรับค่ากาแฟ(และเบียร์)</p>
      </div>
    </div>
  );
};

export default DonateModal;
