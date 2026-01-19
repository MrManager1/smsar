import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            setIsActive(false);
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
            if (mode === 'work') {
              setMode('break');
              setMinutes(5);
            } else {
              setMode('work');
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  if (isCollapsed) {
    return (
      <button 
        className="btn btn-danger rounded-circle shadow position-fixed floating-widget widget-pomodoro" 
        style={{ bottom: '20px', left: '20px', width: '50px', height: '50px', zIndex: 1050 }}
        onClick={() => setIsCollapsed(false)}
        title="مؤقت التركيز"
      >
        ⏱️
      </button>
    );
  }

  return (
    <div className="card shadow position-fixed bg-white floating-widget widget-pomodoro" style={{ bottom: '20px', left: '20px', width: '200px', zIndex: 1050 }}>
      <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center py-2">
        <span className="small fw-bold">{mode === 'work' ? 'وقت العمل 💼' : 'استراحة ☕'}</span>
        <button className="btn-close btn-close-white small" onClick={() => setIsCollapsed(true)}></button>
      </div>
      <div className="card-body text-center py-3">
        <h2 className="display-6 fw-bold mb-3">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </h2>
        <div className="d-flex justify-content-center gap-2">
          <button 
            className={`btn btn-sm ${isActive ? 'btn-warning' : 'btn-success'}`} 
            onClick={toggleTimer}
          >
            {isActive ? 'إيقاف' : 'بدء'}
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={resetTimer}>
            إعادة
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;