import React, { useState, useEffect } from 'react';

import { calculateClientSimilarity } from '../dataFallback';
import { useSearch } from '../context/SearchContext';

const Explorer = ({ onImportToStartup, setCurrentPage, setGlobalQuery }) => {
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch();
  const [innovations, setInnovations] = useState([]);
  const [selectedSector, setSelectedSector] = useState('All');
  
  // Custom Idea Form States
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customSector, setCustomSector] = useState('Augmented Reality');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [customError, setCustomError] = useState(null);

  const sectors = ['All', 'Computational Photography', 'Wearable Technology', 'Augmented Reality', 'Micro-mobility', 'Biomedical Diagnostics', 'Digital Entertainment', 'Consumer Electronics'];

  // Load innovations with fallback
  const loadInnovations = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/innovations?query=${searchQuery}&sector=${selectedSector}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setInnovations(data.data);
        setIsLocalMode(false);
      }
    } catch (error) {
      console.warn("Backend offline. Loading offline fallback database.");
      setIsLocalMode(true);
      import('../dataFallback').then(({ fallbackInnovations }) => {
        let results = fallbackInnovations;
        if (searchQuery) {
          const s = searchQuery.toLowerCase();
          results = results.filter(item => 
            (item.name || "").toLowerCase().includes(s) ||
            (item.inventor || "").toLowerCase().includes(s) ||
            (item.sector || "").toLowerCase().includes(s)
          );
        }
        if (selectedSector && selectedSector !== 'All') {
          results = results.filter(item => (item.sector || "").toLowerCase() === selectedSector.toLowerCase());
        }
        setInnovations(results);
      });
    }
  };

  useEffect(() => {
    loadInnovations();
  }, [searchQuery, selectedSector]);

  // Run AI Audit on Custom Idea
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!customTitle || !customDesc) return;

    setCustomError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisSteps([]);

    // Simulating semantic audit steps removed as per user request to hide the black process box.

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customTitle,
          description: customDesc,
          sector: customSector
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.report) {
        setAnalysisResult(data.report);
        setCustomError(null);
      } else {
        setCustomError(data.message || "Failed to analyze technology query.");
        setAnalysisResult(null);
      }
    } catch (error) {
      console.warn("Express API unreachable. Switching to client-side RAG calculation.");
      const clientResult = calculateClientSimilarity(customTitle, customDesc, customSector);
      if (clientResult.success && clientResult.report) {
        setAnalysisResult({
          ...clientResult.report,
          isOfflineProcessed: true
        });
        setCustomError(null);
      } else {
        setCustomError(clientResult.message || "Failed to analyze technology query.");
        setAnalysisResult(null);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save Audited Idea to Local Storage
  const handleSaveAudit = () => {
    if (!analysisResult) return;
    try {
      const stored = localStorage.getItem('saved_audits');
      const audits = stored ? JSON.parse(stored) : [];
      if (!audits.some(a => a.id === analysisResult.id)) {
        audits.push(analysisResult);
        localStorage.setItem('saved_audits', JSON.stringify(audits));
        window.dispatchEvent(new Event('storage'));
        alert("✨ Innovation successfully saved to your basket!");
      } else {
        alert("This concept has already been saved.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="mono-tag" style={{ color: 'var(--color-secondary)' }}>SEMANTIC DISCOVERY</span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)' }}>Innovation Explorer & Audit Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Search historical failure nodes or upload your own concept to assess compatibility with modern technology enablers.
          </p>
        </div>

        {isLocalMode && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', background: 'rgba(245,158,11,0.15)', padding: '0.25rem 0.6rem', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '4px', fontFamily: 'var(--font-sans)' }}>
            ⚠️ OFFLINE BACKUP MODE ACTIVE
          </span>
        )}
      </div>

      {/* Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Upload & Analyze Idea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Critical Error Warning Banner */}
          {customError && (
            <div className="glass-panel animate-fade-in" style={{ 
              borderLeft: '4px solid var(--color-danger)', 
              borderTop: 'none',
              background: 'rgba(255, 0, 85, 0.08)', 
              padding: '1rem 1.25rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <span style={{ fontSize: '0.75rem', color: '#ff4d6d', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                [CRITICAL_ERROR: INVALID_QUERY] {customError}
              </span>
              <button 
                onClick={() => setCustomError(null)} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  padding: '0 0.5rem' 
                }}
              >
                ✕
              </button>
            </div>
          )}

          <div className="glass-panel glass-panel-glow" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>cloud_upload</span>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Analyze Custom Concept</h2>
            </div>

            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>CONCEPT TITLE</label>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="e.g. Holographic HUD for Cyclists"
                  value={customTitle}
                  onChange={(e) => {
                    setCustomTitle(e.target.value);
                    setCustomError(null);
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>ABSTRACT / DESCRIPTION</label>
                <textarea 
                  className="tech-input" 
                  rows={4}
                  placeholder="Explain what the technology does, how it works, and who it's for. We will detect duplicate patents and explain why similar concepts failed in the past..."
                  value={customDesc}
                  onChange={(e) => {
                    setCustomDesc(e.target.value);
                    setCustomError(null);
                  }}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>INDUSTRY SECTOR</label>
                <select 
                  className="tech-select"
                  value={customSector}
                  onChange={(e) => setCustomSector(e.target.value)}
                >
                  {sectors.slice(1).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="tech-button tech-button-glow" style={{ marginTop: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>developer_board</span> Run Semantic AI Audit
              </button>
            </form>
          </div>

          {/* AI Processing Console Hidden */}

          {/* Audit Results */}
          {analysisResult && !isAnalyzing && (
            <div className="glass-panel animate-fade-in" style={{ border: '1px solid var(--color-success)', background: 'rgba(16, 185, 129, 0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="status-badge badge-active" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                  Audit Complete {analysisResult.isOfflineProcessed && '(Offline Local)'}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--color-success)' }}>
                  SimilarityScore: {analysisResult.similarityScore}%
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {analysisResult.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Patent Availability: <strong style={{ color: 'var(--color-warning)' }}>Expired / Unlicensed</strong>
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-panel)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>REVIVAL VIABILITY</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{analysisResult.revivalViability}%</strong>
                </div>
                <div style={{ background: 'var(--bg-panel)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>TRL RATING</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-warning)' }}>TRL {analysisResult.readinessLevel}/9</strong>
                </div>
              </div>

              {analysisResult.similarityScore > 10 && (
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-warning)',  flexShrink: 0, marginTop: '2px'  }}>warning</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: '1.3' }}>
                    <strong>Patent Overlap</strong>: Closely relates to the defunct <strong>{analysisResult.originalName}</strong>. 
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={handleSaveAudit}
                  className="tech-button tech-button-outline" 
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>save</span> Save to Workspace
                </button>
                <button 
                  onClick={() => onImportToStartup(analysisResult)}
                  className="tech-button" 
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  Plan Startup <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Right: Invenza Defunct Index Search */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>explore</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
              Pre-Indexed Patent Gap Database
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', width: '100%' }}>
            
            {/* Inline search bar */}
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
              <input 
                type="text"
                className="tech-input"
                placeholder="Search pre-seeded innovations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="tech-button" style={{ padding: '0 1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>search</span>
              </button>
            </form>
            
            <select 
              className="tech-select"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Innovations Grid */}
          <div className="list-container" style={{ maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {innovations.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No pre-indexed matches found for current filters.</p>
                {searchQuery.trim().length >= 3 && (
                  <div 
                    className="glass-panel animate-fade-in" 
                    style={{ 
                      border: '1px dashed var(--color-primary)', 
                      cursor: 'pointer', 
                      padding: '1.25rem', 
                      background: 'rgba(236,72,153,0.03)',
                      width: '100%',
                      maxWidth: '360px',
                      marginTop: '0.5rem'
                    }}
                    onClick={() => {
                      setCustomTitle(searchQuery);
                      setCustomDesc("Real-time AI RAG compilation and revival vector audit for: " + searchQuery);
                      setCustomError(null);
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)',  marginBottom: '0.4rem', animation: 'pulse 1.5s infinite'  }}>developer_board</span>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Generate Custom AI Profile for "{searchQuery}"?</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Click here to load this title into the AI analyzer form.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              innovations.map(item => (
                <div key={item.id} className="list-item">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '70%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="status-badge badge-expired" style={{ fontSize: '0.65rem' }}>{item.status}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>{item.sector}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Inventor: <strong>{item.inventor}</strong> | Patent: <strong style={{ color: 'var(--color-primary)' }}>{item.patentId}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>REVIVAL SCORE</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-success)' }}>{item.revivalViability}%</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => {
                          if (setGlobalQuery) setGlobalQuery(item.name);
                          if (setCurrentPage) setCurrentPage('github');
                        }}
                        className="tech-button"
                        style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem', border: '1px solid var(--color-primary)', background: 'rgba(59,130,246,0.05)', color: 'var(--color-primary)' }}
                      >
                        Code
                      </button>
                      <button 
                        onClick={() => onImportToStartup(item)}
                        className="tech-button tech-button-outline"
                        style={{ fontSize: '0.65rem', padding: '0.3rem 0.5rem' }}
                      >
                        Plan <span className="material-symbols-outlined" style={{ fontSize: '8px',  marginLeft: '1px'  }}>play_arrow</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Explorer;
