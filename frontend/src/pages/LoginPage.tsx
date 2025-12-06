// frontend/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useLocation, Link } from 'wouter';
import LogoCG from '../components/LogoCG';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [, setLocation] = useLocation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Chave mestra universal (aceita sem @)
    const masterEmail = 'admin';
    const masterPassword = 'admin';

    // Verificar se é a chave mestra
    if (formData.email === masterEmail && formData.password === masterPassword) {
      const masterUser = {
        id: 1,
        username: 'admin',
        email: masterEmail,
        password: masterPassword,
        role: 'ADMIN'
      };
      localStorage.setItem('currentUser', JSON.stringify(masterUser));
      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        setLocation('/dashboard');
      }, 400);
      return;
    }

    // Verificar localmente para testes
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) =>
      u.email === formData.email && u.password === formData.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        setLocation('/dashboard');
      }, 400);
    } else {
      toast.error('Email ou senha incorretos.');
    }
  };  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <LogoCG size={200} />
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="admin"
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

        <button className="primary-btn" type="submit">
          Entrar
        </button>
        </form>

        <div className="helper" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <span style={{ color: 'var(--muted)' }}>Ainda não tem conta?</span>
          <Link href="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Crie agora</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
