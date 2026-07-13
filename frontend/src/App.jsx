import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import StartupBuilder from './pages/StartupBuilder';
import Patents from './pages/Patents';
import Papers from './pages/Papers';
import SavedIdeas from './pages/SavedIdeas';
import PitchCoach from './pages/PitchCoach';
import TechSynergy from './pages/TechSynergy';
import Hackathons from './pages/Hackathons';
import IdeaDiscovery from './pages/IdeaDiscovery';
import GithubViewer from './pages/GithubViewer';
import Profile from './pages/Profile';
import InnovationIntelligenceCenter from './components/InnovationIntelligenceCenter';
import AICanvasBackground from './components/AICanvasBackground';
import { useSearch } from './context/SearchContext';
import { usePortal } from './context/PortalContext';

function App() {
  const getInitialPageFromUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/presentation/')) {
      return 'presentation';
    }
    return 'dashboard';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPageFromUrl());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { query: globalQuery, setQuery: setGlobalQuery, activeInnovation, setActiveInnovation } = useSearch();
  const { portalMode, setPortalMode } = usePortal();

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/presentation/')) {
        setCurrentPage('presentation');
      } else {
        if (path === '/') {
          setCurrentPage('dashboard');
        } else {
          const page = path.replace('/', '');
          setCurrentPage(page || 'dashboard');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Authentication State management
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('is_logged_in') === 'true' && !!localStorage.getItem('auth_token');
  });
  const [userEmail, setUserEmail] = useState(() => {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return user.email || '';
  });
  const [userRole, setUserRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return user.role || 'student';
  });

  // Light Mode / Dark Mode state selection
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Run global CSS variables update based on current selection
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg-main', '#f8fafc');
      root.style.setProperty('--bg-sidebar', '#ffffff');
      root.style.setProperty('--bg-panel', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--bg-panel-solid', '#ffffff');
      root.style.setProperty('--bg-input', '#ffffff');
      root.style.setProperty('--bg-list-item', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--border-list-item', 'rgba(15, 23, 42, 0.08)');
      root.style.setProperty('--panel-shadow', '0 10px 30px rgba(15, 23, 42, 0.03)');
      root.style.setProperty('--text-main', '#0f172a');
      root.style.setProperty('--text-muted', '#475569');
      root.style.setProperty('--text-dim', '#94a3b8');
      root.style.setProperty('--border-color', 'rgba(15, 23, 42, 0.08)');
      root.style.setProperty('--border-color-glow', 'rgba(37, 99, 235, 0.2)');
      
      if (portalMode === 'student') {
        root.style.setProperty('--color-primary', '#2563eb');
        root.style.setProperty('--color-secondary', '#0d9488');
      } else {
        root.style.setProperty('--color-primary', '#0d9488');
        root.style.setProperty('--color-secondary', '#2563eb');
      }
      root.style.setProperty('--color-accent', '#4f46e5');
    } else {
      root.style.setProperty('--bg-main', '#000000');
      root.style.setProperty('--bg-sidebar', '#050505');
      root.style.setProperty('--bg-panel', 'rgba(18, 18, 18, 0.85)');
      root.style.setProperty('--bg-panel-solid', '#121212');
      root.style.setProperty('--bg-input', '#121212');
      root.style.setProperty('--bg-list-item', 'rgba(18, 18, 18, 0.4)');
      root.style.setProperty('--border-list-item', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--panel-shadow', '0 10px 30px rgba(0, 0, 0, 0.55)');
      root.style.setProperty('--text-main', '#f8fafc');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--text-dim', '#64748b');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--border-color-glow', 'rgba(59, 130, 246, 0.25)');
      
      if (portalMode === 'student') {
        root.style.setProperty('--color-primary', '#3b82f6');
        root.style.setProperty('--color-secondary', '#0d9488');
      } else {
        root.style.setProperty('--color-primary', '#0d9488');
        root.style.setProperty('--color-secondary', '#3b82f6');
      }
      root.style.setProperty('--color-accent', '#6366f1');
    }
    localStorage.setItem('theme', theme);
  }, [theme, portalMode]);

  // Synchronize portal switcher with user role on mount/login
  useEffect(() => {
    if (isLoggedIn) {
      const savedPortal = localStorage.getItem('portal_type');
      if (savedPortal) {
        setPortalMode(savedPortal);
      } else {
        setPortalMode(userRole === 'business' ? 'business' : 'student');
      }
    }
  }, [isLoggedIn, userRole, setPortalMode]);

  const handleLoginSuccess = (user) => {
    setUserEmail(user.email);
    setUserRole(user.role);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUserEmail('');
    setUserRole('student');
    setIsLoggedIn(false);
  };

  const handleImportToStartup = (item) => {
    setActiveInnovation(item);
    setCurrentPage('startup');
  };

  const renderPageContent = () => {
    // Portal access security gates (RBAC)
    if (portalMode === 'student') {
      if (['startup'].includes(currentPage)) {
        return (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--color-danger)', margin: '1.5rem' }}>
            <h2 style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-display)' }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>The Startup Builder is restricted to the Business Portal.</p>
          </div>
        );
      }
    } else if (portalMode === 'business') {
      if (['papers', 'github', 'synergy'].includes(currentPage)) {
        return (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--color-danger)', margin: '1.5rem' }}>
            <h2 style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-display)' }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>This academic module is restricted to the Student Portal.</p>
          </div>
        );
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <Dashboard 
              activeInnovation={activeInnovation} 
              setActiveInnovation={setActiveInnovation}
              globalQuery={globalQuery}
              setGlobalQuery={setGlobalQuery}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginTop: '1.5rem' }}>
              <InnovationIntelligenceCenter theme={theme} activeInnovation={activeInnovation} setCurrentPage={setCurrentPage} setGlobalQuery={setGlobalQuery} />
            </div>
          </>
        );
      case 'explorer':
        return <Explorer onImportToStartup={handleImportToStartup} setCurrentPage={setCurrentPage} setGlobalQuery={setGlobalQuery} />;
      case 'startup':
        return <StartupBuilder activeInnovation={activeInnovation} />;
      case 'patents':
        return <Patents onInspect={handleImportToStartup} setCurrentPage={setCurrentPage} setGlobalQuery={setGlobalQuery} />;
      case 'papers':
        return <Papers globalQuery={globalQuery} setGlobalQuery={setGlobalQuery} setCurrentPage={setCurrentPage} />;
      case 'github':
        return <GithubViewer globalQuery={globalQuery} setGlobalQuery={setGlobalQuery} />;
      case 'saved-ideas':
        return <SavedIdeas onInspect={handleImportToStartup} />;
      case 'synergy':
        return <TechSynergy />;
      case 'hackathons':
        return <Hackathons />;
      case 'discovery':
        return <IdeaDiscovery />;
      case 'pitch-coach':
        return (
          <PitchCoach 
            activeInnovation={activeInnovation} 
            onLaunchPresentation={(id) => {
              window.history.pushState(null, '', `/presentation/${id}`);
              setCurrentPage('presentation');
            }}
          />
        );
      case 'profile':
        return <Profile userEmail={userEmail} theme={theme} />;

      default:
        return <div>Page not found</div>;
    }
  };

  // Render Login page if session is inactive
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Early return for completely clean Presentation Layout (outside app-container, sidebar, main-content margins)
  if (currentPage === 'presentation') {
    return (
      <div className="presentation-layout" style={{ background: '#000', width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 9999999 }}>
        <PitchCoach 
          activeInnovation={activeInnovation} 
          forceProjector={true} 
          onExitPresentation={() => {
            window.history.pushState(null, '', '/');
            setCurrentPage('pitch-coach');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <AICanvasBackground theme={theme} />
      
      <header className="mobile-header">
        <button 
          onClick={() => setSidebarOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem'
          }}
        >
          <Menu size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: '#fff' }}>Invenza AI</strong>
          <span className="hud-sys-label" style={{ fontSize: '0.55rem' }}>OS v2.0</span>
        </div>
        
        <div style={{ width: '30px' }}></div>
      </header>

      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99
          }}
        />
      )}

      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={navigateTo} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userEmail={userEmail}
        handleLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="main-content">
        {renderPageContent()}
      </main>
    </div>
  );
}

export default App;
