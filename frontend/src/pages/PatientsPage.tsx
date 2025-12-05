import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Patient {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api/patients';

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        toast.error('Erro ao carregar pacientes');
      }
    } catch (error) {
      toast.error('Erro de conexão com servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Informe nome e email');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
        }),
      });

      if (response.ok || response.status === 201) {
        const newPatient = await response.json();
        setPatients([newPatient, ...patients]);
        setForm({ name: '', email: '', phone: '' });
        toast.success('Paciente cadastrado com sucesso!');
      } else {
        toast.error('Erro ao cadastrar paciente');
      }
    } catch (error) {
      toast.error('Erro de conexão com servidor');
      console.error(error);
    }
  };

  return (
    <div className="stack gap-16">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Pacientes</p>
          <h1>Cadastro rápido</h1>
          <p className="subtitle">Registre pacientes e vincule planos na sequência.</p>
        </div>
      </header>

      <form className="surface form-grid" onSubmit={handleSubmit}>
        <div className="input-control">
          <label htmlFor="name">Nome completo</label>
          <input
            id="name"
            name="name"
            placeholder="Paciente"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="input-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="paciente@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <button type="submit" className="primary-btn">Cadastrar</button>
      </form>

      <div className="surface">
        <div className="surface-header">
          <h2 className="surface-title">Lista de pacientes</h2>
          <span className="pill">{patients.length} ativos</span>
        </div>
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : patients.length > 0 ? (
          <div className="table">
            <div className="table-head">
              <span>ID</span>
              <span>Nome</span>
              <span>Email</span>
              <span>Telefone</span>
            </div>
            {patients.map((p) => (
              <div key={p.id} className="table-row">
                <span>#{p.id}</span>
                <span>{p.name}</span>
                <span>{p.email}</span>
                <span className="tag muted">{p.phone ?? '—'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Nenhum paciente cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
