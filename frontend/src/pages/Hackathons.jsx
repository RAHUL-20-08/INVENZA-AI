import React, { useState, useEffect } from 'react';

import { useMentor } from '../context/MentorContext';
import { usePortal } from '../context/PortalContext';
import { mockHackathons } from '../dataFallback';

const Hackathons = () => {
  const { portalMode } = usePortal();
  
  // Tab controller: upcoming-hackathons, innovation-engine
  const [activeTab, setActiveTab] = useState('upcoming-hackathons');

  const { 
    project, 
    milestoneStages, 
    completedMilestones, 
    progressPercent, 
    toggleMilestone
  } = useMentor();

  // Upcoming Hackathons States
  const [hackathonsList, setHackathonsList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All'); // All, Unstop, Knowafest
  const [selectedLocation, setSelectedLocation] = useState('All'); // All, Online, Offline
  const [sortBy, setSortBy] = useState('deadline'); // deadline, prize, popular
  const [bookmarks, setBookmarks] = useState(() => {
    return JSON.parse(localStorage.getItem('hackathon_bookmarks') || '[]');
  });

  // Innovation Engine States
  const [innovInputs, setInnovInputs] = useState({
    industry: 'Agriculture',
    technology: 'IoT, Computer Vision',
    domain: 'Sensors & Automation',
    problemStatement: 'Manual scheduling of water pumps causes heavy soil erosion and crop failures.'
  });
  const [innovLoading, setInnovLoading] = useState(false);
  const [generatedInnovation, setGeneratedInnovation] = useState(null);

  // Load Hackathons on Mount
  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setListLoading(true);
    setError(null);
    try {
      const studentProfile = {
        skills: ['React', 'Python', 'IoT'],
        interests: ['AI', 'Sustainability', 'Robotics'],
        department: 'CS',
        yearOfStudy: '3'
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/hackathons?profile=${encodeURIComponent(JSON.stringify(studentProfile))}`);
      const data = await res.json();
      if (data.success) {
        setHackathonsList(data.hackathons || []);
      } else {
        setError("Failed to load hackathons from server.");
      }
    } catch (e) {
      console.warn("Hackathon backend offline, using mock data.");
      setHackathonsList(mockHackathons);
    } finally {
      setListLoading(false);
    }
  };

  const handleToggleBookmark = (id) => {
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id];
      localStorage.setItem('hackathon_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleGenerateInnovation = async (e) => {
    if (e) e.preventDefault();
    setInnovLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analysis/innovate-engine`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(innovInputs)
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedInnovation(data.innovation);
      } else {
        alert(data.message || "Failed to synthesize innovation.");
      }
    } catch (err) {
      alert("Failed to connect to Innovation Engine. Make sure server is running.");
    } finally {
      setInnovLoading(false);
    }
  };

  // Toggle internal custom innovation steps checklists
  const handleToggleStep = (stepIdx) => {
    if (!generatedInnovation) return;
    setGeneratedInnovation(prev => {
      const updatedSteps = prev.guidanceSteps.map((step, idx) => {
        if (idx === stepIdx) {
          return { ...step, completed: !step.completed };
        }
        return step;
      });
      return { ...prev, guidanceSteps: updatedSteps };
    });
  };

  // Filter tag categories
  const filterTags = ['All', 'AI', 'IoT', 'Healthcare', 'Agriculture', 'Robotics', 'Cybersecurity', 'Blockchain', 'Open Innovation', 'Smart Cities', 'Sustainability'];

  // Apply filters and sort hackathons list
  const filteredHackathons = hackathonsList
    .filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'All' || h.tags.includes(selectedTag);
      const matchesPlatform = selectedPlatform === 'All' || h.platform === selectedPlatform;
      const matchesLocation = selectedLocation === 'All' || h.mode === selectedLocation;
      return matchesSearch && matchesTag && matchesPlatform && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'prize') {
        const getVal = (str) => parseInt(str.replace(/[^\d]/g, '')) || 0;
        return getVal(b.prizePool) - getVal(a.prizePool);
      }
      return b.matchScore - a.matchScore; // popular/relevant match
    });

  const portalAccent = portalMode === 'student' ? '#3b82f6' : '#0d9488';
  const portalGlow = portalMode === 'student' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 148, 136, 0.15)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '85vh', paddingBottom: '3rem' }}>
      
      {/* Header Hub */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px',  color: portalAccent  }}>emoji_events</span> Student Portal & Innovation Hub
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Verify live hackathons and convert failed or expired innovations into winning products.
          </p>
        </div>

        {/* Local Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '0.35rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('upcoming-hackathons')} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', background: activeTab === 'upcoming-hackathons' ? portalAccent : 'transparent', border: 'none', color: activeTab === 'upcoming-hackathons' ? '#fff' : 'var(--text-muted)' }}
          >
            🏆 Upcoming Hackathons
          </button>
          
          <button 
            onClick={() => setActiveTab('innovation-engine')} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', background: activeTab === 'innovation-engine' ? portalAccent : 'transparent', border: 'none', color: activeTab === 'innovation-engine' ? '#fff' : 'var(--text-muted)' }}
          >
            💡 Innovation Opportunity Engine
          </button>
        </div>
      </div>

      {/* TAB 1: UPCOMING HACKATHONS */}
      {activeTab === 'upcoming-hackathons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Controls: Search, Filters, Sorting */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              
              {/* Search Bar */}
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px',  position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)'  }}>search</span>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="Search hackathons or hosts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.2rem', width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              {/* Platform Selector */}
              <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value)} 
                className="tech-input" 
                style={{ width: '150px', fontSize: '0.8rem' }}
              >
                <option value="All">All Platforms</option>
                <option value="Unstop">Unstop</option>
                <option value="Knowafest">Knowafest</option>
              </select>

              {/* Mode Selector */}
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)} 
                className="tech-input" 
                style={{ width: '150px', fontSize: '0.8rem' }}
              >
                <option value="All">All Locations</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              {/* Sorting */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="tech-input" 
                style={{ width: '150px', fontSize: '0.8rem' }}
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="prize">Sort by Prize</option>
                <option value="popular">Sort by Match Score</option>
              </select>
            </div>

            {/* Tag Selection Chips */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
              {filterTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className="tech-button"
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.35rem 0.65rem',
                    background: selectedTag === tag ? portalAccent : 'transparent',
                    borderColor: selectedTag === tag ? portalAccent : 'var(--border-color)',
                    color: selectedTag === tag ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Hackathon Cards Grid */}
          {listLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px',  animation: 'spin 1.5s linear infinite', color: portalAccent  }}>refresh</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Loading hackathons...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-danger)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px',  marginBottom: '0.5rem'  }}>warning</span>
              <p style={{ fontSize: '0.85rem' }}>{error}</p>
            </div>
          ) : filteredHackathons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '1.5px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-dim)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '42px',  marginBottom: '0.5rem'  }}>emoji_events</span>
              <p style={{ fontSize: '0.9rem' }}>No open hackathons match the selected filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredHackathons.map((h) => {
                const isBookmarked = bookmarks.includes(h.id);
                return (
                  <div 
                    key={h.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-color)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between', 
                      gap: '1rem',
                      position: 'relative'
                    }}
                  >
                    {/* Top Platform & Days Remaining Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        background: h.platform === 'Unstop' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                        border: `1px solid ${h.platform === 'Unstop' ? '#3b82f6' : '#10b981'}`,
                        color: h.platform === 'Unstop' ? '#3b82f6' : '#10b981',
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-sans)' 
                      }}>
                        {h.platform.toUpperCase()}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          background: h.status === 'Closing Soon' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${h.status === 'Closing Soon' ? 'var(--color-danger)' : 'var(--border-color)'}`,
                          color: h.status === 'Closing Soon' ? 'var(--color-danger)' : 'var(--text-muted)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-sans)'
                        }}>
                          {h.daysRemaining} DAYS LEFT
                        </span>
                        
                        {/* Bookmark Button */}
                        <button 
                          onClick={() => handleToggleBookmark(h.id)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-dim)', padding: 0 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>bookmark</span>
                        </button>
                      </div>
                    </div>

                    {/* Hackathon title / description */}
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'block', lineHeight: '1.4' }}>{h.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Organized by: {h.organizer}</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0.6rem 0 0 0', lineHeight: '1.4' }}>{h.description}</p>
                    </div>

                    {/* Metadata details list */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontWeight: 600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px',  color: portalAccent  }}>location_on</span> {h.mode} ({h.venue.split('/')[0].trim()})
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px',  color: '#f59e0b'  }}>workspace_premium</span> {h.prizePool}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--text-dim)'  }}>calendar_today</span> Reg. Ends: {new Date(h.deadline).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--text-dim)'  }}>group</span> Size: {h.teamSize}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                      <a 
                        href={h.officialLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="tech-button" 
                        style={{ flex: 1, textAlign: 'center', background: portalAccent, color: '#fff', borderColor: portalAccent, textDecoration: 'none', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        Register Official Link <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>open_in_new</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INNOVATION OPPORTUNITY ENGINE */}
      {activeTab === 'innovation-engine' && (
        <div style={{ display: 'grid', gridTemplateColumns: generatedInnovation ? '350px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left panel Wizard Form */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1.25rem 0', color: portalAccent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>auto_awesome</span> Opportunity Synthesizer
            </h3>

            <form onSubmit={handleGenerateInnovation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.3rem' }}>TARGET INDUSTRY</label>
                <select 
                  value={innovInputs.industry} 
                  onChange={e => setInnovInputs({ ...innovInputs, industry: e.target.value })} 
                  className="tech-input" 
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  <option value="Agriculture">Agriculture & Farming</option>
                  <option value="Healthcare">Healthcare & Biotech</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Smart Cities">Smart Cities</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.3rem' }}>ENABLER TECH</label>
                <input 
                  type="text" 
                  value={innovInputs.technology} 
                  onChange={e => setInnovInputs({ ...innovInputs, technology: e.target.value })} 
                  className="tech-input" 
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  placeholder="e.g. IoT, Computer Vision"
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.3rem' }}>TARGET DOMAIN</label>
                <input 
                  type="text" 
                  value={innovInputs.domain} 
                  onChange={e => setInnovInputs({ ...innovInputs, domain: e.target.value })} 
                  className="tech-input" 
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  placeholder="e.g. Irrigation, Diagnostics" 
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.3rem' }}>PROBLEM CORE PAIN POINT</label>
                <textarea 
                  value={innovInputs.problemStatement} 
                  onChange={e => setInnovInputs({ ...innovInputs, problemStatement: e.target.value })} 
                  className="tech-input" 
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  rows={4}
                  placeholder="Describe the problem to analyze..." 
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={innovLoading}
                className="tech-button" 
                style={{ width: '100%', background: portalAccent, color: '#fff', borderColor: portalAccent, fontWeight: 'bold' }}
              >
                {innovLoading ? "Analyzing Failed Systems..." : "✨ Synthesize Innovation"}
              </button>
            </form>
          </div>

          {/* Right Panel Output details */}
          {generatedInnovation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Concept Overview Cards */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', color: portalAccent, fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{generatedInnovation.title}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{generatedInnovation.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginTop: '1.25rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>INNOVATION SCORE</span>
                    <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{generatedInnovation.innovationScore}/100</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>PATENT INDEX</span>
                    <strong style={{ fontSize: '1.1rem', color: portalAccent }}>{generatedInnovation.patentOpportunity}%</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block' }}>STARTUP MOAT</span>
                    <strong style={{ fontSize: '1.1rem', color: '#f59e0b' }}>{generatedInnovation.startupPotential}%</strong>
                  </div>
                </div>
              </div>

              {/* Strategic Failure Auditing Case Study */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-danger)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>security</span> Failure Audit: Reviving {generatedInnovation.originalInnovation}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong>Why Legacy Concept Failed:</strong>
                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)' }}>{generatedInnovation.whyItFailed}</p>
                  </div>
                  <div>
                    <strong>Archaic Limitations:</strong>
                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)' }}>{generatedInnovation.currentLimitations}</p>
                  </div>
                  <div style={{ padding: '0.75rem', borderRadius: '6px', background: `${portalAccent}08`, border: `1px solid ${portalAccent}30` }}>
                    <strong style={{ color: portalAccent }}>Modern Revival Vectors:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', lineHeight: '1.4' }}>{generatedInnovation.modernTechnologies}</p>
                  </div>
                </div>
              </div>

              {/* Similar Projects & Similarity score */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 1rem 0' }}>
                  Reference Similar Projects & Research Gaps
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: portalAccent, display: 'block', marginBottom: '0.5rem' }}>SIMILAR PATENTS & CASES</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                      {generatedInnovation.similarProjects.map((p, idx) => (
                        <div key={idx} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                          <strong>{p.name}</strong> <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>({p.similarity} Sim)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.8rem', color: portalAccent, display: 'block', marginBottom: '0.5rem' }}>OPEN SOURCE REPOS</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                      {generatedInnovation.githubProjects.map((repo, idx) => (
                        <div key={idx} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                          <a href={repo.link} target="_blank" rel="noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 'bold' }}>
                            {repo.name} ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hackathon Matchings */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  🏆 Top Target Hackathons (Unstop & Knowafest Only)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {generatedInnovation.hackathonMatches.map((h, idx) => (
                    <div key={idx} style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.85rem', color: portalAccent }}>{h.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>{h.reason}</span>
                      </div>
                      <a href={h.link} target="_blank" rel="noreferrer" className="tech-button" style={{ fontSize: '0.7rem', background: 'transparent', borderColor: portalAccent, color: portalAccent, textDecoration: 'none' }}>
                        Apply Link ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Guidance steps checklist */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: portalAccent, margin: '0 0 1rem 0' }}>
                  💡 Step-by-Step AI Innovation Guidance Checklist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {generatedInnovation.guidanceSteps.map((step, idx) => (
                    <div 
                      key={step.step} 
                      onClick={() => handleToggleStep(idx)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        background: step.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                        border: '1px solid',
                        borderColor: step.completed ? '#10b98140' : 'var(--border-color)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: '1.5px solid',
                        borderColor: step.completed ? '#10b981' : 'var(--text-dim)',
                        background: step.completed ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold'
                      }}>
                        {step.completed && '✓'}
                      </div>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: step.completed ? 'var(--text-dim)' : 'var(--text-main)',
                        textDecoration: step.completed ? 'line-through' : 'none'
                      }}>
                        Step {step.step}: {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ padding: '4rem 1rem', border: '1.5px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px',  marginBottom: '0.5rem', color: portalAccent  }}>bolt</span>
              <p style={{ fontSize: '0.85rem' }}>Enter target parameters and click generate to synthesize a revival opportunity plan.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Hackathons;
