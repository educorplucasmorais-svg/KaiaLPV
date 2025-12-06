// Logo Cybele Guedes
import React from 'react';

interface LogoCGProps {
  size?: number;
}

const LogoCG: React.FC<LogoCGProps> = ({ size = 200 }) => {
  return (
    <div style={{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: '#9B8579',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 ' + (size * 0.04) + 'px ' + (size * 0.15) + 'px rgba(155, 133, 121, 0.4)',
      overflow: 'hidden'
    }}>
      <div style={{
        fontSize: (size * 0.55) + 'px',
        fontWeight: 400,
        fontFamily: 'Georgia, Garamond, serif',
        color: 'white',
        letterSpacing: (size * -0.03) + 'px',
        textAlign: 'center',
        lineHeight: '1'
      }}>
        CG
      </div>
    </div>
  );
};

export default LogoCG;
