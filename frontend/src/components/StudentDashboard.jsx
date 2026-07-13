import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

const StudentDashboard = () => {
  const {
    studentStages,
    studentStep,
    studentCompleted,
    studentProgress,
    advice,
    completeCurrentStep
  } = usePortal();

  // Find active step stage metadata
  const currentStageMeta = studentStages.find(s => s.id === studentStep) || studentStages[studentStages.length - 1];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.75rem', alignItems: 'start' }}>
      
      {/* Left: AI Mentor Guidance Console */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Active Stage & Action Button */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--color-primary)', background: 'rgba(59, 130, 246, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>CURRENT ACTIVE LIFE-CYCLE STEP</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                Step {studentStep}: {currentStageMeta.name}
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)', fontWeight: 'bold' }}>
              STEP {studentStep} OF 14
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', display: 'block', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>AI INNOVATION PM ADVICE</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.45' }}>
              {advice.message}
            </p>
          </div>

          {studentStep <= 14 ? (
            <button
              onClick={completeCurrentStep}
              className="tech-button"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', height: '42px', fontSize: '0.85rem' }}
            >
              <CheckCircle2 size={16} /> Mark Step "{currentStageMeta.name}" Completed
            </button>
          ) : (
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: 'var(--color-success)', fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>
              🎉 CONGRATULATIONS! ALL SUBMISSION PHASES SUCCESSFULLY COMPILED.
            </div>
          )}
        </div>

        {/* Dynamic Next-Step Recommendation Details */}
        {studentStep <= 14 && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Next Recommended Action Plan
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Recommended Task</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginTop: '0.2rem' }}>
                    {advice.nextTask}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Expected Time</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                    {advice.time}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Mentorship Rationale</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                  {advice.reason}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Complexity Rating</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    {advice.difficulty}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Recommended Resources</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.3rem' }}>
                    {(advice.resources || []).map((res, i) => (
                      <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.15rem 0.35rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Right Sidebar: Daily Advice & Progress Roadmap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Daily Mentor Morning Check-in */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--color-secondary)', background: 'rgba(13, 148, 136, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <Award size={14} color="var(--color-secondary)" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Daily Mentor Check-in</h4>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'block', fontWeight: 'bold' }}>Good morning!</span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
            Today's recommended task is to complete <strong>"{currentStageMeta.name}"</strong> because your preceding research milestones are fully checked off.
          </p>
        </div>

        {/* Milestone Stages Roadmap */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            Submissions Roadmap
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {studentStages.map((stage) => {
              const isDone = studentCompleted.has(stage.id);
              const isActive = studentStep === stage.id;
              return (
                <div 
                  key={stage.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    background: isActive ? 'rgba(59, 130, 246, 0.04)' : isDone ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ color: isDone ? 'var(--text-dim)' : 'var(--text-main)', fontWeight: isActive ? 'bold' : 'normal' }}>
                    {stage.id}. {stage.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: isDone ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--text-dim)', fontWeight: 'bold' }}>
                    {isDone ? 'DONE' : isActive ? 'TARGET' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
