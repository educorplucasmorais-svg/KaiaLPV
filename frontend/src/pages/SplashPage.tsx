import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import LogoFJ from '../components/LogoFJ';

interface SplashPageProps {
  onEnter: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      onEnter();
      setLocation('/login');
    }, 500);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClick();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e8e0d5, #d4c9bb 48%, #c9b8a3)',
        cursor: 'pointer',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease-out',
      }}
      onClick={handleClick}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center',
      }}>
        <LogoFJ size={140} />

        <div>
          <h1 style={{
            margin: '0 0 0.5rem',
            fontSize: '3rem',
            fontFamily: 'Cinzel, serif',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #d4af37, #8b6f47)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.05em',
          }}>
            Fonte da Juventude
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.3rem',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#8b6f47',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            Dra. Cybele Ramos
          </p>
        </div>

        <p style={{
          marginTop: '2rem',
          fontSize: '1.1rem',
          fontFamily: 'Cormorant Garamond, serif',
          color: '#8b7355',
          maxWidth: '500px',
          lineHeight: 1.8,
          fontStyle: 'italic',
        }}>
          Medicina Estética & Longevidade
        </p>

        <button
          style={{
            marginTop: '3rem',
            padding: '1rem 3rem',
            fontSize: '1.1rem',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#fff',
            background: 'linear-gradient(135deg, #d4af37, #8b6f47)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
          }}
        >
          Clique para continuar
        </button>
      </div>
    </div>
  );
};

export default SplashPage;
