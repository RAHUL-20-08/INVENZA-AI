import React, { useState } from 'react';

import { fallbackInnovations } from '../dataFallback';

const formatRupees = (cost) => {
  if (!cost) return '₹150,000';
  let str = String(cost).trim();
  if (str.startsWith('$')) {
    str = '₹' + str.slice(1);
  } else if (!str.startsWith('₹') && !str.toLowerCase().includes('inr')) {
    str = '₹' + str;
  }
  return str;
};

const StartupBuilder = ({ activeInnovation }) => {
  const [activeTab, setActiveTab] = useState('roadmap');

  // Load imported item or default to Pebble/Lytro fallback
  const activeItem = activeInnovation || fallbackInnovations[0];

  const getCanvasData = (item) => {
    const cleanName = item.name || "Custom Concept";
    return {
      partners: [
        "Component Manufacturers", 
        `Patent licensing boards for ${cleanName}`,
        ...(item.financials?.potentialInvestors || ["VC Firms"])
      ],
      activities: [
        `Core AI & NPU latency optimizations for ${cleanName}`,
        `Open-source SDK development of ${cleanName} libraries`,
        `Hardware footprint validation for ${cleanName} circuits`
      ],
      propositions: [
        `Highly cost-efficient ${item.sector || 'Technology'} revival parameters`,
        `Modern on-device AI enhancements resolving legacy ${cleanName} limitations`,
        `Eco-friendly modular construction decreasing ${cleanName} e-waste`
      ],
      relationships: [
        `Direct developer relations support for ${cleanName} developers`,
        `High-touch B2B pilot tests for ${cleanName} integrations`,
        `Open-source community moderator channels around ${cleanName}`
      ],
      segments: [
        ...(item.financials?.targetIndustries || ["Tech enthusiasts"]),
        `Early ${cleanName} platform research developers`,
        "Eco-conscious modular consumers"
      ],
      resources: [
        `Proprietary ${cleanName} device design patents`,
        `CUDA/TinyML experts training custom ${cleanName} neural nets`,
        `Cloud infrastructure hosting ${cleanName} telemetry`
      ],
      channels: [
        `GitHub Open Source ${cleanName} repositories`,
        `Direct enterprise licensing of ${cleanName} modules`,
        `Hardware distributor partnerships for ${cleanName} kits`
      ],
      costs: [
        `R&D engineering budget: ${formatRupees(item.financials?.estimatedCost || '₹250,000')}`,
        `Physical fabrication and crash testing of ${cleanName}`,
        "Cloud GPU training instances & API token usage"
      ],
      revenues: [
        `Sales of ${cleanName} developer hardware evaluation kits`,
        `B2B Enterprise maintenance SaaS subscriptions for ${cleanName}`,
        `Extended patent licensing rights of ${cleanName} claims`
      ]
    };
  };

  const canvas = getCanvasData(activeItem);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>COMMERCIALIZATION ENGINE</span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)' }}>Startup Builder & Business Planner</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Build roadmaps, estimate development costs, map SWOT profiles, and compile Business Model Canvases for <strong>{activeItem.name}</strong>.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`tech-button ${activeTab === 'roadmap' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            Roadmap & SWOT
          </button>
          <button 
            onClick={() => setActiveTab('canvas')}
            className={`tech-button ${activeTab === 'canvas' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            Business Model Canvas
          </button>
        </div>
      </div>

      {activeTab === 'roadmap' ? (
        /* Tab 1: Roadmap & SWOT */
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Timeline Roadmap */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>rocket_launch</span>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Commercialization Timeline</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{
                position: 'absolute',
                left: '6px',
                top: '10px',
                bottom: '10px',
                width: '2px',
                background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))'
              }}></div>

              {(activeItem.roadmap || []).map((step, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-23px',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-main)',
                    border: '3px solid var(--color-primary)',
                    boxShadow: '0 0 8px var(--color-primary)'
                  }}></div>
                  
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-secondary)' }}>{step.step}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SWOT Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem' }}>
              {/* Strengths */}
              <div style={{ background: 'rgba(16, 185, 129, 0.04)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-success)', fontFamily: 'var(--font-sans)' }}>STRENGTHS (S)</span>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(activeItem.swot?.strengths || []).map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>

              {/* Weaknesses */}
              <div style={{ background: 'rgba(244, 63, 94, 0.04)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-danger)', fontFamily: 'var(--font-sans)' }}>WEAKNESSES (W)</span>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(activeItem.swot?.weaknesses || []).map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>

              {/* Opportunities */}
              <div style={{ background: 'rgba(6, 182, 212, 0.04)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>OPPORTUNITIES (O)</span>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(activeItem.swot?.opportunities || []).map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>

              {/* Threats */}
              <div style={{ background: 'rgba(245, 158, 11, 0.04)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-warning)', fontFamily: 'var(--font-sans)' }}>THREATS (T)</span>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(activeItem.swot?.threats || []).map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
            </div>

            {/* Financial Requirements */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-success)' }}>currency_rupee</span>
                <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Financial Forecasts</h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated R&D Budget</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--color-success)', fontFamily: 'var(--font-sans)' }}>{formatRupees(activeItem.financials?.estimatedCost)}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.35rem' }}>REQUIRED SKILLS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(activeItem.financials?.requiredSkills || []).map((skill, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.35rem' }}>POTENTIAL INVESTORS</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(activeItem.financials?.potentialInvestors || []).map((inv, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--color-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                      {inv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Tab 2: Business Model Canvas */
        <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'var(--bg-panel-solid)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'repeat(2, 200px)',
            gap: '0.75rem',
            minWidth: '800px',
            overflowX: 'auto'
          }}>
            
            {/* Key Partners */}
            <div style={{ gridRow: 'span 2', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>group</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Key Partners</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.partners || []).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            {/* Key Activities */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>memory</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Key Activities</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.activities || []).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            {/* Value Propositions */}
            <div style={{ gridRow: 'span 2', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(99,102,241,0.2)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>workspace_premium</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Value Prop</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-main)' }}>
                {(canvas.propositions || []).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            {/* Customer Relationships */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-accent)' }}>rocket_launch</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Relationships</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.relationships || []).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* Customer Segments */}
            <div style={{ gridRow: 'span 2', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-success)' }}>group</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Segments</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.segments || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            {/* Key Resources */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-warning)' }}>table_chart</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Key Resources</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.resources || []).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* Channels */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>explore</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Channels</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.channels || []).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

          </div>

          {/* Bottom Financial Sections */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            minWidth: '800px',
            overflowX: 'auto'
          }}>
            {/* Cost Structure */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-danger)' }}>currency_rupee</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Cost Structure</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.costs || []).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            {/* Revenue Streams */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-success)' }}>currency_rupee</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>Revenue Streams</span>
              </div>
              <ul style={{ fontSize: '0.7rem', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                {(canvas.revenues || []).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupBuilder;
