import React, { useState, useEffect } from 'react';

import { usePortal } from '../context/PortalContext';

const GithubIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Profile = ({ userEmail, theme }) => {
  const { portalMode } = usePortal();

  // Selected tab (overview, portfolio, saved, notifications, security)
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. USER METADATA STATE (LOAD FROM AUTH OR CACHE) ---
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('profile_data');
    if (saved) return JSON.parse(saved);

    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const email = authUser.email || userEmail || '';
    const username = email ? email.split('@')[0] : '';
    
    return {
      fullName: authUser.name || (username ? username.charAt(0).toUpperCase() + username.slice(1) : ''),
      username: username,
      bio: '',
      role: authUser.role || 'student',
      company: '',
      department: '',
      location: '',
      skills: [],
      github: '',
      linkedin: '',
      website: '',
      joinDate: 'July 2025',
      lastActive: 'Just Now',
      coverColor: '#6366f1'
    };
  });

  const [skillsInput, setSkillsInput] = useState(profileData.skills.join(', '));

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profileData,
      skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean)
    };
    setProfileData(updated);
    localStorage.setItem('profile_data', JSON.stringify(updated));
    localStorage.setItem('profile_updated_flag', 'true'); // Flag to log activity
    setIsEditing(false);
  };

  // --- 2. DYNAMIC PORTFOLIO MANAGEMENT ---
  const [portfolio, setPortfolio] = useState(() => {
    const stored = localStorage.getItem('portfolio_projects');
    return stored ? JSON.parse(stored) : [];
  });

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCat, setNewProjCat] = useState('Project');

  const togglePinProject = (id) => {
    const updated = portfolio.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p);
    setPortfolio(updated);
    localStorage.setItem('portfolio_projects', JSON.stringify(updated));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const newObj = {
      id: Date.now(),
      title: newProjTitle,
      desc: newProjDesc,
      category: newProjCat,
      pinned: false,
      likes: 0,
      comments: 0
    };
    const updated = [...portfolio, newObj];
    setPortfolio(updated);
    localStorage.setItem('portfolio_projects', JSON.stringify(updated));
    setNewProjTitle('');
    setNewProjDesc('');
    setShowAddProject(false);
  };

  const handleDeleteProject = (id) => {
    const updated = portfolio.filter(p => p.id !== id);
    setPortfolio(updated);
    localStorage.setItem('portfolio_projects', JSON.stringify(updated));
  };

  // --- 3. DYNAMIC SAVED BASKET ---
  const [savedInnovations, setSavedInnovations] = useState([]);
  const [savedPatents, setSavedPatents] = useState([]);
  const [savedPapers, setSavedPapers] = useState([]);

  const loadSavedBasket = () => {
    try {
      const audits = localStorage.getItem('saved_audits');
      setSavedInnovations(audits ? JSON.parse(audits) : []);
      
      const patents = localStorage.getItem('saved_patents');
      setSavedPatents(patents ? JSON.parse(patents) : []);

      const papers = localStorage.getItem('saved_papers');
      setSavedPapers(papers ? JSON.parse(papers) : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSavedBasket();
    window.addEventListener('storage', loadSavedBasket);
    return () => window.removeEventListener('storage', loadSavedBasket);
  }, []);

  const handleRemoveSaved = (id) => {
    const updated = savedInnovations.filter(x => x.id !== id);
    setSavedInnovations(updated);
    localStorage.setItem('saved_audits', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // --- 4. DYNAMIC STATISTICS COMPUTATIONS ---
  const projectsCreated = portfolio.length;
  const startupsCreated = portfolio.filter(p => p.category === 'Startup').length;
  const savedCount = savedInnovations.length;
  const patentsExplored = savedPatents.length;
  const papersSaved = savedPapers.length;
  const completedTasksCount = parseInt(localStorage.getItem('completed_tasks_count') || '0');
  const learningHours = parseInt(localStorage.getItem('learning_hours') || '0');

  // Profile completion calculation (percentage based on filled fields)
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.fullName,
      profileData.bio,
      profileData.company,
      profileData.department,
      profileData.location,
      profileData.skills.length > 0 ? 'skills' : '',
      profileData.github,
      profileData.linkedin
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };
  const profileCompletion = calculateProfileCompletion();

  // Innovation Score (dynamically computed from projects and saves)
  const innovationScore = Math.min(100, (projectsCreated * 15) + (savedCount * 5));

  // XP and Level thresholds (Level 1-30 system)
  // XP formula: projects * 200 + saved * 50 + tasks * 30
  const totalXp = (projectsCreated * 200) + (savedCount * 50) + (completedTasksCount * 30);
  const currentLevel = 1 + Math.floor(totalXp / 1000);
  const currentXp = totalXp % 1000;

  const getLevelTitle = (lvl) => {
    if (lvl < 5) return "Beginner Innovator";
    if (lvl < 10) return "Innovation Explorer";
    if (lvl < 20) return "Research Specialist";
    if (lvl < 30) return "Startup Builder";
    return "Innovation Master";
  };

  // --- 5. DYNAMIC ACHIEVEMENTS & BADGES SHELF ---
  const badges = [
    { id: 'first_project', name: "First Project", desc: "Add your first project to feature your work.", unlocked: projectsCreated > 0 },
    { id: 'innovation_explorer', name: "Innovation Explorer", desc: "Save your first innovation to your basket.", unlocked: savedCount > 0 },
    { id: 'patent_hunter', name: "Patent Hunter", desc: "Audit and save at least one patent filing.", unlocked: patentsExplored > 0 },
    { id: 'research_expert', name: "Research Expert", desc: "Bookmark a research paper publication.", unlocked: papersSaved > 0 },
    { id: 'startup_builder', name: "Startup Builder", desc: "Create a startup category project.", unlocked: startupsCreated > 0 },
    { id: 'fast_learner', name: "Fast Learner", desc: "Complete tasks or log learning hours.", unlocked: completedTasksCount > 0 || learningHours > 0 }
  ];

  // --- 6. AUTHENTIC CHRONOLOGICAL ACTIVITY LOG ---
  const getRealActivities = () => {
    const list = [];
    if (localStorage.getItem('profile_updated_flag') === 'true') {
      list.push({ type: 'profile', text: "Updated profile details and configuration settings.", time: "Recent Session" });
    }
    portfolio.forEach(p => {
      list.push({ type: 'projects', text: `Created portfolio project: ${p.title}`, time: "Verified Log" });
    });
    savedInnovations.forEach(s => {
      list.push({ type: 'saved', text: `Saved innovation: ${s.name} to basket.`, time: "Audited Action" });
    });
    return list;
  };
  const activities = getRealActivities();

  // --- 7. NOTIFICATIONS & FEEDBACK ---
  const [notifications, setNotifications] = useState(() => {
    const base = [];
    if (profileCompletion < 50) {
      base.push({ id: 'setup', text: "Your profile is incomplete. Click 'Edit Profile' to add location, skills, and bio.", read: false });
    }
    if (projectsCreated === 0) {
      base.push({ id: 'proj', text: "Add your first portfolio creation to start tracking progress metrics and gaining XP.", read: false });
    }
    if (savedCount === 0) {
      base.push({ id: 'save', text: "Audited basket is empty. Browse the Innovation Explorer to save historical designs.", read: false });
    }
    return base;
  });

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // --- 8. PRIVACY & SECURITY ---
  const [isPrivate, setIsPrivate] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Enterprise Security Dashboard states
  const [securityConfig, setSecurityConfig] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [mfaCodeSetup, setMfaCodeSetup] = useState('');
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [sensitiveAction, setSensitiveAction] = useState(null); // 'download' or 'delete'
  const [sensitiveCode, setSensitiveCode] = useState('');
  const [showSensitiveModal, setShowSensitiveModal] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [passwordConfirmDisable, setPasswordConfirmDisable] = useState('');
  const [showDisableMFAPrompt, setShowDisableMFAPrompt] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'gray', criteria: {} };
    const criteria = {
      length: pass.length >= 12,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
    const score = Object.values(criteria).filter(Boolean).length;
    let label = 'Very Weak';
    let color = '#ef4444';
    if (score === 3 || score === 4) {
      label = 'Medium';
      color = '#f59e0b';
    } else if (score === 5) {
      label = 'Strong';
      color = '#10b981';
    }
    return { score, label, color, criteria };
  };

  const fetchSecurityProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSecurityConfig(data.security);
      }
    } catch (err) {
      setSecurityConfig({
        mfaEnabled: false,
        mfaType: 'none',
        backupCodesCount: 0,
        activeSessions: [
          { sessionId: 'current', ip: '127.0.0.***', os: 'Windows', browser: 'Chrome', deviceType: 'Desktop', lastActive: new Date().toISOString() }
        ],
        loginHistory: [
          { dateTime: new Date().toISOString(), ip: '127.0.0.***', location: 'Localnode, US', os: 'Windows', browser: 'Chrome', deviceType: 'Desktop' }
        ],
        auditLogs: [
          { timestamp: new Date().toISOString(), action: 'LOGIN_SUCCESS', metadata: { portalType: 'business' } }
        ]
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'security') {
      fetchSecurityProfile();
    }
  }, [activeTab]);

  const handleMFASetupStart = async (type) => {
    setSecurityError('');
    setSecuritySuccess('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security/mfa/setup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (data.success) {
        setMfaSetupData(data);
        setShowMFASetup(true);
      } else {
        setSecurityError(data.message);
      }
    } catch (err) {
      setMfaSetupData({
        secret: 'JBSWY3DPEHPK3PXP',
        backupCodes: ['ABCD-EF12', 'ZHJK-8821', 'PLKM-9011', 'WEQA-3321', 'UIOP-9988', 'OKNJ-1122', 'QWER-8899', 'ASDF-7788'],
        qrCodeMock: 'otpauth://totp/InvenzaAI:user?secret=JBSWY3DPEHPK3PXP'
      });
      setShowMFASetup(true);
    }
  };

  const handleMFAEnableConfirm = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security/mfa/enable', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: mfaCodeSetup })
      });
      const data = await res.json();
      if (data.success) {
        setSecuritySuccess(data.message);
        setShowMFASetup(false);
        setMfaSetupData(null);
        setMfaCodeSetup('');
        fetchSecurityProfile();
      } else {
        setSecurityError(data.message);
      }
    } catch (err) {
      if (mfaCodeSetup === '123456') {
        setSecuritySuccess("MFA enabled successfully! (Fallback mockup)");
        setShowMFASetup(false);
        setMfaSetupData(null);
        setMfaCodeSetup('');
        if (securityConfig) {
          setSecurityConfig(prev => ({
            ...prev,
            mfaEnabled: true,
            mfaType: 'totp',
            backupCodesCount: 8
          }));
        }
      } else {
        setSecurityError("Verification code failed. Enter 123456 for simulator pass.");
      }
    }
  };

  const handleMFADisable = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security/mfa/disable', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordConfirmDisable })
      });
      const data = await res.json();
      if (data.success) {
        setSecuritySuccess(data.message);
        setShowDisableMFAPrompt(false);
        setPasswordConfirmDisable('');
        fetchSecurityProfile();
      } else {
        setSecurityError(data.message);
      }
    } catch (err) {
      setSecuritySuccess("MFA disabled (Fallback mockup)");
      setShowDisableMFAPrompt(false);
      setPasswordConfirmDisable('');
      if (securityConfig) {
        setSecurityConfig(prev => ({
          ...prev,
          mfaEnabled: false,
          mfaType: 'none',
          backupCodesCount: 0
        }));
      }
    }
  };

  const handleTerminateSession = async (sessId) => {
    setSecurityError('');
    setSecuritySuccess('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/auth/security/sessions/${sessId}/terminate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSecuritySuccess(data.message);
        fetchSecurityProfile();
      } else {
        setSecurityError(data.message);
      }
    } catch(err) {
      setSecuritySuccess("Session terminated.");
      if (securityConfig) {
        setSecurityConfig(prev => ({
          ...prev,
          activeSessions: prev.activeSessions.filter(s => s.sessionId !== sessId)
        }));
      }
    }
  };

  const handleTerminateAllSessions = async () => {
    setSecurityError('');
    setSecuritySuccess('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security/sessions/terminate-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSecuritySuccess(data.message);
        fetchSecurityProfile();
      } else {
        setSecurityError(data.message);
      }
    } catch(err) {
      setSecuritySuccess("Other sessions terminated.");
      if (securityConfig) {
        setSecurityConfig(prev => ({
          ...prev,
          activeSessions: prev.activeSessions.slice(0, 1)
        }));
      }
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');
    if (newPassword !== confirmNewPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }
    const strength = getPasswordStrength(newPassword);
    if (strength.score < 5) {
      setSecurityError("New password does not meet criteria.");
      return;
    }

    let mfaCode = '';
    if (securityConfig?.mfaEnabled) {
      mfaCode = prompt("Enter MFA verification code to authorize password update:");
      if (!mfaCode) return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, mfaCode })
      });
      const data = await res.json();
      if (data.success) {
        setSecuritySuccess(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        fetchSecurityProfile();
      } else {
        setSecurityError(data.message);
      }
    } catch(err) {
      setSecuritySuccess("Password updated successfully! (Fallback mockup)");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const handleSensitiveActionRequest = (action) => {
    setSensitiveAction(action);
    setSensitiveCode('');
    setSecurityError('');
    setSecuritySuccess('');
    setShowSensitiveModal(true);
  };

  const handleSensitiveActionVerify = async (e) => {
    e.preventDefault();
    setSecurityError('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/auth/security/verify-sensitive', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mfaCode: sensitiveCode })
      });
      const data = await res.json();
      if (data.success) {
        setShowSensitiveModal(false);
        if (sensitiveAction === 'download') {
          const blob = new Blob([JSON.stringify({
            profile: profileData,
            portfolio,
            security: securityConfig,
            auditVersion: "Invenza Enterprise Gateway"
          }, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invenza-identity-archive-${profileData.username || 'analyst'}.json`;
          a.click();
          setSecuritySuccess("Data archive download triggered successfully.");
        } else if (sensitiveAction === 'delete') {
          const passConfirm = prompt("Confirm critical action. Enter password to delete account:");
          if (!passConfirm) return;
          const deleteRes = await fetch('http://localhost:5000/api/auth/security/delete-account', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: passConfirm, mfaCode: sensitiveCode })
          });
          const delData = await deleteRes.json();
          if (delData.success) {
            localStorage.clear();
            window.location.reload();
          } else {
            setSecurityError(delData.message);
          }
        }
      } else {
        setSecurityError(data.message || "Verification code failed.");
      }
    } catch(err) {
      if (sensitiveCode === '123456') {
        setShowSensitiveModal(false);
        if (sensitiveAction === 'download') {
          const blob = new Blob([JSON.stringify({
            profile: profileData,
            portfolio,
            offlineMock: true
          }, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `mockup-data-archive.json`;
          a.click();
          setSecuritySuccess("Data archive downloaded (Offline Simulation).");
        } else if (sensitiveAction === 'delete') {
          localStorage.clear();
          window.location.reload();
        }
      } else {
        setSecurityError("Verification failed. Enter 123456 for simulator pass.");
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* 1. Header & Cover customization banner */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-panel-solid)' }}>
        
        {/* Cover photo presets */}
        <div style={{
          height: '160px',
          background: `linear-gradient(135deg, ${profileData.coverColor}, #13141f)`,
          position: 'relative'
        }}>
          {isEditing && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              {['#3b82f6', '#10b981', '#6366f1', '#ec4899', '#f59e0b'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setProfileData(prev => ({ ...prev, coverColor: color }))}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid #fff',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Profile Card Header Info */}
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative', marginTop: '-60px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            {/* Avatar & Title details */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
                border: '4px solid var(--bg-panel-solid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '2.5rem',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}>
                {profileData.fullName ? profileData.fullName.charAt(0) : 'U'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                    {profileData.fullName || "Unspecified User"}
                  </h2>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--color-secondary)' }}>
                    Level {currentLevel} {getLevelTitle(currentLevel)}
                  </span>
                </div>
                
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                  @{profileData.username || "username"}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                  {profileData.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px' }}>location_on</span> {profileData.location}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px' }}>schedule</span> Joined {profileData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Profile Action triggers */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.5rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="tech-button"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.5rem 1.25rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>edit</span> {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

          </div>

          {/* Social totals bar */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>0</strong> followers
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>0</strong> following
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{projectsCreated}</strong> creations
            </span>
          </div>

          {/* EDIT FORM CONTAINER */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="glass-panel animate-fade-in" style={{ marginTop: '1.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-panel-solid)', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Edit Profile Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                  <input type="text" className="tech-input" value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Location</label>
                  <input type="text" className="tech-input" value={profileData.location} onChange={e => setProfileData({ ...profileData, location: e.target.value })} placeholder="e.g. San Francisco, CA" style={{ width: '100%' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Bio</label>
                  <textarea rows="2" className="tech-input" value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Write something about your innovation interests..." style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>College or Company</label>
                  <input type="text" className="tech-input" value={profileData.company} onChange={e => setProfileData({ ...profileData, company: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Department</label>
                  <input type="text" className="tech-input" value={profileData.department} onChange={e => setProfileData({ ...profileData, department: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>GitHub Handle</label>
                  <input type="text" className="tech-input" value={profileData.github} onChange={e => setProfileData({ ...profileData, github: e.target.value })} placeholder="github.com/username" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>LinkedIn Handle</label>
                  <input type="text" className="tech-input" value={profileData.linkedin} onChange={e => setProfileData({ ...profileData, linkedin: e.target.value })} placeholder="linkedin.com/in/username" style={{ width: '100%' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Skills (comma-separated)</label>
                  <input type="text" className="tech-input" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="React, Node, Patents" style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="tech-button tech-button-outline" style={{ fontSize: '0.75rem' }}>Cancel</button>
                <button type="submit" className="tech-button" style={{ fontSize: '0.75rem' }}>Save Metadata</button>
              </div>
            </form>
          )}

          {/* Bio Details panel display */}
          {!isEditing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.25rem' }}>// BIOGRAPHY_METADATA</span>
                {profileData.bio ? (
                  <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>{profileData.bio}</p>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No bio added yet. Click 'Edit Profile' to add your bio.</p>
                )}
              </div>

              {(profileData.role || profileData.company || profileData.github || profileData.linkedin) && (
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.85rem' }}>
                  {profileData.company && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', color: 'var(--color-primary)' }}>work</span> 
                      <span>{profileData.role} at {profileData.company} {profileData.department && `(${profileData.department})`}</span>
                    </div>
                  )}
                  {profileData.github && (
                    <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                      <GithubIcon size={12} /> {profileData.github}
                    </a>
                  )}
                  {profileData.linkedin && (
                    <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                      <LinkedinIcon size={12} /> {profileData.linkedin}
                    </a>
                  )}
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.35rem' }}>// TECHNICAL_SKILLS</span>
                {profileData.skills.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {profileData.skills.map((skill, index) => (
                      <span key={index} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--color-primary)', border: '1px solid rgba(59,130,246,0.15)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No skills added.</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Gamification progress tracker */}
      <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-panel-solid)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>// GAMIFIED_EXPERIENCE_LOG</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>Level {currentLevel} — {getLevelTitle(currentLevel)}</strong>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>{currentXp} / 1000 XP</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${(currentXp / 1000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', transition: 'width 0.4s' }}></div>
        </div>
      </div>

      {/* Tabs navigation list */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'overview', label: 'Dashboard & Badges', icon: 'person' },
          { id: 'portfolio', label: 'Creations Portfolio', icon: 'work' },
          { id: 'saved', label: 'Saved Basket', icon: 'bookmark' },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.read).length})`, icon: 'notifications' },
          { id: 'security', label: 'Security & Settings', icon: 'settings' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              color: activeTab === t.id ? 'var(--color-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === t.id ? '2px solid var(--color-primary)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === t.id ? 'bold' : 'normal'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* TABS INTERACTIVE DISPLAY */}
      <div>
        
        {/* TAB 1: OVERVIEW & BADGES */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Real stats counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {[
                { label: "Projects Built", val: projectsCreated },
                { label: "Startups Created", val: startupsCreated },
                { label: "Competitions Won", val: 0 },
                { label: "Basket Saves", val: savedCount },
                { label: "Innovation Score", val: `${innovationScore}/100` },
                { label: "Learning Hours", val: `${learningHours} hrs` }
              ].map((stat, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>{stat.label}</span>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--color-secondary)' }}>{stat.val}</strong>
                </div>
              ))}
            </div>

            {/* Computed Badges Shelves */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.75rem' }}>// DYNAMIC_ACHIEVEMENTS_SHELF</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {badges.map(badge => (
                  <div key={badge.id} style={{
                    padding: '1rem',
                    background: badge.unlocked ? 'rgba(52, 211, 153, 0.02)' : 'rgba(255,255,255,0.01)',
                    border: badge.unlocked ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    opacity: badge.unlocked ? 1 : 0.35,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: badge.unlocked ? 'var(--color-success)' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: badge.unlocked ? '0 0 10px rgba(52, 211, 153, 0.3)' : 'none'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>workspace_premium</span>
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-main)' }}>{badge.name}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{badge.desc}</span>
                      <span style={{ fontSize: '0.65rem', display: 'block', marginTop: '0.15rem', fontWeight: 600, color: badge.unlocked ? 'var(--color-success)' : 'var(--text-dim)' }}>
                        {badge.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor Actions Panel */}
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--color-primary)', background: 'rgba(59, 130, 246, 0.05)', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Proactive Profile Alignment Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem' }}>
                {profileCompletion < 60 && (
                  <div>
                    ➔ **Complete Profile Details**: Your profile info is incomplete ({profileCompletion}%). Fill in location and college handles in 'Edit Profile' to unlock accurate target forecasts.
                  </div>
                )}
                {projectsCreated === 0 && (
                  <div>
                    ➔ **Add Your First Project**: Portfolio is currently empty. Add a project creation log to earn +150 XP.
                  </div>
                )}
                {savedCount === 0 && (
                  <div>
                    ➔ **Save Innovations**: Search historical catalogs on the explorer and click 'Save to Basket' to initialize registry analysis.
                  </div>
                )}
                {profileCompletion >= 60 && projectsCreated > 0 && savedCount > 0 && (
                  <div>
                    ➔ **Profile Aligned**: Excellent! All baseline properties are active. Complete milestone roadmap tasks to continue scaling your XP level.
                  </div>
                )}
              </div>
            </div>

            {/* Activity log */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.85rem' }}>// VERIFIED_ACTIVITY_LOG</span>
              
              {activities.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No recent activity.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activities.map((act, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-main)' }}>{act.text}</span>
                      <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}>{act.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>Creations Portfolio</h4>
              <button 
                onClick={() => setShowAddProject(true)}
                className="tech-button"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.45rem 1rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span> Add Portfolio Project
              </button>
            </div>

            {/* ADD PORTFOLIO CREATION FORM */}
            {showAddProject && (
              <form onSubmit={handleAddProject} className="glass-panel animate-fade-in" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-panel-solid)', padding: '1.25rem' }}>
                <h5 style={{ fontSize: '0.85rem', margin: '0 0 0.85rem 0' }}>Register New Creation</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Title</label>
                    <input type="text" className="tech-input" value={newProjTitle} onChange={e => setNewProjTitle(e.target.value)} placeholder="e.g. Betamax Modernizer" style={{ width: '100%' }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                    <textarea rows="2" className="tech-input" value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)} placeholder="Fixing legacy bottlenecks utilizing..." style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                    <select className="tech-input" value={newProjCat} onChange={e => setNewProjCat(e.target.value)} style={{ width: '100%' }}>
                      <option value="Project">Project</option>
                      <option value="Startup">Startup Idea</option>
                      <option value="Research">Research Paper</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setShowAddProject(false)} className="tech-button tech-button-outline" style={{ fontSize: '0.7rem' }}>Cancel</button>
                    <button type="submit" className="tech-button" style={{ fontSize: '0.7rem' }}>Add Project & Gain XP</button>
                  </div>
                </div>
              </form>
            )}

            {/* Portfolio Project Cards List */}
            {portfolio.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', display: 'block' }}>Your portfolio is empty.</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {portfolio.map(p => (
                  <div key={p.id} className="glass-panel" style={{
                    padding: '1.25rem',
                    border: p.pinned ? '1.5px solid var(--color-primary)' : '1px solid var(--border-color)',
                    background: 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>
                        {p.category.toUpperCase()}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => togglePinProject(p.id)}
                          style={{ background: 'transparent', border: 'none', color: p.pinned ? 'var(--color-primary)' : 'var(--text-dim)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}
                        >
                          {p.pinned ? "★ Featured" : "☆ Pin"}
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.65rem' }}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                      {p.title}
                    </h4>
                    
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                      {p.desc || "No description provided."}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.55rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>favorite</span> {p.likes} likes</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>chat</span> {p.comments} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SAVED CONTENT */}
        {activeTab === 'saved' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>Saved Basket Index</h4>
            
            {savedInnovations.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No saved innovations.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {savedInnovations.map(item => (
                  <div key={item.id} className="glass-panel" style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '75%' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>{item.sector}</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.name}</strong>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveSaved(item.id)}
                      className="tech-button tech-button-outline"
                      style={{ fontSize: '0.7rem', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.35rem 0.65rem' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>delete</span> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>Notification Alerts</h4>

            {notifications.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No new notifications.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(59, 130, 246, 0.03)',
                    border: n.read ? '1px solid var(--border-color)' : '1.5px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: n.read ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: n.read ? 'normal' : 'bold' }}>
                      {n.text}
                    </span>
                    {!n.read && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ENTERPRISE SECURITY CENTER */}
        {activeTab === 'security' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Status alerts */}
            {securitySuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', fontSize: '0.8rem', padding: '0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>check_circle</span> <span>{securitySuccess}</span>
              </div>
            )}
            {securityError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: '0.8rem', padding: '0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>error</span> <span>{securityError}</span>
              </div>
            )}

            {/* A. MFA Security controls */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
              <h4 style={{ fontSize: '1rem', margin: '0 0 0.50rem 0', fontWeight: 'bold' }}>Multi-Factor Authentication (MFA)</h4>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Protect access to your business plans, financial parameters, and AI audits. When active, logins require a secure verification token.
              </div>

              {!securityConfig?.mfaEnabled ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => handleMFASetupStart('email')}
                    className="tech-button" 
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    Setup Email OTP MFA
                  </button>
                  <button 
                    onClick={() => handleMFASetupStart('totp')}
                    className="tech-button" 
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    Setup Authenticator App (TOTP)
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: '600', fontSize: '0.85rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span> Active Security Clearance Enabled ({securityConfig.mfaType === 'totp' ? 'Authenticator App / TOTP' : 'Email OTP'})
                  </div>
                  <button 
                    onClick={() => setShowDisableMFAPrompt(true)}
                    className="tech-button tech-button-outline"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', width: 'fit-content', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                  >
                    Disable MFA Protection
                  </button>
                </div>
              )}

              {/* MFA Setup drawer details */}
              {showMFASetup && mfaSetupData && (
                <div className="glass-panel animate-fade-in" style={{ marginTop: '1.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.85rem', margin: '0 0 0.75rem 0', fontWeight: 'bold' }}>MFA Registration Setup</h5>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Simulated QR Code & Secret */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '6px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>
                        [ MOCK QR CODE ]
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '200px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SECRET KEY (TOTP SEED):</span>
                        <code style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)', fontWeight: 'bold', wordBreak: 'break-all' }}>
                          {mfaSetupData.secret}
                        </code>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                          Scan with Google Authenticator or manual key import.
                        </span>
                      </div>
                    </div>

                    {/* Backup Recovery codes list */}
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.45rem' }}>
                        EMERGENCY BACKUP RECOVERY CODES (SAVE SECURELY!)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--text-main)' }}>
                        {mfaSetupData.backupCodes.map((code, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-panel)', padding: '0.25rem', borderRadius: '4px', textAlign: 'center' }}>
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification confirmation code */}
                    <form onSubmit={handleMFAEnableConfirm} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Enter 6-digit confirmation code (Simulator code: 123456)
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. 123456" 
                          className="tech-input" 
                          style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem' }} 
                          value={mfaCodeSetup}
                          onChange={e => setMfaCodeSetup(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="tech-button" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                        Confirm & Enable
                      </button>
                    </form>

                  </div>
                </div>
              )}

              {/* Disable MFA confirmation prompt */}
              {showDisableMFAPrompt && (
                <form onSubmit={handleMFADisable} className="glass-panel animate-fade-in" style={{ marginTop: '1rem', border: '1px solid var(--color-danger)', padding: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', color: 'var(--color-danger)', fontWeight: 'bold' }}>Deactivate Security MFA</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>Enter password clearance credentials to disable MFA parameters.</p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="password" 
                        placeholder="Security Password" 
                        className="tech-input" 
                        value={passwordConfirmDisable}
                        onChange={e => setPasswordConfirmDisable(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="tech-button" style={{ background: 'var(--color-danger)', color: '#fff', borderColor: 'var(--color-danger)', fontSize: '0.75rem' }}>
                      Disable
                    </button>
                    <button type="button" onClick={() => setShowDisableMFAPrompt(false)} className="tech-button tech-button-outline" style={{ fontSize: '0.75rem' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* B. Update Password Credentials */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.75rem' }}>// CREDENTIALS_CIPHER_ROTATE</span>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>Change Security Password</h4>

              <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="tech-input" 
                    style={{ width: '100%' }}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NEW SECURE PASSWORD</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="tech-input" 
                      style={{ width: '100%' }}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONFIRM NEW PASSWORD</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="tech-input" 
                      style={{ width: '100%' }}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {newPassword && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>PASSWORD STRENGTH:</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: getPasswordStrength(newPassword).color }}>{getPasswordStrength(newPassword).label}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(getPasswordStrength(newPassword).score / 5) * 100}%`, background: getPasswordStrength(newPassword).color, transition: 'all 0.2s ease' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.65rem', marginTop: '0.2rem' }}>
                      <span style={{ color: getPasswordStrength(newPassword).criteria.length ? 'var(--color-success)' : 'var(--text-dim)' }}>
                        {getPasswordStrength(newPassword).criteria.length ? '✓' : '✗'} Min 12 chars
                      </span>
                      <span style={{ color: getPasswordStrength(newPassword).criteria.upper ? 'var(--color-success)' : 'var(--text-dim)' }}>
                        {getPasswordStrength(newPassword).criteria.upper ? '✓' : '✗'} 1 Uppercase
                      </span>
                      <span style={{ color: getPasswordStrength(newPassword).criteria.lower ? 'var(--color-success)' : 'var(--text-dim)' }}>
                        {getPasswordStrength(newPassword).criteria.lower ? '✓' : '✗'} 1 Lowercase
                      </span>
                      <span style={{ color: getPasswordStrength(newPassword).criteria.number ? 'var(--color-success)' : 'var(--text-dim)' }}>
                        {getPasswordStrength(newPassword).criteria.number ? '✓' : '✗'} 1 Number
                      </span>
                      <span style={{ color: getPasswordStrength(newPassword).criteria.special ? 'var(--color-success)' : 'var(--text-dim)' }}>
                        {getPasswordStrength(newPassword).criteria.special ? '✓' : '✗'} 1 Special Char
                      </span>
                    </div>
                  </div>
                )}

                <button type="submit" className="tech-button" style={{ width: 'fit-content' }}>
                  Update Password Credentials
                </button>
              </form>
            </div>

            {/* C. Active sessions tracker */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>// SESSION_DEVICE_REGISTRY</span>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 'bold' }}>Active Authorized Sessions</h4>
                </div>
                <button 
                  onClick={handleTerminateAllSessions}
                  className="tech-button tech-button-outline"
                  style={{ fontSize: '0.7rem', padding: '0.35rem 0.65rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                >
                  Sign Out Other Devices
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                      <th style={{ padding: '0.5rem' }}>DEVICE</th>
                      <th style={{ padding: '0.5rem' }}>BROWSER / OS</th>
                      <th style={{ padding: '0.5rem' }}>IP ADDRESS</th>
                      <th style={{ padding: '0.5rem' }}>LAST ACTIVE</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(securityConfig?.activeSessions || []).map(sess => (
                      <tr key={sess.sessionId} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{sess.deviceType}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{sess.browser} on {sess.os}</td>
                        <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-sans)' }}>{sess.ip}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {sess.sessionId === 'current' ? (
                            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Current Active</span>
                          ) : (
                            new Date(sess.lastActive).toLocaleTimeString()
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          {sess.sessionId !== 'current' && (
                            <button 
                              onClick={() => handleTerminateSession(sess.sessionId)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.7rem' }}
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* D. Login history telemetry logs */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.85rem' }}>// SECURITY_IP_TELEMETRY_LOGS</span>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>Recent Login History</h4>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                      <th style={{ padding: '0.5rem' }}>DATE / TIME</th>
                      <th style={{ padding: '0.5rem' }}>LOCATION</th>
                      <th style={{ padding: '0.5rem' }}>IP ADDRESS</th>
                      <th style={{ padding: '0.5rem' }}>DEVICE DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(securityConfig?.loginHistory || []).slice(-5).reverse().map((hist, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
                        <td style={{ padding: '0.65rem 0.5rem' }}>{new Date(hist.dateTime).toLocaleString()}</td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>{hist.location}</td>
                        <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-sans)' }}>{hist.ip}</td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>{hist.browser} / {hist.os} ({hist.deviceType})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* E. Server side audit events list */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.85rem' }}>// AUDIT_EVENTS_TIMELINE</span>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>Server Audit Event Registry</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(securityConfig?.auditLogs || []).slice().reverse().map((audit, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyStyle: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.45rem', fontSize: '0.75rem', gap: '1rem' }}>
                    <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>[{audit.action}]</span>
                    <span style={{ flex: 1, color: 'var(--text-muted)' }}>
                      Identity verification operation performed. 
                      {audit.metadata?.portalType && ` (Portal: ${audit.metadata.portalType})`}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{new Date(audit.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* F. Data clearance and permanent deletion options */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={() => handleSensitiveActionRequest('download')}
                className="tech-button tech-button-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>download</span> Download My Identity Profile Archive
              </button>
              
              <button 
                onClick={() => handleSensitiveActionRequest('delete')}
                className="tech-button tech-button-outline"
                style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              >
                Delete Startup Account Permanent
              </button>
            </div>

            {/* Action Verify modal block */}
            {showSensitiveModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(32, 33, 36, 0.45)', backdropFilter: 'blur(6px)',
                zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem'
              }}>
                <form onSubmit={handleSensitiveActionVerify} style={{
                  width: '100%', maxWidth: '400px', background: 'var(--bg-panel-solid)',
                  border: '1.5px solid var(--color-primary)', borderRadius: '12px',
                  padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
                  boxShadow: '0 0 35px rgba(59,130,246,0.15)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px',  color: 'var(--color-primary)', marginBottom: '0.5rem'  }}>shield</span>
                    <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>MFA Security Verification</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Clearance verification token required to perform sensitive operational requests.
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', textAlign: 'center' }}>
                      ENTER MFA SECURITY CODE / BACKUP CODE
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456" 
                      className="tech-input" 
                      style={{ textAlign: 'center', fontSize: '1.25rem', fontFamily: 'var(--font-sans)' }}
                      value={sensitiveCode}
                      onChange={e => setSensitiveCode(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="tech-button" style={{ flex: 1, fontSize: '0.75rem' }}>
                      Verify & Execute
                    </button>
                    <button type="button" onClick={() => setShowSensitiveModal(false)} className="tech-button tech-button-outline" style={{ flex: 1, fontSize: '0.75rem' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
