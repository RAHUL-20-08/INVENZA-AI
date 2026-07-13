import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const UnifiedSearchBar = ({ placeholder = "Search verified innovations (e.g. Zune, Nokia N-Gage, Pebble)...", style = {} }) => {
  const { query, setQuery, suggestions, setSuggestions, loading, executeSearch } = useSearch();
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Close suggestions list on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions box visibility on list updates
  useEffect(() => {
    setActiveSuggestionIndex(-1);
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeSuggestionIndex < suggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        const selected = suggestions[activeSuggestionIndex];
        setQuery(selected.name);
        setShowSuggestions(false);
        executeSearch(selected.name);
      } else {
        setShowSuggestions(false);
        executeSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setShowSuggestions(false);
    executeSearch(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    executeSearch(query);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', flex: 1, ...style }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search 
            size={16} 
            color="var(--text-dim)" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }} 
          />
          <input 
            type="text" 
            className="tech-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ paddingLeft: '2.5rem', width: '100%', height: '42px', fontSize: '0.85rem' }}
          />
          {loading && (
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}>
              <span className="glow-text-pink" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>AUDITING...</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="tech-button" 
          disabled={loading || query.trim().length < 2}
          style={{ height: '42px', padding: '0 1.25rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          AI AUDIT
        </button>
      </form>

      {/* Autocomplete suggestions popup overlay */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="glass-panel" 
          style={{ 
            position: 'absolute', 
            top: '48px', 
            left: 0, 
            right: 0, 
            zIndex: 100, 
            maxHeight: '260px', 
            overflowY: 'auto', 
            padding: '0.5rem 0',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--panel-shadow)',
            borderRadius: '6px',
            background: 'var(--bg-panel-solid)'
          }}
        >
          {suggestions.map((item, index) => (
            <div 
              key={item.id + '-' + index}
              onClick={() => handleSuggestionClick(item.name)}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              style={{ 
                padding: '0.6rem 1rem', 
                fontSize: '0.8rem', 
                cursor: 'pointer', 
                color: 'var(--text-main)',
                backgroundColor: index === activeSuggestionIndex ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                borderLeft: index === activeSuggestionIndex ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{item.name}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                {item.source === 'local' ? 'DATABASE' : 'VERIFIED CONCEPTS'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchBar;
