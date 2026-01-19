import React, { useEffect, useState } from 'react';
import './Snowfall.css';

const Snowfall = ({ count = 150 }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const createSnowflakes = () => {
      const newSnowflakes = Array.from({ length: count }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 5 + 5}s`, // 5 to 10 seconds
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random(),
          width: `${Math.random() * 5 + 2}px`,
          height: `${Math.random() * 5 + 2}px`,
        };
        return <div key={i} className="snow" style={style} />;
      });
      setSnowflakes(newSnowflakes);
    };

    createSnowflakes();
  }, [count]);

  return <div className="snow-container" style={{ pointerEvents: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>{snowflakes}</div>;
};

export default Snowfall;