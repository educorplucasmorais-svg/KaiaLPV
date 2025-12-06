import React, { useEffect, useState } from 'react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    secureDownload: false,
  });
  const [users, setUsers] = useState<{ id: number; username?: string; email: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const stored = localStorage.getItem('users');
    const parsed = stored ? JSON.parse(stored) : [];
    setUsers(parsed);
  }, []);

  return (
    <div className="stack gap-16">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Configurações</p>
          <h1>Painel admin</h1>
          <p className="subtitle">Preferências gerais e segurança.</p>
        </div>
      </header>

      <div className="surface settings-grid">
        <div className="setting-item" style={{ gridColumn: '1 / -1' }}>
          <div>
            <h3>Usuários cadastrados</h3>
            <p className="muted">Selecione para visualizar os emails já criados.</p>
          </div>
          {users.length > 0 ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '420px' }}>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.7)',
                  color: 'var(--text)',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1rem'
                }}
              >
                <option value="">Selecione um usuário</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id.toString()}>
                    {u.username || 'Usuário'} — {u.email}
                  </option>
                ))}
              </select>
              <span className="pill">{users.length} cadastrado(s)</span>
            </div>
          ) : (
            <p className="muted">Nenhum usuário salvo localmente.</p>
          )}
        </div>

        <div className="setting-item">
          <div>
            <h3>Notificações</h3>
            <p className="muted">Alertas sobre novos planos e cadastros.</p>
          </div>
          <button className="pill-link" type="button" onClick={() => toggle('notifications')}>
            {settings.notifications ? 'Ativadas' : 'Desativadas'}
          </button>
        </div>

        <div className="setting-item">
          <div>
            <h3>Salvar automaticamente</h3>
            <p className="muted">Grava rascunhos de planos e formulários.</p>
          </div>
          <button className="pill-link" type="button" onClick={() => toggle('autoSave')}>
            {settings.autoSave ? 'Ativado' : 'Desativado'}
          </button>
        </div>

        <div className="setting-item">
          <div>
            <h3>Downloads seguros</h3>
            <p className="muted">Exige token para baixar arquivos sensíveis.</p>
          </div>
          <button className="pill-link" type="button" onClick={() => toggle('secureDownload')}>
            {settings.secureDownload ? 'Protegido' : 'Livre'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
