import React from 'react';
import PageNav from '../components/PageNav';

const kpis = [
  { label: 'Pacientes ativos', value: '128', trend: '+8 esta semana' },
  { label: 'Planos gerados', value: '342', trend: '+22 nos últimos 7 dias' },
  { label: 'Taxa de conclusão', value: '91%', trend: 'metas completadas' },
];

const recentPlans = [
  { id: 'PL-342', patient: 'Ana Costa', status: 'Emitido', date: '05/12' },
  { id: 'PL-341', patient: 'João Silva', status: 'Revisão', date: '04/12' },
  { id: 'PL-340', patient: 'Marina Dias', status: 'Concluído', date: '03/12' },
];

const quickActions = [
  { label: 'Cadastrar paciente', href: '/patients' },
  { label: 'Gerar novo plano', href: '/plans' },
  { label: 'Ver registros', href: '/data' },
  { label: 'Configurações', href: '/settings' },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="stack gap-16">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Painel</p>
          <h1>Visão geral do cuidado</h1>
          <p className="subtitle">Acompanhe pacientes, planos e status em um só lugar.</p>
        </div>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <a key={action.href} className="chip-link" href={action.href}>{action.label}</a>
          ))}
        </div>
      </header>

      <div className="card-grid">
        {kpis.map((item) => (
          <div key={item.label} className="card">
            <p className="card-label">{item.label}</p>
            <p className="card-value">{item.value}</p>
            <p className="card-hint">{item.trend}</p>
          </div>
        ))}
      </div>

      <div className="surface">
        <div className="surface-header">
          <div>
            <p className="eyebrow">Últimos planos</p>
            <h2 className="surface-title">Atividades recentes</h2>
          </div>
          <a className="ghost-link" href="/plans">Gerenciar</a>
        </div>
        <div className="table">
          <div className="table-head">
            <span>ID</span>
            <span>Paciente</span>
            <span>Status</span>
            <span>Data</span>
          </div>
          {recentPlans.map((plan) => (
            <div key={plan.id} className="table-row">
              <span>{plan.id}</span>
              <span>{plan.patient}</span>
              <span className="tag">{plan.status}</span>
              <span>{plan.date}</span>
            </div>
          ))}
        </div>
      </div>

      <PageNav 
        nextPage={{ label: 'Pacientes', href: '/patients' }}
      />
    </div>
  );
};

export default DashboardPage;
