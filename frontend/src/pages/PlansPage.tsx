import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// URL do Backend (Railway)
const API_URL = 'https://dracybeleguesdes.com.br';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Plan {
  id?: number;
  planCode: string;
  patientId: number;
  patientName?: string;
  treatments: string[];
  essentialTreatments?: string[];
  observations: string;
  status?: string;
}

interface Treatment {
  id: string;
  name: string;
  description: string;
  category: string;
}

const treatments: Treatment[] = [
  // Coluna 1
  { id: 'skincare', name: 'Skincare personalizado', description: 'Skincare personalizado', category: 'Skincare' },
  { id: 'suplementacao', name: 'Suplementação personalizada e exclusiva', description: 'Suplementação personalizada e exclusiva', category: 'Suplementação' },
  { id: 'vectra-hd', name: 'VECTRA HD', description: 'VECTRA HD', category: 'Diagnóstico' },
  { id: 'ultraformer-face-1', name: 'Ultraformer MPT Full Face – 1 sessão', description: 'Ultraformer MPT Full Face – 1 sessão', category: 'Ultraformer' },
  { id: 'ultraformer-face-2', name: 'Ultraformer MPT Full Face – 2 sessões', description: 'Ultraformer MPT Full Face – 2 sessões', category: 'Ultraformer' },
  { id: 'ultraformer-corpo-1', name: 'Ultraformer MPT Corpo – 1 sessão', description: 'Ultraformer MPT Corpo – 1 sessão', category: 'Ultraformer' },
  { id: 'ultraformer-corpo-2', name: 'Ultraformer MPT Corpo – 2 sessões', description: 'Ultraformer MPT Corpo – 2 sessões', category: 'Ultraformer' },
  { id: 'laser-discovery-1', name: 'Laser DISCOVERY PICO – 1 sessão', description: 'Laser DISCOVERY PICO – 1 sessão', category: 'Laser' },
  { id: 'laser-discovery-2', name: 'Laser DISCOVERY PICO – 2 sessões', description: 'Laser DISCOVERY PICO – 2 sessões', category: 'Laser' },
  { id: 'fotona-4d-1', name: 'Fotona 4D – 1 sessão', description: 'Fotona 4D – 1 sessão', category: 'Fotona' },
  { id: 'fotona-4d-2', name: 'Fotona 4D – 2 sessões', description: 'Fotona 4D – 2 sessões', category: 'Fotona' },
  { id: 'volnewmer-grandes', name: 'VOLNEWMER grandes áreas', description: 'VOLNEWMER para grandes áreas', category: 'VOLNEWMER' },
  { id: 'volnewmer-pequenas', name: 'VOLNEWMER pequenas áreas', description: 'VOLNEWMER para pequenas áreas', category: 'VOLNEWMER' },
  { id: 'botox-full-1', name: 'Botox Full Face – 1 sessão', description: 'Botox facial completo – 1 sessão', category: 'Botox' },
  { id: 'botox-full-2', name: 'Botox Full Face – 2 sessões', description: 'Botox facial completo – 2 sessões', category: 'Botox' },
  { id: 'botox-full-3', name: 'Botox Full Face – 3 sessões', description: 'Botox facial completo – 3 sessões', category: 'Botox' },
  { id: 'botox-1area', name: 'Botox – 1 área', description: 'Botox em 1 área específica', category: 'Botox' },

  // Coluna 2
  { id: 'pdrn', name: 'PDRN', description: 'PDRN', category: 'Regenerativo' },
  { id: 'preenchimento-labial', name: 'Preenchimento Labial', description: 'Preenchimento labial', category: 'Preenchimento' },
  { id: 'preenchimento-gluteo', name: 'Preenchimento Glúteo', description: 'Preenchimento glúteo', category: 'Preenchimento' },
  { id: 'mmp-3', name: 'MMP – 3 sessões', description: 'MMP – 3 sessões', category: 'MMP' },
  { id: 'mmp-5', name: 'MMP – 5 sessões', description: 'MMP – 5 sessões', category: 'MMP' },
  { id: 'mesclas', name: 'Mesclas', description: 'Mesclas', category: 'Aplicações' },
  { id: 'exossomos', name: 'Exossomos', description: 'Tratamento com exossomos', category: 'Aplicações' },
  { id: 'dutasterida', name: 'Dutasterida', description: 'Aplicação de dutasterida', category: 'Aplicações' },
  { id: 'suporte-cs', name: 'Suporte CS', description: 'Suporte CS', category: 'Suporte' },
  { id: 'drug-delivery', name: 'Drug delivery', description: 'Drug delivery', category: 'Aplicações' },
  { id: 'ebook-longevidade', name: 'Bônus: E-book premium de longevidade', description: 'E-book premium sobre longevidade', category: 'Bônus' },
  { id: 'ebook-cuidados', name: 'Bônus: E-book de cuidados diários essenciais', description: 'E-book de cuidados diários essenciais', category: 'Bônus' },
  { id: 'plano-manutencao', name: 'Bônus: Plano de manutenção pós-tratamento', description: 'Plano de manutenção pós-tratamento', category: 'Bônus' },
];

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [form, setForm] = useState({ patientId: '', observations: '' });
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [essentialTreatments, setEssentialTreatments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchPatients();
  }, []);

  // Buscar pacientes do backend
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await fetch(`${API_URL}/patients`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } else {
        // Fallback para localStorage se backend não disponível
        const stored = localStorage.getItem('patients');
        if (stored) {
          const localPatients = JSON.parse(stored);
          setPatients(localPatients);
          setFilteredPatients(localPatients);
        }
        toast.error('Usando dados locais - backend indisponível');
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      // Fallback para localStorage
      const stored = localStorage.getItem('patients');
      if (stored) {
        const localPatients = JSON.parse(stored);
        setPatients(localPatients);
        setFilteredPatients(localPatients);
      }
    } finally {
      setLoadingPatients(false);
    }
  };

  // Filtrar pacientes por nome
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length === 0) {
      setFilteredPatients(patients);
      setShowDropdown(false);
    } else {
      const filtered = patients.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowDropdown(true);
    }
  };

  // Selecionar paciente
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setForm({ ...form, patientId: patient.id.toString() });
    setShowDropdown(false);
  };

  const fetchPlans = () => {
    setLoading(true);
    const stored = localStorage.getItem('plans');
    if (stored) {
      setPlans(JSON.parse(stored));
    }
    setLoading(false);
  };

  const downloadPDF = (plan: Plan) => {
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
            <meta charset="UTF-8">
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
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #e8e8e8;
              }
              
              .treatments-columns li:last-child {
                border-bottom: none;
              }
              
              .payment-section {
                background: rgba(212, 175, 55, 0.1);
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
                border: 2px solid #d4af37;
                box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
              }
              
              .payment-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 15px;
              }
              
              .payment-field {
                margin-bottom: 15px;
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
                Essenciais: <strong style="color: #d4af37; font-size: 16px;">${essentials.length}</strong>
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

  const toggleTreatment = (treatmentId: string) => {
    setSelectedTreatments(prev => 
      prev.includes(treatmentId) 
        ? prev.filter(id => id !== treatmentId)
        : [...prev, treatmentId]
    );
  };

  const toggleEssential = (treatmentId: string) => {
    setEssentialTreatments(prev =>
      prev.includes(treatmentId)
        ? prev.filter(id => id !== treatmentId)
        : [...prev, treatmentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error('Selecione um paciente');
      return;
    }
    if (selectedTreatments.length === 0) {
      toast.error('Selecione pelo menos um tratamento');
      return;
    }

    const stored = localStorage.getItem('plans');
    const existing = stored ? JSON.parse(stored) : [];
    const planCode = `PL-${Date.now() % 10000}`;
    const newPlan = {
      id: Date.now(),
      planCode,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      treatments: selectedTreatments,
      essentialTreatments,
      observations: form.observations,
      status: 'Rascunho',
    };
    
    const updated = [newPlan, ...existing];
    localStorage.setItem('plans', JSON.stringify(updated));
    setPlans(updated);
    setForm({ patientId: '', observations: '' });
    setSelectedPatient(null);
    setSearchTerm('');
    setSelectedTreatments([]);
    setEssentialTreatments([]);
    toast.success('Plano registrado com sucesso!');
  };

  return (
    <div className="stack gap-16">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Planos</p>
          <h1>Gerar e acompanhar</h1>
          <p className="subtitle">Crie protocolos personalizados de rejuvenescimento para seu paciente.</p>
        </div>
      </header>

      <form className="surface form-grid" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--accent-strong)' }}>01. Seleção do Paciente</h2>
          <div className="input-control" style={{ position: 'relative' }}>
            <label htmlFor="patientSearch">Buscar Paciente *</label>
            <input
              id="patientSearch"
              name="patientSearch"
              type="text"
              placeholder={loadingPatients ? "Carregando pacientes..." : "Digite o nome do paciente"}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
              disabled={loadingPatients}
              autoComplete="off"
            />
            
            {/* Dropdown de pacientes */}
            {showDropdown && filteredPatients.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: 'var(--shadow)'
              }}>
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{patient.email}</div>
                  </div>
                ))}
              </div>
            )}

            {showDropdown && filteredPatients.length === 0 && searchTerm.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '12px 16px',
                zIndex: 100,
                color: 'var(--muted)'
              }}>
                Nenhum paciente encontrado
              </div>
            )}
          </div>

          {/* Paciente selecionado */}
          {selectedPatient && (
            <div style={{
              marginTop: '12px',
              padding: '12px 16px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--gold)',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Paciente selecionado: </span>
                <strong style={{ color: 'var(--gold)' }}>{selectedPatient.name}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPatient(null);
                  setSearchTerm('');
                  setForm({ ...form, patientId: '' });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--accent-strong)' }}>03. Seleção de Serviços</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="pill">{selectedTreatments.length} selecionados</span>
              <span className="pill" style={{ background: 'linear-gradient(135deg, var(--gold), var(--accent-strong))', color: 'white' }}>
                ★ {essentialTreatments.length} essenciais
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '12px',
            marginBottom: '1.5rem'
          }}>
            {treatments.map((treatment) => (
              <label
                key={treatment.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '6px',
                  border: selectedTreatments.includes(treatment.id) 
                    ? '2px solid var(--gold)' 
                    : '1px solid var(--border)',
                  background: selectedTreatments.includes(treatment.id)
                    ? 'rgba(212, 175, 55, 0.08)'
                    : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedTreatments.includes(treatment.id)
                    ? '0 2px 8px rgba(212, 175, 55, 0.2)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!selectedTreatments.includes(treatment.id)) {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedTreatments.includes(treatment.id)) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTreatments.includes(treatment.id)}
                  onChange={() => toggleTreatment(treatment.id)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--gold)',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '0.95rem',
                    color: 'var(--text)',
                    marginBottom: '2px'
                  }}>
                    {treatment.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--muted)' 
                  }}>
                    {treatment.description}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleEssential(treatment.id); }}
                  title="Marcar como essencial"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: essentialTreatments.includes(treatment.id) ? '2px solid var(--gold)' : '1px solid var(--border)',
                    background: essentialTreatments.includes(treatment.id)
                      ? 'linear-gradient(135deg, var(--gold), var(--accent-strong))'
                      : 'rgba(255,255,255,0.6)',
                    color: essentialTreatments.includes(treatment.id) ? 'white' : 'var(--muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: essentialTreatments.includes(treatment.id) ? '0 2px 10px rgba(212,175,55,0.35)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ★
                </button>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--accent-strong)' }}>04. Observações</h2>
          <div className="input-control">
            <label htmlFor="observations">Adicione observações sobre o protocolo...</label>
            <textarea
              id="observations"
              name="observations"
              placeholder="Observações adicionais, recomendações especiais, contraindicações..."
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.6)',
                color: 'var(--text)',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        <button type="submit" className="primary-btn">Salvar Proposta</button>
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
              <span>Código</span>
              <span>Paciente</span>
              <span>Tratamentos</span>
              <span>Essenciais</span>
              <span>Status</span>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="table-row">
                <span style={{ fontWeight: 600, color: 'var(--gold)' }}>{plan.planCode}</span>
                <span>Paciente #{plan.patientId}</span>
                <span className="truncate">{plan.treatments.length} tratamento(s)</span>
                <span className="truncate">{plan.essentialTreatments?.length || 0} essencial(is)</span>
                <span className="tag">{plan.status || 'Rascunho'}</span>
                <button
                  type="button"
                  onClick={() => downloadPDF(plan)}
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(135deg, var(--gold), var(--accent-strong))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(212,175,55,0.25)'
                  }}
                >
                  Baixar PDF
                </button>
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
