import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import PageNav from '../components/PageNav';

interface PlanRecord {
  id: number;
  planCode: string;
  patientId: number;
  treatments: string[];
  essentialTreatments?: string[];
  observations: string;
  status?: string;
  fileName?: string;
  createdAt?: string;
}

const DataPage: React.FC = () => {
  const [records, setRecords] = useState<PlanRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    setLoading(true);
    const stored = localStorage.getItem("plans");
    if (stored) {
      setRecords(JSON.parse(stored));
      toast.success("Sincronizado!");
    }
    setLoading(false);
  };

  const downloadPDF = (plan: PlanRecord) => {
    try {
      const printWindow = window.open("", "", "height=1100,width=900");
      if (!printWindow) {
        toast.error("Por favor, permita pop-ups para baixar o PDF");
        return;
      }
      const essentials = plan.essentialTreatments || [];
      const halfIndex = Math.ceil(plan.treatments.length / 2);
      const col1 = plan.treatments.slice(0, halfIndex).map(t => {
        const mark = essentials.includes(t) ? '★' : '✓';
        const color = essentials.includes(t) ? 'color: #d4af37; font-weight: 700;' : 'color: #4a3f35;';
        return `<li><span style="${color}">${mark}</span> ${t}</li>`;
      }).join("");
      const col2 = plan.treatments.slice(halfIndex).map(t => {
        const mark = essentials.includes(t) ? '★' : '✓';
        const color = essentials.includes(t) ? 'color: #d4af37; font-weight: 700;' : 'color: #4a3f35;';
        return `<li><span style="${color}">${mark}</span> ${t}</li>`;
      }).join("");

      printWindow.document.write(`
        <html>
          <head>
            <title>${plan.planCode}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
              * { box-sizing: border-box; }
              body {
                margin: 0;
                padding: 40px 50px;
                font-family: "Cormorant Garamond", serif;
                background: linear-gradient(135deg, #1a1614 0%, #2d2420 100%);
                color: #f5f5f5;
                line-height: 1.7;
                font-size: 14px;
              }
              @media print {
                body { padding: 30px; background: white; }
                @page { size: A4; margin: 15mm; }
              }
              .header {
                text-align: center;
                margin-bottom: 35px;
                border-bottom: 3px solid #d4af37;
                padding-bottom: 20px;
              }
              .logo {
                display: inline-block;
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #d4af37 0%, #c9962e 100%);
                border-radius: 50%;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 400;
                font-size: 34px;
                font-family: Georgia, Garamond, serif;
                letter-spacing: -2px;
                margin: 0 auto 15px;
                box-shadow: 0 6px 20px rgba(155, 133, 121, 0.4);
              }
              h1 { margin: 10px 0; font-family: "Cinzel", serif; color: #d4af37; font-size: 32px; letter-spacing: 2px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .subtitle { margin: 5px 0; color: #e8c77a; font-size: 16px; font-weight: 600; }
              .tagline { margin: 8px 0; color: #c9a962; font-size: 13px; font-style: italic; }
              
              .content {
                background: linear-gradient(135deg, #2a2420 0%, #1f1b18 100%);
                padding: 35px 40px;
                border-radius: 10px;
                border: 2px solid #d4af37;
                margin-bottom: 30px;
                box-shadow: 0 8px 24px rgba(212, 175, 55, 0.25), inset 0 1px 1px rgba(255,255,255,0.05);
              }
              
              h2 { 
                color: #d4af37; 
                font-family: "Cinzel", serif; 
                margin: 0 0 25px; 
                font-size: 20px; 
                text-transform: uppercase;
                letter-spacing: 1.5px;
                border-bottom: 2px solid #d4af37;
                padding-bottom: 10px;
                font-weight: 700;
              }
              
              h3 { 
                color: #e8c77a; 
                font-family: "Cinzel", serif; 
                margin: 25px 0 12px; 
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
              }
              
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 25px;
              }
              
              .info-item {
                background: rgba(212, 175, 55, 0.08);
                padding: 12px 15px;
                border-radius: 6px;
                border-left: 3px solid #d4af37;
                border: 1px solid rgba(212, 175, 55, 0.2);
              }
              
              .info-label {
                font-size: 11px;
                text-transform: uppercase;
                color: #c9a962;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              }
              
              .info-value {
                font-size: 15px;
                color: #f5f5f5;
                font-weight: 600;
              }
              
              .treatments-columns {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
                margin: 20px 0;
              }
              
              .treatments-columns ul {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              
              .treatments-columns li {
                padding: 8px 0;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                color: #e8e8e8;
                font-size: 13px;
                line-height: 1.5;
              }
              
              .treatments-columns li:last-child {
                border-bottom: none;
              }
              
              .payment-section {
                margin-top: 30px;
                padding: 25px;
                background: rgba(212, 175, 55, 0.1);
                border-radius: 8px;
                border: 2px solid #d4af37;
                box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
              }
              
              .payment-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-top: 15px;
              }
              
              .payment-field {
                background: rgba(212, 175, 55, 0.05);
                padding: 15px;
                border-radius: 6px;
                border: 1px solid rgba(212, 175, 55, 0.3);
                min-height: 60px;
              }
              
              .payment-field label {
                display: block;
                font-size: 11px;
                text-transform: uppercase;
                color: #d4af37;
                font-weight: 700;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
              }
              
              .payment-field .fill-line {
                border-bottom: 2px solid #d4af37;
                height: 25px;
                position: relative;
              }
              
              .payment-field .fill-line::after {
                content: '(preencher manualmente)';
                position: absolute;
                right: 0;
                bottom: -18px;
                font-size: 9px;
                color: #c9a962;
                font-style: italic;
              }
              
              .observations {
                background: rgba(212, 175, 55, 0.08);
                padding: 15px 20px;
                border-radius: 6px;
                margin: 20px 0;
                border-left: 4px solid #d4af37;
                border: 1px solid rgba(212, 175, 55, 0.2);
              }
              
              .footer {
                text-align: center;
                border-top: 3px solid #d4af37;
                padding-top: 20px;
                margin-top: 35px;
                font-size: 12px;
                color: #c9a962;
              }
              
              .footer p {
                margin: 6px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">FJ</div>
              <h1>FONTE DA JUVENTUDE</h1>
              <p class="subtitle">Dra. Cybele Ramos</p>
              <p class="tagline">Medicina Estética & Longevidade</p>
            </div>

            <div class="content">
              <h2>Plano de Tratamento</h2>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Código do Plano</div>
                  <div class="info-value" style="color: #d4af37;">${plan.planCode}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ID do Paciente</div>
                  <div class="info-value">Paciente #${plan.patientId}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">${plan.status || "Ativo"}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Data de Emissão</div>
                  <div class="info-value">${new Date().toLocaleDateString("pt-BR")}</div>
                </div>
              </div>

              <h3>Tratamentos Selecionados</h3>
              <div class="treatments-columns">
                <ul>${col1}</ul>
                <ul>${col2}</ul>
              </div>
              <p style="text-align: center; margin: 15px 0; font-weight: 600; color: #8b6f47;">
                Total: <strong style="color: #d4af37; font-size: 16px;">${plan.treatments.length}</strong> tratamento(s) | 
                Essenciais: <strong style="color: #d4af37; font-size: 16px;">${(plan.essentialTreatments || []).length}</strong>
              </p>

              ${plan.observations ? `
                <div class="observations">
                  <h3 style="margin-top: 0;">Observações</h3>
                  <p style="margin: 0;">${plan.observations}</p>
                </div>
              ` : ""}

              <div class="payment-section">
                <h3 style="margin-top: 0; text-align: center;">Informações de Pagamento</h3>
                <div class="payment-grid">
                  <div class="payment-field">
                    <label>Valor Total do Plano (R$)</label>
                    <div class="fill-line"></div>
                  </div>
                  <div class="payment-field">
                    <label>Forma de Pagamento</label>
                    <div class="fill-line"></div>
                  </div>
                  <div class="payment-field">
                    <label>Número de Parcelas</label>
                    <div class="fill-line"></div>
                  </div>
                  <div class="payment-field">
                    <label>Valor por Parcela (R$)</label>
                    <div class="fill-line"></div>
                  </div>
                </div>
                <div style="margin-top: 20px;">
                  <div class="payment-field">
                    <label>Observações de Pagamento</label>
                    <div class="fill-line" style="height: 40px;"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p style="font-weight: 600;">Fonte da Juventude - Medicina Estética & Longevidade</p>
              <p>Dra. Cybele Ramos | CRM XXXXX</p>
              <p style="font-size: 11px; margin-top: 10px;">Documento gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <script>
              setTimeout(() => { window.print(); }, 300);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("PDF aberto para impressão!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
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
              <span>Código</span>
              <span>Paciente</span>
              <span>Tratamentos</span>
              <span>Essenciais</span>
              <span>Status</span>
              <span>Ação</span>
            </div>
            {records.map((item) => (
              <div key={item.id} className="table-row">
                <span style={{ fontWeight: 600, color: "var(--gold)" }}>{item.planCode}</span>
                <span>Paciente #{item.patientId}</span>
                <span className="truncate">{item.treatments?.length || 0} tratamento(s)</span>
                <span className="truncate">{item.essentialTreatments?.length || 0} essencial(is)</span>
                <span className="tag">{item.status || "Rascunho"}</span>
                <button 
                  onClick={() => downloadPDF(item)}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(135deg, var(--gold), var(--accent-strong))",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.target as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(212, 175, 55, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.target as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                   Baixar PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Nenhum plano armazenado ainda.</p>
        )}
      </div>

      <PageNav 
        prevPage={{ label: 'Planos', href: '/plans' }}
        nextPage={{ label: 'Configurações', href: '/settings' }}
      />
    </div>
  );
};

export default DataPage;
