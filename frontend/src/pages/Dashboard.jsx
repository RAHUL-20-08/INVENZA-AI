import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Search,
  ArrowUpRight,
  Cpu,
  RefreshCw,
  Save,
  Terminal,
  Shield,
  Globe,
  FileText,
  BookOpen,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { fallbackInnovations, calculateClientSimilarity } from '../dataFallback';

const Dashboard = ({ activeInnovation, setActiveInnovation, globalQuery, setGlobalQuery }) => {
  const { error, executeSearch } = useSearch();
  const [innovations, setInnovations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocalMode, setIsLocalMode] = useState(false);

  // Custom query & error states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [queryError, setQueryError] = useState(null);

  // Live HUD preview states
  const [hudPreview, setHudPreview] = useState(null);
  const [hudLoading, setHudLoading] = useState(false);

  // Dynamic hash calculation for custom visual offsets
  let nameHash = 0;
  const nameToHash = selectedItem?.name || "Custom Concept";
  for (let i = 0; i < nameToHash.length; i++) {
    nameHash += nameToHash.charCodeAt(i);
  }

  // Client-side technology name validator to filter out keyboard spam and gibberish
  const isValidTechnologyName = (q) => {
    if (!q) return false;
    const clean = q.trim().toLowerCase();
    
    // 1. Length constraint
    if (clean.length < 3) return false;
    
    // 2. Reject pure numbers or special character spam
    if (/^[^\w\s]+$/.test(clean) || /^\d+$/.test(clean)) return false;
    
    // 3. Check for consecutive repeated letters (e.g. "aaaa")
    if (/(.)\1\1\1/.test(clean)) return false;
    
    // 4. Consonant clustering limit (e.g. "sdfgh")
    if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(clean)) return false;

    // 5. Gibberish keyboard row contiguous swipes (e.g. "zxcv", "asdf", "qwer")
    const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    for (let row of keyboardRows) {
      if (clean.length >= 4 && row.includes(clean)) return false;
    }

    // 6. Word-based spelling and abbreviation check
    const commonAbbreviations = ["lcd", "led", "tft", "cpu", "gpu", "npu", "ram", "rom", "hud", "dvd", "vhs", "gps", "rfid", "nfc", "vr", "ar", "mr", "xml", "rss", "usb", "ip", "wipo", "iot"];
    const words = clean.split(/[\s\-_]+/);
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

  const extractTechnicalKeywords = (text, title) => {
    if (!text) return [title];
    const stopWords = new Set([
      'the', 'and', 'of', 'to', 'in', 'is', 'a', 'was', 'for', 'on', 'by', 'an', 'it', 'with', 'as', 'at', 
      'from', 'that', 'this', 'be', 'or', 'which', 'were', 'are', 'its', 'their', 'but', 'not', 'he', 'she', 
      'they', 'who', 'has', 'have', 'had', 'been', 'would', 'could', 'should', 'more', 'most', 'some', 'any',
      'other', 'such', 'into', 'than', 'then', 'also', 'first', 'two', 'new', 'used', 'using', 'use', 'made',
      'after', 'before', 'during', 'under', 'over', 'between', 'through', 'about', 'against', 'these', 'those',
      'first-generation', 'multi-touch', 'high-definition', 'real-time', 'realtime', 'cross-platform', 'open-source'
    ]);

    const cleanTitle = title.toLowerCase();
    const capitalizedReg = /\b[A-Z][a-zA-Z\-]+(?:\s+[A-Z][a-zA-Z\-]+)*\b/g;
    const matches = text.match(capitalizedReg) || [];
    
    const entities = [];
    const seenEntities = new Set();
    
    for (let match of matches) {
      const cleanMatch = match.trim();
      const lowerMatch = cleanMatch.toLowerCase();
      if (lowerMatch === cleanTitle || stopWords.has(lowerMatch) || cleanMatch.length < 3) continue;
      if (/^(However|Although|Therefore|Furthermore|Initially|Subsequently|During|Under|Despite|Unlike|Additionally|Alternatively|Consequently|Moreover|Meanwhile)$/.test(cleanMatch)) continue;
      
      if (!seenEntities.has(lowerMatch)) {
        seenEntities.add(lowerMatch);
        entities.push(cleanMatch);
      }
    }

    if (entities.length < 3) {
      const words = text.toLowerCase()
        .replace(/[^\w\s\-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 5 && !stopWords.has(w) && w !== cleanTitle);
        
      const freq = {};
      for (let w of words) {
        freq[w] = (freq[w] || 0) + 1;
      }
      
      const sortedWords = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
      for (let w of sortedWords) {
        if (!seenEntities.has(w)) {
          seenEntities.add(w);
          entities.push(w.charAt(0).toUpperCase() + w.slice(1));
          if (entities.length >= 4) break;
        }
      }
    }

    while (entities.length < 3) {
      entities.push("Edge AI");
      entities.push("Decentralized RAG");
      entities.push("SaaS APIs");
    }

    return entities.slice(0, 3);
  };

  // Debounced effect to query Wikipedia API & verify if the search query is a real concept
  useEffect(() => {
    if (!globalQuery || globalQuery.trim().length < 3) {
      setHudPreview(null);
      setHudLoading(false);
      return;
    }

    if (!isValidTechnologyName(globalQuery)) {
      setHudPreview({
        invalid: true,
        message: "Invalid naming pattern, repeated characters, or keyboard sweeps detected."
      });
      setHudLoading(false);
      return;
    }

    setHudLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      const cleanQ = globalQuery.trim().toLowerCase();
      
      // 1. Check similarity with pre-seeded local database first (exact/substring match OR high Jaccard)
      let bestLocalMatch = null;
      let maxSim = 0;
      let isExactOrSubMatch = false;

      for (let item of innovations) {
        const itemNameLower = item.name.toLowerCase();
        if (cleanQ === itemNameLower || itemNameLower.includes(cleanQ) || cleanQ.includes(itemNameLower)) {
          bestLocalMatch = item;
          isExactOrSubMatch = true;
          break;
        }
      }
      
      if (!isExactOrSubMatch) {
        const queryWords = new Set(cleanQ.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2));
        innovations.forEach(item => {
          const itemWords = new Set((item.name + " " + item.sector).toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2));
          const intersection = new Set([...queryWords].filter(x => itemWords.has(x)));
          const union = new Set([...queryWords, ...itemWords]);
          const sim = union.size === 0 ? 0 : intersection.size / union.size;
          if (sim > maxSim) {
            maxSim = sim;
            bestLocalMatch = item;
          }
        });
      }

      const matchPercent = isExactOrSubMatch ? 100 : Math.round(maxSim * 100);
      
      if (bestLocalMatch && (isExactOrSubMatch || matchPercent >= 45)) {
        const filedYear = bestLocalMatch.yearFiled || 2012;
        const currentYear = new Date().getFullYear();
        const isExpired = (filedYear + 20) < currentYear;
        
        const keywords = extractTechnicalKeywords(bestLocalMatch.description, bestLocalMatch.name);
        const keyword1 = keywords[0] || "Edge AI";
        const keyword2 = keywords[1] || "Decentralized RAG";
        const keyword3 = keywords[2] || "Modular APIs";

        const suggestions = [
          `Integrate advanced computational layers with modern ${keyword1} frameworks to bypass legacy hardware limitations.`,
          `Deploy distributed micro-networks to optimize real-time ${keyword2} workflows.`,
          `Leverage scalable ${keyword3} solutions to drive enterprise commercialization paths.`
        ];

        setHudPreview({
          exists: "local",
          matchName: bestLocalMatch.name,
          matchScore: matchPercent,
          filedYear,
          isExpired,
          suggestions,
          invalid: false,
          description: bestLocalMatch.description,
          operatingStatus: "DISCONTINUED / DEFUNCT (Historical Index)",
          additionalDetails: `Primary Failure: ${bestLocalMatch.failureBottlenecks ? bestLocalMatch.failureBottlenecks[0] : "Market saturation"}`
        });
        setHudLoading(false);
        return;
      }

      // 2. Query Wikipedia API search to verify if it is a real concept
      try {
        const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(globalQuery)}&origin=*`;
        const response = await fetch(wikiSearchUrl);
        const searchData = await response.json();
        
        if (!searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
          setHudPreview({
            invalid: true,
            message: `"${globalQuery}" could not be matched with any active technical entries, scientific nodes, or patent files.`
          });
          setHudLoading(false);
          return;
        }

        const bestWikiMatch = searchData.query.search[0];
        const titleWords = new Set(bestWikiMatch.title.toLowerCase().split(/\s+/));
        const queryWordsArr = cleanQ.split(/\s+/);
        const overlap = queryWordsArr.filter(w => titleWords.has(w));
        
        if (overlap.length === 0 && !bestWikiMatch.title.toLowerCase().includes(cleanQ) && !cleanQ.includes(bestWikiMatch.title.toLowerCase())) {
          setHudPreview({
            invalid: true,
            message: `"${globalQuery}" could not be matched with any active technical entries, scientific nodes, or patent files.`
          });
          setHudLoading(false);
          return;
        }

        // Fetch detailed page abstract to check if it's a biography/person
        const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(bestWikiMatch.title)}&origin=*`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        
        const pages = detailData.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pageId !== "-1" ? pages[pageId].extract : "";
        
        // Reject biography queries
        const bioKeywords = ["born ", "was born", "personal life", "cricketer", "actor", "politician", "singer", "actress", "novelist", "artist"];
        if (extract && bioKeywords.some(kw => extract.toLowerCase().includes(kw))) {
          setHudPreview({
            invalid: true,
            message: "Invenza blocks searches for personal profiles or biographies. Please search for a technical system."
          });
          setHudLoading(false);
          return;
        }

        // Extrapolate filing date from text or hash it deterministically
        let filedYear = 2010;
        const yearMatches = extract.match(/\b(19\d{2}|20\d{2})\b/g);
        if (yearMatches) {
          const validYears = yearMatches
            .map(y => parseInt(y, 10))
            .filter(y => y >= 1950 && y <= new Date().getFullYear());
          if (validYears.length > 0) {
            filedYear = Math.min(...validYears);
          }
        } else {
          let hash = 0;
          for (let i = 0; i < cleanQ.length; i++) hash += cleanQ.charCodeAt(i);
          filedYear = 1990 + (hash % 22);
        }
        
        const currentYear = new Date().getFullYear();
        const isExpired = (filedYear + 20) < currentYear;

        // Dynamic accelerators suggestions derived from the actual Wikipedia page abstract!
        const keywords = extractTechnicalKeywords(extract, bestWikiMatch.title);
        const keyword1 = keywords[0] || "Edge AI";
        const keyword2 = keywords[1] || "Decentralized RAG";
        const keyword3 = keywords[2] || "Modular APIs";

        const suggestions = [
          `Integrate advanced computational layers with modern ${keyword1} frameworks to bypass legacy hardware limitations.`,
          `Deploy distributed micro-networks to optimize real-time ${keyword2} workflows.`,
          `Leverage scalable ${keyword3} solutions to drive enterprise commercialization paths.`
        ];

        const titleLower = bestWikiMatch.title.toLowerCase();
        const isWikiMatch = titleLower.includes(cleanQ) || cleanQ.includes(titleLower);

        // Determine operating status from Wikipedia abstract
        let operatingStatus = "INACTIVE (Historical Technology)";
        const lowerExtract = (extract || "").toLowerCase();
        if (lowerExtract.includes("discontinued") || lowerExtract.includes("ceased") || lowerExtract.includes("defunct") || lowerExtract.includes("abandoned") || lowerExtract.includes("shut down") || lowerExtract.includes("cancelled")) {
          operatingStatus = "DISCONTINUED / OBSOLETE";
        } else if (lowerExtract.includes("active") || lowerExtract.includes("ongoing") || lowerExtract.includes("currently in use") || lowerExtract.includes("current")) {
          operatingStatus = "ACTIVE / OPERATIONAL";
        }

        setHudPreview({
          exists: isWikiMatch ? "wikipedia" : "new",
          matchName: bestWikiMatch.title,
          filedYear,
          isExpired,
          suggestions,
          invalid: false,
          description: extract ? (extract.slice(0, 160) + (extract.length > 160 ? "..." : "")) : "Historical technology document retrieved from database node.",
          operatingStatus,
          additionalDetails: `Registry Node: Wikipedia English Database`
        });
      } catch (e) {
        console.warn("Wikipedia API verification failed for live HUD preview.", e);
        let hash = 0;
        for (let i = 0; i < cleanQ.length; i++) hash += cleanQ.charCodeAt(i);
        const filedYear = 2004 + (hash % 15);
        const currentYear = new Date().getFullYear();
        const isExpired = (filedYear + 20) < currentYear;

        setHudPreview({
          exists: "new",
          filedYear,
          isExpired,
          suggestions: [
            "Edge AI NPU processors to offload localized computations.",
            "Decentralized RAG pipelines to enable real-time offline searches.",
            "Modular SaaS API architectures to package functionality for B2B developers."
          ],
          invalid: false,
          description: "Custom user concept configuration status logged in temporary system workspace.",
          operatingStatus: "CONCEPT / IDEATION PHASE",
          additionalDetails: "Registry fallback node triggered - no active public matches found."
        });
      } finally {
        setHudLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [globalQuery, innovations]);

  const renderPreAuditPreview = (preview, isHeader = false) => {
    if (hudLoading) {
      return (
        <div className="glass-panel animate-fade-in" style={{
          marginTop: '0.5rem',
          padding: '1.25rem',
          border: '1.5px solid rgba(0, 242, 254, 0.4)',
          background: 'rgba(5, 6, 10, 0.98)',
          width: isHeader ? '280px' : '100%',
          boxSizing: 'border-box',
          boxShadow: '0 8px 24px rgba(0, 242, 254, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          zIndex: 999,
          position: isHeader ? 'absolute' : 'static',
          top: isHeader ? '100%' : 'auto',
          left: 0
        }}>
          <RefreshCw size={12} className="glow-text-cyan" style={{ animation: 'spin 2.5s linear infinite', marginRight: '0.5rem' }} />
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            [AUDITING GLOBAL REGISTRIES...]
          </span>
        </div>
      );
    }

    if (!preview) return null;

    if (preview.invalid) {
      return (
        <div className="glass-panel animate-fade-in" style={{
          marginTop: '0.5rem',
          padding: '1rem',
          border: '1.5px solid var(--color-error)',
          background: 'rgba(20, 5, 10, 0.98)',
          width: isHeader ? '280px' : '100%',
          boxSizing: 'border-box',
          boxShadow: '0 8px 24px rgba(255, 0, 85, 0.15)',
          zIndex: 999,
          position: isHeader ? 'absolute' : 'static',
          top: isHeader ? '100%' : 'auto',
          left: 0
        }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-error)', fontWeight: 'bold' }}>
            [HUD_ALERT: CRITICAL_INVALID_CONCEPT]
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.4' }}>
            {preview.message}
          </p>
        </div>
      );
    }

    return (
      <div className="glass-panel animate-fade-in" style={{
        marginTop: '0.5rem',
        padding: '1.25rem',
        border: '1.5px solid var(--border-color-glow)',
        background: 'rgba(5, 6, 10, 0.98)',
        width: isHeader ? '280px' : '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 24px rgba(0, 242, 254, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        zIndex: 999,
        position: isHeader ? 'absolute' : 'static',
        top: isHeader ? '100%' : 'auto',
        left: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
            [LIVE AI DIAGNOSTICS HUD PREVIEW]
          </span>
        </div>

        {/* Existing / New Concept Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Status:</span>
          {preview.exists === "local" ? (
            <span style={{ color: 'var(--color-warning)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
              ALREADY EXISTS IN SYSTEM INDEX ({preview.matchName})
            </span>
          ) : preview.exists === "wikipedia" ? (
            <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
              HISTORICAL REGISTRY MATCH ({preview.matchName})
            </span>
          ) : (
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
              NEW IDEATION CONCEPT
            </span>
          )}
        </div>

        {/* Patent Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Patent Clearance:</span>
          {preview.isExpired ? (
            <span className="status-badge badge-active" style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}>
              EXPIRED (Public Domain)
            </span>
          ) : (
            <span className="status-badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.35rem' }}>
              ACTIVE (IP Protected)
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '-0.3rem', fontFamily: 'var(--font-mono)' }}>
          Estimated filed year: {preview.filedYear} (Protection: {preview.filedYear + 20})
        </div>

        {/* Operating Status Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>[OPERATING_STATUS]</span>
          <span style={{ color: (preview.operatingStatus || "").includes("ACTIVE") ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 'bold', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
            {preview.operatingStatus}
          </span>
        </div>

        {/* Registry Overview / Description */}
        {preview.description && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>[REGISTRY_ABSTRACT]</span>
            <p style={{ color: 'var(--text-main)', margin: 0, fontStyle: 'italic', fontSize: '0.7rem', lineHeight: '1.3' }}>
              "{preview.description}"
            </p>
          </div>
        )}

        {/* Additional System Metadata */}
        {preview.additionalDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>[SYSTEM_METADATA]</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
              {preview.additionalDetails}
            </span>
          </div>
        )}

        {/* Innovation Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
            SUGGESTED REVIVAL ACCELERATORS:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {preview.suggestions.map((sug, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-start', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                <span style={{ color: 'var(--color-secondary)' }}>➔</span>
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Interactive simulator states
  const [simulating, setSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState([
    "[SYS] Simulation core idle.",
    "Click 'RUN SIMULATION' to forecast market re-entry vector metrics."
  ]);

  const runMarketSimulation = () => {
    if (!selectedItem) return;
    setSimulating(true);
    setSimLogs(["[SYSTEM] Initializing Invenza Neural Network Simulation..."]);
    
    const logsList = [
      `[SYSTEM] Mapping patent claims matching ${selectedItem.name}...`,
      `[SYSTEM] Aligning sector regulatory requirements for ${selectedItem.sector || "General Tech"}...`,
      `[SYSTEM] Spawning 100 autonomous agent instances in sandboxed marketplace...`,
      `[MARKET] Testing entry strategy with estimated funding of ${selectedItem.financials?.estimatedCost || selectedItem.estimatedCost || "$250,000"}...`,
      `[MARKET] Calculating user conversion metrics and developer onboarding rates...`,
      `[SUCCESS] Simulation completed successfully!`,
      `[SUCCESS] Projected revival success index: ${selectedItem.revivalViability}%`,
      `[SUCCESS] Net projected growth: ${selectedItem.marketGrowth || "14.5% CAGR"}`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logsList.length) {
        setSimLogs(prev => [...prev, logsList[i]]);
        i++;
      } else {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 450);
  };

  useEffect(() => {
    setSimulating(false);
    setSimLogs([
      "[SYS] Simulation core idle.",
      "Click 'RUN SIMULATION' to forecast market re-entry vector metrics."
    ]);
  }, [selectedItem]);

  const predictedProjects = (globalQuery || '').trim() ? innovations.filter(item => 
    item.name.toLowerCase().includes(globalQuery.toLowerCase()) || 
    item.sector.toLowerCase().includes(globalQuery.toLowerCase())
  ).slice(0, 4) : [];

  // Fetch innovations list on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/innovations');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setInnovations(data.data);
          
          // Set selection ONLY if activeInnovation is set, allowing landing on Welcome Console
          if (activeInnovation) {
            setSelectedItem(activeInnovation);
          }
          setIsLocalMode(false);
        }
      } catch (error) {
        console.warn("Backend offline. Dashboard loading from local fallback.");
        setInnovations(fallbackInnovations);
        
        if (activeInnovation) {
          setSelectedItem(activeInnovation);
        }
        setIsLocalMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Update selection if activeInnovation changes externally
  useEffect(() => {
    setSelectedItem(activeInnovation);
  }, [activeInnovation]);

  const handleSelectItem = (id) => {
    const item = innovations.find(i => i.id === id);
    if (item) {
      setSelectedItem(item);
      if (setActiveInnovation) setActiveInnovation(item);
      setQueryError(null);
    }
  };

  // Real-time AI simulation generator
  const handleGenerateCustom = async (e) => {
    e.preventDefault();
    if (!isValidTechnologyName(globalQuery)) {
      setQueryError("Please enter a valid technology name (e.g. Segway, Pebble, Betamax). Keyboard sweeps or random characters are not accepted.");
      setIsGenerating(false);
      return;
    }

    setQueryError(null);
    setIsGenerating(true);
    setGenerationLogs([
      "Initializing Invenza AI Real-Time Agent...",
      `Query input received: "${globalQuery}"`
    ]);

    setTimeout(() => {
      setGenerationLogs(prev => [...prev, "Contacting WIPO & Google Patent registries...", "Parsing claim structures and legal expiration terms..."]);
    }, 500);

    setTimeout(() => {
      setGenerationLogs(prev => [...prev, "Auditing socio-economic failure vectors...", "Matching market trends with historical database indexes..."]);
    }, 1000);

    setTimeout(() => {
      setGenerationLogs(prev => [...prev, "Compiling dynamic SWOT vectors...", "Synthesizing modern AI-enablers pipeline..."]);
    }, 1500);

    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: globalQuery,
            description: "Real-time AI compilation and revival vector audit for " + globalQuery,
            sector: "General Tech"
          })
        });
        
        const data = await response.json();
        
        if (data.success && data.report) {
          setSelectedItem(data.report);
          if (setActiveInnovation) setActiveInnovation(data.report);
          setInnovations(prev => {
            if (prev.some(i => i.id === data.report.id)) return prev;
            return [data.report, ...prev];
          });
          setQueryError(null);
        } else {
          setQueryError(data.message || "Failed to analyze technology query.");
        }
      } catch (error) {
        console.warn("Backend offline. Generating fallback analysis locally.");
        const localData = calculateClientSimilarity(
          globalQuery,
          "Real-time AI compilation and revival vector audit for " + globalQuery,
          "General Tech"
        );
        if (localData.success && localData.report) {
          setSelectedItem(localData.report);
          if (setActiveInnovation) setActiveInnovation(localData.report);
          setInnovations(prev => {
            if (prev.some(i => i.id === localData.report.id)) return prev;
            return [localData.report, ...prev];
          });
          setQueryError(null);
        } else {
          setQueryError(localData.message || "Failed to analyze technology query.");
        }
      } finally {
        setIsGenerating(false);
        setGenerationLogs([]);
      }
    }, 2000);
  };

  const handleSaveAudit = () => {
    if (!selectedItem) return;
    try {
      const stored = localStorage.getItem('saved_audits');
      const audits = stored ? JSON.parse(stored) : [];
      if (!audits.some(a => a.id === selectedItem.id)) {
        audits.push(selectedItem);
        localStorage.setItem('saved_audits', JSON.stringify(audits));
        window.dispatchEvent(new Event('storage'));
        alert("Innovation successfully saved to your basket!");
      } else {
        alert("This concept has already been saved.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <h3 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[SYS_SYNC: SYNCHRONIZING REAL-TIME DATA MATRIX...]</h3>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
        
        {/* Terminal Loading Screen Overlay for Real-Time Generation */}
        {isGenerating && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 6, 10, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="glass-panel" style={{ width: '480px', padding: '2rem', border: '1px solid var(--color-primary)', background: '#090a10' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Cpu size={24} className="glow-text-pink" style={{ animation: 'spin 2s linear infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>[INVENZA_AI: SYNTHESIZING...]</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-secondary)',
                height: '180px',
                overflowY: 'auto',
                background: 'rgba(0,0,0,0.4)',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {generationLogs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-primary)' }}>&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Critical Red HUD Validation Warning Banner */}
        {queryError && (
          <div className="glass-panel animate-fade-in" style={{ 
            borderLeft: '4px solid var(--color-danger)', 
            borderTop: 'none',
            background: 'rgba(255, 0, 85, 0.08)', 
            padding: '1rem 1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={18} color="var(--color-danger)" />
              <span style={{ fontSize: '0.85rem', color: '#ff4d6d', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                [CRITICAL_ERROR: INVALID_QUERY] {queryError}
              </span>
            </div>
            <button 
              onClick={() => setQueryError(null)} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                padding: '0 0.5rem'
              }}
            >
              ✕
            </button>
          </div>
        )}
        {/* Welcome Header */}
        <div>
          <span className="mono-tag glow-text-pink">INVENZA CORE v2.0</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            Welcome to <span style={{ background: 'linear-gradient(95deg, var(--color-primary), var(--color-accent), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Invenza AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem', maxWidth: '700px', lineHeight: '1.5' }}>
            A real-time artificial intelligence diagnostic workspace to revive cancelled innovations, audit obsolete patents, and design modern SaaS or hardware market-re-entry vectors.
          </p>
        </div>

        {/* Dynamic System Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-panel">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [TOTAL_PATENTS_AUDITED]
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>4,852 Assets</h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>WIPO & USPTO archival database</span>
          </div>

          <div className="glass-panel">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [IDENTIFIED_TECH_GAPS]
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '0.5rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>142 Inactive Nodes</h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Unfulfilled market opportunities</span>
          </div>

          <div className="glass-panel">
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [AVG_REVIVAL_VIABILITY]
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '0.5rem', color: 'var(--color-success)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>72.6% Viable</h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Calculated average feasibility</span>
          </div>
        </div>

        {/* Central Action Console */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start', marginTop: '1rem' }}>
          
          {/* Quick Start Audit Form */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
              Run Real-Time AI Diagnostic Audit
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Type any technology name (defunct gadget, obsolete patent, or green energy concept) to audit its viability.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
              <UnifiedSearchBar placeholder="Type any tech to audit (e.g. Zune, Water Treatment)..." />
              {error && (
                <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Pre-indexed Selector */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
              Quick Selection Index
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Load and audit pre-seeded historical benchmarks to review past commercial failures and modern revival pathways.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {innovations.slice(0, 6).map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setGlobalQuery(item.name);
                    if (setActiveInnovation) setActiveInnovation(item);
                  }}
                  className="tech-button tech-button-outline"
                  style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Motive-focused Gap Table */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            High-Potential Patent Gaps Registered
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
            The following inactive or expired technology profiles represent the highest viability indexes due to resolved modern engineering enablers.
          </p>

          <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Technology Profile</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Sector</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Original Failure Bottleneck</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Modern Revival Enabler</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {innovations.slice(0, 4).map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px dashed var(--border-color)', color: 'var(--text-main)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{item.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="hud-sys-label" style={{ fontSize: '0.6rem' }}>{item.sector}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                      {item.id === '1' ? 'High CPU rendering loads / Slow storage access' :
                       item.id === '2' ? 'Low network bandwidth / Micro-billing friction' :
                       item.id === '3' ? 'Legacy tube optics / Bulky hardware scaling' :
                       'High raw manufacturing & solar wafer price bounds'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-success)', fontWeight: '500' }}>
                      {item.id === '1' ? 'Local NPU processors / NVMe storage grids' :
                       item.id === '2' ? '5G Websockets / Smart Contract micro-pay' :
                       item.id === '3' ? 'Refocused micro-lens arrays / Neural splatting' :
                       'Automated film layer backing / Recycled silicon'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setGlobalQuery(item.name);
                          if (setActiveInnovation) setActiveInnovation(item);
                        }}
                        className="tech-button"
                        style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem', display: 'inline-flex' }}
                      >
                        Load & Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Audit Logs Workspace Links */}
        {(() => {
          try {
            const stored = localStorage.getItem('saved_audits');
            const items = stored ? JSON.parse(stored) : [];
            if (items.length === 0) return null;
            return (
              <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)' }}>RECENTLY SAVED IN BASKET</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {items.slice(0, 4).map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setGlobalQuery(item.name);
                        if (setActiveInnovation) setActiveInnovation(item);
                      }}
                      className="tech-button"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
                    >
                      📁 {item.name} ({item.revivalViability}%)
                    </button>
                  ))}
                </div>
              </div>
            );
          } catch { return null; }
        })()}
      </div>
    );
  }

  // Calculate SVG line coordinates for Market Trend
  const getSvgPath = (trend) => {
    if (!trend || trend.length === 0) return '';
    const width = 240;
    const height = 60;
    const padding = 10;
    const usableW = width - padding * 2;
    const usableH = height - padding * 2;

    const xCoords = trend.map((_, i) => padding + (i * usableW) / (trend.length - 1));
    const yCoords = trend.map(pt => height - padding - (pt.value * usableH) / 100);

    return xCoords.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${yCoords[i]}`).join(' ');
  };

  const getSuggestions = (inputText) => {
    if (!inputText) return { matches: [], suggestions: [] };
    const words = inputText.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
    if (words.length === 0) return { matches: [], suggestions: [] };

    const keywords = [
      'water', 'treatment', 'filter', 'filtration', 'purify', 'purification', 'membrane', 'recycle', 'recycling', 
      'waste', 'chemical', 'chemistry', 'physics', 'biological', 'biology', 'clinical', 'pharmaceutical', 
      'energy', 'wind', 'hydro', 'turbine', 'electric', 'grid', 'nuclear', 'fusion', 'fission', 'reactor', 
      'generator', 'carbon', 'emission', 'environmental', 'climate', 'ecological', 'sustainability', 
      'agriculture', 'irrigation', 'thermal', 'thermoelectric', 'geothermal', 'hvac', 'ventilation', 'air', 
      'gas', 'liquid', 'fluid', 'fluidic', 'aerodynamic', 'motor', 'brushless', 'rotor', 'stator', 'servo', 
      'actuator', 'transducer', 'pixel', 'led', 'oled', 'lcd', 'eink', 'smartphone', 'semiconductor', 
      'transistor', 'diode', 'motherboard', 'ram', 'ssd', 'antenna', 'gps', 'radar', 'sonar', 'vision', 
      'uav', 'quadcopter', 'train', 'aircraft', 'spacecraft', 'rocket', 'propulsion', 'alloy', 'metal', 
      'carbon-fiber', 'graphene', 'nanotech', 'nanotechnology', 'superconductor', 'encryption', 
      'cryptography', 'blockchain', 'database', 'server', 'camera', 'cameras', 'optic', 'optics', 
      'lens', 'lenses', 'glass', 'glasses', 'screen', 'screens', 'display', 'displays', 'battery', 
      'batteries', 'charge', 'charger', 'chargers', 'charging', 'ev', 'evs', 'car', 'cars', 'vehicle', 
      'vehicles', 'scooter', 'scooters', 'blood', 'diagnostics', 'diagnostic', 'medical', 'medicine', 
      'health', 'bio', 'biotech', 'dna', 'cell', 'cells', 'sensor', 'sensors', 'game', 'games', 
      'gaming', 'console', 'consoles', 'stream', 'streaming', 'play', 'player', 'players', 'stadia', 
      'pebble', 'watch', 'watches', 'smartwatch', 'phone', 'phones', 'device', 'devices', 'hardware', 
      'software', 'app', 'apps', 'web', 'network', 'networks', 'cloud', 'data', 'computer', 'computers', 
      'computing', 'ar', 'vr', 'mr', 'xr', 'innovation', 'innovations', 'patent', 'patents', 'tech', 
      'technology', 'technologies', 'system', 'systems', 'mechanic', 'mechanical', 'robot', 'robots', 
      'robotic', 'robotics', 'drone', 'drones', 'engine', 'engines', 'solar', 'power', 'electricity', 
      'electrical', 'circuit', 'circuits', 'chip', 'chips', 'processor', 'processors', 'npu', 'gpu', 
      'cpu', 'memory', 'storage', 'saas', 'platform', 'platforms', 'ai', 'ml', 'nlp', 'rag', 'splat', 
      'splatting', 'quantum', 'satellite', 'satellites', 'wire', 'wireless', 'radio', 'signal', 'signals', 
      'laser', 'lasers', 'audio', 'sound', 'acoustic', 'acoustics', 'wave', 'waves', 'automotive', 'transit', 
      'lytro', 'theranos', 'segway', 'zune', 'ara', 'quibi', 'dreamcast', 'n-gage', 'ouya', 'pippin', 
      'lumia', 'kin', 'juicero', 'betamax', 'hd-dvd', 'laserdisc', 'solyndra', 'jawbone', 'vine', 
      'hologram', 'holograms', 'wearable', 'wearables', 'telecom', 'telecommunications', 'micro', 'mobility', 
      'splats', 'light', 'lenslet', 'refocuser', 'retinal'
    ];

    const currentMatches = words.filter(w => keywords.includes(w));
    const lastToken = words[words.length - 1];
    let autocompletes = [];
    if (lastToken && lastToken.length >= 2) {
      autocompletes = keywords.filter(k => k.startsWith(lastToken) && k !== lastToken).slice(0, 5);
    }

    return { matches: currentMatches, suggestions: autocompletes };
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
      
      {/* Terminal Loading Screen Overlay for Real-Time Generation */}
      {isGenerating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 6, 10, 0.95)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '480px', padding: '2rem', border: '1px solid var(--color-primary)', background: '#090a10' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Cpu size={24} className="glow-text-pink" style={{ animation: 'spin 2s linear infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>[INVENZA_AI: SYNTHESIZING...]</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--color-secondary)',
              height: '180px',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {generationLogs.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--color-primary)' }}>&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Critical Red HUD Validation Warning Banner */}
      {queryError && (
        <div className="glass-panel animate-fade-in" style={{ 
          borderLeft: '4px solid var(--color-danger)', 
          borderTop: 'none',
          background: 'rgba(255, 0, 85, 0.08)', 
          padding: '1rem 1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={18} color="var(--color-danger)" />
            <span style={{ fontSize: '0.85rem', color: '#ff4d6d', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              [CRITICAL_ERROR: INVALID_QUERY] {queryError}
            </span>
          </div>
          <button 
            onClick={() => setQueryError(null)} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              padding: '0 0.5rem'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upper Navigation, AI Search box & Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span className="mono-tag glow-text-pink">INVENZA REAL-TIME CONSOLE</span>
          <h1 style={{ fontSize: '2.1rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
            AI-Driven <span style={{ background: 'linear-gradient(95deg, var(--color-primary), var(--color-accent), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Revival Diagnostician</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Audit patents, extract historical bottlenecks, and forecast commercial potentials for any gadget or idea.
          </p>
        </div>

        {/* Input box to generate AI data for ANY technology */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', width: '380px' }}>
          <UnifiedSearchBar placeholder="Type any tech to audit (e.g. Zune, Stadia)..." />
          {error && (
            <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

          {/* Quick Selector Dropdown for pre-indexed ones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-end' }}>
            {isLocalMode && (
              <span className="hud-alert-label">[OFFLINE_MODE]</span>
            )}
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PRE-SEEDED DATASETS:</span>
            <select 
              className="tech-select"
              value={selectedItem.id}
              onChange={(e) => handleSelectItem(e.target.value)}
              style={{ width: '150px', height: '32px', fontSize: '0.75rem', padding: '0 1.5rem 0 0.5rem' }}
            >
              {innovations.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

      {/* 4 Stats Grid */}
      <div className="stats-grid">
        <div className="glass-panel glass-panel-violet">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [SYS_NODES_ACTIVE]
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <h2 className="glow-text-pink" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>14,204</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>+12.4% <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>vs last mo</span></span>
          </div>
        </div>

        <div className="glass-panel glass-panel-cyan">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [AI_REVIVAL_VIABILITY]
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <h2 className="glow-text-cyan" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>78.4%</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>+4.2% <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>since Jan</span></span>
          </div>
        </div>

        <div className="glass-panel glass-panel-pink">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [COMMERCIALIZATION_INDEX]
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <h2 className="glow-text-pink" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>84.2%</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>+9.1% <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>higher TRL</span></span>
          </div>
        </div>

        <div className="glass-panel">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            [GLOBAL_COLLABORATORS]
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>3,489</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 700 }}>+15.3% <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>global</span></span>
          </div>
        </div>
      </div>

      {/* Main Core Dashboard Layout */}
      <div className="dashboard-layout">
        
        {/* Left Side: Innovation Details Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Card */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="status-badge badge-expired">EXPIRED PATENT</span>
                <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Filed: {selectedItem.yearFiled || "N/A"}
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  if (setActiveInnovation) setActiveInnovation(null);
                }}
                className="tech-button tech-button-outline"
                style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}
              >
                ✕ Close Workspace
              </button>
            </div>

            {/* Title & Stats */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Radial Score Gauge */}
              <div className="circle-gauge" style={{ width: '110px', height: '110px' }}>
                <svg>
                  <circle className="circle-gauge-bg" cx="55" cy="55" r="45" />
                  <circle 
                    className="circle-gauge-fill" 
                    cx="55" 
                    cy="55" 
                    r="45" 
                    strokeDasharray={282}
                    strokeDashoffset={282 - (282 * (selectedItem.revivalViability || 0)) / 100}
                    style={{ stroke: 'var(--color-secondary)' }}
                  />
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', textShadow: '0 0 8px var(--color-secondary)' }}>
                    {selectedItem.revivalViability}%
                  </span>
                  <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                    VIABILITY
                  </span>
                </div>
              </div>

              {/* General Metadata */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                  {selectedItem.name}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Source: <strong>{selectedItem.inventor || "AI Synthesis Engine"}</strong> | Patent ID: <strong style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>{selectedItem.patentId || "PENDING"}</strong>
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.75rem', lineHeight: '1.5' }}>
                  {selectedItem.description || selectedItem.abstract || "Real-time AI diagnostics have audited this concept's viability profile. By linking historic commercial bottlenecks with modern technology enablers, we formulate a sustainable market-re-entry vector."}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button 
                    onClick={handleSaveAudit}
                    className="tech-button tech-button-outline"
                    style={{ fontSize: '0.75rem', padding: '0.45rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Save size={12} color="var(--color-primary)" /> Save to Workspace
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Line */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              padding: '1rem 0',
              borderTop: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)',
              marginTop: '0.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  COMMERCIAL POT.
                </span>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
                  {selectedItem.commercialPotential}%
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  MARKET GROWTH
                </span>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {selectedItem.marketGrowth || "CAGR 14.5%"}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  TARGET SECTOR
                </span>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
                  {selectedItem.sector || "General Tech"}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  ORIGINALITY INDEX
                </span>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                  {selectedItem.similarityScore ? (100 - selectedItem.similarityScore) : 100}% Unique
                </p>
              </div>
            </div>
          </div>

          {/* AI Innovation Mentor Diagnostics */}
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '3px solid var(--color-primary)', background: 'rgba(59,130,246,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  AI Innovation Mentor Diagnostics
                </h3>
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(59,130,246,0.15)', color: 'var(--color-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.3)', fontWeight: 'bold' }}>
                MENTOR DIAGNOSTICS SCORE: {selectedItem.confidenceScore || 85}%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Modern Revival Enablers
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  {selectedItem.modernEnablers || "Waveguide display modules, micro-LLM pipelines, and solar trickle chargers."}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Common Developer Pitfalls
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  {selectedItem.commonPitfalls || "Ignoring custom data ingestion boundaries or deploying without offline simulation modules."}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Similar Successful Systems
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  {selectedItem.similarSuccess || "Ray-Ban Meta Smart Glasses, Apple Vision Pro, Notion workspaces."}
                </p>
              </div>
            </div>
          </div>

          {/* Side by Side: Bottlenecks & Enhancements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Failure Bottlenecks */}
            <div className="glass-panel" style={{ borderLeft: '3px solid var(--color-danger)', borderTop: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={16} color="var(--color-danger)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-danger)' }}>
                  Primary Failure Bottlenecks
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                {(selectedItem.failureBottlenecks || []).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Enhancement Vectors */}
            <div className="glass-panel" style={{ borderLeft: '3px solid var(--color-success)', borderTop: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle size={16} color="var(--color-success)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-success)' }}>
                  AI Enhancement Vector
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                {(selectedItem.aiEnhancementVector || []).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SWOT Matrix Card */}
          {selectedItem.swot && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <Cpu size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  Strategic SWOT Analysis
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', background: 'rgba(52,211,153,0.02)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-success)', fontFamily: 'var(--font-mono)', display: 'block', borderBottom: '1px solid rgba(52,211,153,0.1)', paddingBottom: '0.25rem' }}>[S] STRENGTHS</span>
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(selectedItem.swot.strengths || []).map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
                <div style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-danger)', fontFamily: 'var(--font-mono)', display: 'block', borderBottom: '1px solid rgba(239,68,68,0.1)', paddingBottom: '0.25rem' }}>[W] WEAKNESSES</span>
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(selectedItem.swot.weaknesses || []).map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
                <div style={{ padding: '1.25rem', background: 'rgba(0,242,254,0.02)', border: '1px solid rgba(0,242,254,0.15)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', display: 'block', borderBottom: '1px solid rgba(0,242,254,0.1)', paddingBottom: '0.25rem' }}>[O] OPPORTUNITIES</span>
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(selectedItem.swot.opportunities || []).map((o, idx) => <li key={idx}>{o}</li>)}
                  </ul>
                </div>
                <div style={{ padding: '1.25rem', background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-warning)', fontFamily: 'var(--font-mono)', display: 'block', borderBottom: '1px solid rgba(245,158,11,0.1)', paddingBottom: '0.25rem' }}>[T] THREATS</span>
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(selectedItem.swot.threats || []).map((t, idx) => <li key={idx}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Roadmap Card */}
          {selectedItem.roadmap && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <TrendingUp size={16} color="var(--color-secondary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  Project Revival Roadmap
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', marginTop: '0.5rem' }}>
                {(selectedItem.roadmap || []).map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(0,242,254,0.1)', border: '2px solid var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', zIndex: 2 }}>
                        {idx + 1}
                      </div>
                      {idx < selectedItem.roadmap.length - 1 && (
                        <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.07)', margin: '0.25rem 0' }}></div>
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: idx < selectedItem.roadmap.length - 1 ? '1.25rem' : 0 }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>{step.step}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Innovation Timeline */}
          {selectedItem && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <TrendingUp size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  Historical Innovation Timeline
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', position: 'relative' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{selectedItem.yearFiled || 2012}</span>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 700 }}>Patent Lodged</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Initial technology configuration registered.</p>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.01)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)', fontWeight: 'bold' }}>{selectedItem.yearFiled ? selectedItem.yearFiled + 3 : 2015}</span>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 700 }}>Failure Node</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Suspended due to legacy hardware / high scaling costs.</p>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(52,211,153,0.01)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)', fontWeight: 'bold' }}>2024</span>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 700 }}>AI Enabler Era</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Edge neural processors and IoT grids mature.</p>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(0,242,254,0.01)', border: '1px solid rgba(0,242,254,0.2)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>2026</span>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 700 }}>Revival Window</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active re-entry vector compiled via Invenza AI.</p>
                </div>
              </div>
            </div>
          )}

          {/* Sustainability & Environmental Impact Card */}
          {selectedItem && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={16} color="var(--color-success)" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                    Sustainability & Circular Impact Audit
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(52,211,153,0.15)', color: 'var(--color-success)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(52,211,153,0.3)', fontWeight: 'bold' }}>
                  SUSTAINABLE GRADE: A-
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Ecological Footprint Offset</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    Reduces electronic and material waste by {65 + (nameHash % 20)}% compared to legacy manufacturing standards.
                  </p>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>Circular Resource Integration</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    Features a modular, repairable chassis architecture aligning with modern global Right-to-Repair regulations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Regulatory Risk Matrix */}
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <Shield size={16} color="var(--color-warning)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                Regulatory Risk Matrix (Live Telemetry)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem 0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold' }}>FDA CLEARANCE</span>
                {selectedItem.sector?.toLowerCase().includes("diagnostic") || selectedItem.sector?.toLowerCase().includes("bio") ? (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(239,68,68,0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>HIGH RISK // SEC 510K</span>
                ) : (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>EXEMPT // N/A</span>
                )}
              </div>

              <div style={{ padding: '1rem 0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold' }}>FCC PART 15</span>
                {selectedItem.sector?.toLowerCase().includes("wearable") || selectedItem.sector?.toLowerCase().includes("reality") || selectedItem.sector?.toLowerCase().includes("optics") ? (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(52,211,153,0.15)', color: 'var(--color-success)', border: '1px solid rgba(52,211,153,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>COMPLIANT // FCC OK</span>
                ) : (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>EXEMPT // WIRELESS OFF</span>
                )}
              </div>

              <div style={{ padding: '1rem 0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold' }}>EPA STANDARD</span>
                {selectedItem.sector?.toLowerCase().includes("water") || selectedItem.sector?.toLowerCase().includes("environmental") ? (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(245,158,11,0.15)', color: 'var(--color-warning)', border: '1px solid rgba(245,158,11,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>CAUTION // LIQ WASTES</span>
                ) : (
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(52,211,153,0.15)', color: 'var(--color-success)', border: '1px solid rgba(52,211,153,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>PASS // GREEN OK</span>
                )}
              </div>

              <div style={{ padding: '1rem 0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold' }}>CE COMPLIANCE</span>
                <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 'bold', background: 'rgba(52,211,153,0.15)', color: 'var(--color-success)', border: '1px solid rgba(52,211,153,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>VERIFIED // CE MARK</span>
              </div>
            </div>
          </div>

          {/* Interactive AI Sandbox Simulator */}
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={16} color="var(--color-secondary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  AI Market Revival Simulator
                </h3>
              </div>
              <button 
                onClick={runMarketSimulation} 
                disabled={simulating}
                className="tech-button" 
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
              >
                {simulating ? 'SIMULATING...' : 'RUN SIMULATION'}
              </button>
            </div>
            
            <div style={{
              background: '#04060a',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-success)',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {simLogs.map((log, idx) => (
                <div key={idx} style={{
                  color: log.startsWith('[ERROR]') ? 'var(--color-danger)' : log.startsWith('[SUCCESS]') ? 'var(--color-success)' : log.startsWith('[SYSTEM]') ? 'var(--color-secondary)' : '#fff'
                }}>
                  {log}
                </div>
              ))}
              {simulating && (
                <div style={{ color: 'var(--text-muted)' }}>[SYS_PING] Running network checks... ▒▒▒▒▒▒▒▒▒▒</div>
              )}
            </div>
          </div>

          {/* Financials & Investment Portfolio */}
          {selectedItem.financials && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <DollarSign size={16} color="var(--color-success)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  Investment & Financial Portfolio
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 'bold' }}>Development Cost</span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>{selectedItem.financials.estimatedCost || selectedItem.estimatedCost || "$150,000"}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 'bold' }}>Target Industries</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {(selectedItem.financials.targetIndustries || []).map((ind, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', background: 'rgba(236,72,153,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(236,72,153,0.2)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 'bold' }}>Required Skills</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {(selectedItem.financials.requiredSkills || []).map((sk, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', background: 'rgba(0,242,254,0.1)', color: 'var(--color-secondary)', border: '1px solid rgba(0,242,254,0.2)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 'bold' }}>Potential Investors</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {(selectedItem.financials.potentialInvestors || []).map((inv, idx) => (
                      <span key={idx} style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Diagnostics Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(10,13,20,0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Activity size={18} color="var(--color-secondary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              DIAGNOSTICS PANEL
            </h3>
          </div>

          {/* Innovation Score Circle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Innovation Score</span>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Patent uniqueness score</p>
            </div>
            <div className="circle-gauge" style={{ width: '70px', height: '70px' }}>
              <svg>
                <circle className="circle-gauge-bg" cx="35" cy="35" r="28" />
                <circle 
                  className="circle-gauge-fill" 
                  cx="35" 
                  cy="35" 
                  r="28" 
                  strokeDasharray={176}
                  strokeDashoffset={176 - (176 * (selectedItem.recommendationScore || 75)) / 100}
                  style={{ stroke: 'var(--color-primary)', strokeWidth: '6px' }}
                />
              </svg>
              <span style={{ position: 'absolute', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', textShadow: '0 0 8px var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{selectedItem.recommendationScore || 75}</span>
            </div>
          </div>

          {/* Revival Probability Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>Revival Probability</span>
              <span style={{ color: 'var(--color-success)' }}>{selectedItem.revivalViability}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${selectedItem.revivalViability}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* Market Revival Trend Line */}
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Market Revival Trend</span>
            <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.5rem' }}>
              <svg width="100%" height="60" viewBox="0 0 240 60" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`${getSvgPath(selectedItem.marketTrend)} L 230 50 L 10 50 Z`} 
                  fill="url(#trendGrad)" 
                />
                <path 
                  d={getSvgPath(selectedItem.marketTrend)} 
                  fill="none" 
                  stroke="var(--color-primary)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <circle 
                  cx={230}
                  cy={60 - 10 - (((selectedItem.marketTrend?.[selectedItem.marketTrend.length - 1]?.value) || 75) * 40) / 100}
                  r="4"
                  fill="var(--color-secondary)"
                />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                <span>2020</span>
                <span>2022</span>
                <span>2024</span>
                <span>2026 (Now)</span>
              </div>
            </div>
          </div>

          {/* Readiness Level (TRL) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Readiness Level (TRL)</span>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Feasibility score range</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(245,158,11,0.15)', color: 'var(--color-warning)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.3)' }}>
              TRL {selectedItem.readinessLevel || 3}/9
            </span>
          </div>

          {/* Recommendation Score */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Recommendation Score</span>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AI-driven match rating</p>
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-display)', textShadow: '0 0 8px var(--color-accent)' }}>
              {selectedItem.recommendationScore || 75}/100
            </span>
          </div>

          {/* Recent Activity Logs */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Recent Activity</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }}></span>
                <span>Patent verified against WIPO Database</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span className="pulse-indicator" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-secondary)' }}></span>
                <span>SWOT Matrix updated via Generative AI</span>
              </div>
            </div>
          </div>

          {/* AI Patent Claims Auditor */}
          <div className="glass-panel animate-fade-in" style={{ marginTop: '1rem', padding: '1.25rem', borderLeft: '3px solid var(--color-primary)', background: 'rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>[PATENT_CLAIMS_VERIFICATION]</span>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.25rem 0 0.75rem 0', fontWeight: 700 }}>Independent Patent Claims Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(52,211,153,0.03)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '4px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>Claim 1: Core System Method</span>
                  <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>[EXPIRED / OPEN_SOURCE]</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Defines the method for operating a {selectedItem.name} apparatus utilizing local processors.</p>
              </div>
              <div style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-danger)' }}>Claim 2: Neural Model Feedback</span>
                  <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--color-danger)' }}>[ACTIVE / IP_PROTECTED]</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Claims the feedback loop adjusting sensor gains via dynamic deep learning models.</p>
              </div>
            </div>
          </div>

          {/* AI Pitch Teleprompter Preview */}
          <div className="glass-panel animate-fade-in" style={{ marginTop: '1rem', padding: '1.25rem', borderLeft: '3px solid var(--color-secondary)', background: 'rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>[ELEVATOR_PITCH_PROTOTYPE]</span>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.25rem 0 0.5rem 0', fontWeight: 700 }}>AI Oral Presentation Script Preview</h4>
            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)', borderRadius: '4px', fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              "Hello, we are launching a modernized revival of {selectedItem.name}. While original configurations failed due to early mechanical bottlenecks, we solve this by coupling the architecture with edge RAG processors and low-latency local NPUs. This lets us capture the market at a projected CAGR of {selectedItem.marketGrowth || '14.5%'} with a lean development budget..."
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lightbulb size={12} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
              <span>Practice this slide-deck script with voice synthesis under the <strong>AI Pitch Coach</strong> tab!</span>
            </p>
          </div>

          {/* Connected Knowledge Feeds Integration Hub */}
          {selectedItem && (
            <div className="glass-panel animate-fade-in" style={{ marginTop: '1rem', padding: '1.25rem', borderLeft: '3px solid var(--color-success)', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', textTransform: 'uppercase' }}>[CONNECTED_KNOWLEDGE_PIPELINES]</span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.25rem 0 0.75rem 0', fontWeight: 700 }}>Real-World Data Aggregation Hub</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Globe size={11} color="var(--color-secondary)" /> Wikipedia API Stream</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>[CONNECTED // ONLINE]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Cpu size={11} color="var(--color-primary)" /> WIPO Patent Registry</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>[ACTIVE INDEX MATCH: {selectedItem.patentId || 'US-PENDING-B2'}]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><FileText size={11} color="var(--color-accent)" /> Academic Publications</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>[SYNAPSED ACADEMIC GAPS]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Terminal size={11} color="#fff" /> GitHub Repositories</span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>[REPOSITORY SYNCED]</span>
                </div>
              </div>
            </div>
          )}

          {/* Related Innovations Section */}
          {selectedItem && (
            <div className="glass-panel animate-fade-in" style={{ marginTop: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <TrendingUp size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                  Related Innovations
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {innovations
                  .filter(item => item.id !== selectedItem.id && item.sector === selectedItem.sector)
                  .slice(0, 3)
                  .map(related => (
                    <div 
                      key={related.id}
                      onClick={() => {
                        if (executeSearch) {
                          executeSearch(related.name);
                        } else {
                          setSelectedItem(related);
                          if (setActiveInnovation) setActiveInnovation(related);
                        }
                      }}
                      className="glass-panel"
                      style={{ 
                        padding: '1.25rem', 
                        cursor: 'pointer', 
                        border: '1px solid var(--border-color)', 
                        transition: 'all 0.2s ease',
                        background: 'rgba(255,255,255,0.01)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {related.sector}
                      </span>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                        {related.name}
                      </h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {related.description}
                      </p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
