import React, { useEffect, useState } from 'react';


const AuthCallback = ({ onLoginSuccess, onOnboardingNeeded, onCancel }) => {
  const [statusStep, setStatusStep] = useState(1); // 1: Parsing, 2: Handshake, 3: Verifying, 4: Success, 5: Error
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[SYS] ${msg}`]);
  };

  useEffect(() => {
    const exchangeCode = async () => {
      addLog("Detecting callback authorization parameters...");
      
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (!code || !state) {
        setStatusStep(5);
        setErrorMsg("Clearance failed: Authorization code or state payload is missing.");
        addLog("Error: Missing parameters.");
        return;
      }

      const [provider, portalType] = state.split('_');
      if (!provider || !portalType) {
        setStatusStep(5);
        setErrorMsg("Clearance failed: Unrecognized state security context.");
        addLog("Error: Invalid state.");
        return;
      }

      setStatusStep(2);
      addLog(`Initiating secure backend handshake with ${provider} auth nodes...`);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/oauth/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, provider, portalType })
        });
        const data = await response.json();

        if (data.success) {
          setStatusStep(3);
          addLog("Credentials match: verified.");
          addLog("Exchanging short-lived tokens for session clearance...");

          setTimeout(() => {
            if (data.isNewUser) {
              addLog("New identity detected. Routing to portal profile onboarding...");
              onOnboardingNeeded(data.token, data.user, portalType);
            } else {
              addLog("Existing identity confirmed. Opening main deck dashboard...");
              localStorage.setItem('is_logged_in', 'true');
              localStorage.setItem('auth_token', data.token);
              localStorage.setItem('portal_type', portalType);
              localStorage.setItem('auth_user', JSON.stringify(data.user));
              onLoginSuccess(data.user);
            }
          }, 1500);
        } else {
          setStatusStep(5);
          setErrorMsg(data.message || "Failed to exchange security clearance parameters.");
          addLog("Error: Handshake rejected by token server.");
        }
      } catch (err) {
        setStatusStep(5);
        setErrorMsg("Network error contacting security nodes. Please confirm server availability.");
        addLog("Error: Connection refused.");
      }
    };

    exchangeCode();
  }, [onLoginSuccess, onOnboardingNeeded]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-main)'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        textAlign: 'center'
      }}>
        
        {/* Animated Scanner Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          {statusStep < 4 ? (
            <div style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(59, 130, 246, 0.15)'
            }}>
              <span className="material-symbols-outlined pulse" style={{ fontSize: '32px',  color: 'var(--color-primary)'  }}>developer_board</span>
              <div style={{
                position: 'absolute',
                top: '-2px', left: '-2px', right: '-2px', bottom: '-2px',
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: 'var(--color-primary)',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : statusStep === 4 ? (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--color-success)',
              color: 'var(--color-success)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>verified_user</span>
            </div>
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--color-danger)',
              color: 'var(--color-danger)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>error</span>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            {statusStep < 4 ? "Security Exchange Check" : statusStep === 4 ? "Access Authorized" : "Security Clearance Error"}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {statusStep === 1 && "Parsing identity callback tokens..."}
            {statusStep === 2 && "Exchanging credentials with federated provider..."}
            {statusStep === 3 && "Verifying security claims and JWT signatures..."}
            {statusStep === 4 && "Clearing local active session layers..."}
            {statusStep === 5 && errorMsg}
          </p>
        </div>

        {/* Terminal logs display */}
        <div style={{
          background: '#020305',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'left',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.7rem',
          color: '#34d399',
          height: '110px',
          overflowY: 'auto',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}>
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>

        {statusStep === 5 && (
          <button onClick={onCancel} className="tech-button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Return to Login Portal <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </button>
        )}

      </div>
    </div>
  );
};

export default AuthCallback;
