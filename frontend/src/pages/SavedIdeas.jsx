import React, { useState, useEffect } from 'react';
import { Bookmark, Rocket, Trash2, HelpCircle } from 'lucide-react';

const SavedIdeas = ({ onInspect }) => {
  const [savedItems, setSavedItems] = useState([]);

  const loadSavedItems = () => {
    try {
      const stored = localStorage.getItem('saved_audits');
      if (stored) {
        setSavedItems(JSON.parse(stored));
      } else {
        setSavedItems([]);
      }
    } catch (e) {
      console.error("Error reading saved audits:", e);
    }
  };

  useEffect(() => {
    loadSavedItems();
    // Add window listener to catch local updates
    window.addEventListener('storage', loadSavedItems);
    return () => window.removeEventListener('storage', loadSavedItems);
  }, []);

  const handleDelete = (id) => {
    try {
      const updated = savedItems.filter(item => item.id !== id);
      localStorage.setItem('saved_audits', JSON.stringify(updated));
      setSavedItems(updated);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="mono-tag" style={{ color: 'var(--color-accent)' }}>PERSISTENT REGISTRY</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)' }}>Saved Innovations Basket</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Inspect the concepts you audited during this session. Load them into the Startup Builder to formulate canvases and forecasts.
        </p>
      </div>

      {savedItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Bookmark size={40} color="var(--text-dim)" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Your saved basket is empty</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '400px' }}>
              Submit an abstract in the **Innovation Explorer** tab and click "Save Audit" to store concepts permanently in this browser.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {savedItems.map((item) => (
            <div key={item.id} className="glass-panel list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '70%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="status-badge badge-ideation" style={{ fontSize: '0.65rem' }}>
                    {item.patentId || 'AUDITED CONCEPT'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.sector}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.failureBottlenecks ? item.failureBottlenecks[0] : 'Audited and compiled concept details.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>VIABILITY</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-success)' }}>{item.revivalViability}%</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onInspect(item)}
                    className="tech-button"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                  >
                    <Rocket size={12} /> Plan Startup
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="tech-button tech-button-outline"
                    style={{ fontSize: '0.75rem', padding: '0.4rem', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--color-danger)' }}
                    title="Delete Idea"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SavedIdeas;
