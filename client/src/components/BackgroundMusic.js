import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showControl, setShowControl] = useState(false);
  const audioRef = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        try {
          // محاولة التشغيل المباشر
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // إذا منع المتصفح التشغيل، ننتظر أول نقرة من المستخدم
          const enableAudio = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Playback failed", e));
            }
            // إزالة المستمع بعد التشغيل الناجح
            document.removeEventListener('click', enableAudio);
          };
          document.addEventListener('click', enableAudio);
        }
      }
    };
    attemptAutoplay();
  }, []);

  const handleMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying) setShowControl(true);
  };

  const handleMouseLeave = () => {
    if (showControl) {
      hideTimer.current = setTimeout(() => {
        setShowControl(false);
      }, 3000);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Playback prevented:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
      if (!isPlaying) setShowControl(true);
    }
  };

  return (
    <div 
      className="position-fixed" 
      style={{ 
        bottom: '140px', left: '20px', zIndex: 1040,
        transition: 'opacity 0.5s',
        opacity: isPlaying && !showControl ? 0.5 : 1
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* موسيقى بيانو هادئة */}
      <audio
        ref={audioRef}
        loop
        autoPlay
        // قم واستبدال الرابط أدناه برابط الملف الصوتي الجديد
        src="https://ia800207.us.archive.org/29/items/CanonInD_201806/Canon%20in%20D.mp3"
      />

      {showControl && (
        <div className="card shadow-lg mb-2 slide-up border-0 text-center" style={{ width: '150px', background: 'rgba(255,255,255,0.95)', borderRadius: '15px' }}>
           <div className="card-body p-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="fw-bold text-muted">🔊 الصوت</small>
                <button type="button" className="btn-close btn-sm" onClick={() => setShowControl(false)}></button>
              </div>
              <input 
                type="range" 
                className="form-range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))} 
              />
           </div>
        </div>
      )}

      <button 
        className={`btn rounded-circle shadow-lg d-flex align-items-center justify-content-center border-2 border-white ${isPlaying ? 'btn-info text-white' : 'btn-secondary'}`} 
        style={{ width: '50px', height: '50px', transition: 'all 0.3s' }}
        onClick={togglePlay}
        title={isPlaying ? "إيقاف الموسيقى" : "تشغيل موسيقى هادئة"}
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
    </div>
  );
};

export default BackgroundMusic;