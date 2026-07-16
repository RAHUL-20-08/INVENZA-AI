import React from 'react';


const ExportCenter = ({ 
  activeItem,
  onBack, 
  handleDownloadPPTX, 
  handleDownloadSpeakerNotes, 
  handleDownloadScript 
}) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={onBack} 
          className="tech-button tech-button-outline"
          style={{ fontSize: '0.75rem', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span> Back to Dashboard
        </button>
        <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Export Center</strong>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '1.5rem', textAlign: 'left' }}>Download Presentation Assets</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* PowerPoint outline card */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>description</span>
                <strong style={{ fontSize: '0.9rem' }}>PowerPoint Structural Outline</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Download a clean text document of your 15 slide outlines ready to import into PowerPoint slides.
              </p>
            </div>
            <button 
              onClick={handleDownloadPPTX}
              className="tech-button" 
              style={{ fontSize: '0.75rem', padding: '0.5rem' }}
            >
              Download Outline <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>download</span>
            </button>
          </div>

          {/* Speaker Notes card */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>description</span>
                <strong style={{ fontSize: '0.9rem' }}>Comprehensive Speaker Notes</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Download stats, durations, possible judge questions, and transition cues for all 15 slides.
              </p>
            </div>
            <button 
              onClick={handleDownloadSpeakerNotes}
              className="tech-button" 
              style={{ fontSize: '0.75rem', padding: '0.5rem' }}
            >
              Download Notes Guide <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>download</span>
            </button>
          </div>

          {/* Teleprompter markdown script card */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-accent)' }}>code</span>
                <strong style={{ fontSize: '0.9rem' }}>Speech Teleprompter Script (.md)</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Download a clean markdown teleprompter script formatted for oral presentations and practice runs.
              </p>
            </div>
            <button 
              onClick={handleDownloadScript}
              className="tech-button" 
              style={{ fontSize: '0.75rem', padding: '0.5rem' }}
            >
              Download Script <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>download</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ExportCenter;
