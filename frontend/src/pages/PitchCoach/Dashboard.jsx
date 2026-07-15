import React from 'react';


const Dashboard = ({ 
  activeItem, 
  pitchMode, 
  audienceType, 
  convictionScore, 
  historyList,
  tempo,
  tone,
  onSwitchView,
  onLaunchProjector 
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* HUD Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Pitch Generator Trigger */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>auto_awesome</span>
              <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Pitch Generator</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4', textAlign: 'left' }}>
              Configure elevator, investor, hackathon, technical, or viva pitches tailored to target audiences.
            </p>
          </div>
          <button 
            onClick={() => onSwitchView('generator')} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', width: '100%', padding: '0.55rem' }}
          >
            Create New Pitch <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
          </button>
        </div>

        {/* Practice Mode Trigger */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>co_present</span>
              <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Practice Presentation</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4', textAlign: 'left' }}>
              Launch Canva-style 15-slide projector with voice teleprompter and drag-resizing split sidebars.
            </p>
          </div>
          <button 
            onClick={onLaunchProjector} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', width: '100%', padding: '0.55rem' }}
          >
            Launch Projector <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>play_arrow</span>
          </button>
        </div>

        {/* Judge Simulator Trigger */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-accent)' }}>memory</span>
              <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Judge Simulator</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4', textAlign: 'left' }}>
              Trigger interactive questions graded with NPU diagnostics, scoring, and conviction matrices.
            </p>
          </div>
          <button 
            onClick={() => onSwitchView('simulator')} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', width: '100%', padding: '0.55rem' }}
          >
            Practice Q&A <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          </button>
        </div>

      </div>

      {/* Main split dashboard content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Active context info & History list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.0rem' }}>
          
          {/* Active project card details */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)', textAlign: 'left', display: 'block' }}>// ACTIVE_TARGET_CONTEXT</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 800 }}>{activeItem.name}</h3>
              <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>{activeItem.sector}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, textAlign: 'left', marginBottom: '1rem' }}>
              {activeItem.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Viability Index</span>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-success)' }}>{activeItem.revivalViability || 85}%</strong>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Tech Readiness</span>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#fff' }}>TRL {activeItem.readinessLevel || 4}/9</strong>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Market Sizing</span>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-primary)' }}>{activeItem.marketGrowth || "15.4% CAGR"}</strong>
              </div>
            </div>
          </div>

          {/* Practice History list */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', display: 'block', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.0rem', textAlign: 'left' }}>
              Practice Session History
            </strong>
            {historyList && historyList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historyList.map((hist, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{hist.projectName}</strong>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '0.2rem 0 0 0' }}>Q: {hist.question.substring(0, 50)}...</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{hist.date}</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--color-success)' }}>{hist.score}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                No practice history records found. Start practicing Q&A simulation!
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Conviction radar and fast stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Conviction Indicator */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', border: '1.5px solid rgba(6,182,212,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>thumb_up</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Conviction Index</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'var(--font-sans)' }}>{convictionScore}%</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>GRADED_STABILITY</span>
            </div>

            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${convictionScore}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))' }}></div>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.75rem' }}>// PITCH_CONFIGURATION_HUD</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--color-primary)'  }}>timer</span> <span>Autoplay Mode: <strong>Voice Trigger Enabled</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--color-secondary)'  }}>volume_up</span> <span>Speaking Tempo: <strong>{tempo}</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--color-success)'  }}>sentiment_satisfied</span> <span>Delivery Tone: <strong>{tone}</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--text-muted)'  }}>settings</span> <span>Active Mode: <span style={{ textTransform: 'capitalize' }}>{pitchMode} Pitch</span></span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><span className="material-symbols-outlined" style={{ fontSize: '12px',  color: 'var(--color-accent)'  }}>group</span> <span>Target Audience: <span style={{ textTransform: 'capitalize' }}>{audienceType}</span></span></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
