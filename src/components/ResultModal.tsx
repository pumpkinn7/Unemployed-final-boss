import { memo, useEffect, useState } from 'react';
import meWhenImage from '../assets/me when.jfif';

interface ResultModalProps {
  show: boolean;
  onHide: () => void;
  result: string;
}

const ResultModal = memo(({ show, onHide, result }: ResultModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

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

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 200000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  if (!show) return null;

  return (
    <div className="donation-modal" onClick={onHide}>
      <div className="donation-content result-modal-content" onClick={e => e.stopPropagation()}>
        <img 
          src={meWhenImage} 
          className="result-image mb-3"
          alt="Result"
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
              setIsCopied(true);
            }}
          >
            {isCopied ? 'คัดลอกแล้ว (ลอกบ่อยแบบนี้ไงเลยทำไรไม่เป็น)' : 'คัดลอก'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ResultModal;