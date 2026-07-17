import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="theme-toggle-wrapper">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle dark mode"
        type="button"
      >
        <div className={`theme-toggle-track ${isDark ? 'dark' : 'light'}`}>
          <span className={`theme-toggle-icon sun ${!isDark ? 'active' : ''}`}>
            <span className="material-symbols-outlined">light_mode</span>
          </span>
          <span className={`theme-toggle-icon moon ${isDark ? 'active' : ''}`}>
            <span className="material-symbols-outlined">dark_mode</span>
          </span>
          <div className="theme-toggle-thumb" />
        </div>
        <span className="theme-toggle-text">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
