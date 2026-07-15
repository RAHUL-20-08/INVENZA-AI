import React, { useState, useEffect, useRef } from 'react';

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
        <div className="search-box-google" style={{ flex: 1, minHeight: '44px' }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input 
            type="text" 
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, paddingRight: '0.25rem' }}>
              {['#1A73E8','#0f63bd','#7facf4'].map((c, i) => (
                <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: c, animation: `google-dot-bounce 1.4s ease-in-out ${i*0.16}s infinite` }}></div>
              ))}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="tech-button" 
          disabled={loading || query.trim().length < 2}
          style={{ height: '44px', padding: '0 1.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap', borderRadius: '24px' }}
        >
          AI AUDIT
        </button>
      </form>

      {/* Autocomplete suggestions popup overlay */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '52px', 
            left: 0, 
            right: '100px',
            zIndex: 100, 
            maxHeight: '280px', 
            overflowY: 'auto', 
            padding: '0.35rem 0',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--search-shadow-focus)',
            borderRadius: '0 0 24px 24px',
            background: 'var(--bg-panel-solid)',
            borderTop: 'none'
          }}
        >
          {suggestions.map((item, index) => (
            <div 
              key={item.id + '-' + index}
              onClick={() => handleSuggestionClick(item.name)}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              style={{ 
                padding: '0.65rem 1.25rem', 
                fontSize: '0.875rem', 
                cursor: 'pointer', 
                color: 'var(--text-main)',
                backgroundColor: index === activeSuggestionIndex ? 'var(--bg-hover)' : 'transparent',
                borderLeft: index === activeSuggestionIndex ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all 0.12s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--text-dim)' }}>history</span>
                <span>{item.name}</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', background: 'var(--bg-hover)', padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>
                {item.source === 'local' ? 'DATABASE' : 'VERIFIED'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchBar;
