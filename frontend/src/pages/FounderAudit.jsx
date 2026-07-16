import React, { useState, useEffect } from 'react';

const FounderAudit = ({ onLogout }) => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/founder/audit`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        if (data.success) {
          // Sort logs newest first
          const sortedLogs = (data.auditLogs || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLogs(sortedLogs);
          setUsers(data.userHistory || []);
        } else {
          setError(data.message || 'Failed to fetch audit logs.');
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
        setError("Network error. Could not reach the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuditData();
  }, []);

  const filteredLogs = logs.filter(log => filterAction === 'All' || log.action === filterAction);
  
  // Extract unique actions for the filter dropdown
  const uniqueActions = ['All', ...new Set(logs.map(log => log.action))];

  return (
    <div style={{ padding: '0 1rem 2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#f59e0b' }}>admin_panel_settings</span> 
            Founder Security Terminal
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Exclusive super-admin access to global platform audit logs and user activity history.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="material-symbols-outlined">error</span> Error</h3>
          <p style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Audit Events</span>
              <span style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>{logs.length}</span>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Users</span>
              <span style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>{users.length}</span>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</span>
              <span style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span> Secure
              </span>
            </div>
          </div>

          {/* Audit Log Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>System Audit Trail</h2>
              <select 
                value={filterAction} 
                onChange={(e) => setFilterAction(e.target.value)}
                className="tech-input"
                style={{ width: '250px' }}
              >
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action === 'All' ? 'All Actions' : action}</option>
                ))}
              </select>
            </div>

            <div className="glass-panel" style={{ borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1.2rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Timestamp</th>
                      <th style={{ padding: '1.2rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>User Email</th>
                      <th style={{ padding: '1.2rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
                      <th style={{ padding: '1.2rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Metadata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
                        <td style={{ padding: '1rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td style={{ padding: '1rem', color: 'var(--blue-400)' }}>{log.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            background: log.action.includes('LOGIN') ? 'rgba(16,185,129,0.1)' : log.action.includes('REGISTER') ? 'rgba(59,130,246,0.1)' : log.action.includes('LOCKED') ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                            color: log.action.includes('LOGIN') ? '#10b981' : log.action.includes('REGISTER') ? '#3b82f6' : log.action.includes('LOCKED') ? '#ef4444' : '#f59e0b',
                            fontWeight: 'bold'
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                          <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                          No audit logs found for the selected action.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FounderAudit;
