// Componente de navegação entre páginas
import React from 'react';
import { Link } from 'wouter';

interface PageNavProps {
  prevPage?: { label: string; href: string };
  nextPage?: { label: string; href: string };
}

const PageNav: React.FC<PageNavProps> = ({ prevPage, nextPage }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: prevPage && nextPage ? 'space-between' : prevPage ? 'flex-start' : 'flex-end',
      alignItems: 'center',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid var(--border)',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {prevPage && (
        <Link href={prevPage.href}>
          <a style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.4)',
            color: 'var(--text)',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '1.1rem' }}>←</span>
            <span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Voltar</span>
              <span style={{ display: 'block' }}>{prevPage.label}</span>
            </span>
          </a>
        </Link>
      )}
      
      {nextPage && (
        <Link href={nextPage.href}>
          <a style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '6px',
            border: '1px solid var(--gold)',
            background: 'linear-gradient(135deg, var(--gold), var(--accent-strong))',
            color: 'white',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
          }}>
            <span style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Próximo</span>
              <span style={{ display: 'block' }}>{nextPage.label}</span>
            </span>
            <span style={{ fontSize: '1.1rem' }}>→</span>
          </a>
        </Link>
      )}
    </div>
  );
};

export default PageNav;
