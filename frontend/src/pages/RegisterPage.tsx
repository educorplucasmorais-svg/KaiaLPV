import React, { useState } from 'react';
import { useLocation, Link } from "wouter"; // Para redirecionar após o sucesso e navegar
import { toast } from 'sonner'; // Para notificações

const RegisterPage: React.FC = () => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordHash: '', // Nome da coluna no seu modelo Java
    role: 'USER'      // Valor padrão
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation(); // Hook do Wouter

  // Função para lidar com a mudança dos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.passwordHash.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    // CRÍTICO: O Spring Boot espera o JSON exatamente como está no modelo User.java
    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success('Cadastro realizado com sucesso! Redirecionando...');
        // Redireciona o usuário para a página de login
        setTimeout(() => setLocation('/login'), 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Falha no cadastro: ${errorData.message || 'Erro desconhecido.'}`);
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor Java.');
      console.error('Erro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Criar conta</h1>
      <p className="subtitle">Ganhe acesso à sua área personalizada e acompanhe a evolução.</p>

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
        
        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>

      <div className="helper">
        <span>Já tem uma conta?</span>
        <Link href="/login">Fazer login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;