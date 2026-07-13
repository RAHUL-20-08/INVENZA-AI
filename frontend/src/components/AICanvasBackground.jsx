import React from 'react';

const AICanvasBackground = ({ theme }) => {
  const bg = theme === 'light'
    ? 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #cbd5e1 100%)'
    : 'radial-gradient(circle at 50% 50%, #080808 0%, #000000 100%)';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: bg,
      zIndex: -2,
      pointerEvents: 'none',
      transition: 'background 0.4s ease'
    }} />
  );
};

export default AICanvasBackground;
