import React, { useState, useEffect } from 'react';


const AdminConfig = ({ theme, portalAccent }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchAdminConfig();
  }, []);

  const fetchAdminConfig = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/admin/config`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setConfig(data.config);
        addLog("Fetched dynamic OAuth credentials statuses successfully.");
      } else {
        setError(data.message || "Failed to retrieve configuration telemetry.");
      }
    } catch (err) {
      setError("Network offline. Backend server is unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: `3px solid ${portalAccent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>LOADING CREDENTIALS TELEMETRY...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-danger)' }}>warning</span>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Access Denied</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '400px' }}>{error}</p>
        <button onClick={fetchAdminConfig} className="tech-button" style={{ marginTop: '0.5rem' }}>Retry Sync</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1rem' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', margin: 0 }}>
            OAuth Configuration Control
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Verify client identifiers, authentication bindings, and deployment status.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontFamily: 'var(--font-sans)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>shield</span>
          SECURE OPERATOR MODE
        </div>
      </div>

      {/* Grid Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Google Status */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px', color: '#3b82f6' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>key</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>Google OAuth Provider</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>id_token / OIDC flow</span>
            </div>
            <div style={{
              marginLeft: 'auto',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-sans)',
              background: config.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: config.status === 'Active' ? 'var(--color-success)' : 'var(--color-danger)',
              border: `1px solid ${config.status === 'Active' ? 'var(--color-success)' : 'var(--color-danger)'}`
            }}>
              {config.status === 'Active' ? 'ACTIVE' : 'UNCONFIGURED'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.65rem', fontFamily: 'var(--font-sans)', marginBottom: '0.25rem' }}>GOOGLE_CLIENT_ID</label>
              <code style={{ background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.55rem', borderRadius: '4px', display: 'block', border: '1px solid var(--border-color)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {config.googleClientId}
              </code>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.65rem', fontFamily: 'var(--font-sans)', marginBottom: '0.25rem' }}>GOOGLE_CLIENT_SECRET</label>
              <code style={{ background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.55rem', borderRadius: '4px', display: 'block', border: '1px solid var(--border-color)', color: config.googleClientSecret === '[CONFIGURED]' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {config.googleClientSecret}
              </code>
            </div>
          </div>
        </div>

        {/* LinkedIn Status */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.1)', padding: '0.5rem', borderRadius: '8px', color: '#0d9488' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>key</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>LinkedIn OAuth Provider</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>v2AccessToken flow</span>
            </div>
            <div style={{
              marginLeft: 'auto',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-sans)',
              background: config.linkedinClientId !== 'mock_linkedin_client_id' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: config.linkedinClientId !== 'mock_linkedin_client_id' ? 'var(--color-success)' : 'var(--color-danger)',
              border: `1px solid ${config.linkedinClientId !== 'mock_linkedin_client_id' ? 'var(--color-success)' : 'var(--color-danger)'}`
            }}>
              {config.linkedinClientId !== 'mock_linkedin_client_id' ? 'ACTIVE' : 'UNCONFIGURED'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.65rem', fontFamily: 'var(--font-sans)', marginBottom: '0.25rem' }}>LINKEDIN_CLIENT_ID</label>
              <code style={{ background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.55rem', borderRadius: '4px', display: 'block', border: '1px solid var(--border-color)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {config.linkedinClientId}
              </code>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.65rem', fontFamily: 'var(--font-sans)', marginBottom: '0.25rem' }}>LINKEDIN_CLIENT_SECRET</label>
              <code style={{ background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.55rem', borderRadius: '4px', display: 'block', border: '1px solid var(--border-color)', color: config.linkedinClientSecret === '[CONFIGURED]' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {config.linkedinClientSecret}
              </code>
            </div>
          </div>
        </div>

      </div>

      {/* Network & Callback Integration */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '8px', color: '#f59e0b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>language</span>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>Callback integration & Redirect URIs</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Dynamic Referer/Origin Host Mappings</span>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          To allow logins, set your Google Cloud Console / LinkedIn Developer portal Authorized Redirect URI to match the dynamic endpoint below.
          The server detects the host header automatically:
        </div>

        <div style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.2rem' }}>DYNAMIC RESOLVED REDIRECT URI:</span>
            <code style={{ fontSize: '0.85rem', fontFamily: 'var(--font-sans)', color: portalAccent }}>{config.redirectUri}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
            AUTO-DETECT ACTIVE
          </div>
        </div>
      </div>

      {/* System Telemetry Logs */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px',  color: portalAccent  }}>terminal</span>
          <span>SSO HANDSHAKE TELEMETRY</span>
        </div>
        <div style={{
          background: 'var(--bg-panel)',
          borderRadius: '6px',
          padding: '0.75rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          maxHeight: '130px',
          overflowY: 'auto'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>[SYS LOGS EMPTY] Listening for callback triggers...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminConfig;
