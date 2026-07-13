import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Bookmark, 
  Rocket, 
  Trophy, 
  Presentation, 
  Compass, 
  Cpu,
  Sparkles,
  LogOut,
  X,
  Shield,
  Sun,
  Moon,
  Settings,
  FolderGit2,
  User,
  AlertTriangle
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, userEmail, handleLogout, theme, toggleTheme }) => {
  const { portalMode, setPortalMode } = usePortal();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [missingRole, setMissingRole] = useState('');

  const handlePortalSwitchAttempt = (targetPortal) => {
    if (portalMode === targetPortal) return;
    
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const roles = authUser.roles || [authUser.role || 'student'];
    
    if (roles.includes(targetPortal)) {
      localStorage.setItem('portal_type', targetPortal);
      setPortalMode(targetPortal);
      setCurrentPage('dashboard');
    } else {
      setMissingRole(targetPortal);
      setShowWarningModal(true);
    }
  };

  const getMenuItems = () => {
    if (portalMode === 'student') {
      return [
        { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'My Profile Hub', icon: User },
        { id: 'hackathons', label: 'AI Mentor Hub', icon: Trophy },
        { id: 'explorer', label: 'Innovation Explorer', icon: Compass },
        { id: 'patents', label: 'Patent Search', icon: Search },
        { id: 'papers', label: 'Research Papers', icon: FileText },
        { id: 'github', label: 'GitHub Projects', icon: FolderGit2 },
        { id: 'synergy', label: 'Tech Synergy Lab', icon: Sparkles },
        { id: 'saved-ideas', label: 'Saved Innovations', icon: Bookmark },
        { id: 'pitch-coach', label: 'AI Pitch Coach', icon: Presentation }
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Business Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'My Profile Hub', icon: User },
        { id: 'startup', label: 'Startup Builder', icon: Rocket },
        { id: 'discovery', label: 'Business Idea Lab', icon: Cpu },
        { id: 'explorer', label: 'Competitor Analysis', icon: Compass },
        { id: 'patents', label: 'Patent Intelligence', icon: Search },
        { id: 'hackathons', label: 'Business Mentor', icon: Trophy },
        { id: 'pitch-coach', label: 'Pitch Deck Builder', icon: Presentation }
      ];
    }
  };

  const username = userEmail ? userEmail.split('@')[0] : 'Invenza Analyst';
  const initialLetter = username.charAt(0).toUpperCase();

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <button 
        className="sidebar-close-btn"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={18} />
      </button>

      {/* Missing Role Warning Portal Switcher Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 3, 5, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '450px',
            background: 'var(--bg-panel-solid)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 0 35px var(--color-primary)',
            color: 'var(--text-main)',
            boxSizing: 'border-box',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem', borderRadius: '50%', color: 'var(--color-danger)' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0 }}>Portal Account Missing</h3>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              You do not have a registered profile for the <strong>{missingRole === 'student' ? 'Student' : 'Business'} Portal</strong> under your current email address. Would you like to register one now?
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setShowWarningModal(false)}
                className="tech-button tech-button-outline"
                style={{ flex: 1, fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
                  const emailToPrefill = authUser.email || '';
                  handleLogout();
                  localStorage.setItem('prefill_register_email', emailToPrefill);
                  localStorage.setItem('prefill_register_portal', missingRole);
                  window.location.reload();
                }}
                className="tech-button"
                style={{ flex: 1, fontSize: '0.8rem', background: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }}
              >
                Register Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Account & Settings Modal Overlay */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 3, 5, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '450px',
            background: 'var(--bg-panel-solid)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 0 35px var(--color-primary)',
            color: 'var(--text-main)',
            boxSizing: 'border-box'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowProfileModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                padding: '0.45rem',
                borderRadius: '6px'
              }}>
                <Shield size={18} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: '0.6rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>[SSO_CLEARANCE_CONTROL]</span>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', margin: 0 }}>Account & Settings</h3>
              </div>
            </div>

            {/* Profile Detail Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Account Badge Card */}
              <div style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-color)',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#fff',
                  boxShadow: '0 0 10px var(--color-accent)'
                }}>
                  {initialLetter}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <strong style={{ fontSize: '1rem' }}>{username}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Revival Specialist & Analyst
                  </span>
                </div>
              </div>

              {/* 1. Account Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>// PROFILE_INFORMATION</span>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.6rem', 
                  fontSize: '0.75rem', 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-color)', 
                  padding: '0.85rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>clearance_email</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>{userEmail}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>assigned_role</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
                      {portalMode === 'student' ? 'Student Specialist' : 'B2B Startup Consultant'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>sso_provider</span>
                    <span style={{ color: 'var(--text-main)' }}>
                      {userEmail?.includes('gmail') ? 'Google Federated SSO' : 'Microsoft Live AD'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>clearance_level</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Level 4 Access</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>telemetry_status</span>
                    <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>99.2% Alignment</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>node_server</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>http://localhost:5000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>account_signature</span>
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                      SIG_{Math.abs(userEmail.split('@')[0].split('').reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0),0)).toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. System Configurations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>// SYSTEM_SETTINGS</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px' }}>
                  {/* Theme Mode Option */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visual Mode</span>
                    <button
                      onClick={toggleTheme}
                      className="tech-button tech-button-outline"
                      style={{ fontSize: '0.7rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {theme === 'light' ? <Moon size={11} /> : <Sun size={11} />}
                      <span>{theme === 'light' ? "Dark Theme" : "Light Theme"}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Platform Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          padding: '0.55rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px var(--color-primary)'
        }}>
          <Cpu size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.05em', color: 'var(--text-main)', textShadow: '0 0 8px rgba(255,255,255,0.1)' }}>
            Invenza AI
          </h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', fontWeight: 'bold' }}>
            TECH OS V2.0
          </span>
        </div>
      </div>

      {/* Sci-Fi Telemetry Barcode */}
      <div style={{ display: 'flex', gap: '2px', height: '14px', opacity: 0.25, marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
        {[4, 2, 8, 1, 6, 2, 4, 1, 8, 2, 4, 6, 1, 3, 5, 2, 4].map((w, i) => (
          <div key={i} style={{ width: `${w}px`, background: 'var(--text-muted)', height: '100%' }}></div>
        ))}
      </div>

      <div 
        onClick={() => setCurrentPage('profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          background: 'rgba(59, 130, 246, 0.04)',
          border: '1.5px solid var(--border-color-glow)',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color-glow)';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.1)';
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          color: '#fff',
          boxShadow: '0 0 12px var(--color-accent)'
        }}>
          {initialLetter}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <span style={{ 
            fontWeight: 700, 
            fontSize: '0.85rem', 
            color: 'var(--text-main)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }} title={userEmail || 'Invenza Analyst'}>
            {username}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Profile & Settings</span>
            <Settings size={10} style={{ opacity: 0.8 }} />
          </span>
        </div>
      </div>

      {/* Portal Switcher Toggle */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        padding: '0.2rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        gap: '0.2rem'
      }}>
        <button
          onClick={() => handlePortalSwitchAttempt('student')}
          style={{
            flex: 1,
            padding: '0.45rem 0',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            border: 'none',
            background: portalMode === 'student' ? 'var(--color-primary)' : 'transparent',
            color: portalMode === 'student' ? '#fff' : 'var(--text-muted)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Student Portal
        </button>
        <button
          onClick={() => handlePortalSwitchAttempt('business')}
          style={{
            flex: 1,
            padding: '0.45rem 0',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            border: 'none',
            background: portalMode === 'business' ? 'var(--color-primary)' : 'transparent',
            color: portalMode === 'business' ? '#fff' : 'var(--text-muted)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Startup Portal
        </button>
      </div>

      {/* Navigation Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent)' : 'transparent',
                borderRadius: '8px',
                color: isActive ? 'var(--color-secondary)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                borderLeft: isActive ? '3.5px solid var(--color-secondary)' : '3.5px solid transparent',
                textShadow: isActive ? '0 0 8px rgba(59, 130, 246, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--color-secondary)' : 'inherit' }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Log Out Control Panel */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.03)'
      }}>
        {/* Log out */}
        <button 
          onClick={handleLogout}
          className="tech-button tech-button-outline" 
          style={{ 
            fontSize: '0.8rem', 
            padding: '0.55rem', 
            width: '100%', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
            background: 'rgba(244, 63, 94, 0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.03)';
          }}
        >
          <LogOut size={13} />
          LOG OUT CLEAR CIPHER
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
