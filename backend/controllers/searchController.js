import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadInnovationsFromDB } from '../utils/dbFetcher.js';
import { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/database.json');

// Helper to load database
const loadDatabase = () => {
  try {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { innovations: [] };
  }
};

const isValidSearchQuery = (clean) => {
  if (!clean) return false;
  
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

export const getInnovations = async (req, res) => {
  const { query, sector } = req.query;
  const db = await loadInnovationsFromDB();
  let results = db.innovations || [];

  if (query) {
    const searchTerms = query.toLowerCase();
    results = results.filter(item => 
      (item.name || "").toLowerCase().includes(searchTerms) ||
      (item.inventor || "").toLowerCase().includes(searchTerms) ||
      (item.sector || "").toLowerCase().includes(searchTerms) ||
      (item.failureBottlenecks || []).some(b => (b || "").toLowerCase().includes(searchTerms))
    );
  }

  if (sector && sector !== 'All') {
    results = results.filter(item => (item.sector || "").toLowerCase() === sector.toLowerCase());
  }

  res.json({ success: true, count: results.length, data: results });
};

export const getInnovationById = async (req, res) => {
  const { id } = req.params;
  const db = await loadInnovationsFromDB();
  const innovation = (db.innovations || []).find(item => item.id === id);

  if (!innovation) {
    return res.status(404).json({ success: false, message: 'Innovation not found' });
  }

  res.json({ success: true, data: innovation });
};

export const searchPatents = async (req, res) => {
  const { query } = req.query;
  const db = await loadInnovationsFromDB();
  const innovations = db.innovations || [];
  const dbPatents = db.patents || [];

  // Build basic list from local innovations
  let patentsFromInnovations = innovations.map(item => ({
    id: item.patentId || "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
    title: `${item.name} Patent Model`,
    innovationId: item.id,
    inventor: item.inventor || "Unknown Inventor",
    filedYear: item.yearFiled || 2012,
    expiryYear: (item.yearFiled || 2012) + 20,
    status: (item.yearFiled || 2012) + 20 < new Date().getFullYear() ? "Expired (Public Domain)" : "Active (Licensing Req.)",
    classifications: item.sector || "General Tech",
    claims: [
      `A computational apparatus implementing the structural elements of ${item.name}.`,
      "A primary communication bus routing telemetry signals across hardware nodes.",
      "A software interface loop adjusting processing coordinates in real-time."
    ],
    description: item.description || `Core patent documenting the structural layout and circuit logic of ${item.name}.`
  }));

  // Combine innovations-mapped patents and actual db patents
  let patents = [...patentsFromInnovations, ...dbPatents];

  // If a query is provided, filter the list.
  if (query && query.trim()) {
    const searchTerms = query.toLowerCase().trim();
    if (!isValidSearchQuery(searchTerms)) {
      return res.json({ success: true, count: 0, data: [] });
    }
    
    // Check if query is blocked as a personal name
    const personalNames = [
      'arjun', 'sharma', 'amit', 'vijay', 'john', 'smith', 'brown', 'davis',
      'kumar', 'singh', 'patel', 'gupta', 'mehta', 'shroff'
    ];
    const words = searchTerms.split(/\s+/);
    const isPersonalName = words.length > 0 && words.every(w => personalNames.includes(w));
    if (isPersonalName) {
      return res.json({ success: true, count: 0, data: [] });
    }

    // Filter local list first
    let filtered = patents.filter(pat => 
      (pat.id && pat.id.toLowerCase().includes(searchTerms)) ||
      (pat.title && pat.title.toLowerCase().includes(searchTerms)) ||
      (pat.inventor && pat.inventor.toLowerCase().includes(searchTerms)) ||
      (pat.classifications && 
        (Array.isArray(pat.classifications) 
          ? pat.classifications.some(c => c.toLowerCase().includes(searchTerms))
          : pat.classifications.toLowerCase().includes(searchTerms)))
    );

    if (filtered.length > 0) {
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    // If not found locally, fetch from Cerebras API
    try {
      const cerebrasData = await fetchCerebrasSearch(query);
      if (cerebrasData) {
        const newPatent = {
          id: "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
          title: cerebrasData.title || `${query} Patent`,
          inventor: cerebrasData.inventor || "Unknown",
          filedYear: cerebrasData.year || 2023,
          expiryYear: (cerebrasData.year || 2023) + 20,
          status: "Active",
          classifications: cerebrasData.classifications || "General Tech",
          claims: cerebrasData.claims || ["A computational apparatus.", "A software interface.", "A hardware component."],
          description: cerebrasData.description || "Detailed analysis generated by AI."
        };
        
        // Seed the new patent back to the database
        try {
          db.patents = db.patents || [];
          db.patents.push(newPatent);
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        } catch (dbErr) {
          console.error("Failed to seed new patent to database:", dbErr);
        }

        return res.json({ success: true, count: 1, data: [newPatent] });
      }
    } catch (e) {
      console.warn("Cerebras API lookup failed for patent search, using local fallback.", e);
    }
    
    // If we had a query and it yielded no matches locally or on Cerebras, return empty!
    return res.json({ success: true, count: 0, data: [] });
  }

  res.json({ success: true, count: patents.length, data: patents });
};

const suggestionsCache = new Map();

export const getSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ success: true, suggestions: [] });
  }

  const cleanQuery = q.toLowerCase().trim();

  // 1. Check Cache
  if (suggestionsCache.has(cleanQuery)) {
    return res.json({ success: true, suggestions: suggestionsCache.get(cleanQuery) });
  }

  // 2. Reject gibberish or spam or names
  const personalNames = [
    'arjun', 'sharma', 'amit', 'vijay', 'john', 'smith', 'brown', 'davis',
    'kumar', 'singh', 'patel', 'sharma', 'gupta', 'mehta', 'shroff', 'praveen', 'sandeep',
    'rahul', 'deepak', 'rohit', 'sanjay', 'anil', 'sunil', 'neha', 'pooja', 'sneha', 'john', 'smith'
  ];
  const words = cleanQuery.split(/\s+/);
  const isPersonalName = words.length > 0 && words.every(w => personalNames.includes(w));
  if (isPersonalName || !isValidSearchQuery(cleanQuery)) {
    suggestionsCache.set(cleanQuery, []);
    return res.json({ success: true, suggestions: [] });
  }

  const db = await loadInnovationsFromDB();
  const innovations = db.innovations || [];
  
  // Find local database matches
  const localMatches = innovations
    .filter(item => (item.name || "").toLowerCase().includes(cleanQuery))
    .map(item => ({ name: item.name, id: item.id, source: 'local' }));

  // Query Wikipedia for external matches
  let wikiMatches = [];
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(q)}&utf8=1&srlimit=5`;
    const response = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)' }
    });
    const searchData = await response.json();
    const searchResults = searchData?.query?.search || [];

    for (let match of searchResults) {
      const title = match.title;
      // Skip matches that already exist in local database
      if (localMatches.some(lm => lm.name.toLowerCase() === title.toLowerCase())) {
        continue;
      }

      // Check if it's a biography/person page
      const bioKeywords = ["born ", "was born", "personal life", "cricketer", "actor", "politician", "singer", "actress", "biography", "professor", "physicist", "chemist", "engineer", "mathematician", "writer"];
      const snippet = (match.snippet || "").toLowerCase();
      if (bioKeywords.some(kw => snippet.includes(kw))) {
        continue;
      }

      // Do a quick detail check for bio keywords or if it's a list page/unrelated
      const pageTitleLower = title.toLowerCase();
      if (personalNames.some(pn => pageTitleLower.includes(pn))) {
        continue;
      }

      wikiMatches.push({ name: title, id: title.replace(/\s+/g, '-').toLowerCase(), source: 'wiki' });
    }
  } catch (err) {
    console.warn("Wikipedia API suggestion fetch offline or failed.");
  }

  // Combine and deduplicate
  const allSuggestions = [...localMatches, ...wikiMatches];
  
  // Cache and return
  suggestionsCache.set(cleanQuery, allSuggestions);
  res.json({ success: true, suggestions: allSuggestions });
};

