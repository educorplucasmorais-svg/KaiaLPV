// Logo Cybele Guedes - Baseada no branding oficial
import React from 'react';

interface LogoCGProps {
  size?: number;
}

const LogoCG: React.FC<LogoCGProps> = ({ size = 200 }) => {
  return (
    <div style={{
      width: size + 'px',
      height: size + 'px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 4px 8px rgba(143, 113, 105, 0.4))',
    }}>
      <svg 
        viewBox="0 0 200 200" 
        width={size} 
        height={size}
        style={{ overflow: 'visible' }}
      >
        {/* C superior esquerdo */}
        <path 
          d="M25 75
             C25 35, 60 10, 100 10
             C120 10, 138 18, 150 32
             L150 32
             C150 32, 145 38, 140 44
             L135 50
             C126 40, 114 34, 100 34
             C72 34, 50 52, 50 75
             C50 90, 58 103, 72 112
             L60 130
             C38 116, 25 97, 25 75Z" 
          fill="#B8A99F"
        />
        
        {/* G inferior direito entrelaçado */}
        <path 
          d="M175 125
             C175 165, 140 190, 100 190
             C80 190, 62 182, 50 168
             L62 150
             C72 162, 86 170, 100 170
             C128 170, 150 152, 150 125
             C150 110, 142 97, 128 88
             L140 70
             C162 84, 175 103, 175 125Z
             M150 125
             L150 145
             L100 145
             L100 125
             L150 125Z" 
          fill="#B8A99F"
        />
      </svg>
    </div>
  );
};

export default LogoCG;
