import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Plan {
  id?: number;
  planCode: string;
  patientId: number;
  goal: string;
  status?: string;
}

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({ patientId: '', goal: '', planCode: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api/plans';

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        toast.error('Erro ao carregar planos');
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
    if (!form.patientId || !form.goal) {
      toast.error('Informe paciente e objetivo do plano');
      return;
    }

    try {
      const planCode = `PL-${Date.now() % 10000}`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planCode,
          patientId: parseInt(form.patientId),
          goal: form.goal,
          status: 'Rascunho',
        }),
      });

      if (response.ok || response.status === 201) {
        const newPlan = await response.json();
        setPlans([newPlan, ...plans]);
        setForm({ patientId: '', goal: '', planCode: '' });
        toast.success('Plano registrado com sucesso!');
      } else {
        toast.error('Erro ao registrar plano');
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
          <p className="eyebrow">Planos</p>
          <h1>Gerar e acompanhar</h1>
          <p className="subtitle">Crie planos personalizados e monitore o status.</p>
        </div>
      </header>

      <form className="surface form-grid" onSubmit={handleSubmit}>
        <div className="input-control">
          <label htmlFor="patientId">ID do Paciente</label>
          <input
            id="patientId"
            name="patientId"
            type="number"
            placeholder="ID do paciente"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          />
        </div>
        <div className="input-control">
          <label htmlFor="goal">Objetivo / Observação</label>
          <input
            id="goal"
            name="goal"
            placeholder="Metas ou observações do plano"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          />
        </div>
        <button type="submit" className="primary-btn">Salvar plano</button>
      </form>

      <div className="surface">
        <div className="surface-header">
          <h2 className="surface-title">Planos registrados</h2>
          <span className="pill">{plans.length} itens</span>
        </div>
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : plans.length > 0 ? (
          <div className="table">
            <div className="table-head">
              <span>ID</span>
              <span>Código</span>
              <span>Objetivo</span>
              <span>Status</span>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="table-row">
                <span>#{plan.id}</span>
                <span>{plan.planCode}</span>
                <span className="truncate">{plan.goal}</span>
                <span className="tag">{plan.status || 'Rascunho'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Nenhum plano registrado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default PlansPage;
