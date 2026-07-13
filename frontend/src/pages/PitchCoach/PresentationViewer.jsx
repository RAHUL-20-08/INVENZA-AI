import React from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

const SlideRenderer = ({ slide, isMobile, audienceType }) => {
  const { layout, title, desc, detail, id, stats } = slide;
  
  // Base header and footer metadata to keep consistency
  const headerMeta = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>SLIDE {id} / 15 • {layout?.toUpperCase()}</span>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{audienceType.toUpperCase()} MODE</span>
    </div>
  );

  const footerMeta = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
      <span>Invenza Slide System</span>
      <span>{stats || "TRL: 4/9"}</span>
    </div>
  );

  // Switch between layout templates:
  switch (layout) {
    case 'cover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <span className="mono-tag" style={{ color: 'var(--color-primary)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>// PITCH_DECK_REVIVAL</span>
              <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', margin: '0 0 1rem 0', lineHeight: 1.15 }}>
                {title.replace("Slide 1: ", "")}
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                {detail}
              </p>
              <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.1)', border: '1px solid var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                🔑 Ready for Revival Assessment
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="180" height="180" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad)" strokeWidth="2.5" strokeDasharray="5,3" />
                  <polygon points="50,20 75,65 25,65" fill="rgba(6,182,212,0.15)" stroke="var(--color-secondary)" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="8" fill="var(--color-primary)" />
                </svg>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'problem':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(239,68,68,0.06)', borderLeft: '4px solid var(--color-danger)', padding: '1rem', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-danger)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>HISTORICAL BOTTLENECK</span>
                <strong style={{ fontSize: isMobile ? '1rem' : '1.35rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Why it stayed cancelled:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                  {detail}
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <strong>Impact:</strong> Project remained locked under TRL Level 4 for years without foveated edge calibration filters.
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="200" height="150" viewBox="0 0 200 150">
                  <rect x="20" y="20" width="160" height="110" rx="6" fill="#05070a" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                  <line x1="40" y1="75" x2="160" y2="75" stroke="var(--color-danger)" strokeWidth="2.5" />
                  <circle cx="100" cy="75" r="16" fill="rgba(239,68,68,0.2)" stroke="var(--color-danger)" strokeWidth="2" />
                  <text x="100" y="80" dominantBaseline="middle" textAnchor="middle" fill="var(--color-danger)" fontSize="13" fontWeight="bold">BLOCK</text>
                  <text x="100" y="115" textAnchor="middle" fill="var(--text-dim)" fontSize="8">CRITICAL LIMIT REACHED</text>
                </svg>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'solutions-gap':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, textAlign: 'left', fontWeight: 'bold' }}>{desc}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '8px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-danger)', display: 'block', marginBottom: '0.5rem' }}>❌ Competitor Alternatives</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Over-reliance on heavy cloud telemetry APIs. Requires constant active connectivity, introducing &gt;120ms transmission delays.
                </p>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.15)', padding: '1.25rem', borderRadius: '8px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-success)', display: 'block', marginBottom: '0.5rem' }}>✔️ The Invenza Solution</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Quantized offline edge compilation nodes. Telemetry buffer parses locally on ESP32 in under 12ms with absolute compliance security.
                </p>
              </div>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'proposed-solution':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>// REVAL_MATRIX_SOLUTION</span>
              <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#fff', fontWeight: 800 }}>Proposed AI Overlay</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {detail}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <div>⏱️ <strong>Latency:</strong> &lt; 12ms</div>
                <div>🛡️ <strong>Safety:</strong> Edge Isolated</div>
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="200" height="150" viewBox="0 0 200 150">
                  <rect x="15" y="20" width="70" height="40" rx="4" fill="rgba(255,255,255,0.02)" stroke="var(--border-color)" />
                  <text x="50" y="44" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Legacy Core</text>
                  <path d="M 85 40 L 115 40" stroke="var(--color-primary)" strokeWidth="1.5" />
                  <rect x="115" y="20" width="70" height="40" rx="4" fill="rgba(59,130,246,0.1)" stroke="var(--color-primary)" />
                  <text x="150" y="44" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">AI Wrapper</text>
                  <path d="M 150 60 L 150 90" stroke="var(--color-success)" strokeWidth="1.5" />
                  <rect x="100" y="90" width="90" height="40" rx="4" fill="rgba(16,185,129,0.08)" stroke="var(--color-success)" />
                  <text x="145" y="114" textAnchor="middle" fill="#fff" fontSize="8">quantized buffer</text>
                </svg>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'features-grid':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, textAlign: 'left', fontWeight: 'bold' }}>{desc}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'left', borderTop: '2.5px solid var(--color-primary)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>⚡</span>
                <strong style={{ fontSize: '0.8rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Fast Processing</strong>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
                  NPU compressor latency is kept below 12 milliseconds locally.
                </p>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'left', borderTop: '2.5px solid var(--color-secondary)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>👁️</span>
                <strong style={{ fontSize: '0.8rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Glare Reduction</strong>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
                  94.2% ghosting reflection reduction across relief waveguide panels.
                </p>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'left', borderTop: '2.5px solid var(--color-success)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>🛡️</span>
                <strong style={{ fontSize: '0.8rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Moat Check</strong>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
                  Full WIPO clearance with 14/14 expired claims. No clashing hazards.
                </p>
              </div>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'architecture':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>// DATA_FLOWCHART</span>
              <strong style={{ fontSize: '1.25rem', color: '#fff' }}>Holographic Waveguide Pipeline</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45, margin: 0 }}>
                {detail}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', background: '#05070a', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <svg width="280" height="120" viewBox="0 0 280 120">
                <rect x="5" y="45" width="60" height="30" rx="3" fill="rgba(255,255,255,0.02)" stroke="var(--border-color)" />
                <text x="35" y="63" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Sensors</text>
                <path d="M 65 60 L 95 60" stroke="var(--color-primary)" strokeWidth="1.5" />
                
                <rect x="95" y="45" width="80" height="30" rx="3" fill="rgba(59,130,246,0.05)" stroke="var(--color-primary)" />
                <text x="135" y="63" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">NPU Processor</text>
                <path d="M 175 60 L 205 60" stroke="var(--color-secondary)" strokeWidth="1.5" />
                
                <rect x="205" y="45" width="70" height="30" rx="3" fill="rgba(6,182,212,0.05)" stroke="var(--color-secondary)" />
                <text x="240" y="63" textAnchor="middle" fill="#fff" fontSize="8">Waveguide</text>
              </svg>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'tech-stack':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, textAlign: 'left', fontWeight: 'bold' }}>{title.replace("Slide 7: ", "")}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', textAlign: 'left' }}>
                <span className="mono-tag" style={{ color: 'var(--color-primary)', display: 'inline-block', marginBottom: '0.55rem' }}>CUDA / C++</span>
                <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Rendering Engine</strong>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>
                  CUDA pipelines process foveated rendering aberration weights in parallel.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', textAlign: 'left' }}>
                <span className="mono-tag" style={{ color: 'var(--color-secondary)', display: 'inline-block', marginBottom: '0.55rem' }}>ESP32 SDK</span>
                <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Firmware Build</strong>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>
                  Quantized calibrations compiled into lightweight 18MB firmware modules.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', textAlign: 'left' }}>
                <span className="mono-tag" style={{ color: 'var(--color-success)', display: 'inline-block', marginBottom: '0.55rem' }}>PyTorch</span>
                <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Calibration Model</strong>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>
                  Aberration corrections are trained in PyTorch and compiled using TensorRT.
                </p>
              </div>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'ai-features':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span className="mono-tag" style={{ color: 'var(--color-success)' }}>// CORE_NEURAL_WEIGHTS</span>
              <strong style={{ fontSize: '1.25rem', color: '#fff' }}>Aberration Quantization</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {detail}
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                💡 Quantizing weights into 4-bit formats prevents wearable processor battery draining.
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="200" height="150" viewBox="0 0 200 150">
                  <rect x="20" y="20" width="160" height="110" rx="4" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.08)" />
                  <path d="M 40 100 Q 80 40 120 80 T 160 50" fill="none" stroke="var(--color-success)" strokeWidth="3" />
                  <circle cx="120" cy="80" r="4" fill="var(--color-success)" />
                  <text x="125" y="84" fill="var(--color-success)" fontSize="8" fontWeight="bold">quantized weight point</text>
                </svg>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'patent-analysis':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(245,158,11,0.06)', borderLeft: '4px solid var(--color-warning)', padding: '1rem', borderRadius: '4px' }}>
                <strong style={{ fontSize: '1.25rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Safe-to-Revive Patent</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                  {detail}
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <strong>Clearance:</strong> Checked all 14 claims in register records. All claims verified as fully expired.
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="180" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="50" fill="rgba(16,185,129,0.05)" stroke="var(--color-success)" strokeWidth="3" />
                  <path d="M 60 75 L 70 85 L 95 60" fill="none" stroke="var(--color-success)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="75" y="140" textAnchor="middle" fill="var(--color-success)" fontSize="10" fontWeight="bold">CLAIMS SAFE (14/14)</text>
                </svg>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'research-support':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>// RESEARCH_CITATIONS</span>
              <strong style={{ fontSize: '1.25rem', color: '#fff' }}>Scientific Refraction Math</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                {detail}
              </p>
            </div>
            {!isMobile && (
              <div style={{ background: '#05070a', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>η = 1.0 - (sin(θ)/n)</span>
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', lineHeight: '1.45' }}>
                  <strong>Waveguide Index:</strong>η represents refraction loss metrics under foveated angle inputs (θ).
                </div>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'market-opportunity':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="mono-tag" style={{ color: 'var(--color-secondary)' }}>// TAM_EXPANSION</span>
              <strong style={{ fontSize: '1.35rem', color: '#fff' }}>Market Momentum Growth</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45, margin: 0 }}>
                {detail}
              </p>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="180" height="150" viewBox="0 0 180 150">
                  <line x1="20" y1="130" x2="160" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <rect x="40" y="90" width="30" height="40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                  <rect x="110" y="30" width="30" height="100" fill="var(--color-secondary)" />
                  <text x="55" y="142" textAnchor="middle" fill="var(--text-dim)" fontSize="8">Legacy</text>
                  <text x="125" y="142" textAnchor="middle" fill="#fff" fontSize="8">CAGR target</text>
                </svg>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    case 'business-canvas':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, textAlign: 'left', fontWeight: 'bold' }}>{desc}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Value Proposition</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-main)' }}>Quantized offline calibrations. Solves aberration loss locally without cloud latency.</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', display: 'block', marginBottom: '0.25rem' }}>Monetization Channels</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-main)' }}>Recurring SDK license subscriptions and pre-packaged hardware calibration blocks.</span>
              </div>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'swot-matrix':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, textAlign: 'left', fontWeight: 'bold' }}>SWOT Moat Matrices</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(52,211,153,0.03)', border: '1px solid rgba(52,211,153,0.15)', padding: '0.75rem', borderRadius: '6px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-success)', display: 'block', marginBottom: '0.25rem' }}>Strengths</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Low-power compiled offline footprint (&lt;18MB ESP32 firmware).</span>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', padding: '0.75rem', borderRadius: '6px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-danger)', display: 'block', marginBottom: '0.25rem' }}>Weaknesses</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Initial calibration overhead on foveated sensors.</span>
              </div>
              <div style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.15)', padding: '0.75rem', borderRadius: '6px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>Opportunities</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reviving expired AR waveguide patent claims safely.</span>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.15)', padding: '0.75rem', borderRadius: '6px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-warning)', display: 'block', marginBottom: '0.25rem' }}>Threats</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Competitor copies via standard waveguide overlays.</span>
              </div>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'future-roadmap':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span className="mono-tag" style={{ color: 'var(--color-success)' }}>// TIMELINE_ROADMAP</span>
              <strong style={{ fontSize: '1.25rem', color: '#fff' }}>18-Month Scope Path</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45, margin: 0 }}>
                {detail}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', background: '#05070a', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <svg width="280" height="100" viewBox="0 0 280 100">
                <circle cx="40" cy="50" r="8" fill="var(--color-primary)" />
                <line x1="48" y1="50" x2="132" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <circle cx="140" cy="50" r="8" fill="var(--color-secondary)" />
                <line x1="148" y1="50" x2="232" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <circle cx="240" cy="50" r="8" fill="var(--color-success)" />
                <text x="40" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="7">NPU MVP</text>
                <text x="140" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="7">3D Splatting</text>
                <text x="240" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="7">Mesh nodes</text>
              </svg>
            </div>
          </div>
          {footerMeta}
        </div>
      );

    case 'thank-you':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: '2rem', flex: 1, alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <span className="mono-tag" style={{ color: 'var(--color-success)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>// PITCH_CONCLUDED</span>
              <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', margin: '0 0 1rem 0' }}>
                Thank You!
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: '0 0 1.5rem 0' }}>
                We are open to take panel feedback and simulator questions.
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <div>📧 team@invenza.edu</div>
                <div>🌐 invenza.edu</div>
              </div>
            </div>
            {!isMobile && (
              <div style={{ background: 'rgba(16,185,129,0.03)', border: '1.5px solid var(--color-success)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Financial Ask</strong>
                <span style={{ fontSize: '1.25rem', color: 'var(--color-success)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>{slide.detail.split('|')[1]?.replace('Required Budget: ', '') || "$350,000"}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Requested seed funding to support prototype packaging.</span>
              </div>
            )}
          </div>
          {footerMeta}
        </div>
      );

    default:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {headerMeta}
          <div style={{ textAlign: 'left', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 800, margin: '0 0 1rem 0' }}>{title}</h2>
            <div style={{ margin: '1rem 0' }}>{slide.svg}</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>{detail}</p>
          </div>
          {footerMeta}
        </div>
      );
  }
};

