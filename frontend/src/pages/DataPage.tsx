import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PlanRecord {
  id: number;
  planCode: string;
  patientId: number;
  goal: string;
  status?: string;
  fileName?: string;
  createdAt?: string;
}

const DataPage: React.FC = () => {
  const [records, setRecords] = useState<PlanRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api/plans';

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        toast.error('Erro ao carregar registros');
      }
    } catch (error) {
      toast.error('Erro de conexão com servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="stack gap-16">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Banco de dados</p>
          <h1>Registros e downloads</h1>
          <p className="subtitle">Acompanhe arquivos gerados e mantenha-os acessíveis.</p>
        </div>
        <div className="quick-actions">
          <button className="ghost-link" type="button" onClick={fetchRecords}>Sincronizar</button>
        </div>
      </header>

      <div className="surface">
        <div className="surface-header">
          <h2 className="surface-title">Planos armazenados</h2>
          <span className="pill">{records.length} arquivos</span>
        </div>
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : records.length > 0 ? (
          <div className="table">
            <div className="table-head">
              <span>ID</span>
              <span>Código</span>
              <span>Paciente</span>
              <span>Status</span>
            </div>
            {records.map((item) => (
              <div key={item.id} className="table-row">
                <span>#{item.id}</span>
                <span>{item.planCode}</span>
                <span>Paciente #{item.patientId}</span>
                <span className="tag">{item.status || 'Rascunho'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Nenhum plano armazenado ainda.</p>
        )}
      </div>
    </div>
  );
};

export default DataPage;
