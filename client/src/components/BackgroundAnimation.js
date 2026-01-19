import React from 'react';
import './BackgroundAnimation.css';

const BackgroundAnimation = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
      <div className="bg-shape shape-4"></div>

      <div className="gradient-blob" style={{
        top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        animationDuration: '25s'
      }}></div>
      
      <div className="gradient-blob" style={{
        bottom: '-10%', right: '-10%', width: '60vw', height: '60vw',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        animationDuration: '30s', animationDelay: '-5s'
      }}></div>
      
      <div className="gradient-blob" style={{
        top: '40%', left: '40%', width: '40vw', height: '40vw',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        transform: 'translate(-50%, -50%)',
        animationDuration: '22s', animationDelay: '-10s', opacity: 0.4
      }}></div>
      
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backdropFilter: 'blur(60px)', WebkitBackdropFilter: 'blur(60px)', opacity: 0.4,
        background: 'rgba(255,255,255,0.1)'
      }}></div>
    </div>
  );
};

export default BackgroundAnimation;