const PresentationViewer = ({
  projectorRef,
  presentSlideIndex,
  setPresentSlideIndex,
  slidesList,
  audienceType,
  projectorView,
  setProjectorView,
  isMobile,
  showNotes,
  setShowNotes,
  notesWidth,
  startNotesResizing,
  isDragging,
  presentationTime,
  tempo,
  demoLogs,
  demoCommand,
  setDemoCommand,
  handleRunDemoCommand,
  availableVoices,
  selectedVoiceName,
  setSelectedVoiceName,
  voiceVolume,
  setVoiceVolume,
  voiceRate,
  setVoiceRate,
  isMuted,
  setIsMuted,
  speaking,
  handleToggleSpeech,
  isPlaying,
  setIsPlaying,
  nativeFullscreen,
  toggleNativeFullscreen,
  mobileShowNotesDrawer,
  setMobileShowNotesDrawer,
  handleExit,
  speakCurrentSlide
}) => {
  return (
    <div 
      ref={projectorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#030508',
        zIndex: 999999999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        color: '#fff',
        overflow: 'hidden'
      }}
    >
      
      {/* Waveform waveforms Style */}
      <style>{`
        @keyframes waveformAnim {
          0% { height: 4px; }
          100% { height: 24px; }
        }
        @keyframes pulseSoft {
          0% { box-shadow: 0 0 5px rgba(6,182,212,0.2); }
          100% { box-shadow: 0 0 20px rgba(6,182,212,0.6); }
        }
        @keyframes scanlineAnim {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(280px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 0.1; }
        }
      `}</style>

      {/* Main Presenter Area */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 90px)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Left/Center: Presentation Slide Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '1rem' : '2.5rem',
          background: '#05070a',
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative',
          width: showNotes ? `${100 - notesWidth}%` : '100%'
        }}>
          
          {projectorView === 'presentation' ? (
            // SLIDES PRESENTATION VIEW
            <div id="print-section" className="glass-panel-glow animate-fade-in" style={{
              width: '100%',
              maxWidth: '1350px',
              aspectRatio: '16/9',
              maxHeight: '65vh',
              background: '#0d111a',
              border: '1.5px solid var(--color-primary)',
              padding: isMobile ? '1rem 1.5rem' : '2.5rem 3.5rem',
              borderRadius: '12px',
              boxSizing: 'border-box',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <SlideRenderer 
                slide={slidesList[presentSlideIndex]} 
                isMobile={isMobile} 
                audienceType={audienceType} 
              />
            </div>
          ) : (
            // INTERACTIVE PROTOTYPE DEMO SIMULATOR
            <div className="glass-panel-glow animate-fade-in" style={{
              width: '100%',
              maxWidth: '1350px',
              aspectRatio: '16/9',
              maxHeight: '65vh',
              background: '#040508',
              border: '1.5px solid var(--color-success)',
              padding: isMobile ? '1rem' : '2rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: 'var(--color-success)' }}>
                <span>💻 PROTOTYPE INTERACTIVE SHELL: {slidesList[presentSlideIndex].title.toUpperCase()}</span>
                <span>STATUS: ACTIVE</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', background: '#000', padding: '1rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#10b981' }}>
                {demoLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>

              <form onSubmit={handleRunDemoCommand} style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-success)', alignSelf: 'center' }}>$</span>
                <input 
                  type="text" 
                  className="tech-input" 
                  placeholder="Type diagnostic command (help, analyze, compile, moat, clear)..."
                  value={demoCommand}
                  onChange={e => setDemoCommand(e.target.value)}
                  style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.45rem', border: '1px solid var(--color-success)', background: '#000' }}
                />
                <button type="submit" className="tech-button" style={{ fontSize: '0.7rem', padding: '0.45rem 1rem' }}>Execute</button>
              </form>
            </div>
          )}

          {/* Floating AI presenter speaking prompts */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              zIndex: 10
            }}>
              <div style={{ background: 'rgba(10,12,18,0.95)', border: '1px solid var(--border-color)', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.7rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span>⏳ Time: <strong>{Math.floor(presentationTime / 60)}m {presentationTime % 60}s</strong></span>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                <span>Suggested Pace: <strong>{tempo}</strong></span>
              </div>
              <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--color-accent)', textAlign: 'left', maxWidth: '300px' }}>
                <strong>🤖 Presenter Coach:</strong> Spend approx {slidesList[presentSlideIndex].duration}. {slidesList[presentSlideIndex].talkingPoints[0]}.
              </div>
            </div>
          )}
        </div>

        {/* Draggable Split Divider Line */}
        {showNotes && !isMobile && (
          <div 
            onMouseDown={startNotesResizing}
            style={{
              width: '6px',
              background: isDragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              cursor: 'col-resize',
              transition: 'background 0.2s',
              zIndex: 20
            }}
          />
        )}

        {/* Right Sidebar Speaker Notes */}
        {showNotes && !isMobile && (
          <div style={{
            width: `${notesWidth}%`,
            minWidth: '220px',
            background: '#080b11',
            borderLeft: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}>
            <div>
              <span style={{ fontSize: '0.6rem', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>SPEAKER_NOTES_GUIDE</span>
              <h3 style={{ fontSize: '1rem', marginTop: '0.15rem', fontFamily: 'var(--font-display)', textAlign: 'left' }}>Teleprompter</h3>
            </div>

            <div style={{
              flex: 1,
              background: '#040609',
              border: '1px solid var(--border-color)',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              color: 'var(--color-secondary)',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                "{slidesList[presentSlideIndex].notes}"
              </p>
            </div>

            {/* Speech configuration */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>SPEECH AUDIO</span>
              
              <div>
                <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.15rem', textAlign: 'left' }}>TTS Voice</label>
                <select 
                  className="tech-input" 
                  value={selectedVoiceName}
                  onChange={e => setSelectedVoiceName(e.target.value)}
                  style={{ width: '100%', fontSize: '0.65rem', padding: '0.2rem', background: '#000' }}
                >
                  {availableVoices.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textAlign: 'left' }}>Vol</span>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={voiceVolume} 
                    onChange={e => setVoiceVolume(parseFloat(e.target.value))} 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textAlign: 'left' }}>Speed</span>
                  <input 
                    type="range" 
                    min="0.5" max="2" step="0.25" 
                    value={voiceRate} 
                    onChange={e => setVoiceRate(parseFloat(e.target.value))} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="tech-button tech-button-outline"
                  style={{ flex: 1, fontSize: '0.65rem', padding: '0.25rem' }}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={() => speakCurrentSlide(presentSlideIndex)}
                  className="tech-button tech-button-outline"
                  style={{ flex: 1, fontSize: '0.65rem', padding: '0.25rem' }}
                >
                  Restart
                </button>
              </div>
            </div>

            <button
              onClick={handleToggleSpeech}
              className="tech-button tech-button-glow"
              style={{ width: '100%', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
            >
              {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
              {speaking ? "Mute Presenter" : "Play Narration"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Bottom Panel */}
      {isMobile && mobileShowNotesDrawer && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: 0,
          width: '100%',
          background: '#080b11',
          borderTop: '2px solid var(--color-primary)',
          padding: '1.25rem',
          boxSizing: 'border-box',
          zIndex: 1000000001,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxHeight: '40vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>SPEAKER NOTES</span>
            <button onClick={() => setMobileShowNotesDrawer(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem' }}>Close</button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', margin: 0, fontStyle: 'italic', textAlign: 'left' }}>
            "{slidesList[presentSlideIndex].notes}"
          </p>
        </div>
      )}

      {/* Centered Floating Control Bar */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000000,
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        padding: '0.5rem 1.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        gap: isMobile ? '0.45rem' : '0.85rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMobile ? '92%' : 'auto',
        maxWidth: '960px',
        boxSizing: 'border-box'
      }}>
        
        {/* Prev */}
        <button
          disabled={presentSlideIndex === 0}
          onClick={() => setPresentSlideIndex(prev => Math.max(0, prev - 1))}
          className="tech-button tech-button-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          <SkipBack size={12} /> {!isMobile && "Prev"}
        </button>

        {/* Play/Pause speech */}
        <button
          onClick={handleToggleSpeech}
          className="tech-button tech-button-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          {speaking ? <Pause size={12} /> : <Play size={12} />}
          {!isMobile && (speaking ? "Pause Voice" : "Play Voice")}
        </button>

        {/* Autoplay toggling */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="tech-button"
          style={{
            padding: '0.35rem 0.85rem', 
            fontSize: '0.75rem', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.2rem',
            background: isPlaying ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
            border: isPlaying ? '1px solid var(--color-warning)' : '1px solid var(--color-success)',
            color: isPlaying ? 'var(--color-warning)' : 'var(--color-success)'
          }}
        >
          {!isMobile && "Autoplay"} {isPlaying ? "[ON]" : "[OFF]"}
        </button>

        {/* Jump-to-Slide numerical drop-down selector */}
        <select
          value={presentSlideIndex}
          onChange={e => setPresentSlideIndex(parseInt(e.target.value))}
          style={{
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.7rem'
          }}
        >
          {slidesList.map((s, idx) => (
            <option key={s.id} value={idx}>Slide {s.id}/15</option>
          ))}
        </select>

        {/* Toggle between presentation slide screen and diagnostics demo simulator */}
        <button
          onClick={() => setProjectorView(projectorView === 'presentation' ? 'demo' : 'presentation')}
          className="tech-button tech-button-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px' }}
        >
          {projectorView === 'presentation' ? "Run Demo" : "Show Slides"}
        </button>

        {/* Next */}
        <button
          disabled={presentSlideIndex === slidesList.length - 1}
          onClick={() => setPresentSlideIndex(prev => Math.min(slidesList.length - 1, prev + 1))}
          className="tech-button tech-button-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          {!isMobile && "Next"} <SkipForward size={12} />
        </button>

        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>

        {/* Show Notes */}
        <button
          onClick={() => {
            if (isMobile) {
              setMobileShowNotesDrawer(!mobileShowNotesDrawer);
            } else {
              setShowNotes(!showNotes);
            }
          }}
          className="tech-button tech-button-outline"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          {showNotes || mobileShowNotesDrawer ? <EyeOff size={12} /> : <Eye size={12} />}
          {!isMobile && "Notes"}
        </button>

        {/* Fullscreen native trigger */}
        {!isMobile && (
          <button
            onClick={toggleNativeFullscreen}
            className="tech-button tech-button-outline"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            {nativeFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {!isMobile && (nativeFullscreen ? "Exit Full" : "Fullscreen")}
          </button>
        )}

        {/* Exit Projector */}
        <button
          onClick={handleExit}
          style={{
            background: 'rgba(255,0,85,0.1)',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}
        >
          <X size={12} /> {!isMobile && "Exit"}
        </button>
      </div>

    </div>
  );
};

export default PresentationViewer;
