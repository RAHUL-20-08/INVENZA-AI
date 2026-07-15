import React, { useState } from 'react';

import { fallbackInnovations } from '../dataFallback';

const TechSynergy = () => {
  // Option types: 'seeded' (pre-indexed), 'saved' (user saved audits), 'custom' (user custom typed)
  const [typeA, setTypeA] = useState('seeded');
  const [typeB, setTypeB] = useState('custom');

  // Input states for Base Technology A
  const [selectedSeededA, setSelectedSeededA] = useState(fallbackInnovations[0]?.id || '');
  const [selectedSavedA, setSelectedSavedA] = useState('');
  const [customTextA, setCustomTextA] = useState('');

  // Input states for Secondary Technology B
  const [selectedSeededB, setSelectedSeededB] = useState(fallbackInnovations[1]?.id || '');
  const [selectedSavedB, setSelectedSavedB] = useState('');
  const [customTextB, setCustomTextB] = useState('');

  const [synthesizing, setSynthesizing] = useState(false);
  const [report, setReport] = useState(null);

  // Load saved audits from localStorage
  const [savedAudits] = useState(() => {
    try {
      const stored = localStorage.getItem('saved_audits');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Resolve project name, sector, and viability details dynamically
  const resolveItem = (type, seededId, savedId, customText) => {
    if (type === 'seeded') {
      const found = fallbackInnovations.find(item => item.id === seededId);
      return found ? { name: found.name, sector: found.sector, revivalViability: found.revivalViability, description: found.description } : { name: 'Seeded Concept', sector: 'General Tech', revivalViability: 75, description: '' };
    }
    if (type === 'saved') {
      const found = savedAudits.find(item => item.id === savedId);
      return found ? { name: found.name, sector: found.sector, revivalViability: found.revivalViability, description: found.description } : { name: 'Saved Custom Concept', sector: 'General Tech', revivalViability: 80, description: '' };
    }
    return { 
      name: (customText || "").trim() || 'Custom Concept', 
      sector: 'Custom Engineering', 
      revivalViability: 82,
      description: `Custom technology configuration focusing on ${customText || "modern engineering vectors"}.`
    };
  };

  const handleSynthesize = async () => {
    const itemA = resolveItem(typeA, selectedSeededA, selectedSavedA, customTextA);
    const itemB = resolveItem(typeB, selectedSeededB, selectedSavedB, customTextB);

    if (!itemA.name.trim() || itemA.name === 'Custom Concept') {
      alert("Please specify a custom name or select a project for Base Technology A!");
      return;
    }
    if (!itemB.name.trim() || itemB.name === 'Custom Concept') {
      alert("Please specify a custom name or select a project for Secondary Technology B!");
      return;
    }
    if (itemA.name.toLowerCase() === itemB.name.toLowerCase()) {
      alert("Please select or type two different technology concepts to synthesize!");
      return;
    }
    
    setSynthesizing(true);
    setReport(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/synergy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemA, itemB })
      });
      const data = await response.json();
      if (data.success) {
        setReport(data.report);
      } else {
        throw new Error(data.message || "Synthesis failed.");
      }
    } catch (error) {
      console.warn("Backend synthesis offline. Running local fallback.");
      const nameA = itemA.name.split(' ')[0];
      const nameB = itemB.name.split(' ')[0];
      const hybridName = `${nameA} x ${nameB} Synergy Platform`;
      
      const hybridReport = {
        name: hybridName,
        sector: `${itemA.sector} / ${itemB.sector}`,
        viability: Math.round(((itemA.revivalViability || 75) + (itemB.revivalViability || 75)) / 2) + 5,
        proposition: `Combines the mechanical structure and stabilization properties of ${itemA.name} with the technical display modules or diagnostics capabilities of ${itemB.name}.`,
        features: [
          `➔ Projects balance and navigation telemetry from ${itemA.name} onto the HUD structures of ${itemB.name}.`,
          `➔ Controls local electrical feedback rates based on real-time sensor streams.`,
          `➔ Packages lightweight, modular chassis materials to lower electronic waste.`
        ],
        marketFit: `Targeting industrial inspection teams, smart factory logistics operations, and B2B developers in the ${itemA.sector || "tech"} space.`
      };
      setReport(hybridReport);
    } finally {
      setSynthesizing(false);
    }
  };

  // Render selection method inputs
  const renderInputSection = (type, setType, seededVal, setSeededVal, savedVal, setSavedVal, customVal, setCustomVal, label) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>{label}</label>
        
        {/* Toggle Option Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.02)', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <button 
            type="button"
            onClick={() => setType('seeded')}
            className={`tech-button ${type === 'seeded' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>local_library</span> Pre-Seeded
          </button>
          <button 
            type="button"
            onClick={() => setType('saved')}
            className={`tech-button ${type === 'saved' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>bookmark</span> Saved Basket
          </button>
          <button 
            type="button"
            onClick={() => setType('custom')}
            className={`tech-button ${type === 'custom' ? '' : 'tech-button-outline'}`}
            style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>text_fields</span> Custom Text
          </button>
        </div>

        {/* Dynamic input field depending on selection */}
        {type === 'seeded' && (
          <select className="tech-select" value={seededVal} onChange={(e) => setSeededVal(e.target.value)} style={{ width: '100%' }}>
            {fallbackInnovations.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        )}

        {type === 'saved' && (
          savedAudits.length > 0 ? (
            <select className="tech-select" value={savedVal || (savedAudits[0]?.id || '')} onChange={(e) => setSavedVal(e.target.value)} style={{ width: '100%' }}>
              {savedAudits.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          ) : (
            <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.5rem', borderRadius: '4px', fontFamily: 'var(--font-sans)' }}>
              [EMPTY: SAVE AN IDEA IN DASHBOARD FIRST]
            </div>
          )
        )}

        {type === 'custom' && (
          <input 
            type="text" 
            className="tech-input" 
            placeholder="Type custom tech concept name..."
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>CROSS-INNOVATION LAB</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)' }}>Tech Synergy Synthesizer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select two technologies from our database, select from your saved audits, or type a custom project name to generate a synergy report.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.25rem', alignItems: 'start' }}>
        {/* Left Column: Selector Form */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>developer_board</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Select Components</h3>
          </div>

          {/* Input A */}
          {renderInputSection(
            typeA, setTypeA, 
            selectedSeededA, setSelectedSeededA, 
            selectedSavedA, setSelectedSavedA, 
            customTextA, setCustomTextA, 
            "BASE TECHNOLOGY A"
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '0.25rem 0' }}>
            <div style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', padding: '0.45rem', border: '1px solid var(--border-color)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>bolt</span>
            </div>
          </div>

          {/* Input B */}
          {renderInputSection(
            typeB, setTypeB, 
            selectedSeededB, setSelectedSeededB, 
            selectedSavedB, setSelectedSavedB, 
            customTextB, setCustomTextB, 
            "SECONDARY TECHNOLOGY B"
          )}

          <button onClick={handleSynthesize} className="tech-button" style={{ marginTop: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>auto_awesome</span> Synthesize Synergy
          </button>
        </div>

        {/* Right Column: Results Console */}
        <div className="glass-panel" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {synthesizing ? (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
              <span className="material-symbols-outlined glow-text-pink" style={{ fontSize: '24px',  animation: 'spin 2s linear infinite'  }}>refresh</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>CROSS-MUTATING GENETIC PATENTS...</span>
            </div>
          ) : report ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <span className="mono-tag" style={{ color: 'var(--color-secondary)' }}>HYBRID SYSTEM COMPILED</span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.15rem', color: 'var(--text-main)' }}>{report.name}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-sans)' }}>RE-ENTRY SCORING</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'var(--font-sans)' }}>{report.viability}%</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>CONCEPT DESCRIPTION</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.5' }}>{report.proposition}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.4rem' }}>KEY CAPABILITIES</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      <span style={{ color: 'var(--color-secondary)' }}>➔</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 242, 254, 0.03)', border: '1px solid rgba(0, 242, 254, 0.15)', padding: '0.85rem 1rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', display: 'block', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>TARGET CONSUMER SECTOR FIT</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: '1.4' }}>{report.marketFit}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--border-color)',  marginBottom: '0.75rem'  }}>bolt</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>[SYNERGY LAB STANDBY]</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem', maxWidth: '300px' }}>
                Select or type any two technologies and click synthesize to compile their hybrid specifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechSynergy;
