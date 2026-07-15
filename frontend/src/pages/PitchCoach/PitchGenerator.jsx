import React from 'react';
import { Sparkles, Save, ArrowLeft, RefreshCw, Volume2, Smile } from 'lucide-react';

const PitchGenerator = ({ 
  pitchMode, 
  setPitchMode, 
  audienceType, 
  setAudienceType, 
  activeScript, 
  tempo, 
  tone, 
  onBack,
  onSavePitch 
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
        <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>AI Pitch Configurator</strong>
      </div>

      {/* Inputs Selector HUD */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Mode Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.55rem', textAlign: 'left' }}>Pitch Mode Format</label>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {[
              { id: 'elevator', label: '30s Elevator' },
              { id: 'hackathon', label: '3m Hackathon' },
              { id: 'investor', label: 'Investor Pitch' },
              { id: 'viva', label: 'College Viva' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPitchMode(m.id)}
                className={`tech-button ${pitchMode === m.id ? '' : 'tech-button-outline'}`}
                style={{ fontSize: '0.7rem', padding: '0.45rem 0.85rem' }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audience Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.55rem', textAlign: 'left' }}>Target Audience</label>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {[
              { id: 'judges', label: 'Hackathon Judges' },
              { id: 'investors', label: 'VC Investors' },
              { id: 'professors', label: 'Academic Professors' },
              { id: 'customers', label: 'Customers' }
            ].map(a => (
              <button
                key={a.id}
                onClick={() => setAudienceType(a.id)}
                className={`tech-button ${audienceType === a.id ? '' : 'tech-button-outline'}`}
                style={{ fontSize: '0.7rem', padding: '0.45rem 0.85rem' }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main generated speech teleprompter display */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Personalized Speech Teleprompter</span>
          </div>
          <button 
            onClick={onSavePitch} 
            className="tech-button" 
            style={{ fontSize: '0.75rem', padding: '0.45rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Save size={12} /> Save Script Configuration
          </button>
        </div>

        {/* Tempo HUD indicator */}
        <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.85rem', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Volume2 size={12} style={{ color: 'var(--color-primary)' }} /> <span>Speaking Tempo: <strong>{tempo}</strong></span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Smile size={12} style={{ color: 'var(--color-success)' }} /> <span>Delivery Tone: <strong>{tone}</strong></span></div>
        </div>

        {/* Generated Script */}
        <div style={{
          background: '#eae1cc',
          border: '1px solid #dfd5bf',
          padding: '1.5rem',
          borderRadius: '8px',
          fontSize: '0.95rem',
          lineHeight: '1.65',
          color: '#2b251e',
          fontStyle: 'italic',
          maxHeight: '220px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
        }}>
          "{activeScript}"
        </div>
      </div>

    </div>
  );
};

export default PitchGenerator;
