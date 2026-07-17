import React, { useState, useEffect } from 'react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPortal, setFilterPortal] = useState('All');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/superadmin/audit`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        if (data.success) {
          // Sort logs newest first
          const sortedLogs = (data.auditLogs || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLogs(sortedLogs);
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
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(log => filterPortal === 'All' || log.portal === filterPortal);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '85vh' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#8b5cf6' }}>history</span> Global Audit Log
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Review system actions, login history, and portal activities.
          </p>
        </div>

        <select 
          value={filterPortal} 
          onChange={(e) => setFilterPortal(e.target.value)}
          className="tech-input"
          style={{ width: '200px' }}
        >
          <option value="All">All Portals</option>
          <option value="student">Student Portal</option>
          <option value="business">Business Portal</option>
          <option value="system">System Actions</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="material-symbols-outlined">error</span> Error</h3>
          <p style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>User Email</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Portal</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--blue-400)' }}>{log.email || log.user}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{log.action}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      background: log.portal === 'student' ? 'rgba(59,130,246,0.1)' : log.portal === 'business' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: log.portal === 'student' ? '#3b82f6' : log.portal === 'business' ? '#10b981' : '#ef4444',
                      textTransform: 'uppercase'
                    }}>
                      {log.portal}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{log.type}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No audit logs found for the selected portal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
