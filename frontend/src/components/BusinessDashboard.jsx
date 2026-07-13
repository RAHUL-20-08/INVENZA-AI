import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Activity,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

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
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>STARTUP DEVELOPMENT LEVEL</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                Stage {businessStep}: {currentStageMeta.name}
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(13, 148, 136, 0.15)', color: 'var(--color-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(13, 148, 136, 0.3)', fontWeight: 'bold' }}>
              PHASE {businessStep} OF 12
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', display: 'block', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>CONSULTANT ADVICE</span>
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
              <CheckCircle2 size={16} /> Mark Stage "{currentStageMeta.name}" Completed
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
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Next Phase Target</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginTop: '0.2rem' }}>
                    {advice.nextTask}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Required Duration</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                    {advice.time}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Expansion Rationale</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                  {advice.reason}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Execution Complexity</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'block', marginTop: '0.2rem', fontWeight: 'bold' }}>
                    {advice.difficulty}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Toolkits & Templates</span>
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

      {/* Right Column: Live Market Intelligence & Investment Readiness */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Startup validation telemetry report */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={14} color="var(--color-secondary)" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Live Investment Readiness</h4>
          </div>

          {startupLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              <RefreshCw size={20} className="animate-spin glow-text-pink" style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>AUDITING LIVE REGISTRY...</span>
            </div>
          ) : startupError ? (
            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
              ⚠️ {startupError}
            </div>
          ) : startupReport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>INVESTMENT SCORE</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-success)' }}>{startupReport.investmentScore}%</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>BUSINESS HEALTH</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>{startupReport.businessHealth}%</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.6,m', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>SCALABILITY INDEX</span>
                  <strong style={{ fontSize: '1rem', color: '#fff' }}>{startupReport.scalabilityScore}%</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>RISK COEFFICIENT</span>
                  <strong style={{ fontSize: '1rem', color: startupReport.riskScore > 35 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {startupReport.riskScore}%
                  </strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>REVENUE PREDICTION</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{startupReport.revenuePrediction}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>GROWTH FORECAST</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{startupReport.growthForecast}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: 'block' }}>COMPETITORS ON RECORD</span>
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
