import React, { useState } from 'react';

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
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const roles = authUser.roles || [authUser.role || 'student'];
    const isAdmin = roles.includes('admin') || (userEmail && userEmail.toLowerCase().includes('admin'));

    let items = [];
    if (portalMode === 'student') {
      items = [
        { id: 'dashboard', label: 'Student Dashboard', icon: 'dashboard' },
        { id: 'profile', label: 'My Profile Hub', icon: 'person' },
        { id: 'hackathons', label: 'AI Mentor Hub', icon: 'emoji_events' },
        { id: 'explorer', label: 'Innovation Explorer', icon: 'explore' },
        { id: 'patents', label: 'Patent Search', icon: 'search' },
        { id: 'papers', label: 'Research Papers', icon: 'description' },
        { id: 'github', label: 'GitHub Projects', icon: 'folder' },
        { id: 'synergy', label: 'Tech Synergy Lab', icon: 'auto_awesome' },
        { id: 'saved-ideas', label: 'Saved Innovations', icon: 'bookmark' },
        { id: 'pitch-coach', label: 'AI Pitch Coach', icon: 'co_present' }
      ];
    } else {
      items = [
        { id: 'dashboard', label: 'Business Dashboard', icon: 'dashboard' },
        { id: 'profile', label: 'My Profile Hub', icon: 'person' },
        { id: 'startup', label: 'Startup Builder', icon: 'rocket_launch' },
        { id: 'discovery', label: 'Business Idea Lab', icon: 'developer_board' },
        { id: 'explorer', label: 'Competitor Analysis', icon: 'explore' },
        { id: 'patents', label: 'Patent Intelligence', icon: 'search' },
        { id: 'hackathons', label: 'Business Mentor', icon: 'emoji_events' },
        { id: 'pitch-coach', label: 'Pitch Deck Builder', icon: 'co_present' }
      ];
    }

    if (isAdmin) {
      items.push({ id: 'admin-config', label: 'Admin Configuration', icon: 'shield' });
    }
    return items;
  };

  const authUserSession = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const username = authUserSession.name || (userEmail ? userEmail.split('@')[0] : 'Invenza Analyst');
  const initialLetter = username.charAt(0).toUpperCase();

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <button 
        className="sidebar-close-btn"
        onClick={() => setSidebarOpen(false)}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>

      {/* Missing Role Warning Portal Switcher Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(32, 33, 36, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
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
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem',
            position: 'relative',
            boxShadow: 'var(--shadow-5)',
            color: 'var(--text-main)',
            boxSizing: 'border-box',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem', borderRadius: '50%', color: 'var(--color-danger)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>warning</span>
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
          background: 'rgba(32, 33, 36, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
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
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                padding: '0.45rem',
                borderRadius: '6px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff' }}>shield</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', margin: 0 }}>Account & Settings</h3>
              </div>
            </div>

            {/* Profile Detail Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Account Badge Card */}
              <div style={{
                background: 'var(--bg-hover)',
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
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>
                    Revival Specialist & Analyst
                  </span>
                </div>
              </div>

              {/* 1. Account Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', display: 'block' }}>PROFILE INFORMATION</span>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.6rem', 
                  fontSize: '0.75rem', 
                  background: 'var(--bg-hover)', 
                  border: '1px solid var(--border-color)', 
                  padding: '0.85rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Email</span>
                    <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-secondary)', fontSize: '0.7rem' }}>{userEmail}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Role</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                      {portalMode === 'student' ? 'Student Specialist' : 'B2B Startup Consultant'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>SSO Provider</span>
                    <span style={{ color: 'var(--text-main)' }}>
                      {userEmail?.includes('gmail') ? 'Google Federated SSO' : 'Microsoft Live AD'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Clearance Level</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>Level 4 Access</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status</span>
                    <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>99.2% Alignment</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Node Server</span>
                    <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-dim)', fontSize: '0.7rem' }}>http://localhost:5000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Signature</span>
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', fontSize: '0.65rem' }}>
                      SIG_{Math.abs(userEmail.split('@')[0].split('').reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0),0)).toString(16).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. System Configurations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', display: 'block' }}>SYSTEM SETTINGS</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px' }}>
                  {/* Theme Mode Option */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visual Mode</span>
                    <button
                      onClick={toggleTheme}
                      className="tech-button tech-button-outline"
                      style={{ fontSize: '0.7rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {theme === 'light' ? <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>dark_mode</span> : <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>light_mode</span>}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>

        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', color: 'var(--text-main)' }}>
            Invenza <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </h2>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}>
            CORE V2.0
          </span>
        </div>
      </div>



      <div 
        onClick={() => setCurrentPage('profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          background: 'var(--color-primary-light)',
          border: '1px solid rgba(26, 115, 232, 0.2)',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#D2E3FC';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-primary-light)';
          e.currentTarget.style.borderColor = 'rgba(26, 115, 232, 0.2)';
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1A73E8, #1557B0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '0.9rem',
          color: '#fff',
          boxShadow: 'var(--shadow-2)',
          flexShrink: 0
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
          <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Profile & Settings</span>
            <span className="material-symbols-outlined" style={{ fontSize: '10px',  opacity: 0.8  }}>settings</span>
          </span>
        </div>
      </div>

      {/* Portal Switcher Toggle */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-hover)',
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
                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px',  color: isActive ? 'var(--color-primary)' : 'inherit'  }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Log Out Control Panel */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)'
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
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>logout</span>
          LOG OUT CLEAR CIPHER
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
