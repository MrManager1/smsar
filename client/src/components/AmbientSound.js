import React, { useState, useRef } from 'react';

const AmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain');
  const [volume, setVolume] = useState(0.5);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const audioRef = useRef(null);

  const sounds = {
    rain: { name: 'مطر', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
    cafe: { name: 'مقهى', url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
    waves: { name: 'أمواج', url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg' },
    forest: { name: 'غابة', url: 'https://actions.google.com/sounds/v1/animals/birds_in_forest.ogg' }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSound = (key) => {
    setCurrentSound(key);
    setIsPlaying(true);
    setTimeout(() => audioRef.current.play(), 100);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  if (isCollapsed) {
    return (
      <button 
        className="btn btn-info text-white rounded-circle shadow position-fixed floating-widget widget-sound" 
        style={{ bottom: '140px', left: '20px', width: '50px', height: '50px', zIndex: 1050 }}
        onClick={() => setIsCollapsed(false)}
        title="أصوات محيطة"
      >
        🎧
      </button>
    );
  }

  return (
    <div className="card shadow position-fixed floating-widget widget-sound" style={{ bottom: '140px', left: '20px', width: '200px', zIndex: 1050 }}>
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center py-2">
        <span className="small fw-bold">أجواء صوتية</span>
        <button className="btn-close btn-close-white small" onClick={() => setIsCollapsed(true)}></button>
      </div>
      <div className="card-body p-2">
        <audio ref={audioRef} src={sounds[currentSound].url} loop />
        
        <div className="d-grid gap-2 mb-3">
          {Object.entries(sounds).map(([key, sound]) => (
            <button key={key} className={`btn btn-sm ${currentSound === key ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => changeSound(key)}>
              {sound.name}
            </button>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-dark flex-grow-1" onClick={togglePlay}>{isPlaying ? '⏸ إيقاف' : '▶ تشغيل'}</button>
        </div>
        <input type="range" className="form-range mt-2" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} />
      </div>
    </div>
  );
};

export default AmbientSound;