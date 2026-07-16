import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import aiBrainLogo from '../assets/ai_brain_logo_transparent.png';

const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, userEmail, handleLogout, theme, toggleTheme }) => {
  const { portalMode, setPortalMode } = usePortal();
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

  const authUserSession = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const roles = authUserSession.roles || [authUserSession.role || 'student'];
  const isFounder = roles.includes('founder');
  const isSuperAdmin = roles.includes('superadmin') || (userEmail && userEmail.toLowerCase().includes('superadmin'));
  const isAdmin = roles.includes('admin') || (userEmail && userEmail.toLowerCase().includes('admin'));
  const username = authUserSession.name || (userEmail ? userEmail.split('@')[0] : 'Invenza User');
  const initialLetter = username.charAt(0).toUpperCase();

  // Student portal menu groups
  const studentMenuGroups = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
        { id: 'profile', label: 'My Profile Hub', icon: 'person' },
        { id: 'hackathons', label: 'AI Mentor Hub', icon: 'psychology' },
      ]
    },
    {
      label: 'Research',
      items: [
        { id: 'explorer', label: 'Innovation Explorer', icon: 'explore' },
        { id: 'patents', label: 'Patent Search', icon: 'search' },
        { id: 'papers', label: 'Research Papers', icon: 'description' },
        { id: 'github', label: 'GitHub Projects', icon: 'code' },
      ]
    },
    {
      label: 'Tools',
      items: [
        { id: 'synergy', label: 'Tech Synergy Lab', icon: 'hub' },
        { id: 'saved-ideas', label: 'Saved Innovations', icon: 'bookmark' },
        { id: 'pitch-coach', label: 'AI Pitch Coach', icon: 'record_voice_over' },
      ]
    }
  ];

  // Business portal menu groups
  const businessMenuGroups = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
        { id: 'profile', label: 'My Profile Hub', icon: 'person' },
        { id: 'hackathons', label: 'Business Mentor', icon: 'psychology' },
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'startup', label: 'Startup Builder', icon: 'rocket_launch' },
        { id: 'discovery', label: 'Business Idea Lab', icon: 'developer_board' },
        { id: 'explorer', label: 'Competitor Analysis', icon: 'explore' },
      ]
    },
    {
      label: 'Tools',
      items: [
        { id: 'patents', label: 'Patent Intelligence', icon: 'search' },
        { id: 'pitch-coach', label: 'Pitch Deck Builder', icon: 'record_voice_over' },
      ]
    }
  ];

  const menuGroups = portalMode === 'student' ? studentMenuGroups : businessMenuGroups;

  // Add superadmin/admin item if needed
  if (isFounder) {
    menuGroups.push({
      label: 'Admin Tools',
      items: [
        { id: 'admin-audit', label: 'System Audit Logs', icon: 'security' },
      ]
    });
  } else if (isSuperAdmin) {
    menuGroups.push({
      label: 'Superadmin Panel',
      items: [
        { id: 'audit-log', label: 'Global Audit Log', icon: 'history' },
        { id: 'account-management', label: 'Account Control', icon: 'manage_accounts' },
      ]
    });
  } else if (isAdmin) {
    const lastGroup = menuGroups[menuGroups.length - 1];
    lastGroup.items.push({ id: 'admin-config', label: 'Admin Configuration', icon: 'shield' });
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

      {/* Mobile close button */}
      <button
        className="sidebar-close-btn"
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>

      {/* Missing Role Warning Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '420px',
            background: 'var(--white)', border: '1px solid var(--border-main)',
            borderRadius: 'var(--radius-lg)', padding: '2rem',
            boxShadow: 'var(--shadow-5)', color: 'var(--text-primary)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'var(--danger-light)', padding: '0.6rem', borderRadius: '50%', color: 'var(--danger)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>warning</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>Portal Account Missing</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', textAlign: 'center' }}>
              You don't have a registered profile for the <strong>{missingRole === 'student' ? 'Student' : 'Business'} Portal</strong>. Would you like to register one now?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowWarningModal(false)}
                className="tech-button tech-button-outline"
                style={{ flex: 1, fontSize: '13px' }}
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
                style={{ flex: 1, fontSize: '13px' }}
              >
                Register Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* — Logo — */}
      <div className="logo-block">
        <div className="logo-mark">
          <div className="logo-icon">
            <img src={aiBrainLogo} alt="Invenza AI Logo" />
          </div>
          <div className="logo-text">
            <div className="logo-title">Invenza <span>AI</span></div>
            <div className="logo-version">Core v2.0</div>
          </div>
        </div>
      </div>

      {/* — User Profile — */}
      <div
        className="user-profile"
        onClick={() => setCurrentPage('profile')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setCurrentPage('profile')}
      >
        <div className="user-avatar">{initialLetter}</div>
        <div className="user-info">
          <div className="user-name" title={userEmail || username}>{username}</div>
          <div className="user-role">{portalMode === 'student' ? 'Student' : 'Business'} · Settings</div>
        </div>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-tertiary)' }}>chevron_right</span>
      </div>

      {/* — Portal Toggle — */}
      <div className="portal-toggle">
        <button
          className={`portal-btn${portalMode === 'student' ? ' active' : ''}`}
          onClick={() => handlePortalSwitchAttempt('student')}
        >
          Student Portal
        </button>
        <button
          className={`portal-btn${portalMode === 'business' ? ' active' : ''}`}
          onClick={() => handlePortalSwitchAttempt('business')}
        >
          Startup Portal
        </button>
      </div>

      {/* — Navigation — */}
      <nav className="nav-list">
        {menuGroups.map((group, gIdx) => (
          <React.Fragment key={group.label}>
            {gIdx > 0 && <div className="nav-divider" />}
            <div className="nav-section-label">{group.label}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      {/* — Footer — */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} id="btn-logout">
          <span className="material-symbols-outlined">logout</span>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
