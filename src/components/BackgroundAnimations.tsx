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

      {/* Floating Underwear - Keep original amount */}
      <div className="floating-container">
        {[...Array(6)].map((_, i) => (
          <div
            key={`underwear-${i}`}
            className="floating-underwear"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          >
            {underwearEmojis[Math.floor(Math.random() * underwearEmojis.length)]}
          </div>
        ))}
      </div>

      {/* Floating Fun Emojis - New category with different animation */}
      <div className="floating-container">
        {[...Array(10)].map((_, i) => (
          <div
            key={`fun-emoji-${i}`}
            className="floating-fun-emoji"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${10 + Math.random() * 15}s`,
              fontSize: `${16 + Math.random() * 16}px`
            }}
          >
            {funEmojis[Math.floor(Math.random() * funEmojis.length)]}
          </div>
        ))}
      </div>

      {/* Floating Particles - Reduced amount to balance */}
      <div className="floating-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Slow Moving Large Emojis - Occasional big ones */}
      <div className="floating-container">
        {[...Array(3)].map((_, i) => (
          <div
            key={`large-emoji-${i}`}
            className="floating-large-emoji"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 25}s`
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
