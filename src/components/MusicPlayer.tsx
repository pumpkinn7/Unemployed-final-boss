import React, { useEffect, useRef, useState } from 'react';
import donationQR from '../assets/513993259_1480287213107862_2306719135690889745_n.jpg';
import backgroundMusic from '../assets/music/backgroundMusic.mp3';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Unemployed Final Boss',
          text: 'เว็บไซต์ด่า Resume แบบหยาบคาย',
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        alert('ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleDonation = () => {
    setShowDonation(!showDonation);
  };

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src={backgroundMusic} type="audio/mpeg" />
      </audio>

      <div className="floating-buttons">
        <button
          onClick={toggleMusic}
          className="control-button music-button"
          title="เปิด/ปิดเสียง"
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
        
        <a 
          href="https://github.com/pumpkinn7/Unemployed-final-boss.git" 
          target="_blank" 
          rel="noopener noreferrer"
          className="control-button github-button"
          title="GitHub Repository"
        >
          <span role="img" aria-label="GitHub">🐙</span>
        </a>
        
        <button
          onClick={handleShare}
          className="control-button share-button"
          title="แชร์เว็บไซต์"
        >
          <span role="img" aria-label="Share">📤</span>
        </button>
        
        <button
          onClick={toggleDonation}
          className="control-button donate-button"
          title="โดเนท"
        >
          <span role="img" aria-label="Donate">💰</span>
        </button>
      </div>

      {showDonation && (
        <div className="donation-modal">
          <div className="donation-content">
            <button className="close-button" onClick={toggleDonation}>×</button>
            <h3>สนับสนุนนักพัฒนา</h3>
            <div className="qr-container">
              <img src={donationQR} alt="Donation QR Code" className="donation-qr" />
            </div>
            <p className="donation-email">ติดต่อ: sm.septc137@gmail.com</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
