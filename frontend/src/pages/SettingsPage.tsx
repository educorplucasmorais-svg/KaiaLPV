import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    secureDownload: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
