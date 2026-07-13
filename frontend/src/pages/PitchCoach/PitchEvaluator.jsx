import React from 'react';
import { ThumbsUp, ArrowLeft } from 'lucide-react';

const PitchEvaluator = ({ 
  evaluations, 
  convictionScore, 
  onBack 
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
        <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Pitch Scoring & Moats Evaluation</strong>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left: Overall Conviction Moat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1.5px solid rgba(6,182,212,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ThumbsUp size={18} color="var(--color-secondary)" />
              <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>Overall Conviction Index</strong>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>{convictionScore}%</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>STABILITY_GRADIENTS</span>
            </div>

            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${convictionScore}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))' }}></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0, textAlign: 'left' }}>
              Your conviction score represents how robust your modern AI/waveguide edits are against industry claims. Keep practicing Q&A sessions to boost your grading scale.
            </p>
          </div>

          {/* Actionable Suggestions */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--color-warning)', background: 'rgba(245,158,11,0.03)', textAlign: 'left' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-warning)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.55rem' }}>[PERSONALIZED_IMPROVEMENTS]</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem', lineHeight: '1.45' }}>
              <div>➔ **Moat Definition**: Highlight foveated NPU graphics processing to block big-tech copying.</div>
              <div>➔ **Cost Strategy**: Detail B2B software SDK licensing parameters in slide 12.</div>
              <div>➔ **Presentation**: Focus on pauses after hook statement in slide 1.</div>
            </div>
          </div>

        </div>

        {/* Right: Detailed metrics */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1rem', textAlign: 'left' }}>// PITCH_EVALUATION_RADAR</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {evaluations.map((evalItem, idx) => (
              <div key={idx} style={{ fontSize: '0.8rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{evalItem.label}</span>
                  <strong style={{ color: 'var(--text-main)' }}>{evalItem.score}%</strong>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '2.5px', overflow: 'hidden', marginBottom: '0.25rem' }}>
                  <div style={{ width: `${evalItem.score}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>{evalItem.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PitchEvaluator;
