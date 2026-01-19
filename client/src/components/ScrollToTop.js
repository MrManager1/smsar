import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button 
          onClick={scrollToTop} 
          className="btn btn-primary rounded-circle shadow-lg position-fixed fade-in border-2 border-white floating-widget widget-scroll"
          style={{ bottom: '90px', right: '20px', width: '45px', height: '45px', zIndex: 1030, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="العودة للأعلى"
        >
          <span style={{fontSize: '1.2rem'}}>⬆️</span>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;