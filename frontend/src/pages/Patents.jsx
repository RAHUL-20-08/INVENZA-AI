import React, { useState, useEffect } from 'react';

import { fallbackInnovations } from '../dataFallback';
import { useSearch } from '../context/SearchContext';

const Patents = ({ onInspect, setCurrentPage, setGlobalQuery }) => {
  const { query, setQuery } = useSearch();
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(false);

  const isValidSearchQuery = (clean) => {
    if (!clean) return true;
    const s = clean.trim().toLowerCase();
    
    // 1. Length constraint
    if (s.length < 3) return true;
    
    // 2. Reject pure numbers or special character spam
    if (/^[^\w\s]+$/.test(s) || /^\d+$/.test(s)) return false;
    
    // 3. Check for consecutive repeated letters (e.g. "aaaa")
    if (/(.)\1\1\1/.test(s)) return false;
    
    // 4. Consonant clustering limit (e.g. "sdfgh")
    if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(s)) return false;

    // 5. Gibberish keyboard row contiguous swipes (e.g. "zxcv", "asdf", "qwer")
    const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    for (let row of keyboardRows) {
      if (s.length >= 4 && row.includes(s)) return false;
    }

    // 6. Word-based spelling and abbreviation check
    const commonAbbreviations = ["lcd", "led", "tft", "cpu", "gpu", "npu", "ram", "rom", "hud", "dvd", "vhs", "gps", "rfid", "nfc", "vr", "ar", "mr", "xml", "rss", "usb", "ip"];
    const words = s.split(/[\s\-_]+/);
    for (let word of words) {
      if (word.length >= 3) {
        const vowels = (word.match(/[aeiouy]/g) || []).length;
        const consonants = (word.match(/[bcdfghjklmnpqrstvwxz]/g) || []).length;
        if (vowels === 0 && !commonAbbreviations.includes(word)) return false;
        if (vowels > 0 && consonants / vowels > 4.5) return false;
      }
    }

    return true;
  };

  const fetchPatents = async (searchVal) => {
    if (searchVal && searchVal.trim().length >= 3 && !isValidSearchQuery(searchVal)) {
      setPatents([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/patents?query=${encodeURIComponent(searchVal)}`);
      const data = await res.json();
      if (data.success) {
        setPatents(data.data);
      }
    } catch (e) {
      console.warn("Backend patent search offline. Loading local fallbacks.", e);
      const basePatents = [
        ...fallbackInnovations.map(item => ({
          id: item.patentId,
          title: `${item.name} Patent Model`,
          innovationId: item.id,
          innovation: item,
          inventor: item.inventor,
          filedYear: item.yearFiled,
          expiryYear: item.yearFiled + 20,
          status: item.yearFiled + 20 < new Date().getFullYear() ? "Expired (Public Domain)" : "Active (Licensing Req.)",
          classifications: item.sector,
          claims: [
            "A computational sensor array utilizing micro-lens configurations.",
            "A feedback loop modifying parameters based on focal depth coordinates.",
            "A transmission path passing multi-dimensional volumetric pixel streams."
          ],
          description: `Core patent documenting the structural layout and circuit logic of the original ${item.name}. Detailed drawings depict multi-directional sensor capture buses.`
        })),
        {
          id: "US7423521B2",
          title: "Modular Charging Surface with Interlaced Coils",
          inventor: "Apple Wireless ATAP",
          filedYear: 2015,
          expiryYear: 2035,
          status: "Active (Licensing Req.)",
          classifications: "Wireless Inductive Power",
          claims: [
            "A charging mat comprising overlapping inductive emitter coils.",
            "A system adjusting active coils based on electromagnetic feedback coordinates.",
            "A cooling system circulating fluid to dissipate heat from overlapping coils."
          ],
          description: "Original patent schematics detailing Multi-device wireless charging surfaces with thermal sensors. Similar to Apple's cancelled AirPower project."
        },
        {
          id: "US5612683A",
          title: "Decentralized Microfluidic Assays",
          inventor: "Vasan & Stanford Biotech",
          filedYear: 1995,
          expiryYear: 2015,
          status: "Expired (Public Domain)",
          classifications: "Biomedical Engineering",
          claims: [
            "A plastic cartridge routing liquid samples through capillary channels.",
            "Decentralized spectrophotometric reaction sensors reading blood values.",
            "Self-calibrating optical chambers verifying chemical agent status."
          ],
          description: "Expired basic patents outlining microfluidic channel networks and laser fluorescence readers. Forms the chemical foundation for blood capillary testing."
        }
      ];
      const filtered = basePatents.filter(pat => 
        pat.id.toLowerCase().includes(searchVal.toLowerCase()) ||
        pat.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        pat.inventor.toLowerCase().includes(searchVal.toLowerCase()) ||
        pat.classifications.toLowerCase().includes(searchVal.toLowerCase())
      );
      setPatents(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatents(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatents(query);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="mono-tag" style={{ color: 'var(--color-primary)' }}>INTELLECTUAL PROPERTY</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)' }}>Patent Search Scanner</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Query expired and active global patents (WIPO, USPTO). Identify technologies that have entered the public domain.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPatent ? '1.8fr 1.2fr' : '1fr', gap: '1.5rem', transition: 'all 0.3s ease' }}>
        
        {/* Main List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-dim)',  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'  }}>search</span>
            <input 
              type="text" 
              className="tech-input" 
              placeholder="Search patent title/ID (e.g. Zune, US8289440B2) & press Enter..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%', borderColor: (query.trim().length >= 3 && !isValidSearchQuery(query)) ? 'var(--color-error)' : 'var(--border-color)' }}
            />
          </form>
          {query.trim().length >= 3 && !isValidSearchQuery(query) && (
            <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', fontFamily: 'var(--font-sans)', marginTop: '-0.5rem' }}>
              [INVALID QUERY: KEYBOARD SWEEPS OR GIBBERISH ARE NOT ACCEPTED]
            </div>
          )}

          {/* Patent Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading && patents.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <span className="material-symbols-outlined glow-text-pink" style={{ fontSize: '16px',  animation: 'spin 2s linear infinite', marginRight: '0.5rem'  }}>refresh</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>AUDITING PATENT REGISTRIES...</span>
              </div>
            ) : patents.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>
                [NO REGISTERED PATENTS MATCHING CRITERIA FOUND]
              </div>
            ) : (
              patents.map(pat => (
                <div 
                  key={pat.id} 
                  className={`glass-panel ${selectedPatent?.id === pat.id ? 'glass-panel-glow' : ''}`}
                  onClick={() => setSelectedPatent(pat)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '75%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`status-badge ${pat.status.includes('Expired') ? 'badge-active' : 'badge-warning'}`}>
                        {pat.status.includes('Expired') ? 'EXPIRED (Public Domain)' : 'ACTIVE (Licensing)'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>{pat.classifications}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{pat.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Patent ID: <strong style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-sans)' }}>{pat.id}</strong> | Inventor: <strong>{pat.inventor}</strong>
                    </p>
                  </div>

                  <button 
                    className="tech-button tech-button-outline"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    View Claims <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Detailed Claims Side-Over */}
        {selectedPatent && (
          <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(10,13,20,0.9)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Patent Specifications</h3>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--color-secondary)' }}>{selectedPatent.id}</span>
              </div>
              <button 
                onClick={() => setSelectedPatent(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                ✕
              </button>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-sans)' }}>ABSTRACT</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                {selectedPatent.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ background: 'var(--bg-panel)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>FILED YEAR</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{selectedPatent.filedYear}</strong>
              </div>
              <div style={{ background: 'var(--bg-panel)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>EST. EXPIRY</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{selectedPatent.expiryYear}</strong>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-sans)', marginBottom: '0.35rem' }}>INDEPENDENT CLAIMS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPatent.claims.map((claim, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', lineHeight: '1.3' }}>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{idx+1}.</span>
                    <span>{claim}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedPatent.status.includes('Expired') && (
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-success)',  flexShrink: 0, marginTop: '2px'  }}>verified_user</span>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-success)' }}>Public Domain Target</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    This patent has expired. You can integrate these structural claims into your hackathon code without legal risk!
                  </p>
                </div>
              </div>
            )}

            {selectedPatent.innovation && (
              <button 
                onClick={() => onInspect(selectedPatent.innovation)}
                className="tech-button"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', width: '100%', marginTop: '0.5rem' }}
              >
                Inspect Associated Innovation
              </button>
            )}

            <button 
              onClick={() => {
                const cleanTitle = selectedPatent.title.replace(" Patent Model", "").replace(" Patent", "");
                if (setGlobalQuery) setGlobalQuery(cleanTitle);
                if (setCurrentPage) setCurrentPage('github');
              }}
              className="tech-button tech-button-outline"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', width: '100%', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
            >
              Search GitHub Code
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default Patents;
