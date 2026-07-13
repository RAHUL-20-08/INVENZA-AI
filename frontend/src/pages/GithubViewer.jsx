import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Search, 
  Folder, 
  File, 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  GitFork, 
  RefreshCw,
  Code,
  Terminal,
  ChevronRight
} from 'lucide-react';

const GithubViewer = ({ globalQuery, setGlobalQuery }) => {
  const [query, setQuery] = useState(globalQuery || '');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active repository navigation states
  const [selectedRepo, setSelectedRepo] = useState(null); // { owner, name, description, stars }
  const [currentPath, setCurrentPath] = useState('');
  const [contents, setContents] = useState([]);
  const [contentsLoading, setContentsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // { name, path, download_url, content }
  const [fileLoading, setFileLoading] = useState(false);

  // Synchronize input query with global search parameter changes
  useEffect(() => {
    if (globalQuery) {
      setQuery(globalQuery);
      handleSearch(globalQuery);
    }
  }, [globalQuery]);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q || q.trim().length < 2) return;
    
    setLoading(true);
    setError(null);
    setSelectedRepo(null);
    setContents([]);
    setSelectedFile(null);

    try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("GitHub API rate limit exceeded. Please try again in a minute.");
        }
        throw new Error(`GitHub API returned status code ${response.status}`);
      }
      const data = await response.json();
      setRepos(data.items || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRepoContents = async (repo, path = '') => {
    setContentsLoading(true);
    setError(null);
    setSelectedFile(null);
    
    const repoOwner = repo.owner.login;
    const repoName = repo.name;

    try {
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`);
      if (!response.ok) {
        throw new Error(`Failed to load repository contents: status ${response.status}`);
      }
      const data = await response.json();
      // Sort: folders first, then files
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
          })
        : [data];
      
      setContents(sortedData);
      setCurrentPath(path);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setContentsLoading(false);
    }
  };

  const loadFileContent = async (file) => {
    setFileLoading(true);
    setError(null);
    try {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file contents: status ${response.status}`);
      }
      const data = await response.json();
      let decoded = '';
      if (data.encoding === 'base64') {
        // Handle utf-8 base64 decoding correctly
        const binString = atob(data.content.replace(/\s/g, ''));
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
          bytes[i] = binString.charCodeAt(i);
        }
        decoded = new TextDecoder('utf-8').decode(bytes);
      } else {
        decoded = data.content || '';
      }

      setSelectedFile({
        ...file,
        content: decoded
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setFileLoading(false);
    }
  };

  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setContents([]);
    setSelectedFile(null);
    setError(null);
  };

  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    const parentPath = parts.join('/');
    loadRepoContents(selectedRepo, parentPath);
  };

  const isTextOrCodeFile = (filename) => {
    const textExtensions = [
      'js', 'jsx', 'ts', 'tsx', 'py', 'c', 'cpp', 'h', 'hpp', 'java', 'cs', 'go', 'rs', 
      'html', 'css', 'json', 'md', 'txt', 'sh', 'yml', 'yaml', 'xml', 'ini', 'conf', 'sql'
    ];
    const ext = filename.split('.').pop().toLowerCase();
    return textExtensions.includes(ext) || !filename.includes('.');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header section */}
      <div>
        <span className="mono-tag glow-text-pink">FEDERATED CODE INTEGRATION</span>
        <h1 style={{ fontSize: '2.1rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
          GitHub <span style={{ background: 'linear-gradient(95deg, var(--color-primary), var(--color-accent), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Repository Hub</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Query, browse, and inspect open-source software patterns matching our revived technology vectors.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="tech-input"
              placeholder="Search GitHub repositories (e.g. multi-touch camera, membrane treatment)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.85rem' }}
            />
          </div>
          <button type="submit" className="tech-button" style={{ height: '42px', padding: '0 1.5rem' }}>
            <FolderGit2 size={16} />
            SEARCH REPOS
          </button>
        </form>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div style={{
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid var(--color-danger)',
          borderRadius: '4px',
          color: 'var(--color-danger)',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Layout Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRepo ? '1fr 2fr' : '1fr', gap: '1.5rem', minHeight: '550px' }}>
        
        {/* Repo Search Results list OR File Tree Column */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          
          {!selectedRepo ? (
            // Repositories List
            <>
              <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Matching Repositories ({repos.length})
              </h3>
              
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '0.5rem' }}>
                  <RefreshCw size={24} className="glow-text-cyan" style={{ animation: 'spin 2s linear infinite' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SCANNING GITHUB INDEX...</span>
                </div>
              ) : repos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  No repositories loaded. Enter a technology vector to query codebases.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {repos.map(repo => (
                    <div 
                      key={repo.id}
                      onClick={() => {
                        setSelectedRepo(repo);
                        loadRepoContents(repo, '');
                      }}
                      className="list-item"
                      style={{ cursor: 'pointer', padding: '1rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                          {repo.full_name}
                        </span>
                        <ChevronRight size={14} color="var(--text-dim)" />
                      </div>
                      
                      {repo.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {repo.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Star size={10} /> {repo.stargazers_count}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <GitFork size={10} /> {repo.forks_count}
                        </span>
                        {repo.language && (
                          <span style={{ color: 'var(--color-secondary)' }}>{repo.language}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Repository Contents List
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button 
                  onClick={handleBackToRepos}
                  className="tech-button tech-button-outline"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                >
                  <ArrowLeft size={10} /> Back
                </button>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>EXPLORING DIR</span>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                  {selectedRepo.name}
                </h4>
                <a 
                  href={selectedRepo.html_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--color-secondary)', marginTop: '0.25rem', textDecoration: 'none' }}
                >
                  View on GitHub <ExternalLink size={10} />
                </a>
              </div>

              {contentsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: '0.5rem' }}>
                  <RefreshCw size={18} className="glow-text-cyan" style={{ animation: 'spin 2s linear infinite' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reading branch index...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '480px', overflowY: 'auto' }}>
                  {currentPath && (
                    <div 
                      onClick={handleNavigateUp}
                      className="list-item"
                      style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>📁 .. (parent folder)</span>
                    </div>
                  )}

                  {contents.map(item => (
                    <div 
                      key={item.sha}
                      onClick={() => {
                        if (item.type === 'dir') {
                          loadRepoContents(selectedRepo, item.path);
                        } else {
                          loadFileContent(item);
                        }
                      }}
                      className="list-item"
                      style={{ 
                        cursor: 'pointer', 
                        padding: '0.6rem 0.75rem', 
                        border: selectedFile?.sha === item.sha ? '1px solid var(--color-primary)' : '1px dashed var(--border-list-item)',
                        background: selectedFile?.sha === item.sha ? 'rgba(59,130,246,0.05)' : 'var(--bg-list-item)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                        {item.type === 'dir' ? (
                          <Folder size={14} color="var(--color-secondary)" />
                        ) : (
                          <File size={14} color="var(--text-dim)" />
                        )}
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: item.type === 'dir' ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>

        {/* Right Code Viewer Column */}
        {selectedRepo && (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '550px' }}>
            
            {!selectedFile ? (
              // Empty selection display
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', gap: '0.75rem', textAlign: 'center', padding: '4rem 1rem' }}>
                <Code size={40} color="var(--border-color-glow)" />
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Interactive Code Inspector</h4>
                <p style={{ fontSize: '0.8rem', maxWidth: '340px', lineHeight: '1.4' }}>
                  Select any code or text file from the repository directory tree on the left to inspect its contents.
                </p>
              </div>
            ) : fileLoading ? (
              // Loading file
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <RefreshCw size={24} className="glow-text-cyan" style={{ animation: 'spin 2s linear infinite' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DECODING BASE64 CONTENT...</span>
              </div>
            ) : (
              // Loaded File Content Display
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                
                {/* File details banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span className="mono-tag" style={{ fontSize: '0.65rem', color: 'var(--color-primary)' }}>FILEPATH IN REPO</span>
                    <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginTop: '0.2' }}>
                      {selectedFile.path}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    SIZE: {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                {/* Inspect Container */}
                {isTextOrCodeFile(selectedFile.name) ? (
                  <div style={{ flex: 1, position: 'relative' }}>
                    <pre style={{
                      margin: 0,
                      padding: '1.25rem',
                      background: 'rgba(0,0,0,0.85)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      overflow: 'auto',
                      maxHeight: '480px',
                      color: '#adbac7',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      whiteSpace: 'pre-wrap'
                    }}>
                      <code>{selectedFile.content}</code>
                    </pre>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', gap: '0.5rem', padding: '3rem 1rem' }}>
                    <Terminal size={32} />
                    <span style={{ fontSize: '0.8rem' }}>Binary/Non-text file formats cannot be previewed in line.</span>
                    <a 
                      href={selectedFile.download_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="tech-button" 
                      style={{ fontSize: '0.7rem', padding: '0.3rem 0.75rem', marginTop: '0.5rem' }}
                    >
                      Download Raw File
                    </a>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default GithubViewer;
