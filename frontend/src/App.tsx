import { Switch, Route, Link } from "wouter";
import { Toaster } from 'sonner';
import './App.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PlansPage from './pages/PlansPage';
import DataPage from './pages/DataPage';
import SettingsPage from './pages/SettingsPage';

const highlights = [
  { label: 'Usuários ativos', value: '5.2k' },
  { label: 'Taxa de satisfação', value: '97%' },
  { label: 'Tempo médio de retorno', value: '24h' },
];

const quickNav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/patients', label: 'Pacientes' },
  { href: '/plans', label: 'Planos' },
  { href: '/data', label: 'Banco de dados' },
  { href: '/settings', label: 'Configurações' },
];

function App() {
  return (
    <div className="app-shell">
      <Toaster position="top-right" richColors />

      <div className="backdrop">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">FJ</span>
          <div>
            <p className="brand-title">Fonte da Juventude</p>
            <p className="brand-subtitle">Vitalidade para sua rotina</p>
          </div>
        </div>

        <nav className="top-links">
          <Link href="/dashboard" className="ghost-link">Dashboard</Link>
          <Link href="/login" className="ghost-link">Entrar</Link>
          <Link href="/register" className="pill-link">Criar conta</Link>
        </nav>
      </header>

      <main className="layout">
        <section className="hero">
          <p className="eyebrow">Saúde, longevidade e clareza</p>
          <h1>Revitalize sua experiência com uma plataforma leve e acolhedora.</h1>
          <p className="lede">
            Centralize sua jornada de bem-estar e acompanhe cada progresso com
            um design que respira equilíbrio. Conecte-se, registre-se e mantenha
            sua vitalidade em dia.
          </p>

          <div className="highlights">
            {highlights.map((item) => (
              <div key={item.label} className="highlight-card">
                <p className="highlight-value">{item.value}</p>
                <p className="highlight-label">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="quick-nav">
            {quickNav.map((item) => (
              <Link key={item.href} href={item.href} className="chip-link">{item.label}</Link>
            ))}
          </div>
        </section>

        <section className="panel">
          <Switch>
            <Route path="/" component={DashboardPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/patients" component={PatientsPage} />
            <Route path="/plans" component={PlansPage} />
            <Route path="/data" component={DataPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route>404: Página Não Encontrada</Route>
          </Switch>
        </section>
      </main>
    </div>
  );
}

export default App;