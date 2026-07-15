import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace Google fonts
css = css.replace(/@import url[^;]+;/g, '');

// Replace :root variables
css = css.replace(/:root \{[^}]+\}/, `:root {
  /* Google Material Design 3 */
  --bg-main: #F8F9FA;
  --bg-sidebar: #FFFFFF;
  --bg-panel: #FFFFFF;
  --bg-panel-solid: #FFFFFF;
  --bg-input: #FFFFFF;
  --bg-list-item: #FFFFFF;
  --panel-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  --color-primary: #4285F4;
  --color-secondary: #34A853;
  --color-accent: #FBBC05;
  --color-success: #34A853;
  --color-warning: #FBBC05;
  --color-danger: #EA4335;
  
  --border-color: #E8EAED;
  --border-color-glow: rgba(66, 133, 244, 0.25);
  
  --text-main: #202124;
  --text-muted: #5F6368;
  --text-dim: #80868B;
  
  /* Fonts */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Roboto', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;
  
  /* Responsive Typography Scale System */
  --fs-hero: clamp(2.5rem, 5vw, 3.5rem);
  --fs-page: clamp(1.75rem, 4vw, 2.25rem);
  --fs-section: clamp(1.375rem, 3vw, 1.625rem);
  --fs-card: clamp(1.125rem, 2vw, 1.25rem);
  --fs-body: 1rem;
  --fs-small: 0.9rem;
  --fs-caption: 0.75rem;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
}`);

// Remove custom cursor
css = css.replace(/\/\* Custom Cursor System \*\/[\s\S]*?}/, '');
css = css.replace(/\/\* Hover\/Clickable Cursor System \*\/[\s\S]*?}/, '');

// Remove HUD ambient grid lights
css = css.replace(/\/\* Floating HUD ambient grid lights \*\/[\s\S]*?\.app-container::after \{[\s\S]*?\}/, '');

// Fix glass panel styling
css = css.replace(/\.glass-panel \{[^}]+\}/, '.glass-panel { background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 2rem; box-shadow: var(--panel-shadow); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }');

// Remove Corner Brackets
css = css.replace(/\/\* Corner Brackets \*\/[\s\S]*?\.glass-panel:hover \{/, '.glass-panel:hover {');

// Fix buttons
css = css.replace(/\.tech-button \{[^}]+\}/, '.tech-button { background: var(--color-primary); color: #ffffff; border: none; border-radius: 24px; padding: 0.65rem 1.5rem; font-weight: 500; font-family: var(--font-sans); font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background-color 0.2s, box-shadow 0.2s; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12); }');
css = css.replace(/\.tech-button:hover \{[^}]+\}/, '.tech-button:hover { background: #3367d6; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); transform: translateY(-1px); }');

css = css.replace(/\.tech-button-glow \{[^}]+\}/, '.tech-button-glow { background: var(--color-secondary); color: #ffffff; border: none; border-radius: 24px; padding: 0.65rem 1.5rem; font-weight: 500; font-family: var(--font-sans); font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background-color 0.2s, box-shadow 0.2s; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12); }');
css = css.replace(/\.tech-button-glow:hover \{[^}]+\}/, '.tech-button-glow:hover { background: #288441; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); transform: translateY(-1px); }');

css = css.replace(/\.border-gradient-cyber::after \{[^}]+\}/, '.border-gradient-cyber::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--color-primary); }');

// General link and glow effects
css = css.replace(/\.glow-text-[a-z]+ \{[^}]+\}/g, '');

fs.writeFileSync('src/index.css', css);
console.log('CSS updated successfully');
