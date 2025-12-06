import React, { useState } from 'react';
import { useLocation, Link } from "wouter";
import { toast } from 'sonner';
import LogoCG from '../components/LogoCG';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: '',
    role: 'USER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  // Função para lidar com a mudança dos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.passwordHash.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Salvar localmente para testes
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === formData.email)) {
      toast.error('Email já cadastrado.');
      return;
    }

    users.push({
      id: Date.now(),
      username: formData.username,
      email: formData.email,
      password: formData.passwordHash,
      role: 'USER'
    });

    localStorage.setItem('users', JSON.stringify(users));
    toast.success('Cadastro realizado com sucesso!');
    setTimeout(() => setLocation('/login'), 600);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <LogoCG size={200} />
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-control">
          <label htmlFor="username">Nome de usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Seu nome único"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="voce@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-control">
          <label htmlFor="passwordHash">Senha</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="passwordHash"
              name="passwordHash" // CRÍTICO: Deve corresponder ao campo no modelo Java
              placeholder="Crie uma senha segura"
              value={formData.passwordHash}
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
          Criar conta
        </button>
        </form>

        <div className="helper" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <span style={{ color: 'var(--muted)' }}>Já tem uma conta?</span>
          <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Fazer login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;