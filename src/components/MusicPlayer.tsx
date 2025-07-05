import React, { useEffect, useRef, useState } from 'react';
import backgroundMusic from '../assets/music/backgroundMusic.mp3';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src={backgroundMusic} type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleMusic}
        className="music-button"
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </>
  );
};

export default MusicPlayer;
