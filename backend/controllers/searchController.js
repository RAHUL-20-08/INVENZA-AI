import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export const getInnovations = (req, res) => {
  const { query, sector } = req.query;
  const db = loadDatabase();
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

export const getInnovationById = (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  const innovation = (db.innovations || []).find(item => item.id === id);

  if (!innovation) {
    return res.status(404).json({ success: false, message: 'Innovation not found' });
  }

  res.json({ success: true, data: innovation });
};

export const searchPatents = async (req, res) => {
  const { query } = req.query;
  const db = loadDatabase();
  const innovations = db.innovations || [];

  // Build basic list from local innovations
  let patents = innovations.map(item => ({
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

  // If a query is provided, filter the list.
  if (query && query.trim()) {
    const searchTerms = query.toLowerCase().trim();
    if (!isValidSearchQuery(searchTerms)) {
      return res.json({ success: true, count: 0, data: [] });
    }
    
    // Check if query is blocked as a personal name
    const personalNames = [
      'arjun', 'sharma', 'amit', 'vijay', 'john', 'smith', 'brown', 'davis',
      'kumar', 'singh', 'patel', 'sharma', 'gupta', 'mehta', 'shroff'
    ];
    const words = searchTerms.split(/\s+/);
    const isPersonalName = words.length > 0 && words.every(w => personalNames.includes(w));
    if (isPersonalName) {
      return res.json({ success: true, count: 0, data: [] });
    }

    // Filter local list first
    let filtered = patents.filter(pat => 
      pat.id.toLowerCase().includes(searchTerms) ||
      pat.title.toLowerCase().includes(searchTerms) ||
      pat.inventor.toLowerCase().includes(searchTerms) ||
      pat.classifications.toLowerCase().includes(searchTerms)
    );

    if (filtered.length > 0) {
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    // If not found locally, fetch from Wikipedia API
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&utf8=1`;
      const response = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)' }
      });
      const searchData = await response.json();
      
      if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
        const bestMatch = searchData.query.search[0];
        
        // Fetch detailed page abstract
        const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original&titles=${encodeURIComponent(bestMatch.title)}`;
        const detailRes = await fetch(detailUrl, {
          headers: { 'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)' }
        });
        const detailData = await detailRes.json();
        
        const pages = detailData.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pageId !== "-1" ? pages[pageId].extract : "";
        
        // Reject biography queries
        const bioKeywords = ["born ", "was born", "personal life", "cricketer", "actor", "politician", "singer", "actress"];
        if (extract && bioKeywords.some(kw => extract.toLowerCase().includes(kw))) {
          return res.json({ success: true, count: 0, data: [] });
        }

        // Extrapolate inventor and year
        let inventor = "Global Research & Innovation Lab";
        let yearFiled = 2014;
        
        const yearMatches = extract.match(/\b(19\d{2}|20\d{2})\b/);
        if (yearMatches) {
          yearFiled = parseInt(yearMatches[0], 10);
        }

        // Determine custom patent classifications and claims dynamically
        let classifications = "Information System / Tech";
        let claims = [
          `A method for operating a ${bestMatch.title} device utilizing cloud API modules.`,
          "A transmission channel routing data packets dynamically to feedback devices.",
          "An array layout mapping sensor outputs to coordinate structures."
        ];

        const s = bestMatch.title.toLowerCase();
        if (s.includes("health") || s.includes("medical") || s.includes("blood") || s.includes("theranos") || s.includes("bio") || s.includes("diagnostic")) {
          classifications = "Biomedical / Diagnostics";
          claims = [
            `A microfluidic test cartridge layout for ${bestMatch.title} routing liquid samples.`,
            "A spectrophotometer sensor array verifying chemical agent reaction rates.",
            "A software calibration array adjusting fluorescence lookup values dynamically."
          ];
        } else if (s.includes("glass") || s.includes("ar") || s.includes("vr") || s.includes("camera") || s.includes("optics") || s.includes("lens") || s.includes("waveguide") || s.includes("display")) {
          classifications = "Waveguide Optics / Displays";
          claims = [
            `A diffractive waveguide prism array directing color light streams for ${bestMatch.title}.`,
            "A microLED light projection system adjusting brightness matching ambient levels.",
            "An eye tracking sensor loop mapping user focal coordinates to display buffers."
          ];
        } else if (s.includes("watch") || s.includes("wearable") || s.includes("pebble") || s.includes("device") || s.includes("phone")) {
          classifications = "Wearables / Mobile Hardware";
          claims = [
            `A low-power electrophoretic display interface for a ${bestMatch.title} device.`,
            "A communication scheduler adjusting Bluetooth handshake sleep intervals.",
            "A snap-on modular magnetic terminal system permitting chassis disassembly."
          ];
        } else if (s.includes("scooter") || s.includes("car") || s.includes("stabilizer") || s.includes("gyro") || s.includes("mobility") || s.includes("vehicle")) {
          classifications = "Micro-Mobility / Self-Balancing";
          claims = [
            `A gyroscopic self-stabilizing motor feedback controller for ${bestMatch.title}.`,
            "A sensor array mapping tilt coordinates to brushless motor voltage limits.",
            "A geofencing transit limiter automatically lowering vehicle speed on sidewalks."
          ];
        } else if (s.includes("game") || s.includes("console") || s.includes("streaming") || s.includes("video") || s.includes("media") || s.includes("play")) {
          classifications = "Digital Media & Gaming";
          claims = [
            `A cloud frame encoding interface transmitting game streams for ${bestMatch.title}.`,
            "A packet loss concealment loop interpolating dropped WebRTC video frames.",
            "A decentralized node selector leasing local GPU resource pipelines dynamically."
          ];
        } else if (s.includes("water") || s.includes("filter") || s.includes("purify") || s.includes("filtration") || s.includes("environmental")) {
          classifications = "Environmental / Water Systems";
          claims = [
            `A physical filtration membrane cartridge layout for ${bestMatch.title}.`,
            "An optical fouling detection system scheduling automatic membrane backwash flows.",
            "A solar direct-drive motor regulating pump velocities to photovoltaic levels."
          ];
        } else if (s.includes("drone") || s.includes("flight") || s.includes("aerospace") || s.includes("aviation")) {
          classifications = "Aerospace / Flight Systems";
          claims = [
            `A lightweight carbon-fiber composite wing layout for ${bestMatch.title} aircraft.`,
            "An adaptive flight control surface adjusting servo positions in under 30ms.",
            "A weather navigation feedback loop mapping wind sensors to flight routes."
          ];
        }

        // Dynamic Patent Object
        const newPatent = {
          id: "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
          title: `${bestMatch.title} Patent System`,
          inventor: inventor,
          filedYear: yearFiled,
          expiryYear: yearFiled + 20,
          status: yearFiled + 20 < new Date().getFullYear() ? "Expired (Public Domain)" : "Active (Licensing Req.)",
          classifications: classifications,
          claims: claims,
          description: extract || `Intellectual property specifications describing the mechanical and digital integration of ${bestMatch.title}.`
        };

        return res.json({ success: true, count: 1, data: [newPatent] });
      }
    } catch (e) {
      console.warn("Wikipedia API lookup failed for patent search, using local fallback.", e);
    }
    
    // If we had a query and it yielded no matches locally or on Wikipedia, return empty!
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

  const db = loadDatabase();
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

