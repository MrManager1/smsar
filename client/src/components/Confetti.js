import React from 'react';

const Confetti = () => {
  // A lightweight CSS-only confetti implementation
  const particles = Array.from({ length: 50 });
  const colors = ['#ffc107', '#0d6efd', '#198754', '#dc3545', '#0dcaf0'];
  const shapes = ['🎉', '🎊', '✨', '🎈'];

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden'}}>
      {particles.map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}vw`,
          top: `-5vh`,
          fontSize: `${Math.random() * 1.5 + 1}rem`,
          color: colors[Math.floor(Math.random() * colors.length)],
          animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5 + 0.5
        }}>
          {shapes[Math.floor(Math.random() * shapes.length)]}
        </div>
      ))}
      <style>{`@keyframes fall { to { transform: translateY(105vh) rotate(720deg); } }`}</style>
    </div>
  );
};

export default Confetti;