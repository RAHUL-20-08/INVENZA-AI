import React from 'react';
import { usePortal } from '../context/PortalContext';


const BusinessDashboard = () => {
  const {
    businessStages,
    businessStep,
    businessCompleted,
    businessProgress,
    advice,
    completeCurrentStep,
    startupReport,
    startupLoading,
    startupError
  } = usePortal();

  const currentStageMeta = businessStages.find(b => b.id === businessStep) || businessStages[businessStages.length - 1];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.75rem', alignItems: 'start' }}>
      
      {/* Left Column: AI Startup Consultant Console */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Active Stage & Complete Trigger */}
        <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--color-secondary)', background: 'rgba(13, 148, 136, 0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}>STARTUP DEVELOPMENT LEVEL</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                Stage {businessStep}: {currentStageMeta.name}
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', background: 'rgba(13, 148, 136, 0.15)', color: 'var(--color-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(13, 148, 136, 0.3)', fontWeight: 'bold' }}>
              PHASE {businessStep} OF 12
            </span>
          </div>

          <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', display: 'block', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>CONSULTANT ADVICE</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.45' }}>
              {advice.message}
            </p>
          </div>

          {businessStep <= 12 ? (
            <button
              onClick={completeCurrentStep}
              className="tech-button"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', height: '42px', fontSize: '0.85rem', background: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span> Mark Stage "{currentStageMeta.name}" Completed
            </button>
          ) : (
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: 'var(--color-success)', fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold' }}>
              🎉 CONGRATULATIONS! STARTUP MVP VALIDATION PROCESS FULLY COMPLETED.
            </div>
          )}
        </div>

        {/* Next recommended action metrics */}
        {businessStep <= 12 && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Consultant Recommended Tasks
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', textTransform: 'uppercase' }}>Next Phase Target</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginTop: '0.2rem' }}>
                    {advice.nextTask}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', textTransform: 'uppercase' }}>Required Duration</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px',  display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle'  }}>schedule</span>
                    {advice.time}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', textTransform: 'uppercase' }}>Expansion Rationale</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                  {advice.reason}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', textTransform: 'uppercase' }}>Execution Complexity</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    {advice.difficulty}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', textTransform: 'uppercase' }}>Toolkits & Templates</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.3rem' }}>
                    {(advice.resources || []).map((res, i) => (
                      <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.15rem 0.35rem', borderRadius: '4px', fontFamily: 'var(--font-sans)' }}>
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

      {/* Right Column: Live Market Intelligence & Investment Readiness */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Startup validation telemetry report */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>trending_up</span>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Live Investment Readiness</h4>
          </div>

          {startupLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <span className="material-symbols-outlined animate-spin glow-text-pink" style={{ fontSize: '20px',  marginBottom: '0.5rem'  }}>refresh</span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-sans)' }}>AUDITING LIVE REGISTRY...</span>
            </div>
          ) : startupError ? (
            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
              ⚠️ {startupError}
            </div>
          ) : startupReport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* MD3 Analytics Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }} viewBox="0 0 36 36">
                      <path style={{ fill: 'none', stroke: 'var(--border-color)', strokeWidth: '4' }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path style={{ fill: 'none', stroke: 'var(--color-success)', strokeWidth: '4', strokeDasharray: `${startupReport.investmentScore}, 100` }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{startupReport.investmentScore}%</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase' }}>Investment Score</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>BUSINESS HEALTH</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{startupReport.businessHealth}%</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>SCALABILITY INDEX</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-secondary)' }}>{startupReport.scalabilityScore}%</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>RISK COEFFICIENT</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${startupReport.riskScore}%`, height: '100%', background: startupReport.riskScore > 35 ? 'var(--color-danger)' : 'var(--color-success)' }}></div>
                  </div>
                  <strong style={{ fontSize: '1rem', color: startupReport.riskScore > 35 ? 'var(--color-danger)' : 'var(--color-success)' }}>{startupReport.riskScore}%</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', display: 'block' }}>REVENUE PREDICTION</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{startupReport.revenuePrediction}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', display: 'block' }}>GROWTH FORECAST</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{startupReport.growthForecast}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', display: 'block' }}>COMPETITORS ON RECORD</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                    {(startupReport.competitors || []).map((comp, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem 0' }}>
              No startup validation compiled. Search for a technical concept above to build business intelligence.
            </div>
          )}
        </div>

        {/* Business Milestones Timeline list */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            Validation Checklist
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {businessStages.map((stage) => {
              const isDone = businessCompleted.has(stage.id);
              const isActive = businessStep === stage.id;
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
                    background: isActive ? 'rgba(13, 148, 136, 0.04)' : isDone ? 'rgba(16, 185, 129, 0.02)' : 'transparent',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ color: isDone ? 'var(--text-dim)' : 'var(--text-main)', fontWeight: isActive ? 'bold' : 'normal' }}>
                    {stage.id}. {stage.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: isDone ? 'var(--color-success)' : isActive ? 'var(--color-secondary)' : 'var(--text-dim)', fontWeight: 'bold' }}>
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

export default BusinessDashboard;
