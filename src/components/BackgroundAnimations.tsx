import React from 'react';
import '../styles/animations.css';

const BackgroundAnimations: React.FC = () => {
  // Different emoji categories for variety
  const underwearEmojis = ['🩲', '👙', '🩱'];
  const funEmojis = ['😂', '🙏🏻', '🤠', '🤬', '👌🏻', '🥵', '😭', '💀', '👻', '☠️', '🤡', '🥹', '🥺', '💩', '👽', '🧸', '🌈', '🔥', '🔞', '❓'];
  
  return (
    <>
      {/* Stars Animation */}
      <div className="stars-background" />

      {/* Floating Underwear - ลดจำนวนลง */}
      <div className="floating-container">
        {[...Array(4)].map((_, i) => (
          <div
            key={`underwear-${i}`}
            className="floating-underwear"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 15}s`
            }}
          >
            {underwearEmojis[Math.floor(Math.random() * underwearEmojis.length)]}
          </div>
        ))}
      </div>

      {/* Floating Fun Emojis - ลดจำนวนลง */}
      <div className="floating-container">
        {[...Array(6)].map((_, i) => (
          <div
            key={`fun-emoji-${i}`}
            className="floating-fun-emoji"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 18}s`,
              fontSize: `${16 + Math.random() * 16}px`
            }}
          >
            {funEmojis[Math.floor(Math.random() * funEmojis.length)]}
          </div>
        ))}
      </div>

      {/* Floating Particles - ลดจำนวนลง */}
      <div className="floating-container">
        {[...Array(5)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>

      {/* Slow Moving Large Emojis - ลดจำนวนลง */}
      <div className="floating-container">
        {[...Array(2)].map((_, i) => (
          <div
            key={`large-emoji-${i}`}
            className="floating-large-emoji"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${25 + Math.random() * 30}s`
            }}
          >
            {['🔥', '💀', '🤡', '👻', '🌈'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </>
  );
};

export default BackgroundAnimations;
