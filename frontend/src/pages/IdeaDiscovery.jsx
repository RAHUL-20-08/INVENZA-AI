import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  BookOpen, 
  RefreshCw,
  Search,
  ArrowRight,
  LineChart,
  ShieldAlert,
  Zap,
  Briefcase,
  Trophy,
  DollarSign,
  Clock,
  Compass,
  FileText,
  Users,
  Target,
  FileCode,
  Download,
  Send,
  Plus,
  Info,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Lightbulb,
  Volume2
} from 'lucide-react';

// Custom Searchable Dropdown Component
const SearchableDropdown = ({ label, value, onChange, options, tooltip, portalAccent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {label}
        {tooltip && (
          <span style={{ cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.7rem' }} title={tooltip}>
            ⓘ
          </span>
        )}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          padding: '0.65rem 0.85rem', 
          background: 'rgba(0,0,0,0.25)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.85rem'
        }}
      >
        <span>{value || `Select ${label}`}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          background: 'var(--bg-panel-solid)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '6px', 
          zIndex: 100, 
          marginTop: '0.25rem', 
          padding: '0.5rem', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)' 
        }}>
          <input 
            type="text" 
            placeholder="Search options..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '0.45rem', 
              borderRadius: '4px', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--border-color)', 
              color: '#fff', 
              fontSize: '0.75rem', 
              marginBottom: '0.5rem' 
            }} 
            onClick={(e) => e.stopPropagation()} 
          />
          <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {filtered.map(opt => (
              <div 
                key={opt} 
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearch('');
                }} 
                style={{ 
                  padding: '0.45rem 0.6rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  background: value === opt ? `${portalAccent}15` : 'transparent', 
                  fontSize: '0.75rem',
                  color: value === opt ? '#fff' : 'var(--text-muted)'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.target.style.background = value === opt ? `${portalAccent}15` : 'transparent'}
              >
                {opt}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '0.45rem', fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center' }}>No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// In-place Editable Block Component
const EditableBlock = ({ label, value, onChange, type = "text", onRegenerate, portalAccent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(value);

  useEffect(() => {
    setTempVal(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempVal);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.45rem', 
      padding: '1.25rem', 
      borderRadius: '8px', 
      border: '1px solid var(--border-color)', 
      background: 'rgba(255,255,255,0.01)', 
      position: 'relative' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{label.toUpperCase()}</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {onRegenerate && (
            <button 
              onClick={onRegenerate} 
              className="tech-button" 
              style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              🔄 Refresh Section
            </button>
          )}
          <span style={{ fontSize: '0.65rem', color: portalAccent, display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
            <Edit2 size={10} /> In-place Editable
          </span>
        </div>
      </div>
      
      {isEditing ? (
        type === "textarea" ? (
          <textarea 
            value={tempVal} 
            onChange={(e) => setTempVal(e.target.value)} 
            onBlur={handleBlur}
            autoFocus
            rows={5}
            className="tech-input"
            style={{ fontSize: '0.85rem', width: '100%', lineHeight: '1.5' }}
          />
        ) : (
          <input 
            type="text" 
            value={tempVal} 
            onChange={(e) => setTempVal(e.target.value)} 
            onBlur={handleBlur}
            autoFocus
            className="tech-input"
            style={{ fontSize: '0.85rem', width: '100%' }}
          />
        )
      ) : (
        <div 
          onClick={() => setIsEditing(true)} 
          style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', minHeight: '1.5rem', lineHeight: '1.6' }}
        >
          {value || `Click to add ${label}...`}
        </div>
      )}
    </div>
  );
};

const IdeaDiscovery = () => {
  const { portalMode } = usePortal();
  
  // Workspace and UI states
  const [activeIdea, setActiveIdea] = useState(null);
  const [savedStartups, setSavedStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('generator'); 
  const [canvasMode, setCanvasMode] = useState('lean');
  const [step, setStep] = useState(1); // Steps: 1, 2, 3, 4, 5

  // List arrays matching prompt spec exactly
  const industries = ["Artificial Intelligence", "Healthcare", "Agriculture", "Education", "Cybersecurity", "FinTech", "EdTech", "Robotics", "Space Technology", "Renewable Energy", "IoT", "Blockchain", "Manufacturing", "Logistics", "Transportation", "Climate Tech", "Smart Cities", "Food Technology", "Biotechnology", "Tourism", "Retail", "Others"];
  const businessTypes = ["Startup", "MSME", "Enterprise", "Research Project", "Student Project", "Hackathon Prototype", "Open Source Project", "Social Innovation", "Non-profit"];
  const projectGoals = ["Build MVP", "Hackathon", "College Project", "Patent Revival", "Commercial Product", "Research", "Startup Launch", "Investment Ready", "Prototype", "Technology Demonstration"];
  const targetUsersList = ["Students", "Teachers", "Hospitals", "Farmers", "Factories", "Companies", "Government", "NGOs", "Researchers", "Consumers", "Businesses", "Developers", "Investors"];
  const techStackList = ["Artificial Intelligence", "Machine Learning", "Deep Learning", "LLMs", "NLP", "Computer Vision", "IoT", "Blockchain", "Cloud Computing", "Edge AI", "AR/VR", "Robotics", "Embedded Systems", "Big Data", "Cybersecurity", "Digital Twin", "GIS", "Quantum Computing"];
  const budgets = ["Below ₹10,000", "₹10K–₹50K", "₹50K–₹1L", "₹1L–₹5L", "₹5L–₹25L", "₹25L+"];
  const teamSizes = ["Solo", "2 Members", "3 Members", "4 Members", "5 Members", "6+"];
  const timelines = ["1 Month", "3 Months", "6 Months", "1 Year", "2 Years"];
  const targetMarkets = ["Local", "State", "National", "International", "Global"];
  const revenueModels = ["Subscription", "Freemium", "Licensing", "Marketplace", "Advertisement", "SaaS", "One-time Purchase", "Consulting", "Enterprise", "Government Contract"];
  const fundingStages = ["Self-funded", "Friends & Family", "Incubator", "Accelerator", "Angel Investor", "Seed Funding", "Series A", "Grant", "MSME Scheme"];

  // Wizard state loaded from localStorage draft if exists
  const [inputs, setInputs] = useState(() => {
    const draft = localStorage.getItem('venture_builder_draft');
    if (draft) {
      try { return JSON.parse(draft); } catch (e) {}
    }
    return {
      industry: 'Agriculture',
      businessType: 'Startup',
      projectGoal: 'Build MVP',
      technology: ['IoT', 'Edge AI'],
      budget: '₹1L–₹5L',
      teamSize: '3 Members',
      timeline: '6 Months',
      targetMarket: 'National',
      revenueModel: ['SaaS', 'Subscription'],
      fundingStage: 'Self-funded',
      targetAudience: ['Farmers'],
      problemStatement: 'Farmers suffer crop losses due to unoptimized manual drip irrigation scheduling loops.',
      marketTrends: 'Smart e-paper displays and low-power mesh radios'
    };
  });

  // Save draft state to localStorage on modification
  useEffect(() => {
    localStorage.setItem('venture_builder_draft', JSON.stringify(inputs));
  }, [inputs]);

  // AI Mentor chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'mentor', text: 'Welcome to your Workspace. I am your AI Business Mentor. Enter your venture criteria in our guided builder, and I will guide you through validation to launch.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchSavedStartups();
  }, []);

  const fetchSavedStartups = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/analysis/saved-startups', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSavedStartups(data.startups || []);
      }
    } catch (e) {
      console.warn("Failed to load saved startups telemetry.");
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      // Map multi-select arrays to comma-separated strings for compatibility with backend controller
      const payload = {
        industry: inputs.industry,
        skills: `Team size: ${inputs.teamSize}, Goal: ${inputs.projectGoal}`,
        budget: inputs.budget,
        country: `${inputs.targetMarket} deployment scale`,
        technology: inputs.technology.join(', '),
        problemStatement: inputs.problemStatement,
        targetAudience: inputs.targetAudience.join(', '),
        marketTrends: inputs.marketTrends
      };

      const res = await fetch('http://localhost:5000/api/discover-ideas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.idea) {
        setActiveIdea(data.idea);
        setActiveTab('plan');
        setChatHistory([
          { sender: 'mentor', text: `Venture concept "${data.idea.title}" synthesized successfully! I have created your Lean Canvas, SWOT analysis, competitor lists, and visual launch roadmap. Feel free to edit any text directly or ask me questions about it.` }
        ]);
      } else {
        setError(data.message || "Failed to generate concept.");
      }
    } catch (err) {
      setError("AI generation server offline. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async () => {
    if (!activeIdea) return;
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/analysis/save-startup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idea: activeIdea })
      });
      const data = await res.json();
      if (data.success) {
        fetchSavedStartups();
        alert("Concept saved successfully to Workspace Dashboard!");
      }
    } catch (e) {
      alert("Failed to save idea.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Suggest options based on current selections
  const handleAISuggest = (field) => {
    if (field === 'industry') {
      if (inputs.problemStatement.toLowerCase().includes('crop') || inputs.problemStatement.toLowerCase().includes('irrigation')) {
        setInputs(prev => ({ ...prev, industry: 'Agriculture' }));
      } else if (inputs.problemStatement.toLowerCase().includes('health') || inputs.problemStatement.toLowerCase().includes('patient')) {
        setInputs(prev => ({ ...prev, industry: 'Healthcare' }));
      } else {
        setInputs(prev => ({ ...prev, industry: 'Artificial Intelligence' }));
      }
    } else if (field === 'technology') {
      if (inputs.industry === 'Healthcare') {
        setInputs(prev => ({ ...prev, technology: ['Artificial Intelligence', 'Computer Vision', 'Cloud Computing'] }));
      } else if (inputs.industry === 'Agriculture') {
        setInputs(prev => ({ ...prev, technology: ['IoT', 'Edge AI', 'Computer Vision'] }));
      } else {
        setInputs(prev => ({ ...prev, technology: ['Artificial Intelligence', 'LLMs', 'Cloud Computing'] }));
      }
    } else if (field === 'revenueModel') {
      if (inputs.businessType === 'Startup' || inputs.businessType === 'Enterprise') {
        setInputs(prev => ({ ...prev, revenueModel: ['SaaS', 'Subscription'] }));
      } else if (inputs.businessType === 'Social Innovation' || inputs.businessType === 'Non-profit') {
        setInputs(prev => ({ ...prev, revenueModel: ['Government Contract', 'Consulting'] }));
      } else {
        setInputs(prev => ({ ...prev, revenueModel: ['Freemium', 'Subscription'] }));
      }
    }
  };

  // Auto-fill recommendations highlights
  const getAutoRecommendStack = () => {
    if (inputs.industry === 'Healthcare') {
      return ['Computer Vision', 'AI', 'Cloud Computing', 'Big Data'];
    }
    if (inputs.industry === 'Agriculture') {
      return ['IoT', 'Edge AI', 'Robotics', 'Embedded Systems'];
    }
    return ['Artificial Intelligence', 'LLMs', 'Cloud Computing'];
  };

  const getRecommendedTools = () => {
    if (inputs.industry === 'Healthcare') {
      return { apis: ['Gemini API', 'Patent APIs', 'News API'], frameworks: ['React', 'FastAPI', 'PyTorch'] };
    }
    if (inputs.industry === 'Agriculture') {
      return { apis: ['Weather APIs', 'Patent APIs', 'OpenAlex API'], frameworks: ['React', 'FastAPI', 'TensorFlow'] };
    }
    return { apis: ['Gemini API', 'GitHub API', 'OpenAlex API'], frameworks: ['React', 'FastAPI', 'PyTorch'] };
  };

  // Toggle multi-select chips
  const handleToggleMulti = (field, item) => {
    setInputs(prev => {
      const arr = prev[field] || [];
      const updated = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
      return { ...prev, [field]: updated };
    });
  };

  // Regenerate individual sections on demand
  const handleRegenerateSection = async (sectionKey) => {
    if (!activeIdea) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/analysis/regenerate-section', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: activeIdea.title,
          industry: inputs.industry,
          technology: inputs.technology.join(', '),
          sectionKey
        })
      });
      const data = await res.json();
      if (data.success && data.content) {
        setActiveIdea(prev => {
          const updated = { ...prev };
          updated[sectionKey] = data.content;
          return updated;
        });
      }
    } catch (e) {
      alert("Failed to refresh section content.");
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const context = activeIdea ? `My startup is: ${activeIdea.title}. Description: ${activeIdea.description}. Problem: ${activeIdea.problem}. Solution: ${activeIdea.solution}.` : 'No active startup loaded.';
      
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `${context} User asks: ${userText}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatHistory(prev => [...prev, { sender: 'mentor', text: data.reply }]);
      } else {
        setChatHistory(prev => [...prev, { sender: 'mentor', text: "I'm having trouble analyzing that vector. Can you rephrase?" }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'mentor', text: "Connection error. Mentor offline." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!activeIdea) return;
    const content = `# Venture Plan: ${activeIdea.title}\n\n## Description\n${activeIdea.description}\n\n## Problem Statement\n${activeIdea.problem}\n\n## Proposed Solution\n${activeIdea.solution}\n\n## Technology Stack\n${activeIdea.techStack}\n\n## Market Opportunity\n${activeIdea.marketOpportunity}\n\n## SWOT Matrix\n- Strengths: ${activeIdea.swot.strengths.join(', ')}\n- Weaknesses: ${activeIdea.swot.weaknesses.join(', ')}\n- Opportunities: ${activeIdea.swot.opportunities.join(', ')}\n- Threats: ${activeIdea.swot.threats.join(', ')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeIdea.title.replace(/\s+/g, '_')}_architecture.md`;
    link.click();
  };

  const portalAccent = portalMode === 'student' ? '#3b82f6' : '#0d9488';
  const portalGlow = portalMode === 'student' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 148, 136, 0.15)';

  // Progress Bar rendering
  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: "Core Target" },
      { num: 2, label: "Tech Stack" },
      { num: 3, label: "Strategy" },
      { num: 4, label: "Audience" },
      { num: 5, label: "Review" }
    ];

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step === s.num ? portalAccent : (step > s.num ? '#10b981' : 'rgba(255,255,255,0.05)'),
                border: `1px solid ${step === s.num ? portalAccent : 'var(--border-color)'}`,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                boxShadow: step === s.num ? `0 0 8px ${portalAccent}50` : 'none'
              }}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.75rem', color: step === s.num ? 'var(--text-main)' : 'var(--text-dim)', fontWeight: step === s.num ? 'bold' : 'normal' }}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ width: '30px', height: '2px', background: step > s.num ? '#10b981' : 'rgba(255,255,255,0.05)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="workspace-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '85vh', paddingBottom: '3rem' }}>
      
      {/* Top Header Hub */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Cpu style={{ color: portalAccent }} /> AI Business Innovation Workspace
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Synthesize, validate, and launch dynamic startup concepts backed by expired patent searches and failed startup analysis.
          </p>
        </div>

        {/* Global Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '0.35rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('generator')} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', background: activeTab === 'generator' ? portalAccent : 'transparent', border: 'none', color: activeTab === 'generator' ? '#fff' : 'var(--text-muted)' }}
          >
            <Sparkles size={13} style={{ marginRight: '0.35rem' }} /> Concept Creator
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', background: activeTab === 'dashboard' ? portalAccent : 'transparent', border: 'none', color: activeTab === 'dashboard' ? '#fff' : 'var(--text-muted)' }}
          >
            <Layers size={13} style={{ marginRight: '0.35rem' }} /> Saved Workspace ({savedStartups.length})
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: activeIdea ? '250px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Sidebar Controls (Visible only when an idea is loaded) */}
        {activeIdea && (
          <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', padding: '0.5rem 0.5rem 0.25rem 0.5rem', display: 'block' }}>ACTIVE CONCEPT</span>
            <div style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: portalAccent, wordBreak: 'break-all' }}>{activeIdea.title}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Sector: {inputs.industry}</div>
            </div>

            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', padding: '0.25rem 0.5rem 0.25rem 0.5rem', display: 'block' }}>ANALYTICS SECTIONS</span>
            {[
              { id: 'plan', label: 'Venture Plan', icon: Briefcase },
              { id: 'validator', label: 'Startup Validator', icon: ShieldAlert },
              { id: 'canvas', label: 'Business Canvases', icon: Layers },
              { id: 'competitors', label: 'Competitor Intel', icon: Compass },
              { id: 'market', label: 'Market Research', icon: LineChart },
              { id: 'patent', label: 'Patent & Failures Opportunity', icon: BookOpen },
              { id: 'pitch', label: 'Investor Pitch Hub', icon: Target },
              { id: 'mentor', label: 'Launch Roadmap', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tech-button tech-button-outline"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: activeTab === tab.id ? `${portalAccent}15` : 'transparent',
                  borderColor: activeTab === tab.id ? portalAccent : 'transparent',
                  color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
                  padding: '0.55rem 0.75rem',
                  justifyContent: 'flex-start'
                }}
              >
                <tab.icon size={13} style={{ color: activeTab === tab.id ? portalAccent : 'var(--text-dim)' }} />
                {tab.label}
              </button>
            ))}

            <button 
              onClick={handleSaveIdea} 
              disabled={saveLoading}
              className="tech-button" 
              style={{ width: '100%', marginTop: '1rem', background: 'transparent', borderColor: portalAccent, color: portalAccent }}
            >
              {saveLoading ? "Saving..." : "Save to Workspace"}
            </button>
          </div>
        )}

        {/* Dynamic Panel Display area */}
        <div style={{ flex: 1 }}>

          {/* TAB A: CONCEPT CREATOR WIZARD FORM */}
          {activeTab === 'generator' && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: `1px solid ${portalAccent}`, boxShadow: `0 8px 30px ${portalGlow}` }}>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <Sparkles size={32} style={{ color: portalAccent, marginBottom: '0.5rem' }} />
                <h2 style={{ fontSize: '1.30rem', margin: 0, fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Guided AI Venture Builder</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Construct your startup architecture step-by-step with smart dropdowns and instant recommendations.
                </p>
              </div>

              {/* Step indicator */}
              {renderStepIndicator()}

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: '0.8rem', padding: '0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <AlertTriangle size={14} />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: CORE TARGETS */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <SearchableDropdown 
                      label="Industry" 
                      value={inputs.industry} 
                      onChange={val => setInputs({ ...inputs, industry: val })} 
                      options={industries} 
                      tooltip="Choose the target sector for your startup."
                      portalAccent={portalAccent}
                    />
                    <button 
                      onClick={() => handleAISuggest('industry')} 
                      className="tech-button tech-button-outline" 
                      style={{ height: '2.5rem', fontSize: '0.75rem', borderStyle: 'dashed' }}
                    >
                      ✨ Suggest
                    </button>
                  </div>

                  <SearchableDropdown 
                    label="Business Type" 
                    value={inputs.businessType} 
                    onChange={val => setInputs({ ...inputs, businessType: val })} 
                    options={businessTypes} 
                    tooltip="Determines licensing structures and metrics frameworks."
                    portalAccent={portalAccent}
                  />

                  <SearchableDropdown 
                    label="Project Goal" 
                    value={inputs.projectGoal} 
                    onChange={val => setInputs({ ...inputs, projectGoal: val })} 
                    options={projectGoals} 
                    tooltip="Aligns the validation and roadmap checklist indices."
                    portalAccent={portalAccent}
                  />
                </div>
              )}

              {/* STEP 2: TECHNICAL STACK & TARGET MARKET */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Tech stack multi select with suggestions */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      Technology Stack
                      <span style={{ cursor: 'pointer', color: 'var(--text-dim)' }} title="Select technologies you plan to use.">ⓘ</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {techStackList.map(tech => {
                        const isSel = inputs.technology.includes(tech);
                        const isRecommended = getAutoRecommendStack().includes(tech);
                        return (
                          <button
                            key={tech}
                            onClick={() => handleToggleMulti('technology', tech)}
                            className="tech-button"
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.35rem 0.65rem',
                              background: isSel ? portalAccent : 'rgba(255,255,255,0.02)',
                              borderColor: isSel ? portalAccent : (isRecommended ? `${portalAccent}60` : 'var(--border-color)'),
                              color: isSel ? '#fff' : 'var(--text-muted)'
                            }}
                          >
                            {tech} {isRecommended && !isSel && '✨'}
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => handleAISuggest('technology')} 
                      className="tech-button tech-button-outline" 
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderStyle: 'dashed' }}
                    >
                      ✨ Suggest Tech for {inputs.industry}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <SearchableDropdown 
                      label="Budget" 
                      value={inputs.budget} 
                      onChange={val => setInputs({ ...inputs, budget: val })} 
                      options={budgets} 
                      tooltip="Allocates cash structures."
                      portalAccent={portalAccent}
                    />
                    <SearchableDropdown 
                      label="Timeline" 
                      value={inputs.timeline} 
                      onChange={val => setInputs({ ...inputs, timeline: val })} 
                      options={timelines} 
                      tooltip="Target development schedule."
                      portalAccent={portalAccent}
                    />
                  </div>

                  <SearchableDropdown 
                    label="Target Market Scope" 
                    value={inputs.targetMarket} 
                    onChange={val => setInputs({ ...inputs, targetMarket: val })} 
                    options={targetMarkets} 
                    tooltip="Geographic scaling target bounds."
                    portalAccent={portalAccent}
                  />
                </div>
              )}

              {/* STEP 3: ORGANIZATION & REVENUE STRATEGY */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <SearchableDropdown 
                      label="Team Size" 
                      value={inputs.teamSize} 
                      onChange={val => setInputs({ ...inputs, teamSize: val })} 
                      options={teamSizes} 
                      tooltip="Determines baseline developer capabilities."
                      portalAccent={portalAccent}
                    />
                    <SearchableDropdown 
                      label="Funding Stage" 
                      value={inputs.fundingStage} 
                      onChange={val => setInputs({ ...inputs, fundingStage: val })} 
                      options={fundingStages} 
                      tooltip="Aligns incubator matching indices."
                      portalAccent={portalAccent}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      Revenue Model
                      <span style={{ cursor: 'pointer', color: 'var(--text-dim)' }} title="Select monetization channels.">ⓘ</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {revenueModels.map(model => {
                        const isSel = inputs.revenueModel.includes(model);
                        return (
                          <button
                            key={model}
                            onClick={() => handleToggleMulti('revenueModel', model)}
                            className="tech-button"
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.35rem 0.65rem',
                              background: isSel ? portalAccent : 'rgba(255,255,255,0.02)',
                              borderColor: isSel ? portalAccent : 'var(--border-color)',
                              color: isSel ? '#fff' : 'var(--text-muted)'
                            }}
                          >
                            {model}
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => handleAISuggest('revenueModel')} 
                      className="tech-button tech-button-outline" 
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderStyle: 'dashed' }}
                    >
                      ✨ Suggest Revenue Mode
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: TARGET AUDIENCE & PAIN POINTS */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      Target Users
                      <span style={{ cursor: 'pointer', color: 'var(--text-dim)' }} title="Choose target customer personas.">ⓘ</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {targetUsersList.map(user => {
                        const isSel = inputs.targetAudience.includes(user);
                        return (
                          <button
                            key={user}
                            onClick={() => handleToggleMulti('targetAudience', user)}
                            className="tech-button"
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.35rem 0.65rem',
                              background: isSel ? portalAccent : 'rgba(255,255,255,0.02)',
                              borderColor: isSel ? portalAccent : 'var(--border-color)',
                              color: isSel ? '#fff' : 'var(--text-muted)'
                            }}
                          >
                            {user}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      Customer Pain Point / Problem Statement
                      <span style={{ cursor: 'pointer', color: 'var(--text-dim)' }} title="Describe the specific problem.">ⓘ</span>
                    </label>
                    <textarea 
                      className="tech-input" 
                      rows={3} 
                      value={inputs.problemStatement}
                      onChange={e => setInputs({ ...inputs, problemStatement: e.target.value })}
                      placeholder="e.g. Farmers suffer heavy crop losses due to unoptimized manual drip irrigation..."
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      Current Market Trends
                    </label>
                    <input 
                      type="text" 
                      className="tech-input" 
                      value={inputs.marketTrends}
                      onChange={e => setInputs({ ...inputs, marketTrends: e.target.value })}
                      placeholder="e.g. Smart IoT systems, low-power mesh radios"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & GENERATE */}
              {step === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', fontSize: '0.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div><strong>Industry:</strong> {inputs.industry}</div>
                    <div><strong>Business Type:</strong> {inputs.businessType}</div>
                    <div><strong>Project Goal:</strong> {inputs.projectGoal}</div>
                    <div><strong>Budget:</strong> {inputs.budget}</div>
                    <div><strong>Target Scope:</strong> {inputs.targetMarket}</div>
                    <div><strong>Stack:</strong> {inputs.technology.join(', ')}</div>
                    <div style={{ gridColumn: '1 / 3' }}><strong>Revenue:</strong> {inputs.revenueModel.join(', ')}</div>
                  </div>

                  {/* Context-aware suggestions showcase */}
                  <div style={{ padding: '1rem', borderRadius: '8px', border: `1px solid ${portalAccent}30`, background: `${portalAccent}05` }}>
                    <h4 style={{ fontSize: '0.8rem', color: portalAccent, margin: '0 0 0.5rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Lightbulb size={14} style={{ color: portalAccent }} /> Recommended Tools & Mappings
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div><strong>APIs:</strong> {getRecommendedTools().apis.join(', ')}</div>
                      <div><strong>Frameworks:</strong> {getRecommendedTools().frameworks.join(', ')}</div>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate} 
                    disabled={loading} 
                    className="tech-button" 
                    style={{ 
                      width: '100%', 
                      background: portalAccent, 
                      borderColor: portalAccent, 
                      color: '#fff', 
                      padding: '0.85rem', 
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? "Running AI Venture Mapping Analysis..." : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center', width: '100%' }}>
                        <Sparkles size={14} /> Generate Venture Architecture
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Wizard Nav Controls */}
              <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  disabled={step === 1 || loading}
                  onClick={() => setStep(prev => prev - 1)}
                  className="tech-button tech-button-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
                >
                  <ChevronLeft size={14} /> Back
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev + 1)}
                    className="tech-button"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', background: portalAccent, color: '#fff', borderColor: portalAccent }}
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>READY FOR AI COMPILING</span>
                )}
              </div>

            </div>
          )}

          {/* TAB 1: CORE VENTURE PLAN */}
          {activeTab === 'plan' && activeIdea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: portalAccent }}>
                    Venture Architecture Plan
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handleExportMarkdown} 
                      className="tech-button tech-button-outline" 
                      style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Download size={12} /> Export Plan (.md)
                    </button>
                  </div>
                </div>

                {/* Grid layout of Core Parameters */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', fontFamily: 'var(--font-mono)' }}>ESTIMATED BUDGET</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginTop: '0.2rem', display: 'block' }}>{activeIdea.budget}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', fontFamily: 'var(--font-mono)' }}>LAUNCH TIMELINE</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginTop: '0.2rem', display: 'block' }}>{activeIdea.timeline}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', fontFamily: 'var(--font-mono)' }}>INNOVATION INDEX</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginTop: '0.2rem', display: 'block' }}>{activeIdea.innovationScore}/100</strong>
                  </div>
                </div>

                {/* In-place Editable sections list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <EditableBlock 
                    label="Venture Title" 
                    value={activeIdea.title} 
                    onChange={val => setActiveIdea({ ...activeIdea, title: val })} 
                    portalAccent={portalAccent}
                  />

                  <EditableBlock 
                    label="Business Overview" 
                    value={activeIdea.description} 
                    onChange={val => setActiveIdea({ ...activeIdea, description: val })} 
                    type="textarea" 
                    onRegenerate={() => handleRegenerateSection('description')}
                    portalAccent={portalAccent}
                  />

                  <EditableBlock 
                    label="Problem Statement" 
                    value={activeIdea.problem} 
                    onChange={val => setActiveIdea({ ...activeIdea, problem: val })} 
                    type="textarea" 
                    onRegenerate={() => handleRegenerateSection('problem')}
                    portalAccent={portalAccent}
                  />

                  <EditableBlock 
                    label="Proposed Solution" 
                    value={activeIdea.solution} 
                    onChange={val => setActiveIdea({ ...activeIdea, solution: val })} 
                    type="textarea" 
                    onRegenerate={() => handleRegenerateSection('solution')}
                    portalAccent={portalAccent}
                  />

                  <EditableBlock 
                    label="Technology Stack" 
                    value={activeIdea.techStack} 
                    onChange={val => setActiveIdea({ ...activeIdea, techStack: val })} 
                    onRegenerate={() => handleRegenerateSection('techStack')}
                    portalAccent={portalAccent}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STARTUP VALIDATOR FEASIBILITY CHART */}
          {activeTab === 'validator' && activeIdea && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: portalAccent, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                Feasibility & Risk Validator
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'center' }}>
                {/* Circular Score */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="100%" height="100%" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={portalAccent} strokeDasharray={`${activeIdea.overallSuccessProb}, 100`} strokeWidth="3" />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{activeIdea.overallSuccessProb}%</span>
                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUCCESS INDEX</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'center', marginTop: '0.5rem' }}>Dynamic Validation Index</span>
                </div>

                {/* Score break-down bar indicators */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: "Technical Feasibility", val: activeIdea.technicalFeasibility, color: '#3b82f6' },
                    { label: "Market Viability", val: activeIdea.marketFeasibility, color: '#f59e0b' },
                    { label: "Financial Feasibility", val: activeIdea.financialFeasibility, color: '#10b981' },
                    { label: "Scalability potential", val: activeIdea.scalabilityScore, color: '#6366f1' },
                    { label: "Venture Risk Coefficient", val: activeIdea.riskScore, color: 'var(--color-danger)' }
                  ].map((bar, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{bar.label}</span>
                        <strong style={{ color: bar.color }}>{bar.val}%</strong>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${bar.val}%`, background: bar.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUSINESS & LEAN CANVAS DUAL MODE */}
          {activeTab === 'canvas' && activeIdea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setCanvasMode('lean')} 
                    className="tech-button" 
                    style={{ fontSize: '0.7rem', padding: '0.4rem 0.75rem', background: canvasMode === 'lean' ? portalAccent : 'transparent', border: '1px solid var(--border-color)', color: canvasMode === 'lean' ? '#fff' : 'var(--text-muted)' }}
                  >
                    Lean Canvas
                  </button>
                  <button 
                    onClick={() => setCanvasMode('bmc')} 
                    className="tech-button" 
                    style={{ fontSize: '0.7rem', padding: '0.4rem 0.75rem', background: canvasMode === 'bmc' ? portalAccent : 'transparent', border: '1px solid var(--border-color)', color: canvasMode === 'bmc' ? '#fff' : 'var(--text-muted)' }}
                  >
                    Business Model Canvas
                  </button>
                </div>
                <button 
                  onClick={() => window.print()} 
                  className="tech-button tech-button-outline" 
                  style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={12} /> Export PDF Report
                </button>
              </div>

              {/* Canvas printable layout */}
              <div id="canvas-print-area" className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-panel-solid)' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{activeIdea.title}</h2>
                  <span style={{ fontSize: '0.7rem', color: portalAccent, fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                    {canvasMode === 'lean' ? "LEAN ARCHITECTURE CANVAS" : "BUSINESS MODEL CANVAS"}
                  </span>
                </div>

                {canvasMode === 'lean' ? (
                  /* LEAN CANVAS GRID LAYOUT */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 'minmax(120px, auto)', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    
                    <div style={{ gridColumn: '1', gridRow: '1 / 3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>1. Problem</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.problem}</p>
                    </div>

                    <div style={{ gridColumn: '2', gridRow: '1', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>2. Solution</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.solution}</p>
                    </div>
                    <div style={{ gridColumn: '2', gridRow: '2', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>8. Key Metrics</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.metrics}</p>
                    </div>

                    <div style={{ gridColumn: '3', gridRow: '1 / 3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                      <strong style={{ color: portalAccent, display: 'block', marginBottom: '0.45rem' }}>3. Unique Value Proposition</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.uvp}</p>
                    </div>

                    <div style={{ gridColumn: '4', gridRow: '1', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>9. Unfair Advantage</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.unfairAdvantage}</p>
                    </div>
                    <div style={{ gridColumn: '4', gridRow: '2', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>5. Channels</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.channels}</p>
                    </div>

                    <div style={{ gridColumn: '5', gridRow: '1 / 3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>4. Customer Segments</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.segments}</p>
                    </div>

                    <div style={{ gridColumn: '1 / 3', gridRow: '3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>7. Cost Structure</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.costs}</p>
                    </div>
                    <div style={{ gridColumn: '3 / 6', gridRow: '3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>6. Revenue Streams</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.leanCanvas.revenues}</p>
                    </div>

                  </div>
                ) : (
                  /* BUSINESS MODEL CANVAS GRID LAYOUT */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 'minmax(120px, auto)', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    
                    <div style={{ gridColumn: '1', gridRow: '1 / 3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Key Partners</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.partners}</p>
                    </div>

                    <div style={{ gridColumn: '2', gridRow: '1', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Key Activities</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.activities}</p>
                    </div>
                    <div style={{ gridColumn: '2', gridRow: '2', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Key Resources</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.resources}</p>
                    </div>

                    <div style={{ gridColumn: '3', gridRow: '1 / 3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                      <strong style={{ color: portalAccent, display: 'block', marginBottom: '0.45rem' }}>Value Proposition</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.valueProp}</p>
                    </div>

                    <div style={{ gridColumn: '4', gridRow: '1', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Customer Relationships</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.relationships}</p>
                    </div>
                    <div style={{ gridColumn: '4', gridRow: '2', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Channels</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.channels}</p>
                    </div>

                    <div style={{ gridColumn: '5', gridRow: '1 / 3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Customer Segments</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.segments}</p>
                    </div>

                    <div style={{ gridColumn: '1 / 3', gridRow: '3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Cost Structure</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.costs}</p>
                    </div>
                    <div style={{ gridColumn: '3 / 6', gridRow: '3', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>Revenue Streams</strong>
                      <p style={{ margin: 0, lineHeight: '1.4' }}>{activeIdea.bmc.revenues}</p>
                    </div>

                  </div>
                )}
              </div>

              {/* SWOT Strategic Matrix */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: portalAccent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} /> SWOT Strategic Matrix
                  </h3>
                  <button 
                    onClick={() => handleRegenerateSection('swot')} 
                    className="tech-button" 
                    style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RefreshCw size={10} /> Refresh SWOT
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { title: "Strengths (S)", items: activeIdea.swot.strengths, color: '#10b981' },
                    { title: "Weaknesses (W)", items: activeIdea.swot.weaknesses, color: 'var(--color-danger)' },
                    { title: "Opportunities (O)", items: activeIdea.swot.opportunities, color: '#3b82f6' },
                    { title: "Threats (T)", items: activeIdea.swot.threats, color: '#f59e0b' }
                  ].map((card, index) => (
                    <div key={index} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                      <strong style={{ color: card.color, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.35rem' }}>
                        {card.title}
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {card.items.map((li, lIdx) => (
                          <li key={lIdx} style={{ marginBottom: '0.35rem' }}>{li}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPETITOR INTELLIGENCE */}
          {activeTab === 'competitors' && activeIdea && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1.25rem 0', color: portalAccent }}>
                Competitive Intelligence Hub
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeIdea.competitors.map((comp, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: portalAccent }}>{comp.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>{comp.website}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                        Funding: {comp.funding}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
                      <div>
                        <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.2rem' }}>Core Strengths:</strong>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{comp.strengths}</p>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-danger)', display: 'block', marginBottom: '0.2rem' }}>Core Weaknesses:</strong>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{comp.weaknesses}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem' }}>
                      <div>
                        <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>Our Differentiation:</strong>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{comp.differentiation}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.2rem' }}>Opportunity Gap:</strong>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{comp.opportunityGap}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MARKET RESEARCH */}
          {activeTab === 'market' && activeIdea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1.25rem 0', color: portalAccent }}>
                  Market Sizing & Growth Potential
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>TARGET SECTOR SIZE</span>
                    <strong style={{ fontSize: '1.4rem', color: portalAccent, display: 'block', marginTop: '0.25rem' }}>{activeIdea.marketResearch.marketSize}</strong>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>GROWTH VELOCITY</span>
                    <strong style={{ fontSize: '1.4rem', color: '#10b981', display: 'block', marginTop: '0.25rem' }}>{activeIdea.marketResearch.growthRate}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Emerging Market Trends:</strong>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{activeIdea.marketResearch.trends}</p>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Regional Opportunities:</strong>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{activeIdea.marketResearch.regionalOpportunities}</p>
                  </div>
                </div>
              </div>

              {/* Funding schemes */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1.25rem 0', color: portalAccent }}>
                  Venture Funding & Incubator Schemes
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {activeIdea.fundingSchemes.map((scheme, idx) => (
                    <div key={idx} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: portalAccent, display: 'block' }}>{scheme.name}</strong>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Type: {scheme.type} // Amount: {scheme.amount}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.45rem 0 0 0', lineHeight: '1.4' }}>{scheme.eligibility}</p>
                      </div>
                      <a href={scheme.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: portalAccent, textDecoration: 'none', fontWeight: 'bold', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                        Apply/Review Scheme →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PATENT OPPORTUNITIES */}
          {activeTab === 'patent' && activeIdea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <BookOpen size={18} style={{ color: portalAccent }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Expired Patent Opportunity Analyzer</h3>
                </div>

                {activeIdea.patents.map((pat, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: portalAccent, fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>PATENT ID: {pat.id}</span>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>STATUS: EXPIRED</span>
                    </div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{pat.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>AI/IoT Revival Path:</strong>
                      {pat.revivalPath}
                    </div>
                  </div>
                ))}
              </div>

              {/* Failed Startup Case Study */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--color-danger)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Failed Startup Revitalization Case Study</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Legacy Case Subject: {activeIdea.failedStartup.name}</strong>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>Reason for Defunct: {activeIdea.failedStartup.failureReason}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>Lessons Learned:</strong>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{activeIdea.failedStartup.lessonsLearned}</p>
                  </div>
                  <div style={{ background: `${portalAccent}08`, border: `1px solid ${portalAccent}30`, padding: '0.85rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                    <strong style={{ color: portalAccent, display: 'block', marginBottom: '0.2rem' }}>How Today's Technology Revives It:</strong>
                    <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.4' }}>{activeIdea.failedStartup.revivalEnablers}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INVESTOR PITCH DECK */}
          {activeTab === 'pitch' && activeIdea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Financial Prediction Engine */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: portalAccent }}>
                    Venture Financial Forecasts & Pricing
                  </h3>
                  <button 
                    onClick={() => handleRegenerateSection('revenueForecast')} 
                    className="tech-button" 
                    style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RefreshCw size={10} /> Recalculate Projections
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  {[
                    { label: "Target Monthly Revenue", val: activeIdea.revenueForecast.monthly, color: portalAccent },
                    { label: "Projected Annual Revenue", val: activeIdea.revenueForecast.annual, color: '#10b981' },
                    { label: "Estimated Break-Even", val: activeIdea.revenueForecast.breakeven, color: '#f59e0b' },
                    { label: "ROI Forecast (24 Mo)", val: activeIdea.revenueForecast.roi, color: '#6366f1' }
                  ].map((rev, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>{rev.label}</span>
                      <strong style={{ fontSize: '1.1rem', color: rev.color, marginTop: '0.2rem', display: 'block' }}>{rev.val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pitch Script Slides */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1.25rem 0', color: portalAccent }}>
                  AI Pitch Deck Slides & Scripts
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeIdea.pitchDeck.slides.map((slide, idx) => (
                    <div key={idx} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                      <strong style={{ fontSize: '0.8rem', color: portalAccent, display: 'block', marginBottom: '0.25rem' }}>
                        Slide {slide.slideNum}: {slide.title}
                      </strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{slide.content}</p>
                      
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#2b251e', 
                        background: '#eae1cc', 
                        border: '1px solid #dfd5bf',
                        padding: '0.65rem 0.85rem', 
                        borderRadius: '6px',
                        marginTop: '0.65rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.45rem',
                        textAlign: 'left'
                      }}>
                        <Volume2 size={12} style={{ color: '#6d5f50', flexShrink: 0 }} />
                        <span><strong>Speaker Script:</strong> "{activeIdea.pitchDeck.speakerNotes[idx] || ""}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ROADMAPS & CHAT */}
          {activeTab === 'mentor' && activeIdea && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: portalAccent }}>
                    Venture Roadmap & Timelines
                  </h3>
                  <button 
                    onClick={() => handleRegenerateSection('roadmap')} 
                    className="tech-button" 
                    style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RefreshCw size={10} /> Reschedule Timeline
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1.25rem', borderLeft: `2px solid ${portalAccent}30` }}>
                  {activeIdea.roadmap.map((step, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingBottom: '0.5rem' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-25px',
                        top: '2px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: step.status === 'Completed' ? '#10b981' : (step.status === 'In Progress' ? portalAccent : 'var(--text-dim)'),
                        boxShadow: `0 0 8px ${step.status === 'In Progress' ? portalAccent : 'transparent'}`
                      }} />
                      
                      <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{step.milestone}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{step.duration}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: step.status === 'Completed' ? '#10b981' : (step.status === 'In Progress' ? portalAccent : 'var(--text-dim)') }}>
                        {step.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Workspace Mentor Chat Assistant */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: portalAccent, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <Users size={16} /> AI Chat Workspace Mentor
                </h3>

                <div style={{
                  background: 'rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  padding: '1rem',
                  height: '240px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1rem'
                }}>
                  {chatHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? `${portalAccent}15` : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: msg.sender === 'user' ? portalAccent : 'rgba(255,255,255,0.05)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        maxWidth: '80%',
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                        color: msg.sender === 'user' ? 'var(--text-main)' : 'var(--text-muted)'
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.65rem 0.85rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-dim)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: portalAccent, animation: 'pulse 1s infinite alternate' }} />
                      Mentor is thinking...
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="tech-input" 
                    placeholder="Ask the AI Business Mentor for guidance..." 
                    value={chatMessage} 
                    onChange={e => setChatMessage(e.target.value)} 
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="tech-button" style={{ background: portalAccent, borderColor: portalAccent, color: '#fff' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default IdeaDiscovery;
