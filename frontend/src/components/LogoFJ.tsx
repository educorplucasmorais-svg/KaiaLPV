// Logo Fonte da Juventude
import React from 'react';

interface LogoFJProps {
  size?: number;
}

const LogoFJ: React.FC<LogoFJProps> = ({ size = 140 }) => {
  return (
    <div style={{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: '#9B8579',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 ' + (size * 0.06) + 'px ' + (size * 0.2) + 'px rgba(155, 133, 121, 0.5)',
      overflow: 'hidden'
    }}>
      <div style={{
        fontSize: (size * 0.46) + 'px',
        fontWeight: 400,
        fontFamily: 'Georgia, Garamond, serif',
        color: 'white',
        letterSpacing: (size * -0.03) + 'px',
        textAlign: 'center',
        lineHeight: '1'
      }}>
        FJ
      </div>
    </div>
  );
};

export default LogoFJ;
