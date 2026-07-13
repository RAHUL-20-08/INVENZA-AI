import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Award, 
  Briefcase, 
  Bookmark, 
  Cpu, 
  CheckCircle, 
  MapPin, 
  Globe, 
  Edit, 
  Camera, 
  Trash2, 
  Lock, 
  Clock, 
  Share2, 
  Heart, 
  MessageSquare,
  Plus, 
  Download,
  AlertCircle
} from 'lucide-react';
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
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--color-secondary)' }}>
                    Level {currentLevel} {getLevelTitle(currentLevel)}
                  </span>
                </div>
                
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  @{profileData.username || "username"}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                  {profileData.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} /> {profileData.location}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Joined {profileData.joinDate}</span>
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
                <Edit size={12} /> {isEditing ? "Cancel" : "Edit Profile"}
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
            <form onSubmit={handleSaveProfile} className="glass-panel animate-fade-in" style={{ marginTop: '1.5rem', border: '1.5px solid var(--color-primary)', background: 'rgba(10,12,18,0.98)', padding: '1.5rem' }}>
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
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.25rem' }}>// BIOGRAPHY_METADATA</span>
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
                      <Briefcase size={12} color="var(--color-primary)" /> 
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
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.35rem' }}>// TECHNICAL_SKILLS</span>
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
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>// GAMIFIED_EXPERIENCE_LOG</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>Level {currentLevel} — {getLevelTitle(currentLevel)}</strong>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{currentXp} / 1000 XP</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${(currentXp / 1000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', transition: 'width 0.4s' }}></div>
        </div>
      </div>

      {/* Tabs navigation list */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'overview', label: 'Dashboard & Badges', icon: User },
          { id: 'portfolio', label: 'Creations Portfolio', icon: Briefcase },
          { id: 'saved', label: 'Saved Basket', icon: Bookmark },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.read).length})`, icon: Bell },
          { id: 'security', label: 'Security & Settings', icon: Settings }
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
            <t.icon size={14} /> {t.label}
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
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.75rem' }}>// DYNAMIC_ACHIEVEMENTS_SHELF</span>
              
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
                      <Award size={20} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-main)' }}>{badge.name}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{badge.desc}</span>
                      {badge.unlocked ? (
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', display: 'block', marginTop: '0.15rem', fontFamily: 'var(--font-mono)' }}>[UNLOCKED]</span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.15rem', fontFamily: 'var(--font-mono)' }}>[LOCKED]</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor Actions Panel */}
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--color-primary)', background: 'rgba(59, 130, 246, 0.05)', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.45rem' }}>[AI_ADVISOR_ACTIONABLE_RECOMMENDATIONS]</span>
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
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.85rem' }}>// VERIFIED_ACTIVITY_LOG</span>
              
              {activities.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>No recent activity.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activities.map((act, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-main)' }}>{act.text}</span>
                      <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{act.time}</span>
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
                <Plus size={12} /> Add Portfolio Project
              </button>
            </div>

            {/* ADD PORTFOLIO CREATION FORM */}
            {showAddProject && (
              <form onSubmit={handleAddProject} className="glass-panel animate-fade-in" style={{ border: '1.5px solid var(--color-primary)', background: 'rgba(10,12,18,0.98)', padding: '1.25rem' }}>
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
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Heart size={11} /> {p.likes} likes</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MessageSquare size={11} /> {p.comments} comments</span>
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
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>{item.sector}</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.name}</strong>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveSaved(item.id)}
                      className="tech-button tech-button-outline"
                      style={{ fontSize: '0.7rem', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.35rem 0.65rem' }}
                    >
                      <Trash2 size={12} /> Remove
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

        {/* TAB 5: PRIVACY & SETTINGS */}
        {activeTab === 'security' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Privacy settings */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.75rem' }}>// PRIVACY_SETTINGS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block' }}>Public Search Visibility</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Allow other users to view your creations in search feeds.</span>
                  </div>
                  <input type="checkbox" checked={!isPrivate} onChange={() => setIsPrivate(!isPrivate)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.75rem' }}>
                  <div>
                    <strong style={{ display: 'block' }}>Display Account Email</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Show email on public portfolio landing profiles.</span>
                  </div>
                  <input type="checkbox" checked={showEmail} onChange={() => setShowEmail(!showEmail)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* Credentials password */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.75rem' }}>// SECURITY_SETTINGS</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block' }}>Two-Factor Verification (2FA)</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enable multi-factor logins using secure authenticator tokens.</span>
                  </div>
                  <button 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className="tech-button tech-button-outline"
                    style={{ fontSize: '0.7rem', padding: '0.35rem 0.65rem', color: twoFactor ? 'var(--color-success)' : 'var(--text-muted)', border: twoFactor ? '1px solid var(--color-success)' : '1px solid var(--border-color)' }}
                  >
                    {twoFactor ? "Enabled" : "Enable 2FA"}
                  </button>
                </div>
              </div>
            </div>

            {/* connected accounts mock download data */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => alert("📥 Download request received. Archiving database logs for download.")}
                className="tech-button tech-button-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', padding: '0.45rem 1rem' }}
              >
                <Download size={11} /> Download My Data Archive
              </button>
              
              <button 
                onClick={() => {
                  if (confirm("⚠️ Confirm Account Deletion? This will delete all your local database states.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="tech-button tech-button-outline"
                style={{ color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.7rem', padding: '0.45rem 1rem' }}
              >
                Delete My Account
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
