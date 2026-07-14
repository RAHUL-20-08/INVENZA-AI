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
import AuthCallback from './components/AuthCallback';
import AdminConfig from './components/AdminConfig';

function App() {
  const getInitialPageFromUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/presentation/')) {
      return 'presentation';
    }
    if (path.startsWith('/auth/callback')) {
      return 'auth-callback';
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

  // OAuth Profile Onboarding form state
  const [onboardingForm, setOnboardingForm] = useState({
    college: '',
    department: '',
    yearOfStudy: '1',
    skills: '',
    interests: '',
    companyName: '',
    industry: '',
    companySize: '1-10',
    businessStage: 'Idea',
    website: ''
  });

  const handleOnboardingNeeded = (token, user, portal) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('portal_type', portal);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setUserEmail(user.email);
    setUserRole(portal);
    setPortalMode(portal);
    setCurrentPage('onboarding');
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const portalType = localStorage.getItem('portal_type');
    
    const profileFields = portalType === 'student' ? {
      fullName: userEmail.split('@')[0],
      college: onboardingForm.college,
      department: onboardingForm.department,
      yearOfStudy: onboardingForm.yearOfStudy,
      skills: onboardingForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: onboardingForm.interests.split(',').map(i => i.trim()).filter(Boolean)
    } : {
      fullName: userEmail.split('@')[0],
      companyName: onboardingForm.companyName,
      industry: onboardingForm.industry,
      companySize: onboardingForm.companySize,
      businessStage: onboardingForm.businessStage,
      website: onboardingForm.website
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/oauth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ portalType, profileFields })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('is_logged_in', 'true');
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      } else {
        alert(data.message || "Failed to complete onboarding.");
      }
    } catch(err) {
      alert("Verification server communication failed.");
    }
  };

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

  // Inactivity timeout monitor for security audit compliance (15 mins)
  useEffect(() => {
    if (!isLoggedIn) return;

    let timeoutId;
    const INACTIVITY_TIME = 15 * 60 * 1000; // 15 mins

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        alert("🔒 Session expired due to inactivity for security reasons.");
      }, INACTIVITY_TIME);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isLoggedIn]);

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
      case 'admin-config':
        return <AdminConfig theme={theme} portalAccent={portalMode === 'student' ? '#3b82f6' : '#0d9488'} />;

      default:
        return <div>Page not found</div>;
    }
  };

  // Early return for OAuth authorization code exchange callback loading screen
  if (currentPage === 'auth-callback') {
    return (
      <AuthCallback 
        onLoginSuccess={handleLoginSuccess}
        onOnboardingNeeded={handleOnboardingNeeded}
        onCancel={() => {
          window.history.pushState(null, '', '/');
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  // Early return for first-time login profile parameter completion form
  if (currentPage === 'onboarding') {
    const portalType = localStorage.getItem('portal_type') || 'student';
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        color: 'var(--text-main)',
        fontFamily: 'var(--font-sans)'
      }}>
        <form onSubmit={handleOnboardingSubmit} className="glass-panel animate-fade-in" style={{
          maxWidth: '550px',
          width: '100%',
          padding: '2.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-display)' }}>
            Complete Your {portalType === 'student' ? 'Student' : 'Business'} Profile
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
            First login verified. Please enter the remaining directory parameters to finish initializing your account.
          </p>

          {portalType === 'student' ? (
            <>
              <div>
                <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>COLLEGE / UNIVERSITY</label>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="e.g. MIT" 
                  value={onboardingForm.college} 
                  onChange={e => setOnboardingForm({...onboardingForm, college: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>DEPARTMENT</label>
                  <input 
                    type="text" 
                    className="tech-input" 
                    placeholder="e.g. Computer Science" 
                    value={onboardingForm.department} 
                    onChange={e => setOnboardingForm({...onboardingForm, department: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>YEAR</label>
                  <select 
                    className="tech-input" 
                    value={onboardingForm.yearOfStudy} 
                    onChange={e => setOnboardingForm({...onboardingForm, yearOfStudy: e.target.value})}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">Graduate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>TECHNICAL SKILLS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="e.g. React, Python, Machine Learning" 
                  value={onboardingForm.skills} 
                  onChange={e => setOnboardingForm({...onboardingForm, skills: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>AREAS OF INTEREST (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="e.g. Web3, Biotech, Generative AI" 
                  value={onboardingForm.interests} 
                  onChange={e => setOnboardingForm({...onboardingForm, interests: e.target.value})} 
                  required 
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>COMPANY NAME</label>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="e.g. Invenza Lab" 
                  value={onboardingForm.companyName} 
                  onChange={e => setOnboardingForm({...onboardingForm, companyName: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>INDUSTRY SECTOR</label>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="e.g. CleanTech / Artificial Intelligence" 
                  value={onboardingForm.industry} 
                  onChange={e => setOnboardingForm({...onboardingForm, industry: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>STAGE</label>
                  <select 
                    className="tech-input" 
                    value={onboardingForm.businessStage} 
                    onChange={e => setOnboardingForm({...onboardingForm, businessStage: e.target.value})}
                  >
                    <option value="Idea">Idea / R&D</option>
                    <option value="MVP">MVP / Prototype</option>
                    <option value="Seed">Seed Stage</option>
                    <option value="Growth">Growth Stage</option>
                  </select>
                </div>
                <div>
                  <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>COMPANY SIZE</label>
                  <select 
                    className="tech-input" 
                    value={onboardingForm.companySize} 
                    onChange={e => setOnboardingForm({...onboardingForm, companySize: e.target.value})}
                  >
                    <option value="1-10">1 - 10 people</option>
                    <option value="11-50">11 - 50 people</option>
                    <option value="51-200">51 - 200 people</option>
                    <option value="200+">200+ people</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="hud-sys-label" style={{ display: 'block', marginBottom: '0.35rem' }}>WEBSITE / LINKEDIN (OPTIONAL)</label>
                <input 
                  type="url" 
                  className="tech-input" 
                  placeholder="e.g. https://invenza.io" 
                  value={onboardingForm.website} 
                  onChange={e => setOnboardingForm({...onboardingForm, website: e.target.value})} 
                />
              </div>
            </>
          )}

          <button type="submit" className="tech-button" style={{ marginTop: '0.5rem', width: '100%' }}>
            Confirm & Access Dashboard
          </button>
        </form>
      </div>
    );
  }

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
