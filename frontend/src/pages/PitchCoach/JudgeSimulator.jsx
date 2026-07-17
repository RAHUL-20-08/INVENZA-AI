import React from 'react';


const JudgeSimulator = ({ 
  practiceQuestions, 
  activeQuestionIndex, 
  setActiveQuestionIndex, 
  answers, 
  setAnswers, 
  isRecording, 
  handleStartRecording, 
  submitAnswer, 
  evaluating, 
  evalResults, 
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
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span> Back to Dashboard
        </button>
        <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Interactive Q&A Session</strong>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-accent)' }}>memory</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Judge Panel Q&A Simulation</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Question selector tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {practiceQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`tech-button ${activeQuestionIndex === idx ? '' : 'tech-button-outline'}`}
                style={{ fontSize: '0.7rem', padding: '0.4rem 0.75rem' }}
              >
                Question {idx + 1} {evalResults[idx] && `(Graded: ${evalResults[idx].score}%)`}
              </button>
            ))}
          </div>

          {/* Active Question display */}
          <div style={{ background: 'var(--bg-main, rgba(0,0,0,0.02))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.55rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.4', fontWeight: 600 }}>
              {practiceQuestions[activeQuestionIndex].question}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, var(--text-dim))', fontStyle: 'italic' }}>
              Helper: {practiceQuestions[activeQuestionIndex].helper}
            </span>
          </div>

          {/* Waveform indicator */}
          {isRecording && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: '3px', height: '16px', background: 'var(--color-accent)', borderRadius: '2px', animation: 'waveformAnim 0.7s ease-in-out infinite alternate', animationDelay: `${i * 0.08}s` }}></div>
              ))}
              <span style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)' }}>[LISTENING...]</span>
            </div>
          )}

          {/* Answer input */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <textarea
              className="tech-input"
              rows={3}
              placeholder="Provide your technical answer here..."
              value={answers[activeQuestionIndex] || ""}
              onChange={e => setAnswers(prev => ({ ...prev, [activeQuestionIndex]: e.target.value }))}
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.75rem', resize: 'vertical' }}
            />
            <button
              type="button"
              onClick={handleStartRecording}
              className={`tech-button ${isRecording ? '' : 'tech-button-outline'}`}
              style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexShrink: 0 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mic</span>
            </button>
          </div>

          {/* Action triggers */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => submitAnswer(activeQuestionIndex)}
              className="tech-button"
              disabled={evaluating[activeQuestionIndex] || !answers[activeQuestionIndex]?.trim()}
              style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
            >
              {evaluating[activeQuestionIndex] ? "Evaluating..." : "Submit Answer"}
            </button>
            <button
              onClick={() => setAnswers(prev => ({ ...prev, [activeQuestionIndex]: "" }))}
              className="tech-button tech-button-outline"
              style={{ fontSize: '0.75rem', padding: '0.5rem 0.8rem' }}
            >
              Clear
            </button>
          </div>

          {/* Graded evaluation feedback */}
          {evalResults[activeQuestionIndex] && (
            <div style={{ background: 'rgba(16,185,129,0.03)', borderLeft: '4px solid var(--color-success)', padding: '1rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--color-success)' }}>EVALUATION RESPONSE</span>
                <span>Score: {evalResults[activeQuestionIndex].score}%</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', margin: '0.35rem 0 0 0', lineHeight: '1.4', textAlign: 'left' }}>
                {evalResults[activeQuestionIndex].feedback}
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default JudgeSimulator;
