import React, { useState, useEffect } from 'react';

import { usePortal } from '../context/PortalContext';

const InnovationIntelligenceCenter = ({ theme, activeInnovation, setCurrentPage, setGlobalQuery }) => {
  const { portalMode } = usePortal();

  // Dynamic context defaults based on active innovation
  const conceptName = activeInnovation?.name || "";
  const conceptSector = activeInnovation?.sector || "Emerging Technologies";
  const conceptGrowth = activeInnovation?.marketGrowth || "14.2% CAGR";
  const conceptMoat = activeInnovation?.failureBottlenecks ? activeInnovation.failureBottlenecks[0] : "Market timing and technical scalability";

  // State to track completed timeline milestones (Feature 9)
  const [completedMilestones, setCompletedMilestones] = useState(new Set([1]));

  const milestonesList = [
    { id: 1, name: "Idea Created" },
    { id: 2, name: "Research Completed" },
    { id: 3, name: "Patent Search" },
    { id: 4, name: "Architecture" },
    { id: 5, name: "Development" },
    { id: 6, name: "Testing" },
    { id: 7, name: "Presentation" },
    { id: 8, name: "Submission" },
    { id: 9, name: "Deployment" }
  ];

  const toggleMilestone = (id) => {
    const newSet = new Set(completedMilestones);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedMilestones(newSet);
  };

  // Load real user portfolio to check active project (Feature 3)
  const [activeProject, setActiveProject] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      const projs = JSON.parse(stored);
      if (projs.length > 0) {
        // Use the first project or the pinned one as active
        const active = projs.find(p => p.pinned) || projs[0];
        setActiveProject(active);
      } else {
        setActiveProject(null);
      }
    }
  }, []);

  // Preset list of Revival Opportunities (Feature 5)
  const revivalList = [
    { name: "Betamax", sector: "Consumer Electronics", failure: "Restrictive licensing and early format wars", tech: "High-density digital encoding & open-source codec standards", score: 85, cost: "₹150,000", diff: "Medium" },
    { name: "Segway", sector: "Urban Mobility", failure: "High price point and lack of city infrastructure rules", tech: "Solid-state LIDAR, cellular telemetry, and leasing APIs", score: 78, cost: "₹250,000", diff: "Hard" },
    { name: "Pebble Smartwatch", sector: "Wearable Tech", failure: "Market saturation and acquisition transition limits", tech: "Low-power e-ink displays & offline RAG sync matrices", score: 92, cost: "₹85,000", diff: "Easy" }
  ];

  // Preset list of Opportunity Finder items (Feature 2)
  const opportunityFinderItems = [
    { id: 'opt1', title: "5 Expired Patents in AI Healthcare", whyFailed: "Legacy edge processors lacked memory limits to support heavy weights.", whyToday: "Modern local NPUs can run high-accuracy quantized models directly on devices.", revival: 92, difficulty: "Medium", bizOpportunity: "Quantized diagnostic offline nodes.", tech: "TensorRT, local CPU inference pipelines" },
    { id: 'opt2', title: "3 Failed Startups in Agriculture", whyFailed: "Relying on expensive custom drone setups created high B2B barriers.", whyToday: "Consumer drone hardware has dropped 70% in cost with standard SDK controllers.", revival: 85, difficulty: "Easy", bizOpportunity: "Autonomous local field telemetry analyzers.", tech: "WebSockets, local sensor networks" },
    { id: 'opt3', title: "7 Discontinued Products for Redesign", whyFailed: "Pebble smartwatch lacked hardware caches to sustain heavy alert streams.", whyToday: "Lightweight offline RAG models index notifications seamlessly.", revival: 89, difficulty: "Easy", bizOpportunity: "Offline smart assistant hardware adapters.", tech: "Local RAG pipelines, e-ink APIs" }
  ];


  const handleOpenDetails = (name) => {
    if (setGlobalQuery) {
      setGlobalQuery(name);
      // Execute the search directly in main dashboard search engine
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.value = name;
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem', color: 'var(--text-main)' }}>
      
      {/* HEADER CARD */}
      <div className="glass-panel" style={{ padding: '2rem', border: '1.5px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-panel-solid)' }}>        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
          Innovation Intelligence Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Real-time catalog analytics. Audit expired patents, review failed startup cases, and align technical revival vectors.
        </p>
      </div>

      {/* COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* LEFT COLUMN: MAIN CONTENT ZONE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* FEATURE 2: AI OPPORTUNITY FINDER */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {opportunityFinderItems.map(opt => (
                <div key={opt.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{opt.title}</strong>
                    <span className="status-badge badge-active" style={{ fontSize: '0.65rem', color: 'var(--color-secondary)' }}>Revival Potential: {opt.revival}%</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem', lineHeight: '1.4' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>WHY IT FAILED:</span>
                      <p style={{ margin: 0 }}>{opt.whyFailed}</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-success)', display: 'block', fontSize: '0.65rem' }}>WHY IT MATTERS TODAY:</span>
                      <p style={{ margin: 0 }}>{opt.whyToday}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)', padding: '0.55rem 0.85rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    <span>Recommended Stack: <code style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-sans)' }}>{opt.tech}</code></span>
                    <span style={{ color: 'var(--text-dim)' }}>Diff: {opt.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE 1: INNOVATION OPPORTUNITY DASHBOARD */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { title: "Newly Expired Patents", desc: "US-482011-B2: Local storage sensor polling algorithm (Expired 45 days ago).", stat: "Active" },
                { title: "Recently Failed Startups", desc: "AeroCrop: Agricultural drone sensor analytics (Friction: Hardware overhead).", stat: "Worth Revisiting" },
                { title: "Discontinued Products", desc: "Pebble Smartwatch: Modular notification watch OS (Friction: Early tech limitations).", stat: "High Revival Potential" },
                { title: "Abandoned Research Projects", desc: "Low-latency edge caching schemas inside embedded processors.", stat: "Public Domain" }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.6rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>[{item.stat}]</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE 5: INNOVATION REVIVAL OPPORTUNITIES */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {revivalList.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>{item.sector.toUpperCase()}</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-success)' }}>{item.score}%</strong>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div><strong>Failure:</strong> {item.failure}</div>
                    <div style={{ marginTop: '0.35rem' }}><strong>Modern Fix:</strong> {item.tech}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.55rem', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                    <span>Est. Cost: {item.cost}</span>
                    <button 
                      onClick={() => handleOpenDetails(item.name)}
                      className="tech-button tech-button-outline"
                      style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                    >
                      Open Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE 6: AI PROJECT COMPARISON */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            {conceptName ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.75rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>SIMILARITY INDEX</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>84% Match</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>INNOVATION SCORE</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-secondary)' }}>92/100</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>ACTIVE COMPETING PATENTS</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-warning)' }}>3 Expired</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  <div>
                    <strong style={{ color: 'var(--color-success)', display: 'block', fontSize: '0.65rem', marginBottom: '0.25rem' }}>UNIQUE MOAT FEATURES (Your Revival):</strong>
                    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                      <li>Quantized local model execution on edge NPUs.</li>
                      <li>Offline caching bypass for regulatory compliance.</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-danger)', display: 'block', fontSize: '0.65rem', marginBottom: '0.25rem' }}>MISSING FEATURES & REGULATORY RISK:</strong>
                    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                      <li>Telemetry sensor calibration parameters not configured.</li>
                      <li>Potential overlap on active dependent claim 3.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>
                Select an innovation from the search console above to query live comparison indexes.
              </p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: JOURNEY & STATUS PANELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* FEATURE 3: CONTINUE YOUR JOURNEY */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>            {activeProject ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>{activeProject.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Stage:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{activeProject.category} Build</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Overall Progress:</span>
                    <strong style={{ color: 'var(--color-secondary)' }}>45%</strong>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage('startup')}
                  className="tech-button" 
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.45rem', marginTop: '0.25rem' }}
                >
                  Resume Project
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0 0 0.75rem 0' }}>Start Your First Innovation</p>
                <button 
                  onClick={() => setCurrentPage('startup')}
                  className="tech-button" 
                  style={{ fontSize: '0.7rem', padding: '0.45rem 1rem' }}
                >
                  Create Project
                </button>
              </div>
            )}
          </div>

          {/* FEATURE 4: AI NEXT-STEP ENGINE */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-success)', background: 'rgba(52, 211, 153, 0.03)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>You completed:</span>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0.15rem 0 0.65rem 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px', color: 'var(--color-success)' }}>check_circle</span> Literature Review
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
              <div><strong>Next Recommended Task:</strong> Patent Claims Analysis</div>
              <p style={{ color: 'var(--text-muted)', margin: '0.15rem 0 0 0', fontSize: '0.7rem' }}>To isolate expired claims from active dependent items before coding backend routes.</p>
              <div style={{ marginTop: '0.35rem' }}><strong>Estimated Duration:</strong> 2 Hours</div>
            </div>
          </div>

          {/* FEATURE 10 & 11: STUDENT SUCCESS vs STARTUP READINESS */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            {portalMode === 'student' ? (
              // FEATURE 11: STUDENT SUCCESS PANEL
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Project Completion:</span>
                    <strong>45%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Documentation Status:</span>
                    <strong style={{ color: 'var(--color-warning)' }}>Drafted</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Presentation Readiness:</span>
                    <strong>Ready</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Prototype Status:</span>
                    <strong style={{ color: 'var(--color-success)' }}>Active MVP</strong>
                  </div>
                </div>
              </div>
            ) : (
              // FEATURE 10: STARTUP READINESS PANEL
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Business Validation:</span>
                    <strong style={{ color: 'var(--color-success)' }}>88% Verified</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Market Readiness:</span>
                    <strong>High</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Competitor Analysis:</span>
                    <strong style={{ color: 'var(--color-warning)' }}>3 Flagged</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Investment Score:</span>
                    <strong>A- Rating</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FEATURE 12: AI DAILY DISCOVERY */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-accent)', background: 'rgba(99, 102, 241, 0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Today's Promising Expired Patent:</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0.5rem 0', lineHeight: '1.4' }}>
              US-382911: E-ink screen refreshing matrix. Expired globally, open for low-power localized smart boards revival.
            </p>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary)' }}>
              ?? Ideal Match: <strong>Wearables Tech</strong>
            </div>
          </div>

          {/* FEATURE 14: INNOVATION INSIGHT CARDS */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.75rem', lineHeight: '1.4' }}>
              <div>? **Patent Expiry**: Pebble smartwatch refresh APIs expire globally in 45 days.</div>
              <div>? **Failure Vector**: betamax-revival failed historically because of licensing; modern open codecs bypass this completely.</div>
            </div>
          </div>

        </div>

      </div>

      {/* FEATURE 9: INNOVATION TIMELINE MILSTONES */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>        {/* Horizontal Timeline nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {milestonesList.map(step => {
            const isDone = completedMilestones.has(step.id);
            return (
              <div 
                key={step.id} 
                onClick={() => toggleMilestone(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  background: isDone ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0.01)',
                  border: isDone ? '1px solid var(--color-success)' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: isDone ? 'var(--color-success)' : 'transparent',
                  border: isDone ? 'none' : '1px solid var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '8px'
                }}>
                  {isDone ? '?' : ''}
                </div>
                <span style={{ color: isDone ? 'var(--color-success)' : 'var(--text-muted)' }}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURE 8: AI RESOURCE HUB */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.75rem' }}>
          {[
            { cat: "Relevant APIs", desc: "WIPO Public query XML parser API, Wikipedia Abstract streams." },
            { cat: "GitHub Repositories", desc: "Local-quantized-Inference templates, edge-caching routers." },
            { cat: "Research Papers", desc: "Low-latency local models under constrained hardware limits." },
            { cat: "Learning Resources", desc: "Quantization guides and WIPO patent claim tutorials." }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>{item.cat}</strong>
              <span style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
            </div>
          ))}
        </div>
        </div>

      {/* FEATURE 13: QUICK ACTION CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: "?? Search Innovation", page: "explorer" },
          { label: "?? Discover New Idea", page: "discovery" },
          { label: "?? Find Expired Patents", page: "patents" },
          { label: "?? Research Papers", page: "papers" },
          { label: "?? Build Startup", page: "startup" },
          { label: "?? Prepare for Hackathon", page: "hackathons" },
          { label: "?? AI Pitch Generator", page: "pitch-coach" }
        ].map((card, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(card.page)}
            className="tech-button tech-button-outline"
            style={{
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              borderRadius: '8px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.01)'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{card.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default InnovationIntelligenceCenter;
