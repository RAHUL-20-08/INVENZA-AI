import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  HelpCircle, 
  CheckSquare, 
  Clock, 
  Code, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  Download, 
  ArrowRight,
  RefreshCw,
  Copy,
  Calendar,
  MapPin,
  Users,
  Bookmark,
  Sparkles,
  Search,
  Share2,
  SlidersHorizontal,
  Bell,
  ExternalLink,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useMentor } from '../context/MentorContext';
import { usePortal } from '../context/PortalContext';
import StudentDashboard from '../components/StudentDashboard';
import BusinessDashboard from '../components/BusinessDashboard';

const Hackathons = () => {
  const { portalMode } = usePortal();
  
  // Tab control - default to upcoming-hackathons for students
  const [activeTab, setActiveTab] = useState(() => {
    return portalMode === 'student' ? 'upcoming-hackathons' : 'mentor';
  });

  const { 
    project, 
    milestoneStages, 
    completedMilestones, 
    progressPercent, 
    toggleMilestone,
    codeReview,
    reviewLoading,
    runCodeReview,
    docs,
    docsLoading,
    fetchDocument
  } = useMentor();

  // Hackathons States
  const [hackathonsList, setHackathonsList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [activePrepGuide, setActivePrepGuide] = useState(null);
  const [prepLoading, setPrepLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [activeTabPrep, setActiveTabPrep] = useState('ideas'); // 'ideas', 'stack', 'papers', 'timeline'

  // Autocomplete & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filters state
  const [modeFilter, setModeFilter] = useState('All'); // 'All', 'Online', 'Offline', 'Hybrid'
  const [techFilters, setTechFilters] = useState([]); // array of active tags
  const [closingSoonFilter, setClosingSoonFilter] = useState(false);
  const [freeOnlyFilter, setFreeOnlyFilter] = useState(false);
  const [openOnlyFilter, setOpenOnlyFilter] = useState(true);

  // Saved Calendar list & Notifications configurations
  const [savedCalendar, setSavedCalendar] = useState(() => {
    return JSON.parse(localStorage.getItem('registered_hackathons_calendar') || '[]');
  });
  const [notificationConfig, setNotificationConfig] = useState(() => {
    return JSON.parse(localStorage.getItem('hackathon_notification_config') || '{"deadlineReminders":true,"newAIAnnouncements":true,"statusChanges":true}');
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showMatchScoreDetails, setShowMatchScoreDetails] = useState(null); // ID of hackathon to show reasons for

  // Code Review states
  const [codeInput, setCodeInput] = useState('');
  const [copiedDoc, setCopiedDoc] = useState(null);

  // Parse Student Profile from Local Storage
  const getStudentProfile = () => {
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return authUser.studentProfile || {
      skills: ['React', 'NodeJS', 'Python'],
      interests: ['AI', 'Web Development', 'Machine Learning'],
      department: 'CS',
      yearOfStudy: '3'
    };
  };

  // Fetch hackathons from backend
  const fetchHackathonsData = async () => {
    setListLoading(true);
    const profile = getStudentProfile();
    try {
      const res = await fetch(`http://localhost:5000/api/hackathons?profile=${encodeURIComponent(JSON.stringify(profile))}`);
      const data = await res.json();
      if (data.success) {
        setHackathonsList(data.hackathons);
      }
    } catch (err) {
      console.warn("Express backend offline, compiling offline mockup hackathons database...");
      // Fallback matching logic on frontend
      const mockList = [
        {
          id: "calhacks-13",
          name: "CalHacks 13.0",
          organizer: "Cal Hacks Foundation",
          host: "UC Berkeley",
          registrationStatus: "Open",
          deadline: "2026-10-02",
          startDate: "2026-10-16",
          endDate: "2026-10-18",
          mode: "Hybrid",
          venue: "Metreon San Francisco, CA / Online",
          prizePool: "$150,000",
          teamSize: "1-4 members",
          difficulty: "Intermediate",
          eligibleBranches: ["EECS", "CS", "Data Science", "Engineering"],
          technologies: ["React", "Python", "NodeJS", "Google Cloud", "PyTorch"],
          tags: ["AI", "Web Development", "Mobile Development", "Machine Learning"],
          description: "The world's largest collegiate hackathon hosted at UC Berkeley/San Francisco, featuring developer API workshops, AI builder tracks, and executive hardware hacking labs.",
          officialLink: "https://calhacks.io",
          matchScore: 92,
          matchReason: ["Matches technical skills: React, Python", "Matches AI & Machine Learning interest profile tags", "Eligible for CS/EECS departments", "Registration is currently open"]
        },
        {
          id: "hackmit-2026",
          name: "HackMIT 2026",
          organizer: "MIT TechX",
          host: "MIT Campus",
          registrationStatus: "Open",
          deadline: "2026-08-31",
          startDate: "2026-09-19",
          endDate: "2026-09-20",
          mode: "Offline",
          venue: "MIT Campus, Cambridge, MA",
          prizePool: "$30,000",
          teamSize: "1-4 members",
          difficulty: "Intermediate",
          eligibleBranches: ["All Branches", "CS", "Mathematics"],
          technologies: ["C++", "Python", "Rust", "TensorFlow", "Solidity"],
          tags: ["AI", "Machine Learning", "Robotics", "Blockchain"],
          description: "MIT's premier annual student hackathon, attracting 1000+ top creators from across the globe to build innovative hardware and software systems under MIT lab mentoring.",
          officialLink: "https://hackmit.org",
          matchScore: 88,
          matchReason: ["Matches interests: AI, Machine Learning", "Suitable for junior/senior engineering students", "Open to all branches", "Registration currently open"]
        },
        {
          id: "chainlink-constellation-2026",
          name: "Chainlink Constellation Hackathon 2026",
          organizer: "Chainlink Labs",
          host: "Chainlink Labs",
          registrationStatus: "Open",
          deadline: "2026-11-04",
          startDate: "2026-11-05",
          endDate: "2026-11-26",
          mode: "Online",
          venue: "Virtual / Global",
          prizePool: "$250,000",
          teamSize: "1-5 members",
          difficulty: "Advanced",
          eligibleBranches: ["CS", "IT", "Mathematics"],
          technologies: ["Solidity", "Smart Contracts", "Chainlink CCIP", "Web3JS", "Python"],
          tags: ["Blockchain", "Cybersecurity", "Cloud Computing", "Web Development"],
          description: "Build secure decentralized applications utilizing Chainlink CCIP, cross-chain messaging feeds, smart contract security checkers, and hybrid AI computing integrations.",
          officialLink: "https://chain.link/constellation",
          matchScore: 82,
          matchReason: ["Matches technical skills: Python", "Matches interests: Web Development", "Fits standard team size preference", "Registration is open"]
        },
        {
          id: "google-ai-hackathon",
          name: "Google AI Hackathon 2026",
          organizer: "Google Developer Groups",
          host: "Google Cloud",
          registrationStatus: "Open",
          deadline: "2026-08-14",
          startDate: "2026-08-15",
          endDate: "2026-09-15",
          mode: "Online",
          venue: "Virtual / Devpost",
          prizePool: "$100,000",
          teamSize: "1-5 members",
          difficulty: "Intermediate",
          eligibleBranches: ["All Branches", "CS", "Data Science"],
          technologies: ["Gemini API", "Vertex AI", "TensorFlow", "Python", "JAX"],
          tags: ["AI", "Machine Learning", "Data Science", "Cloud Computing"],
          description: "Construct next-generation generative AI applications, search aggregators, or code validators leveraging Google Gemini API and Vertex AI serverless computing nodes.",
          officialLink: "https://googleai.devpost.com",
          matchScore: 95,
          matchReason: ["Matches AI, Machine Learning, Data Science interests", "Matches technical skills: Python", "Google Gemini API matches RAG AI project stack", "Registration is open"]
        },
        {
          id: "pennapps-27",
          name: "PennApps XXVII",
          organizer: "PennApps Student Board",
          host: "University of Pennsylvania",
          registrationStatus: "Open",
          deadline: "2026-08-25",
          startDate: "2026-09-11",
          endDate: "2026-09-13",
          mode: "Offline",
          venue: "Engineering Quad, Philadelphia, PA",
          prizePool: "$25,000",
          teamSize: "1-4 members",
          difficulty: "Beginner-Friendly",
          eligibleBranches: ["All Branches", "CS", "Bioengineering"],
          technologies: ["HTML/CSS", "JavaScript", "React", "NodeJS", "Swift"],
          tags: ["Web Development", "Mobile Development", "IoT", "Robotics"],
          description: "The historic collegiate hackathon, providing a supportive space for developers of all backgrounds to collaborate, learn mobile design, and construct physical IoT rigs.",
          officialLink: "https://pennapps.com",
          matchScore: 78,
          matchReason: ["Matches skills: React, NodeJS", "Beginner-friendly status matches early ideation profiles", "Open registration"]
        }
      ];
      setHackathonsList(mockList);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (portalMode === 'student') {
      fetchHackathonsData();
    }
  }, [portalMode]);

  // Handle Autocomplete Suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matches = new Set();
    
    hackathonsList.forEach(h => {
      if (h.name.toLowerCase().includes(query)) matches.add(h.name);
      if (h.organizer.toLowerCase().includes(query)) matches.add(h.organizer);
      h.technologies.forEach(t => {
        if (t.toLowerCase().includes(query)) matches.add(t);
      });
      h.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) matches.add(tag);
      });
    });

    setSuggestions(Array.from(matches).slice(0, 5));
  }, [searchQuery, hackathonsList]);

  // Handle Prepare with AI Guide
  const handleLoadPrepGuide = async (hackathonId) => {
    setPrepLoading(true);
    const profile = getStudentProfile();
    try {
      const res = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      if (data.success) {
        setActivePrepGuide(data.guide);
        setActiveTabPrep('ideas');
      }
    } catch (err) {
      console.warn("Express backend offline, compiling offline preparation guidelines...");
      const activeHack = hackathonsList.find(h => h.id === hackathonId);
      setActivePrepGuide({
        hackathonId: hackathonId,
        hackathonName: activeHack ? activeHack.name : "Hackathon",
        requiredSkills: [
          "REST API connection and JSON data parsers",
          "Git branch management & commit checks",
          "React State context hooks",
          "FastAPI or Node Express environment setup"
        ],
        recommendedStack: `${activeHack ? activeHack.technologies.slice(0, 3).join(', ') : 'React, Python'}, Express, and MongoDB`,
        learningResources: [
          { name: "Official API references and documentation guides", url: "https://docs.google.com" },
          { name: "GitHub actions CI/CD deployment tutorials", url: "https://github.com" }
        ],
        projectSuggestions: [
          {
            title: `AI-Powered ${activeHack ? activeHack.tags[0] : 'Venture'} Analyzer`,
            stack: "React, Python, TailwindCSS, VectorDB",
            desc: "Construct a semantic search compiler auditing historical patent databases and listing expired public claims."
          },
          {
            title: "Offline Fallback Auth Gate",
            stack: "Solidity, React, NodeJS, Web3",
            desc: "Assemble local-first encrypted login pipelines that operate securely even when server APIs go offline."
          }
        ],
        winningProjects: [
          { name: "PatentHunter Node", description: "Wikipedia parser retrieving claims in under 300ms. Awarded Grand Prize at local event." }
        ],
        relevantPapers: [
          { title: "Static Code Analysis for Vulnerability Auditing", author: "Vance, M.", link: "https://arxiv.org" }
        ],
        relevantRepos: [
          { name: "decentralized-auth-boilerplate", owner: "vance-labs", link: "https://github.com" }
        ],
        preparationChecklist: [
          { day: "Day -7", task: "Form team and finalize core concept matching WIPO/Wikipedia verifications." },
          { day: "Day -3", task: "Setup repository workspace and test build configurations." },
          { day: "Day 1", task: "Initiate API routing pipelines and clean code structures." },
          { day: "Day 2", task: "Pitch rehearsal with presentation deck blueprints." }
        ]
      });
      setActiveTabPrep('ideas');
    } finally {
      setPrepLoading(false);
    }
  };

  // Add / Remove from saved Calendar
  const handleToggleCalendar = (hackathon) => {
    let updated;
    const isSaved = savedCalendar.some(h => h.id === hackathon.id);
    if (isSaved) {
      updated = savedCalendar.filter(h => h.id !== hackathon.id);
    } else {
      updated = [...savedCalendar, hackathon];
    }
    setSavedCalendar(updated);
    localStorage.setItem('registered_hackathons_calendar', JSON.stringify(updated));
  };

  // Notification Config adjustments
  const handleSaveNotifications = (key, val) => {
    const updated = { ...notificationConfig, [key]: val };
    setNotificationConfig(updated);
    localStorage.setItem('hackathon_notification_config', JSON.stringify(updated));
  };

  // Share link trigger
  const handleShareHackathon = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Download prep report checklist as MD file
  const handleDownloadPrepChecklist = (guide) => {
    const content = `# Preparation Guide: ${guide.hackathonName}
Category: Hackathon Prep Blueprint (Generated via Invenza AI)

## Recommended Tech Stack
${guide.recommendedStack}

## Required Skills Checklist
${guide.requiredSkills.map(s => `- [ ] ${s}`).join('\n')}

## Recommended Project Ideas
${guide.projectSuggestions.map(p => `### ${p.title}
- Stack: ${p.stack}
- Description: ${p.desc}`).join('\n\n')}

## Timeline Tasks Checklist
${guide.preparationChecklist.map(t => `- [ ] **${t.day}**: ${t.task}`).join('\n')}

---
CLEARANCE SYSTEM MOAT // SECURE DATA COMPILED
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${guide.hackathonName.replace(/\s+/g, '_')}_prep_blueprint.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Apply filters on search results
  const filteredHackathons = hackathonsList.filter(h => {
    // 1. Search Query filter
    const matchesSearch = !searchQuery.trim() || 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      h.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Mode filter
    if (modeFilter !== 'All' && h.mode !== modeFilter) return false;

    // 3. Tech Tags filters
    if (techFilters.length > 0) {
      const hasMatchedTag = h.tags.some(tag => techFilters.includes(tag));
      if (!hasMatchedTag) return false;
    }

    // 4. Closing Soon filter (under 10 days remaining from current date 2026-07-13)
    if (closingSoonFilter) {
      const diffTime = new Date(h.deadline) - new Date("2026-07-13");
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 10 || diffDays < 0) return false;
    }

    // 5. Open Only filter
    if (openOnlyFilter && h.registrationStatus !== 'Open') return false;

    // 6. Free Registration (Mock check: SIH & college hackathons are usually free)
    if (freeOnlyFilter) {
      const isFree = !h.prizePool.includes('Rs') && !h.prizePool.includes('₹') || h.name.includes('SIH') || h.name.includes('CalHacks') || h.name.includes('MIT') || h.name.includes('PennApps');
      if (!isFree) return false;
    }

    return true;
  });

  // Calculate days remaining till deadline from 2026-07-13
  const getDaysRemaining = (deadlineStr) => {
    const diffTime = new Date(deadlineStr) - new Date("2026-07-13");
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Toggle tech tag inside search filters
  const handleToggleTechFilter = (tag) => {
    if (techFilters.includes(tag)) {
      setTechFilters(techFilters.filter(t => t !== tag));
    } else {
      setTechFilters([...techFilters, tag]);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Global Stats Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>AI INNOVATION PARTNER</span>
          <h1 style={{ fontSize: '2.1rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            AI Innovation Mentor Workspace
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Interactive milestones tracker, automated security code reviewer, slide blueprint compilers, and pitch guides.
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          {portalMode === 'student' && (
            <button 
              onClick={() => setActiveTab('upcoming-hackathons')}
              className={`tech-button ${activeTab === 'upcoming-hackathons' ? '' : 'tech-button-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
            >
              Upcoming Hackathons
            </button>
          )}
          <button 
            onClick={() => setActiveTab('mentor')}
            className={`tech-button ${activeTab === 'mentor' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
          >
            Mentorship & Progress
          </button>
          <button 
            onClick={() => setActiveTab('reviewer')}
            className={`tech-button ${activeTab === 'reviewer' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
          >
            AI Code Reviewer
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`tech-button ${activeTab === 'docs' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
          >
            AI Document Generator
          </button>
          <button 
            onClick={() => setActiveTab('prep')}
            className={`tech-button ${activeTab === 'prep' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
          >
            Event Preparation Guide
          </button>
        </div>
      </div>

      {/* Global Project Status Overlay */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-primary)', background: 'rgba(59, 130, 246, 0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>ACTIVE PROJECT PROFILE</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.15rem' }}>{project.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Sector Category: <strong>{project.sector}</strong></p>
        </div>
        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{progressPercent}% Complete</strong>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.4s ease' }}></div>
          </div>
        </div>
      </div>

      {/* A. UPCOMING HACKATHONS TAB VIEW */}
      {activeTab === 'upcoming-hackathons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Controls: Search, autocomplete & Config toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
            
            {/* Search Input with autocomplete suggestions dropdown */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                className="tech-input" 
                style={{ paddingLeft: '2.5rem' }} 
                placeholder="Search hackathons by name, technologies, location or tag..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              
              {/* Autocomplete list */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-panel-solid)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '8px',
                  zIndex: 100,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  overflow: 'hidden'
                }}>
                  {suggestions.map((sug, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSearchQuery(sug);
                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        borderBottom: idx < suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {sug}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button 
              onClick={fetchHackathonsData} 
              className="tech-button tech-button-outline"
              title="Refresh Feeds"
              style={{ height: '42px', width: '42px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RefreshCw size={14} className={listLoading ? "animate-spin" : ""} />
            </button>

            {/* Notifications settings toggle */}
            <button 
              onClick={() => setShowConfigModal(true)} 
              className="tech-button tech-button-outline"
              style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Bell size={14} /> Alerts
            </button>
          </div>

          {/* Filter Panels HUD */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <SlidersHorizontal size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Discovery Filters</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.8rem' }}>
              
              {/* Mode selector */}
              <div>
                <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>EVENT MODE</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {['All', 'Online', 'Offline', 'Hybrid'].map(m => (
                    <button
                      key={m}
                      onClick={() => setModeFilter(m)}
                      className={`tech-button ${modeFilter === m ? '' : 'tech-button-outline'}`}
                      style={{ fontSize: '0.7rem', padding: '0.35rem 0.65rem' }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag filters */}
              <div>
                <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>TECH CATEGORY</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {['AI', 'Web Development', 'Machine Learning', 'IoT', 'Blockchain', 'Cybersecurity', 'Robotics', 'Cloud Computing'].map(tag => {
                    const isActive = techFilters.includes(tag);
                    return (
                      <span
                        key={tag}
                        onClick={() => handleToggleTechFilter(tag)}
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                          background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.01)',
                          color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Toggles check lists */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={closingSoonFilter} onChange={e => setClosingSoonFilter(e.target.checked)} />
                  <span>Closing Soon (&lt;10 Days)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={freeOnlyFilter} onChange={e => setFreeOnlyFilter(e.target.checked)} />
                  <span>Free Registrations</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={openOnlyFilter} onChange={e => setOpenOnlyFilter(e.target.checked)} />
                  <span>Open Registration Only</span>
                </label>
              </div>

            </div>
          </div>

          {/* Saved Calendar / Deadline tracking strip */}
          {savedCalendar.length > 0 && (
            <div className="glass-panel" style={{ padding: '1rem', borderLeft: '3px solid var(--color-secondary)', background: 'rgba(13, 148, 136, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} /> Saved Calendar Deadlines ({savedCalendar.length} Saved)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {savedCalendar.map(h => {
                  const days = getDaysRemaining(h.deadline);
                  return (
                    <div 
                      key={h.id}
                      style={{
                        minWidth: '200px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-color)',
                        padding: '0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <strong style={{ color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        <span>Deadline: {h.deadline}</span>
                        <span style={{ color: days <= 5 ? 'var(--color-danger)' : 'var(--color-secondary)', fontWeight: 'bold' }}>
                          {days === 0 ? "Expired" : `${days} Days Left`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hackathons Cards Display Grid */}
          {listLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
              <RefreshCw size={28} className="animate-spin glow-text-pink" style={{ marginBottom: '1rem' }} />
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>PARSING PLATFORM EVENT REGISTRIES...</span>
            </div>
          ) : filteredHackathons.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }} className="responsive-grid-two">
              {filteredHackathons.map(hack => {
                const isSaved = savedCalendar.some(s => s.id === hack.id);
                const daysLeft = getDaysRemaining(hack.deadline);
                return (
                  <div 
                    key={hack.id}
                    className="glass-panel"
                    style={{
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      border: '1.5px solid var(--border-color)',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    
                    {/* Card Header: Name, Host, Match Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {hack.host.toUpperCase()} // ORGANIZER: {hack.organizer.toUpperCase()}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                          {hack.name}
                        </h3>
                      </div>
                      
                      {/* AI Match Score Badge */}
                      <div 
                        onClick={() => setShowMatchScoreDetails(hack.id)}
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1.5px solid var(--color-success)',
                          color: 'var(--color-success)',
                          borderRadius: '6px',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        <Sparkles size={11} /> {hack.matchScore}% Match
                      </div>
                    </div>

                    {/* Match Score Reason hover box */}
                    {showMatchScoreDetails === hack.id && (
                      <div style={{
                        position: 'absolute',
                        top: '10%',
                        right: '5%',
                        width: '90%',
                        background: 'var(--bg-panel-solid)',
                        border: '1.5px solid var(--color-success)',
                        borderRadius: '8px',
                        padding: '1.25rem',
                        zIndex: 50,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Sparkles size={13} /> AI Matching Diagnostics
                          </span>
                          <span 
                            onClick={() => setShowMatchScoreDetails(null)} 
                            style={{ cursor: 'pointer', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}
                          >
                            Close
                          </span>
                        </div>
                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {hack.matchReason.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                      {hack.description}
                    </p>

                    {/* Sub-grid of Key Event Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-color)',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
                        <span>Deadline: <strong style={{ color: daysLeft <= 5 ? 'var(--color-danger)' : 'var(--text-main)' }}>{hack.deadline}</strong></span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Trophy size={13} style={{ color: 'var(--color-secondary)' }} />
                        <span>Pool: <strong style={{ color: 'var(--text-main)' }}>{hack.prizePool}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Mode: <strong>{hack.mode}</strong> ({hack.venue})</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Users size={13} style={{ color: 'var(--color-secondary)' }} />
                        <span>Team Size: <strong>{hack.teamSize}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Award size={13} style={{ color: 'var(--color-primary)' }} />
                        <span>Level: <strong>{hack.difficulty}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <BookOpen size={13} style={{ color: 'var(--color-secondary)' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Branch: <strong>{hack.eligibleBranches.join(', ')}</strong></span>
                      </div>
                    </div>

                    {/* Technologies & Tags badge chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {hack.technologies.slice(0, 3).map(tech => (
                        <span key={tech} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)' }}>
                          {tech}
                        </span>
                      ))}
                      {hack.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(59,130,246,0.05)', color: 'var(--color-primary)', border: '1px solid rgba(59,130,246,0.1)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons footer */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr auto auto', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      
                      {/* Register Now button */}
                      <a 
                        href={hack.officialLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="tech-button"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem', height: '36px', textDecoration: 'none' }}
                      >
                        Register Now <ExternalLink size={12} />
                      </a>

                      {/* Prepare Guide button */}
                      <button 
                        onClick={() => handleLoadPrepGuide(hack.id)}
                        className="tech-button tech-button-outline"
                        style={{ fontSize: '0.75rem', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                      >
                        <Sparkles size={11} /> Prepare Guide
                      </button>

                      {/* Save to Calendar toggle */}
                      <button 
                        onClick={() => handleToggleCalendar(hack)}
                        className="tech-button tech-button-outline"
                        title={isSaved ? "Remove from Calendar" : "Add to Calendar"}
                        style={{ height: '36px', width: '36px', padding: 0, color: isSaved ? 'var(--color-secondary)' : 'var(--text-dim)', borderColor: isSaved ? 'var(--color-secondary)' : 'var(--border-color)' }}
                      >
                        <Bookmark size={13} style={{ fill: isSaved ? 'currentColor' : 'none' }} />
                      </button>

                      {/* Share link button */}
                      <button 
                        onClick={() => handleShareHackathon(hack.officialLink)}
                        className="tech-button tech-button-outline"
                        title="Copy Link"
                        style={{ height: '36px', width: '36px', padding: 0, color: copiedLink === hack.officialLink ? 'var(--color-success)' : 'var(--text-dim)' }}
                      >
                        {copiedLink === hack.officialLink ? "✓" : <Share2 size={13} />}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertTriangle size={32} style={{ color: 'var(--color-primary)', opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>No Active Hackathons Found</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', maxWidth: '300px', margin: '0.25rem auto' }}>
                We couldn't resolve any open hackathons matching your search query or filters. Clear some criteria to retry.
              </p>
            </div>
          )}

        </div>
      )}

      {/* B. AI PREPARATION ASSISTANT DETAIL DRAWER PANEL */}
      {activePrepGuide && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '520px',
          height: '100vh',
          background: 'var(--bg-panel-solid)',
          borderLeft: '2px solid var(--color-primary)',
          zIndex: 100000,
          boxShadow: '-8px 0 35px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }} className="animate-slide-in">
          
          {/* Drawer Header */}
          <div style={{
            padding: '1.75rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.01)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                AI PREPARATION ASSISTANT
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 850, fontFamily: 'var(--font-display)', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {activePrepGuide.hackathonName}
              </h3>
            </div>
            <button 
              onClick={() => setActivePrepGuide(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem' }}
            >
              ✕
            </button>
          </div>

          {/* Drawer Sub-tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(0,0,0,0.15)',
            fontSize: '0.75rem'
          }}>
            {[
              { id: 'ideas', label: 'Project Ideas' },
              { id: 'stack', label: 'Tech Stack & Skills' },
              { id: 'papers', label: 'Repos & Literature' },
              { id: 'timeline', label: 'Timeline checklist' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabPrep(tab.id)}
                style={{
                  flex: 1,
                  padding: '0.85rem 0',
                  border: 'none',
                  background: activeTabPrep === tab.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  color: activeTabPrep === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                  borderBottom: activeTabPrep === tab.id ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                  fontWeight: activeTabPrep === tab.id ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Drawer Body Scroll Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxSizing: 'border-box' }}>
            
            {/* Tab 1: Ideas */}
            {activeTabPrep === 'ideas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  Here are three customized, high-viability project suggestions engineered to combine your student profile skills with the target event themes:
                </p>

                {activePrepGuide.projectSuggestions.map((p, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.title}</strong>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>Option 0{idx+1}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      Stack: {p.stack}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Tech Stack & Required Skills */}
            {activeTabPrep === 'stack' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Tech stack */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem', borderLeft: '2.5px solid var(--color-primary)', paddingLeft: '0.5rem' }}>
                    RECOMMENDED ROADMAP TECH STACK
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                    We recommend constructing your prototype system using: <strong style={{ color: 'var(--color-secondary)' }}>{activePrepGuide.recommendedStack}</strong>.
                  </p>
                </div>

                {/* Required skills checklist */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem', borderLeft: '2.5px solid var(--color-primary)', paddingLeft: '0.5rem' }}>
                    REQUIRED TECHNICAL SKILLS CHECKS
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activePrepGuide.requiredSkills.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--color-primary)' }}>✓</span>
                        <span style={{ color: 'var(--text-muted)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Learning resources */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem', borderLeft: '2.5px solid var(--color-primary)', paddingLeft: '0.5rem' }}>
                    OFFICIAL DEVELOPER LEARNING CHANNELS
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activePrepGuide.learningResources.map((res, idx) => (
                      <a 
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-secondary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {res.name} <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 3: Literature & Repos */}
            {activeTabPrep === 'papers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Repos */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem', borderLeft: '2.5px solid var(--color-primary)', paddingLeft: '0.5rem' }}>
                    RECOMMENDED GITHUB STARTER REPOS
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activePrepGuide.relevantRepos.map((repo, idx) => (
                      <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{repo.owner}/{repo.name}</div>
                        <a 
                          href={repo.link} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}
                        >
                          Explore code templates <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Papers */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.5rem', borderLeft: '2.5px solid var(--color-primary)', paddingLeft: '0.5rem' }}>
                    RELEVANT SCIENTIFIC LITERATURE
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activePrepGuide.relevantPapers.map((paper, idx) => (
                      <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem' }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{paper.title}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem', marginTop: '0.1rem' }}>Author: {paper.author}</div>
                        <a 
                          href={paper.link} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}
                        >
                          Read Publication PDF <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Timeline */}
            {activeTabPrep === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  Follow this chronological sprint timeline checklist to prepare and deploy your prototype during the event:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  {activePrepGuide.preparationChecklist.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                        {idx < activePrepGuide.preparationChecklist.length - 1 && <span style={{ width: '1px', flex: 1, background: 'var(--border-color)', margin: '0.2rem 0' }}></span>}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{step.day}</span>
                        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.05rem' }}>{step.task}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer Actions */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button 
              onClick={() => handleDownloadPrepChecklist(activePrepGuide)}
              className="tech-button"
              style={{ flex: 1, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
            >
              <Download size={14} /> Download Prep Blueprint (.md)
            </button>
            <button 
              onClick={() => setActivePrepGuide(null)}
              className="tech-button tech-button-outline"
              style={{ fontSize: '0.8rem' }}
            >
              Dismiss
            </button>
          </div>

        </div>
      )}

      {/* C. ALERTS & NOTIFICATIONS CONFIGURATION DIALOG MODAL */}
      {showConfigModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 3, 5, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 1000000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '430px',
            background: 'var(--bg-panel-solid)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 0 35px var(--color-primary)',
            color: 'var(--text-main)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Bell size={15} color="var(--color-primary)" /> Alert Subscriptions
              </span>
              <button 
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
              Customize notification policies. Telemetry channels dispatch alert banners directly inside Invenza's alerts hub.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Deadline Close Reminders</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Alert when saved hackathon is &lt;2 days from deadline</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationConfig.deadlineReminders} 
                  onChange={e => handleSaveNotifications('deadlineReminders', e.target.checked)} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>New AI Hackathon Dispatches</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Alert when a new verified AI category event is parsed</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationConfig.newAIAnnouncements} 
                  onChange={e => handleSaveNotifications('newAIAnnouncements', e.target.checked)} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Event Status Changes</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Alert if registration opens or event details modify</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificationConfig.statusChanges} 
                  onChange={e => handleSaveNotifications('statusChanges', e.target.checked)} 
                />
              </label>
            </div>

            <button 
              onClick={() => setShowConfigModal(false)}
              className="tech-button"
              style={{ width: '100%', marginTop: '0.5rem', background: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }}
            >
              Apply Alert Subscriptions
            </button>
          </div>
        </div>
      )}

      {/* D. MENTOR PROGRESS TAB */}
      {activeTab === 'mentor' && (
        portalMode === 'student' ? <StudentDashboard /> : <BusinessDashboard />
      )}

      {/* E. AI CODE REVIEWER TAB */}
      {activeTab === 'reviewer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* Input Panel */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Automated Static Code Reviewer
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Upload or paste your source script files (React, Node, Python) to audit security bugs, hardcoded keys, and performance issues.
              </p>
            </div>

            <textarea
              className="tech-input"
              placeholder="Paste code snippet here... (e.g. const apiKey = 'SEC_KEY_G89A'; fetch('http://api.com').then(r => r.json());)"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              style={{ width: '100%', height: '240px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.85rem', resize: 'vertical' }}
            />

            <button
              onClick={() => runCodeReview(codeInput)}
              disabled={reviewLoading || !codeInput.trim()}
              className="tech-button"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '40px', fontSize: '0.8rem' }}
            >
              {reviewLoading ? <RefreshCw size={14} className="animate-spin" /> : <Code size={14} />}
              {reviewLoading ? 'AUDITING FILES...' : 'RUN SECURITY & PERFORMANCE REVIEW'}
            </button>
          </div>

          {/* Review Findings */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '380px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Review Audit Findings
            </h3>

            {reviewLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifycontent: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <RefreshCw size={24} className="glow-text-pink animate-spin" style={{ marginBottom: '1rem' }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>SCANNING SYSTEM NODE CLAIMS...</span>
              </div>
            ) : codeReview ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {codeReview.map((finding, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      padding: '1rem', 
                      background: finding.type === 'security' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255,255,255,0.01)',
                      border: finding.type === 'security' ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--border-color)',
                      borderLeft: finding.severity === 'critical' ? '4px solid var(--color-error)' : finding.severity === 'high' ? '4px solid #ef4444' : '4px solid var(--color-primary)',
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{finding.title}</strong>
                      <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        {finding.type} | {finding.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
                      {finding.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', color: 'var(--text-dim)', textAlign: 'center' }}>
                <ShieldAlert size={28} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                <span style={{ fontSize: '0.75rem' }}>No code has been audited yet.</span>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.25rem', maxWidth: '240px' }}>
                  Paste a file block on the left and click audit to begin structural security scanning.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* F. AI DOCUMENT GENERATOR TAB */}
      {activeTab === 'docs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '1.75rem', alignItems: 'start' }}>
          
          {/* Doc Selection Buttons */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Select Document Format
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { type: 'abstract', label: 'Project Abstract', desc: 'Summary of vision, gaps and moats.' },
                { type: 'README', label: 'GitHub README.md', desc: 'Installs, scripts, and stacks list.' },
                { type: 'architecture', label: 'Architecture Blueprint', desc: 'Flowchart maps & pipelines.' },
                { type: 'slides', label: 'Pitch Presentation Slides', desc: 'Pitch slide topics structure.' }
              ].map(docType => (
                <button
                  key={docType.type}
                  onClick={() => fetchDocument(docType.type)}
                  disabled={docsLoading}
                  className="tech-button tech-button-outline"
                  style={{ 
                    textAlign: 'left', 
                    padding: '0.85rem 1rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.15rem', 
                    border: docs[docType.type] ? '1px solid var(--color-secondary)' : '1px solid var(--border-color)',
                    background: docs[docType.type] ? 'rgba(13,148,136,0.03)' : 'transparent'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{docType.label}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{docType.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compiled Output Panel */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Compiled Markdown Console
              </h3>
              
              {docsLoading && (
                <span className="glow-text-pink animate-spin" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>COMPILING...</span>
              )}
            </div>

            {Object.keys(docs).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(docs).map(([type, content]) => (
                  <div key={type} className="animate-fade-in" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)', borderBottom: 'none', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                        {type.toUpperCase()}.MD
                      </span>
                      <button
                        onClick={() => handleCopyText(content, type)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Copy size={11} /> {copiedDoc === type ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <pre style={{ 
                      margin: 0, 
                      padding: '1rem', 
                      background: '#04060a', 
                      border: '1px solid var(--border-color)', 
                      borderBottomLeftRadius: '6px', 
                      borderBottomRightRadius: '6px', 
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      lineHeight: '1.45'
                    }}>
                      {content}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', color: 'var(--text-dim)', textAlign: 'center' }}>
                <FileText size={28} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                <span style={{ fontSize: '0.75rem' }}>No documents compiled yet.</span>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.25rem', maxWidth: '240px' }}>
                  Select a document format on the left to compile structured blueprints dynamically.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* G. EVENT PREPARATION CHECKLIST TAB */}
      {activeTab === 'prep' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          
          {/* Timeline Planner */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <Clock size={16} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                36-Hour Prototype Timeline
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              {[
                { time: "Hour 00-06", title: "RAG Patent Audit", desc: "Isolate patent claims, check expiration status, and run similarity checks." },
                { time: "Hour 06-18", title: "Core Architecture", desc: "Build layout grids, connect local storage queries, wire context states." },
                { time: "Hour 18-30", title: "AI Integration Loop", desc: "Add autocomplete filters, link parallel git codes, compile checklists." },
                { time: "Hour 30-36", title: "Slide Guides & Rehearsals", desc: "Run Pitch Coach virtual VC simulation, inspect questions, finalize repo README." }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></span>
                    {idx < 3 && <span style={{ width: '1px', flex: 1, background: 'var(--border-color)', margin: '0.2rem 0' }}></span>}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{step.time}</span>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700, marginTop: '0.1rem' }}>{step.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: '1.35' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions Checklist */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <CheckSquare size={16} color="var(--color-secondary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Final Submission Checklist
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { category: "ideation", text: "Run RAG semantic audits to check patent overlap." },
                { category: "ideation", text: "Verify patent expiration status using WIPO classification codes." },
                { category: "code", text: "Configure Express router and add suggestion caching endpoints." },
                { category: "code", text: "Define client-side global search context parameters." },
                { category: "business", text: "Map SWOT diagnostics and budget estimated costs." },
                { category: "pitch", text: "Prepare slides blueprints and rehearse virtual VC feedback queries." }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-secondary)', marginTop: '3px' }}>✓</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.35' }}>
                    {item.text} <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>[{item.category.toUpperCase()}]</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Judge Q&A Rehearsal */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <Trophy size={16} color="var(--color-accent)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Judge Pitch Rehearsal
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: "Q1: 'If this technology failed historically, why would it work now?'",
                  a: "Answer: 'Original models failed due to hardware limits (e.g. Pebble's monochrome screen, Glass's prism optics). By linking public domain claims with modern computing enablers (like waveguide displays and TinyML NPUs), we bypass those bottlenecks at 1/10th of original cost.'"
                },
                {
                  q: "Q2: 'What is your technical fallback if your API goes offline during judging?'",
                  a: "Answer: 'We engineered a client-side NLP similarity model. If our database server is disconnected, the system automatically redirects to local browser loops, ensuring search matching, SWOT planning, and chat dialogs remain 100% active.'"
                },
                {
                  q: "Q3: 'How are you validating your market and pricing models?'",
                  a: "Answer: 'We target B2B developer kit licensing early in Phase 2 to generate revenue, rather than waiting for large-scale consumer manufacturing deployments.'"
                },
                {
                  q: "Q4: 'Why is your UI styled with a corporate dark mode layout?'",
                  a: "Answer: 'Aesthetics drive immediate engagement. The UI is designed as a tactical command center using premium Inter typography, obsidian-black shades, and royal-blue accents to highlight the AI telemetry.'"
                }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{item.q}</strong>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.35' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Hackathons;
