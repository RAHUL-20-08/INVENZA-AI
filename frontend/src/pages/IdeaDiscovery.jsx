import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  BookOpen, 
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  ArrowRight,
  TrendingDown,
  LineChart,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';

const IdeaDiscovery = () => {
  const { portalMode } = usePortal();

  // Active Lab Mode selection
  const [selectedDomain, setSelectedDomain] = useState('agriculture');
  const [defunctTech, setDefunctTech] = useState([]);
  const [recommendedIdeas, setRecommendedIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recommendation Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState({
    domain: 'agriculture',
    type: 'software',
    group: 'individual',
    goal: 'hackathon',
    budget: 'low',
    skills: 'intermediate',
    time: '4 weeks'
  });

  // Selected ideas for side-by-side comparison
  const [comparisonList, setComparisonList] = useState([]);

  // Selected idea for detailed Revival Strategy Overlay
  const [activeRevivalIdea, setActiveRevivalIdea] = useState(null);

  const domains = [
    { value: 'agriculture', label: 'Agriculture & Farming' },
    { value: 'healthcare', label: 'Healthcare & Biotech' },
    { value: 'education', label: 'Education Systems' },
    { value: 'smart cities', label: 'Smart Cities' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'artificial intelligence', label: 'Artificial Intelligence' },
    { value: 'iot', label: 'Internet of Things (IoT)' },
    { value: 'robotics', label: 'Robotics & Automation' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'renewable energy', label: 'Renewable Energy' }
  ];

  // Fetch recommendations based on selected filters
  const fetchOpportunityIdeas = async (domainVal, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/discover-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainVal,
          role: portalMode,
          ...filters
        })
      });
      const data = await res.json();
      if (data.success) {
        setDefunctTech(data.defunctTech || []);
        setRecommendedIdeas(data.recommendedIdeas || []);
      } else {
        setError(data.message);
        setDefunctTech([]);
        setRecommendedIdeas([]);
      }
    } catch (err) {
      console.error(err);
      setError("Verified information is currently unavailable from trusted sources.");
      setDefunctTech([]);
      setRecommendedIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunityIdeas(selectedDomain);
  }, [selectedDomain, portalMode]);

  // Handle Wizard Submit
  const handleWizardSubmit = (e) => {
    e.preventDefault();
    fetchOpportunityIdeas(wizardAnswers.domain, {
      type: wizardAnswers.type,
      skills: wizardAnswers.skills,
      budget: wizardAnswers.budget
    });
    setShowWizard(false);
  };

  // Toggle comparison state
  const toggleCompare = (idea) => {
    const exists = comparisonList.find(i => i.id === idea.id);
    if (exists) {
      setComparisonList(prev => prev.filter(i => i.id !== idea.id));
    } else {
      if (comparisonList.length >= 3) {
        alert("You can compare a maximum of 3 ideas side-by-side.");
        return;
      }
      setComparisonList(prev => [...prev, idea]);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>AI OPPORTUNITY DISCOVERY</span>
          <h1 style={{ fontSize: '2.1rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            {portalMode === 'student' ? 'Student Innovation Lab' : 'Business Innovation Lab'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {portalMode === 'student' 
              ? 'Discover unique, practical final year or hackathon projects by reviving expired patents and defunct technical paradigms.' 
              : 'Identify blue-ocean startup opportunities and patent acquisition gaps to build scalable real-world business models.'}
          </p>
        </div>

        <button 
          onClick={() => setShowWizard(true)}
          className="tech-button"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '42px', fontSize: '0.85rem' }}
        >
          <Sparkles size={16} /> Recommend an Idea for Me
        </button>
      </div>

      {/* Real-Time Opportunity Discoveries Ticker */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', borderLeft: '3px solid var(--color-secondary)', background: 'rgba(13, 148, 136, 0.03)', display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
        <span style={{ fontSize: '0.65rem', background: 'var(--color-secondary)', color: '#fff', padding: '0.15rem 0.35rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
          NEW OPPORTUNITY DISCOVERED
        </span>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', display: 'flex', gap: '2rem', animation: 'marquee 25s linear infinite' }}>
          <span>🔔 Expired Patent US-6481639-B2 (Irrigation Mesh Loops) is now open for public reuse.</span>
          <span>🔔 Abandoned Crop-Seeder robotics diagnostics added to agricultural index templates.</span>
          <span>🔔 Discontinued telehealth biosensor optics US-7389201-B1 claims verified.</span>
        </div>
      </div>

      {/* Domain Selectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Select Target Domain to Query Registry:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {domains.map((dom) => (
            <button
              key={dom.value}
              onClick={() => setSelectedDomain(dom.value)}
              className="tech-button"
              style={{
                fontSize: '0.75rem',
                padding: '0.45rem 1rem',
                background: selectedDomain === dom.value ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                borderColor: selectedDomain === dom.value ? 'var(--color-primary)' : 'var(--border-color)',
                color: selectedDomain === dom.value ? '#fff' : 'var(--text-muted)'
              }}
            >
              {dom.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Live Registry of Defunct Innovations */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={14} color="var(--color-secondary)" />
              Related Defunct Tech Registries
            </h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>LIVE API RETRIEVAL STATUS</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', color: 'var(--text-dim)' }}>
              <RefreshCw size={24} className="animate-spin glow-text-pink" />
              <span style={{ fontSize: '0.65rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>AUDITING LIVE PATENT ENGINES...</span>
            </div>
          ) : error ? (
            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
              ⚠️ {error}
            </div>
          ) : defunctTech.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {defunctTech.map((tech, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <Info size={12} color="var(--color-secondary)" />
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>VERIFIED ANCESTOR RECORD</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{tech}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', padding: '2rem 0' }}>
              No defunct technology references loaded for this domain.
            </div>
          )}
        </div>

        {/* Right Column: Recommended Innovation Revival Opportunities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              AI Opportunity Revival Vectors
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {recommendedIdeas.length} Recommendations Found
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <RefreshCw size={32} className="animate-spin" color="var(--color-primary)" />
            </div>
          ) : recommendedIdeas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recommendedIdeas.map((idea) => {
                const isCompared = comparisonList.some(i => i.id === idea.id);
                return (
                  <div key={idea.id} className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', display: 'block' }}>
                          REVIVAL TARGET: {idea.origin}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                          {idea.name}
                        </h4>
                      </div>

                      {/* Compare Checkbox */}
                      <button
                        onClick={() => toggleCompare(idea)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', border: 'none', color: isCompared ? 'var(--color-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
                      >
                        {isCompared ? <CheckSquare size={14} /> : <Square size={14} />}
                        Compare Idea
                      </button>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '1.25rem' }}>
                      {idea.desc}
                    </p>

                    {/* Score Gauges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'rgba(0,0,0,0.12)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-dim)' }}>Innovation:</span>
                          <strong style={{ color: 'var(--color-primary)' }}>{idea.scores.innovation}%</strong>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${idea.scores.innovation}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-dim)' }}>Originality:</span>
                          <strong style={{ color: 'var(--color-secondary)' }}>{idea.scores.originality}%</strong>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${idea.scores.originality}%`, height: '100%', background: 'var(--color-secondary)' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-dim)' }}>Feasibility:</span>
                          <strong style={{ color: '#fff' }}>{idea.scores.feasibility}%</strong>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${idea.scores.feasibility}%`, height: '100%', background: 'var(--text-main)' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        onClick={() => setActiveRevivalIdea(idea)}
                        className="tech-button"
                        style={{ fontSize: '0.75rem', height: '36px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <RefreshCw size={12} /> Analyze Revival Strategy
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '4rem 0' }}>
              Select a domain selector tag above to discover innovation ideas.
            </div>
          )}

        </div>

      </div>

      {/* Section 4: Idea Comparison Grid */}
      {comparisonList.length >= 2 && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} color="var(--color-primary)" />
                Side-by-Side Revival Comparison
              </h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Comparing {comparisonList.length} Selected Project Blueprints</span>
            </div>
            <button
              onClick={() => setComparisonList([])}
              className="tech-button tech-button-outline"
              style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}
            >
              Clear Comparison
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', color: 'var(--text-dim)' }}>Parameters</th>
                {comparisonList.map(idea => (
                  <th key={idea.id} style={{ padding: '0.75rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{idea.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Revival Anchor</td>
                {comparisonList.map(idea => (
                  <td key={idea.id} style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{idea.origin}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Build Complexity</td>
                {comparisonList.map(idea => (
                  <td key={idea.id} style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{idea.comparison.complexity}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Estimated Cost</td>
                {comparisonList.map(idea => (
                  <td key={idea.id} style={{ padding: '0.75rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{idea.comparison.cost}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Build Timeframe</td>
                {comparisonList.map(idea => (
                  <td key={idea.id} style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{idea.comparison.buildTime}</td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Expected Impact</td>
                {comparisonList.map(idea => (
                  <td key={idea.id} style={{ padding: '0.75rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{idea.comparison.impact}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Overlay Drawer: Innovation Revival Strategy */}
      {activeRevivalIdea && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '500px',
          height: '100vh',
          background: 'var(--bg-panel-solid)',
          borderLeft: '1.5px solid var(--border-color)',
          boxShadow: 'var(--panel-shadow)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Drawer Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', display: 'block' }}>INNOVATION REVIVAL STRATEGY</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeRevivalIdea.name}</h3>
            </div>
            <button
              onClick={() => setActiveRevivalIdea(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Why failed */}
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-danger)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', display: 'block' }}>⚠️ WHY DID IT FAIL HISTORICALLY?</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.45' }}>
                {activeRevivalIdea.failureReason}
              </p>
            </div>

            {/* Why can succeed today */}
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', display: 'block' }}>✨ WHY CAN IT SUCCEED TODAY?</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.45' }}>
                Modern hardware miniaturization and reduced component costs enable consumer budgets. High bandwidth local NPUs render calculations without cloud latency bounds.
              </p>
            </div>

            {/* Modern Technology Enablers */}
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', display: 'block' }}>🔌 MODERN TECH ENABLERS</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                {activeRevivalIdea.modernEnablers}
              </p>
            </div>

            {/* Learning from Failure */}
            <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={14} color="var(--color-danger)" />
                <span style={{ fontSize: '0.65rem', color: 'var(--color-danger)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>MISTAKES TO AVOID</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Technical Trap:</strong> {activeRevivalIdea.technicalMistakes}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                <strong>Mitigation:</strong> Implement a mesh gateway structure routing telemetry via low-power sub-gigahertz radios before cloud pipeline sync.
              </p>
            </div>

            {/* Full Scores Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.75rem' }}>OPPORTUNITY MATRIX BREAKDOWN</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Patent Availability:</span>
                  <strong style={{ color: 'var(--color-secondary)' }}>{activeRevivalIdea.scores.patentAvailability}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Commercial Moat:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{activeRevivalIdea.scores.commercial}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Risk Index:</span>
                  <strong style={{ color: 'var(--color-danger)' }}>{activeRevivalIdea.scores.risk}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Revival Potential:</span>
                  <strong style={{ color: 'var(--color-success)' }}>High</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Recommend an Idea for Me Wizard */}
      {showWizard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ width: '500px', padding: '2rem', animation: 'scaleIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>AI Project Recommendation Wizard</h3>
              <button
                onClick={() => setShowWizard(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleWizardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>TARGET DOMAIN</label>
                <select
                  value={wizardAnswers.domain}
                  onChange={(e) => setWizardAnswers(prev => ({ ...prev, domain: e.target.value }))}
                  style={{ width: '100%', height: '36px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', padding: '0 0.5rem', fontSize: '0.8rem' }}
                >
                  {domains.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>PROJECT TYPE</label>
                  <select
                    value={wizardAnswers.type}
                    onChange={(e) => setWizardAnswers(prev => ({ ...prev, type: e.target.value }))}
                    style={{ width: '100%', height: '36px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', padding: '0 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="software">Software Only</option>
                    <option value="hardware">Hardware Integration</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>GROUP SIZE</label>
                  <select
                    value={wizardAnswers.group}
                    onChange={(e) => setWizardAnswers(prev => ({ ...prev, group: e.target.value }))}
                    style={{ width: '100%', height: '36px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', padding: '0 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team Collaboration</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>PROJECT BUDGET</label>
                  <select
                    value={wizardAnswers.budget}
                    onChange={(e) => setWizardAnswers(prev => ({ ...prev, budget: e.target.value }))}
                    style={{ width: '100%', height: '36px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', padding: '0 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="low">Low ($0 - $500)</option>
                    <option value="medium">Medium ($500 - $5000)</option>
                    <option value="high">High ($5000+)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>SKILL LEVEL</label>
                  <select
                    value={wizardAnswers.skills}
                    onChange={(e) => setWizardAnswers(prev => ({ ...prev, skills: e.target.value }))}
                    style={{ width: '100%', height: '36px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', padding: '0 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert / Advanced</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="tech-button"
                style={{ width: '100%', height: '40px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Sparkles size={14} /> Generate Personalized Opportunities
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default IdeaDiscovery;
