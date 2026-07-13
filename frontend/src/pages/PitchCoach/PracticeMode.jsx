import React from 'react';
import { Presentation, ArrowLeft } from 'lucide-react';

const PracticeMode = ({ 
  slidesList, 
  onBack, 
  onLaunchProjector,
  onSelectSlide 
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
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <button
          onClick={onLaunchProjector}
          className="tech-button tech-button-glow"
          style={{ fontSize: '0.75rem', padding: '0.45rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <Presentation size={14} /> Launch Slide Projector
        </button>
      </div>

      {/* Guide List Container */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', display: 'block', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem', textAlign: 'left' }}>
          Slide-by-Slide Presentation Guide
        </strong>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {slidesList.map((slide, index) => (
            <div 
              key={slide.id} 
              onClick={() => onSelectSlide(index)}
              style={{ 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-color)', 
                padding: '1.25rem', 
                borderRadius: '8px', 
                display: 'grid', 
                gridTemplateColumns: '160px 1fr', 
                gap: '1.5rem', 
                alignItems: 'start', 
                cursor: 'pointer' 
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>SLIDE {slide.id < 10 ? `0${slide.id}` : slide.id}</span>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-main)', marginTop: '0.15rem' }}>{slide.title}</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', marginTop: '0.5rem', fontWeight: 'bold' }}>⏱️ Time: {slide.duration}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>✨ Anim: {slide.animation}</div>
              </div>
              
              <div style={{ fontSize: '0.75rem', lineHeight: '1.45', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div><span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Content:</span> {slide.desc}</div>
                <div>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Talking Points:</span>
                  <ul style={{ margin: '0.15rem 0 0 1rem', padding: 0 }}>
                    {slide.talkingPoints.map((tp, i) => <li key={i}>{tp}</li>)}
                  </ul>
                </div>
                <div><span style={{ color: 'var(--text-muted)' }}><strong>Speaker Notes:</strong> {slide.notes}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.45rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                  <div>📊 <strong>Stat:</strong> {slide.stats}</div>
                  <div>💬 <strong>Judge Q:</strong> {slide.questions}</div>
                </div>
                <div style={{ color: 'var(--color-warning)', fontSize: '0.7rem', fontStyle: 'italic' }}>➜ <strong>Transition:</strong> {slide.transition}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PracticeMode;
