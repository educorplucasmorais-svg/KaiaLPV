// Logo Cybele Guedes - Para uso no topbar
import React from 'react';

interface LogoFJProps {
  size?: number;
}

const LogoFJ: React.FC<LogoFJProps> = ({ size = 140 }) => {
  return (
    <div style={{
      width: size + 'px',
      height: size + 'px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg 
        viewBox="0 0 200 200" 
        width={size} 
        height={size}
        style={{ overflow: 'visible' }}
      >
        {/* Letra C */}
        <path 
          d="M30 100
             C30 50, 70 15, 110 15
             C135 15, 155 25, 170 40
             L155 58
             C143 45, 128 35, 110 35
             C80 35, 55 62, 55 100
             C55 120, 65 138, 80 150
             L65 168
             C42 152, 30 128, 30 100Z" 
          fill="#8F7169"
        />
        
        {/* Letra G entrelaçada */}
        <path 
          d="M170 100
             C170 150, 130 185, 90 185
             C65 185, 45 175, 30 160
             L45 142
             C57 155, 72 165, 90 165
             C120 165, 145 138, 145 100
             C145 80, 135 62, 120 50
             L135 32
             C158 48, 170 72, 170 100Z
             M145 100
             L145 115
             L100 115
             L100 100
             L145 100Z" 
          fill="#8F7169"
        />
      </svg>
    </div>
  );
};

export default LogoFJ;
