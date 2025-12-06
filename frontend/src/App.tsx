import { Switch, Route, Link } from "wouter";
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import './App.css';
import LogoFJ from './components/LogoFJ';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PlansPage from './pages/PlansPage';
import DataPage from './pages/DataPage';
import SettingsPage from './pages/SettingsPage';
import SplashPage from './pages/SplashPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
      setShowSplash(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowSplash(true);
    window.location.href = '/';
  };
  return (
    <div className="app-shell">
      <Toaster position="top-right" richColors />

      {showSplash ? (
        <SplashPage onEnter={() => setShowSplash(false)} />
      ) : (
        <>
          <div className="backdrop">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>

          <header className="topbar">
            <div className="brand">
              <LogoFJ size={50} />
              <div>
                <p className="brand-title">Fonte da Juventude</p>
                <p className="brand-subtitle">Dra. Cybele Ramos</p>
              </div>
            </div>

            <nav className="top-links">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="ghost-link">Dashboard</Link>
                  <span className="ghost-link" style={{ cursor: 'default' }}>
                    {currentUser?.username || currentUser?.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="pill-link"
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    Sair
                  </button>
                </>
              ) : null}
            </nav>
          </header>

          <main className={isLoggedIn ? "layout layout-fullscreen" : "layout"}>
            <section className="panel" style={isLoggedIn ? { gridColumn: '1 / -1', maxWidth: '100%' } : {}}>
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
        </>
      )}
    </div>
  );
}

export default App;