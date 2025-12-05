// frontend/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'wouter';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (response.ok) {
        toast.success('Login realizado com sucesso!');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || 'Não foi possível entrar. Tente novamente.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor.');
      console.error('Erro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Entrar</h1>
      <p className="subtitle">Acesse sua conta para acompanhar sua jornada.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-control">
          <label htmlFor="password">Senha</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha secreta"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="helper">
        <span>Ainda não tem conta?</span>
        <Link href="/register">Crie agora</Link>
      </div>
    </div>
  );
};

export default LoginPage;
