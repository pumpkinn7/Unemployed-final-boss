import { useEffect } from 'react';
import meWhenImage from '../assets/me when.jfif';

interface ResultModalProps {
  show: boolean;
  onHide: () => void;
  result: string;
}

function ResultModal({ show, onHide, result }: ResultModalProps) {
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
      <div className="donation-content result-modal-content" onClick={e => e.stopPropagation()}>
        <h4 className="mb-4">💀เหตุผลไม่มีงานทำ</h4>
        <img 
          src={meWhenImage} 
          alt="Me When" 
          className="result-image"
        />
        <div className="result-text">
          {result}
        </div>
        <div className="result-buttons">
          <button className="result-button btn-secondary" onClick={onHide}>
            ปิด
          </button>
          <button 
            className="result-button btn-copy"
            onClick={() => {
              navigator.clipboard.writeText(result);
            }}
          >
            คัดลอก
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;