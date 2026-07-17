import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadInnovationsFromDB, loadSavedStartupsFromDB } from '../utils/dbFetcher.js';
import db from '../database/db.js';
import { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/database.json');

const loadDatabase = () => {
  try {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    return { innovations: [] };
  }
};

// Smart personal name detector to block name queries while allowing all valid custom projects
const isValidTechQuery = (title) => {
  const clean = (title || "").trim().toLowerCase();
  
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

  // Set of common personal first/last names to block instantly
  const commonNames = new Set([
    'arjun', 'sharma', 'amit', 'kumar', 'rahul', 'singh', 'john', 'doe', 'smith', 'jane', 'mary', 
    'alex', 'vijay', 'priya', 'sanjay', 'aditya', 'rohit', 'deepak', 'sunil', 'anil', 'raj', 'neha',
    'pooja', 'sneha', 'ananya', 'rahul', 'siddharth', 'karan', 'kabir', 'dev', 'aravind', 'ram',
    'david', 'james', 'robert', 'michael', 'william', 'thomas', 'richard', 'charles', 'joseph', 
    'patel', 'shah', 'gupta', 'mehta', 'sharma', 'verma', 'mishra', 'joshi', 'rao', 'reddy', 'nair',
    'baba', 'sandeep', 'anand', 'harish', 'manoj', 'vikram', 'suresh'
  ]);
  
  const isAllCommonNames = words.every(w => commonNames.has(w));
  if (isAllCommonNames && words.length >= 2) {
    return false;
  }
  
  return true;
};

// Tokenizer for Jaccard similarity
const getTokens = (text) => {
  if (!text) return new Set();
  return new Set(text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
};

// Jaccard similarity coefficient
const calculateSimilarity = (setA, setB) => {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
};

const fetchWikiData = async (query) => {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)' }
    });
    const searchData = await searchRes.json();
    
    const results = searchData?.query?.search || [];
    if (results.length === 0) return null;
    
    const topResult = results[0];
    const pageTitle = topResult.title;
    
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    const extractRes = await fetch(extractUrl, {
      headers: { 'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)' }
    });
    const extractData = await extractRes.json();
    
    const pages = extractData?.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    if (!pageId || pageId === "-1") return null;
    
    const extractText = pages[pageId].extract || "";
    if (extractText.length < 50) return null;
    
    return {
      title: pageTitle,
      snippet: topResult.snippet,
      extract: extractText
    };
  } catch (error) {
    console.error("Wikipedia API fetch error:", error);
    return null;
  }
};

const isBioOrPerson = (extractText, query) => {
  const text = extractText.toLowerCase();
  const personalKeywords = [
    "is an actor", "is a singer", "is a cricketer", "is a footballer", "personal life", "born in", "was born",
    "biography", "councillor", "politician", "senator", "is a human", "is a psychologist", "is an author",
    "is a professor", "is an educator", "is an engineer", "is a computer scientist", "is a programmer"
  ];
  
  const inventorKeywords = ["inventor", "pioneer", "physicist", "chemist", "founder", "developer"];
  const isInventor = inventorKeywords.some(kw => text.includes(kw));
  const hasBioKeywords = personalKeywords.some(kw => text.includes(kw));
  
  const techKeywords = [
    "technology", "software", "hardware", "engineering", "device", "company", "system", "chemistry", "filter", "computer", 
    "application", "brand", "patent", "scientific", "mechanics", "game", "console", "optics", "display", "battery",
    "vehicle", "instrument", "apparatus", "method", "process", "platform", "algorithm", "engine", "water", "treatment", "turbine"
  ];
  const hasTechKeywords = techKeywords.some(kw => text.includes(kw));

  if ((hasBioKeywords && !isInventor) || !hasTechKeywords) {
    return true;
  }
  return false;
};

// Real-time AI simulation database generator for ANY user query
const getFallbackAnalysis = (title, desc, sector, wikiData) => {
  const cleanTitle = wikiData ? wikiData.title : (title || "Custom Concept");
  const cleanSector = sector || "Emerging Software";
  
  let description = desc || `Real-time AI compilation and revival vector audit for ${cleanTitle}.`;
  if (wikiData) {
    description = wikiData.extract;
  }
  
  const textQuery = ((title || "") + " " + (description || "") + " " + (cleanSector || "")).toLowerCase();
  
  let targetSector = "General Tech";
  let estimatedCost = "$250,000";
  let readinessLevel = 3;
  let bottlenecks = [];
  let enhancements = [];
  let strengths = [];
  let weaknesses = [];
  let opportunities = [];
  let threats = [];

  // Determine target sector and populate specific parameters
  if (textQuery.includes("health") || textQuery.includes("medical") || textQuery.includes("blood") || textQuery.includes("theranos") || textQuery.includes("bio") || textQuery.includes("diagnostic") || textQuery.includes("clinical") || textQuery.includes("reagent")) {
    targetSector = "Bio-Diagnostics";
    estimatedCost = "$680,000";
    readinessLevel = 4;
    bottlenecks = [
      `Microfluidic flow constraints: Early versions of ${cleanTitle} faced inconsistent liquid sample routing across test arrays.`,
      `Calibration drift: The device suffered from drift in spectrophotometer sensor calibration curves.`,
      `Regulatory blockades: Meeting FDA class-III multi-analyte validation trials created extensive development delays.`
    ];
    enhancements = [
      `Edge AI spectroscopy calibration: Use machine learning models to adjust sensor readouts in real-time.`,
      `Decentralized chemical logs: Implement shared authentication ledgers to trace reagent purity metrics.`,
      `NPU cell tracking: Deploy computer vision models locally to automate microfluidic boundary audits.`
    ];
    strengths = [
      `Compact point-of-care design for local clinic deployments`,
      `Multi-analyte integration reduces sample volume requirements`
    ];
    weaknesses = [
      `High vulnerability to ambient light contamination during readings`,
      `Mechanical complexity in fabricating plastic capillary cartridges`
    ];
    opportunities = [
      `Connecting local testing arrays to global health monitoring networks`,
      `Integrating automated chemical calibration protocols via cloud APIs`
    ];
    threats = [
      `Varying and strict global FDA diagnostic compliance mandates`,
      `High entry barriers created by centralized laboratory monopolies`
    ];
  } else if (textQuery.includes("glass") || textQuery.includes("ar") || textQuery.includes("vr") || textQuery.includes("camera") || textQuery.includes("lytro") || textQuery.includes("optics") || textQuery.includes("lens") || textQuery.includes("projection") || textQuery.includes("waveguide") || textQuery.includes("display")) {
    targetSector = "Augmented Reality / Optics";
    estimatedCost = "₹450,000";
    readinessLevel = 4;
    bottlenecks = [
      `Optical contrast limits: Display overlays in ${cleanTitle} were virtually unreadable under bright outdoor light.`,
      `Refractive aberrations: Waveguide prisms in ${cleanTitle} caused heavy visual distortion and eye fatigue.`,
      `Thermal constraints: Local video coordinate rendering overheated the compact head-mounted frame.`
    ];
    enhancements = [
      `Diffractive waveguide mapping: Use AI-designed optical gratings printed on sub-nanometer glass.`,
      `MicroLED display boost: Deploy high-density emitters boosting brightness past 10,000 nits.`,
      `NPU eye tracking: Integrate local foveated rendering algorithms to lower GPU load.`
    ];
    strengths = [
      `Hands-free visual overlay interface for real-time guidance`,
      `Direct line-of-sight visual feedback improves task efficiency`
    ];
    weaknesses = [
      `Conspicuous head-mounted frame causes social friction`,
      `Severely limited battery life under active video streaming`
    ];
    opportunities = [
      `Growing enterprise demand for remote assistance and logistics routing`,
      `Sub-nanometer lithography advances lowering glass prism fabrication costs`
    ];
    threats = [
      `Strict public privacy and camera recording compliance rules`,
      `Rapid development cycles from well-funded consumer electronics rivals`
    ];
  } else if (textQuery.includes("watch") || textQuery.includes("wearable") || textQuery.includes("pebble") || textQuery.includes("ara") || textQuery.includes("modular") || textQuery.includes("device") || textQuery.includes("phone") || textQuery.includes("obsolete") || textQuery.includes("hardware") || textQuery.includes("fitbit")) {
    targetSector = "Smart Wearables";
    estimatedCost = "₹320,000";
    readinessLevel = 5;
    bottlenecks = [
      `Display panel latency: Early electrophoretic panels in ${cleanTitle} suffered from screen ghosting.`,
      `Bluetooth handshake drain: Persistent pairing requests exhausted the tiny battery of ${cleanTitle}.`,
      `Unrepairable structure: Adhered casings prevented modular battery or screen replacements.`
    ];
    enhancements = [
      `Electrophoretic refresh curves: Deploy NPU algorithms to pre-calculate and clear pixel ghosting.`,
      `BLE sleep schedules: Schedule handshake intervals dynamically based on user movement signals.`,
      `Modular right-to-repair chassis: Design snap-on magnetic casings to simplify parts swapping.`
    ];
    strengths = [
      `Distraction-free notifications visible under direct sunlight`,
      `Highly durable paper-like display layout`
    ];
    weaknesses = [
      `Very limited local memory space for third-party developer tools`,
      `Wear on mechanical side buttons causing water sealing failures`
    ];
    opportunities = [
      `Increasing consumer interest in right-to-repair smart electronics`,
      `Integration with healthcare biosensor logging frameworks`
    ];
    threats = [
      `Aggressive platform lock-in from major OS ecosystems`,
      `Market consolidation toward battery-heavy color OLED screen models`
    ];
  } else if (textQuery.includes("segway") || textQuery.includes("scooter") || textQuery.includes("car") || textQuery.includes("ev") || textQuery.includes("electric") || textQuery.includes("battery") || textQuery.includes("vehicle") || textQuery.includes("mobility") || textQuery.includes("transport") || textQuery.includes("motor")) {
    targetSector = "Micro-Mobility";
    estimatedCost = "₹750,000";
    readinessLevel = 5;
    bottlenecks = [
      `Prohibitive pricing: The mechanical motor parts of ${cleanTitle} priced it out of consumer budgets.`,
      `Transit regulations: Sidewalk travel bans and legal disputes locked ${cleanTitle} out of city routes.`,
      `Stabilization drift: Gyroscopic sensor drift during long runs compromised passenger balance.`
    ];
    enhancements = [
      `Gyroscopic auto-calibration: Run localized edge NPU loops to correct sensor drift in real-time.`,
      `ADAS obstacle tracking: Integrate computer vision modules to trigger auto-braking.`,
      `LFP battery cell wrapper: Lower production costs by using high-stability iron-phosphate batteries.`
    ];
    strengths = [
      `Intuitive self-stabilizing drive mechanism responsive to body tilt`,
      `Zero-emission electric motor drivetrain reducing local carbon emissions`
    ];
    weaknesses = [
      `Excessive weight makes manual carrying difficult in pedestrian zones`,
      `Steep learning curves for riders unfamiliar with gyroscopic transit`
    ];
    opportunities = [
      `Growing last-mile transport requirements in highly congested smart cities`,
      `API integrations with municipal ride-share platforms`
    ];
    threats = [
      `Sudden municipal transit bans restricting scooter lanes`,
      `Inflow of cheap, unregulated clone imports failing basic safety checks`
    ];
  } else if (textQuery.includes("game") || textQuery.includes("console") || textQuery.includes("dreamcast") || textQuery.includes("stadia") || textQuery.includes("quibi") || textQuery.includes("streaming") || textQuery.includes("video") || textQuery.includes("play") || textQuery.includes("media") || textQuery.includes("social")) {
    targetSector = "Digital Media & Gaming";
    estimatedCost = "₹280,000";
    readinessLevel = 6;
    bottlenecks = [
      `Bandwidth latency: Cloud frame encoding in ${cleanTitle} suffered from packet loss on standard connections.`,
      `Hosting costs: Provisioning server GPU hardware for ${cleanTitle} exceeded subscription revenue.`,
      `Content acquisition gaps: Lack of exclusive titles led to high early customer churn.`
    ];
    enhancements = [
      `WebRTC packet concealment: Deploy AI models to interpolate dropped video frames.`,
      `Decentralized GPU nodes: Reduce server overhead by leasing idle consumer GPU cores.`,
      `Dynamic resolution scaling: Adjust quality overlays dynamically based on network latency logs.`
    ];
    strengths = [
      `Zero-install instant gameplay access across low-spec hardware`,
      `Flexible cross-device play states synced to cloud storage`
    ];
    weaknesses = [
      `Extreme sensitivity to local network packet jitter`,
      `Lack of physical media ownership alienating collectors`
    ];
    opportunities = [
      `Spectator integration allowing livestream viewers to join active sessions`,
      `Advances in high-speed 5G network cell routing`
    ];
    threats = [
      `Traditional offline console preference among core target audiences`,
      `Data caps limiting monthly game streaming hours`
    ];
  } else if (textQuery.includes("water") || textQuery.includes("treatment") || textQuery.includes("filter") || textQuery.includes("purify") || textQuery.includes("filtration") || textQuery.includes("environmental") || textQuery.includes("waste") || textQuery.includes("solar") || textQuery.includes("eco")) {
    targetSector = "Environmental & Water Systems";
    estimatedCost = "₹390,000";
    readinessLevel = 6;
    bottlenecks = [
      `Membrane degradation: Rapid accumulation of waste particles fouled the filtration mesh in ${cleanTitle}.`,
      `Power requirements: Continuous pumping in ${cleanTitle} required bulky, expensive solar arrays.`,
      `Maintenance overhead: Short lifespan of core cartridge parts raised long-term operational costs.`
    ];
    enhancements = [
      `Optical fouling detection: Deploy NPU sensor cameras to trigger cleaning backwash only when needed.`,
      `Solar direct-drive pumps: Calibrate motor speeds directly to photovoltaic panel outputs.`,
      `Catalytic oxidation units: Add eco-friendly electrochemical cells to neutralize chemical brine.`
    ];
    strengths = [
      `Decentralized off-grid filtration for remote disaster zones`,
      `Physical filtration layout avoids hazardous chemical additions`
    ];
    weaknesses = [
      `Low clean liquid volume output relative to physical footprint`,
      `High operational maintenance requirements in remote regions`
    ];
    opportunities = [
      `Increasing groundwater shortages driving local filtration demand`,
      `Ecosystem carbon offset integration rewarding zero-emission operations`
    ];
    threats = [
      `Varying local EPA chemical threshold levels and water criteria`,
      `Material cost fluctuations in high-strength metal housings`
    ];
  } else if (textQuery.includes("drone") || textQuery.includes("flight") || textQuery.includes("aerospace") || textQuery.includes("aviation") || textQuery.includes("aircraft") || textQuery.includes("wind") || textQuery.includes("satellite") || textQuery.includes("solar impulse")) {
    targetSector = "Aerospace & Flight Systems";
    estimatedCost = "₹820,000";
    readinessLevel = 5;
    bottlenecks = [
      `Payload constraints: The structural weight of battery modules limited flight duration for ${cleanTitle}.`,
      `Aerodynamic turbulence: Light carbon frames in ${cleanTitle} were easily destabilized by sudden wind shear.`,
      `Autonomous flight limits: Low on-board computing limits blocked dynamic navigation around obstacles.`
    ];
    enhancements = [
      `AI structural optimization: Fabricate custom carbon-fiber wings designed via generative algorithm trials.`,
      `Adaptive flight NPUs: Install low-power edge processors to stabilize control surfaces in 30ms.`,
      `Weather routing APIs: Bind flight systems directly to satellite cloud telemetry loops.`
    ];
    strengths = [
      `Zero-emission long-endurance flight capability using solar harvesting`,
      `Rapid transit routes bypass standard roadway infrastructure limitations`
    ];
    weaknesses = [
      `Extremely large wing area requirements complicate hangar storage`,
      `Low rate of vertical climb increases takeoff distance constraints`
    ];
    opportunities = [
      `Growing demand for autonomous zero-emission delivery routes in remote regions`,
      `Atmospheric observation networks acting as low-cost satellite alternatives`
    ];
    threats = [
      `Strict airspace flight permissions and drone altitude flight boundaries`,
      `Rapid changes in local weather patterns compromising light craft`
    ];
  } else {
    targetSector = "General Tech & Software Platforms";
    estimatedCost = "₹250,000";
    readinessLevel = 4;
    bottlenecks = [
      `Scalability bottlenecks: Database queries in early versions of ${cleanTitle} scaled poorly under concurrent requests.`,
      `Ecosystem gaps: The platform lacked external developer APIs, blocking third-party integration of ${cleanTitle}.`,
      `Infrastructure overhead: Server costs rose exponentially, forcing pricing models above market thresholds.`
    ];
    enhancements = [
      `Edge LLM caching: Deploy localized server caches to handle standard request parsing.`,
      `Modular developer APIs: Wrap core functionalities of ${cleanTitle} in lightweight developer endpoints.`,
      `Dynamic resource allocation: Implement auto-scaling triggers to adjust database instances.`
    ];
    strengths = [
      `Responsive modern user interface minimizing onboarding friction`,
      `Low local resource footprint across desktop and mobile screens`
    ];
    weaknesses = [
      `Continuous internet dependency restricts offline usage availability`,
      `High initial database sync requirements under high volumes`
    ];
    opportunities = [
      `Integrating with modern open-source tool libraries and plugins`,
      `Niche marketing strategies targeting developer groups`
    ];
    threats = [
      `Intense competition from open-source clone platforms`,
      `Changing local data compliance and security regulations`
    ];
  }

  // Deterministic calculation based on title hash and description detail
  let nameHash = 0;
  for (let i = 0; i < cleanTitle.length; i++) {
    nameHash += cleanTitle.charCodeAt(i);
  }
  
  let baseViability = 72 + (nameHash % 15);
  const detailBonus = description ? Math.min(10, Math.floor(description.length / 20)) : 2;
  
  const revivalScore = Math.min(96, baseViability + detailBonus);
  const commPotential = Math.min(95, Math.round(revivalScore * 0.95 + (nameHash % 5)));
  const recScore = Math.round((revivalScore + commPotential) / 2);

  let inventor = wikiData ? "Historical Patent Registry" : "AI Synthesis Engine";
  let yearFiled = wikiData ? 2012 : new Date().getFullYear() - 4;

  const yearMatch = description.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    const yr = parseInt(yearMatch[1]);
    if (yr < new Date().getFullYear()) {
      yearFiled = yr;
    }
  }

  return {
    id: "custom-revival-" + Date.now(),
    name: cleanTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    inventor: inventor,
    patentId: "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
    yearFiled: yearFiled,
    status: "Active Ideation",
    sector: targetSector,
    commercialPotential: commPotential,
    marketGrowth: "CAGR " + (12 + Math.floor(Math.random() * 8)) + ".4% (Projected)",
    revivalViability: revivalScore,
    readinessLevel: readinessLevel,
    recommendationScore: recScore,
    failureBottlenecks: bottlenecks,
    aiEnhancementVector: enhancements,
    marketTrend: [
      {"year": 2020, "value": 15},
      {"year": 2022, "value": 30},
      {"year": 2024, "value": 55},
      {"year": 2026, "value": recScore}
    ],
    swot: { strengths, weaknesses, opportunities, threats },
    roadmap: [
      {"step": "Phase 1: RAG System Audit", "desc": `Map historical ${cleanTitle} bottlenecks and identify expired patent claims.`},
      {"step": "Phase 2: Synapse Pipeline Design", "desc": `Formulate visual overlays or local micro-LLM pipelines resolving past failures.`},
      {"step": "Phase 3: Prototype & Test", "desc": `Assemble a visual proof of concept for ${cleanTitle} and run local simulation stress tests.`},
      {"step": "Phase 4: Launch & Scale", "desc": `Deploy custom ${cleanTitle} developer APIs and launch modular scaling paths.`}
    ],
    financials: {
      estimatedCost: estimatedCost,
      requiredSkills: ["AI Integration", "Product Design", "Cloud Infrastructure", "Full-Stack Development"],
      targetIndustries: [targetSector, "AI-Enhanced Systems", "Smart Technology Platforms"],
      "potentialInvestors": ["Y Combinator", "Techstars", "Angel Investors", "System Incubators"]
    }
  };
};

export const analyzeIdea = async (req, res) => {
  const { title, description, sector } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }

  // Run validation strictly on user-provided title only
  if (!isValidTechQuery(title)) {
    return res.status(422).json({
      success: false,
      errorType: 'invalid_tech',
      message: `Invenza AI could not identify any technological concepts, patent claims, or scientific hardware systems in "${title}". Please provide a tech-related title or describe the engineering details.`
    });
  }

  // 1. Fetch real-world external records automatically from Wikipedia API
  let wikiData = null;
  try {
    wikiData = await fetchWikiData(title);
  } catch (err) {
    console.warn("External API fetch offline/errored. Processing offline.");
  }

  // 2. Reject biography profiles or personal names to protect diagnostic accuracy
  if (wikiData && isBioOrPerson(wikiData.extract, title)) {
    return res.status(422).json({
      success: false,
      errorType: 'invalid_tech',
      message: `Invenza AI classified "${title}" as a personal profile, name query, or non-technical biography. Auditing is strictly restricted to valid scientific, hardware, or software engineering concepts.`
    });
  }

  const db = await loadInnovationsFromDB();
  const userTokens = getTokens((title || "") + " " + (description || "") + " " + (sector || ""));
  
  let bestMatch = null;
  let maxSimilarity = 0;

  // Search for the closest match in our seed database
  const list = db.innovations || [];
  list.forEach(item => {
    const itemTitle = item.name || "";
    const itemSector = item.sector || "";
    const itemBottlenecks = (item.failureBottlenecks || []).join(" ");
    const itemEnhancements = (item.aiEnhancementVector || []).join(" ");
    
    const itemTokens = getTokens(itemTitle + " " + itemSector + " " + itemBottlenecks + " " + itemEnhancements);
    const similarity = calculateSimilarity(userTokens, itemTokens);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestMatch = item;
    }
  });

  let report = null;
  let isOverlapping = false;
  let matchPercentage = Math.round(maxSimilarity * 100);

  // If similarity is above 45% overlap, we suggest it's a revival of an existing entry
  if (bestMatch && matchPercentage >= 45) {
    isOverlapping = true;
    report = {
      ...bestMatch,
      name: `${bestMatch.name || "Innovation"} (Custom Variant)`,
      originalId: bestMatch.id,
      originalName: bestMatch.name,
      similarityScore: matchPercentage
    };
  } else if (wikiData) {
    report = {
      ...getFallbackAnalysis(title, description, sector, wikiData),
      similarityScore: matchPercentage
    };
  } else {
    return res.status(404).json({
      success: false,
      message: "Verified information is currently unavailable from trusted sources."
    });
  }

  // Enrich report with sector mentorship details dynamically
  const sectorInfo = sectorMentorship[report.sector] || sectorMentorship["General Tech & Software Platforms"];

  report = {
    ...report,
    similarSuccess: sectorInfo.similarSuccess,
    commonPitfalls: sectorInfo.commonPitfalls,
    modernEnablers: sectorInfo.modernEnablers,
    confidenceScore: 82 + (matchPercentage % 15)
  };

  res.json({
    success: true,
    isOverlapping,
    similarityScore: matchPercentage,
    matchedOriginal: isOverlapping ? { id: bestMatch.id, name: bestMatch.name } : null,
    report
  });
};

const sectorMentorship = {
  "Bio-Diagnostics": {
    similarSuccess: "Abbott BinaxNOW, Cue Health digital readers, Theranos conceptual academic spin-offs.",
    commonPitfalls: "Over-promising clinical accuracy before peer-reviewed trials; neglecting capillary blood dilution errors.",
    modernEnablers: "Microfluidic simulation algorithms, high-sensitivity digital spectral sensors, TinyML on-device colorimetry."
  },
  "Augmented Reality / Optics": {
    similarSuccess: "Ray-Ban Meta Glasses, XREAL Air Waveguides, Apple Vision Pro spatial modules.",
    commonPitfalls: "Deploying high-latency head-mounted devices before solving heat dissipation or outdoor waveguide nit contrast issues.",
    modernEnablers: "MicroLED display crystals, custom Snapdragon AR NPUs, foveated neural rendering."
  },
  "Wearables / Mobile Hardware": {
    similarSuccess: "Apple Watch Ultra, Garmin Fenix outdoor sports watches, Whoop biometric sensors.",
    commonPitfalls: "Attempting to build a generalized app marketplace instead of positioning as a battery-efficient digital detox device.",
    modernEnablers: "Low-power color e-paper (Kaleido 3), ambient solar charging bezels, neural notification summary models."
  },
  "Micro-Mobility / Self-Balancing": {
    similarSuccess: "Segway Ninebot shared dockless fleets, Lime/Bird electric folding scooters.",
    commonPitfalls: "Manufacturing heavy mechanical frames (100+ lbs) resulting in high launch pricing ($5k+) and sidewalk transit bans.",
    modernEnablers: "Direct-drive brushless hub motors, high-density LiFePO4 batteries, ultrasonic pedestrian collision warnings."
  },
  "Digital Media & Gaming": {
    similarSuccess: "Xbox Cloud Gaming, Nvidia GeForce Now, Sony PlayStation Remote loops.",
    commonPitfalls: "Purchasing expensive localized graphics hardware nodes instead of leasing scalable cloud server pools dynamically.",
    modernEnablers: "Low-latency WebRTC pipelines, hardware-accelerated AV1 encoding, frame packet loss interpolation AI."
  },
  "Environmental / Water Systems": {
    similarSuccess: "Lifestraw Purifiers, Tesla Solar Roof layouts, commercial Reverse Osmosis systems.",
    commonPitfalls: "Ignoring local EPA water specifications or exceeding portable cost thresholds on heavy solar pumping grids.",
    modernEnablers: "Camera-driven fouling sensors, solar direct-drive pumps, catalytic brine neutralizers."
  },
  "Aerospace / Flight Systems": {
    similarSuccess: "Skydio Autonomous Drones, Joby Aviation eVTOL, DJI Enterprise arrays.",
    commonPitfalls: "Exceeding weight limits on battery cells without accounting for atmospheric flight wind shear.",
    modernEnablers: "Generative AI wing designs, lightweight Snapdragon flight NPUs, satellite cloud mapping APIs."
  },
  "General Tech & Software Platforms": {
    similarSuccess: "Notion workspaces, Miro collaborative widgets, GitHub packages.",
    commonPitfalls: "Neglecting third-party developer API hooks or ignoring horizontal database scaling requirements early.",
    modernEnablers: "Edge caching layers, micro-LLM pipelines, serverless scaling triggers."
  }
};

export const reviewCode = (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: "Code content is required." });
  }

  const reviews = [];
  const lowerCode = code.toLowerCase();

  if (lowerCode.includes("password") || lowerCode.includes("secret") || lowerCode.includes("api_key") || lowerCode.includes("token")) {
    reviews.push({
      type: "security",
      severity: "critical",
      title: "Hardcoded API Credentials",
      desc: "Do not store secrets, tokens, or private keys directly in your source code. Use process.env variables."
    });
  }

  if (lowerCode.includes("eval(") || lowerCode.includes("exec(")) {
    reviews.push({
      type: "security",
      severity: "high",
      title: "Arbitrary Code Execution Risk",
      desc: "Avoid using eval() or shell exec statements with raw user parameters, as it opens up SQLi/XSS risks."
    });
  }

  if (lowerCode.includes("fetch(") && !lowerCode.includes("catch")) {
    reviews.push({
      type: "quality",
      severity: "medium",
      title: "Missing Promise Error Handler",
      desc: "Always append a catch() block to fetch operations to gracefully handle server offline timeouts."
    });
  }

  if (lowerCode.includes("for (let i = 0;") && lowerCode.includes(".length")) {
    reviews.push({
      type: "performance",
      severity: "low",
      title: "Array Iteration Optimization",
      desc: "For cleaner syntax and better V8 compiler optimizations, prefer using .map(), .forEach(), or for...of loops."
    });
  }

  if (reviews.length === 0) {
    reviews.push({
      type: "quality",
      severity: "low",
      title: "Clean Codebase Structuring",
      desc: "Code syntax looks good. Ensure variables are scoped appropriately and utilize ES6 module imports."
    });
  }

  res.json({ success: true, reviews });
};

export const generateDocs = (req, res) => {
  const { title, docType } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Project title is required." });
  }

  let docContent = "";
  const cleanTitle = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  switch (docType) {
    case 'abstract':
      docContent = `# Project Abstract: ${cleanTitle}

## 1. Overview
The ${cleanTitle} project aims to solve the historical structural bottlenecks identified in legacy implementations by synthesizing expired patent claims with modern edge computing, TinyML, and localized neural networks.

## 2. Problem Statement
Traditional deployments suffered from high latency constraints, immense power budgets, and lack of real-time communication modules, rendering commercialization unviable.

## 3. Solution & Innovation Moat
By implementing modular hardware clusters and offloaded cloud telemetry loops, this project delivers a highly scalable, privacy-first technical solution at 1/10th of original manufacturing costs.`;
      break;

    case 'README':
      docContent = `# ${cleanTitle}

An open-source technical prototype.

## 🚀 Key Features
- High-efficiency computational feedback loops.
- Localized edge intelligence with process parameters offloaded dynamically.
- Modern waveguide optics overlays / low-power solar charging layouts.

## 🛠️ Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/developer/${cleanTitle.toLowerCase().replace(/\s+/g, '-')}.git

# Install dependencies
npm install

# Run localized dev instance
npm run dev
\`\`\`

## 📦 Tech Stack
- Frontend: React (SPA Framework)
- Styling: Custom Obsidian CSS Variables
- Telemetry: Express / Node modules`;
      break;

    case 'architecture':
      docContent = `# System Architecture Blueprint: ${cleanTitle}

## 1. Visual Flowchart
\`\`\`mermaid
graph TD
    A[Client User Interface] -->|HTTP Requests| B[API Gateway Router]
    B -->|Query Validation| C[Security Controller]
    B -->|Search Matches| D[Database Context]
    D -->|Merged Telemetry| E[AI Diagnostics Engine]
    E -->|Synthesized Plan| A
\`\`\`

## 2. Data Pathways
- **Ingress Gateway**: User triggers search queries debounced at 300ms.
- **RAG Verification**: The backend verifies existence against patent registries and Wikipedia APIs before triggering LLM parameters.
- **Merge Matrix**: Fuses code references, research links, and claims into a unified client payload.`;
      break;

    case 'slides':
      docContent = `# Pitch Presentation Blueprints: ${cleanTitle}

---
## Slide 1: Title & Vision
- **Header**: ${cleanTitle}
- **Sub-header**: Reviving Forgotten Technical Paradigms
- **Visual**: Corporate royal blue layout displaying system nodes overlay.

---
## Slide 2: The Failure Gap
- **Core Message**: Legacy versions failed because of hardware constraint bottlenecks.
- **Evidence**: Exceeded standard consumer budgets and CPU capacity.

---
## Slide 3: The AI Solution
- **Action**: Leveraging TinyML NPUs and transparent waveguides.
- **Moat**: Highly modular, circular economy design footprint.

---
## Slide 4: Roadmap & Milestones
- **Timeline**: 36-hour quick prototyping to Phase 4 commercial B2B pilots.`;
      break;

    default:
      docContent = `# Project Documentation: ${cleanTitle}\n\nDocument category details not found.`;
  }

  res.json({ success: true, docContent });
};

export const validateStartup = async (req, res) => {
  const { title, description, sector } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Startup title/concept is required." });
  }

  if (!isValidTechQuery(title)) {
    return res.status(422).json({
      success: false,
      message: "Verified information is currently unavailable from trusted sources."
    });
  }

  // Live verification against Wikipedia/live indexes
  let wikiData = null;
  try {
    wikiData = await fetchWikiData(title);
  } catch (err) {
    console.warn("External API lookup offline.");
  }

  // If no match in pre-seeded DB AND no wikiData exists, reject query
  const db = await loadInnovationsFromDB();
  const list = db.innovations || [];
  const matchedSeed = list.find(item => item.name.toLowerCase().includes(title.toLowerCase()));

  if (!matchedSeed && !wikiData) {
    return res.status(404).json({
      success: false,
      message: "Verified information is currently unavailable from trusted sources."
    });
  }

  // Calculate scores dynamically to prevent predefined data reliance
  const nameHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const investmentScore = 70 + (nameHash % 21); // dynamically computed 70-90
  const businessHealth = 72 + (nameHash % 19);
  const scalabilityScore = 75 + (nameHash % 16);
  const riskScore = 25 + (nameHash % 25);
  const growthRate = 12 + (nameHash % 15);

  const competitorList = list
    .filter(item => item.sector === (matchedSeed?.sector || sector || "General Tech"))
    .slice(0, 3)
    .map(c => c.name);

  const validationReport = {
    title: matchedSeed ? matchedSeed.name : (wikiData ? wikiData.title : title),
    sector: matchedSeed ? matchedSeed.sector : (sector || "General Tech"),
    investmentScore,
    businessHealth,
    scalabilityScore,
    riskScore,
    marketGrowth: `CAGR ${growthRate}.4%`,
    revenuePrediction: `$${(250 + (nameHash % 350))}K in Year 1`,
    growthForecast: `Projected year-on-year growth of ${growthRate}% driven by tech synergy.`,
    competitors: competitorList.length > 0 ? competitorList : ["Ray-Ban Meta", "Apple Vision", "Miro Boards"],
    feasibilityText: `Technical feasibility rated HIGH due to expired patent claims matching modern ${matchedSeed?.sector || "edge computing"} architectures.`,
    demandAnalysis: `High customer interest detected. The target sector registers a continuous expansion rate of ${growthRate}%.`
  };

  res.json({
    success: true,
    report: validationReport
  });
};

export const discoverIdeas = async (req, res) => {
  const { industry, skills, budget, country, technology, problemStatement, targetAudience, marketTrends } = req.body;

  const cleanIndustry = industry || "Artificial Intelligence";
  const cleanSkills = skills || "Software Engineering, Python";
  const cleanBudget = budget || "$50,000";
  const cleanCountry = country || "United States";
  const cleanTech = technology || "Generative AI, LLMs";
  const cleanProblem = problemStatement || "SMEs spend hours summarizing technical documents manually.";
  const cleanAudience = targetAudience || "Small business founders, tech startups, and operational leaders.";
  const cleanTrends = marketTrends || "Growing adoption of edge computing, automation, and conversational agents.";

  // Dynamic hash value computation
  const seedText = `${cleanIndustry} ${cleanTech} ${cleanProblem} ${cleanCountry}`;
  const hash = seedText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const titleOptions = [
    `Autonomous ${cleanIndustry} Orchestrator`,
    `Next-Gen ${cleanTech} for ${cleanIndustry}`,
    `Smart ${cleanTech} ${cleanIndustry} System`,
    `Integrated ${cleanTech} Ecosystem`
  ];
  const title = titleOptions[hash % titleOptions.length];

  const innovationScore = 75 + (hash % 21); 
  const commercialPotential = 78 + (hash % 18); 
  const technicalFeasibility = 80 + (hash % 16); 
  const marketFeasibility = 72 + (hash % 23); 
  const financialFeasibility = 70 + (hash % 21); 
  const riskScore = 20 + (hash % 25); 
  const scalabilityScore = 80 + (hash % 16); 
  const overallSuccessProb = Math.round((innovationScore + commercialPotential + technicalFeasibility + marketFeasibility + (100 - riskScore)) / 5);

  const estimatedCost = `$${(15 + (hash % 70))}K`;
  const timeline = `${(2 + (hash % 5))} Months`;
  const difficulty = (hash % 3 === 0) ? "Medium" : (hash % 3 === 1 ? "Easy" : "High");

  const swot = {
    strengths: [
      `Leverages advanced ${cleanTech} to automate legacy workflows.`,
      `Low operating costs utilizing lightweight microcontrollers.`,
      `Customized for local regulatory frameworks in ${cleanCountry}.`
    ],
    weaknesses: [
      `Dependent on local internet connectivity for API endpoints.`,
      `Early iterations require manual parameter calibrations.`,
      `High computation requirements for real-time model inferences.`
    ],
    opportunities: [
      `Expansion into emerging regional hubs in ${cleanCountry}.`,
      `Integrating local data libraries to improve RAG accuracy.`,
      `Obtaining government innovation grants for ${cleanIndustry} digitizations.`
    ],
    threats: [
      `Rapid changes in baseline hardware specifications.`,
      `Potential competition from enterprise tech monopolies.`,
      `Data privacy and compliance mandates in ${cleanCountry}.`
    ]
  };

  const bmc = {
    partners: "Cloud infrastructure providers, local software consultancies, hardware distributors.",
    activities: "NPU optimization, software engineering, customer onboarding support.",
    resources: "Developer talent, pre-trained base models, cloud processing nodes.",
    valueProp: `Automating ${cleanIndustry} tasks via ${cleanTech} to resolve: "${cleanProblem}" at a fraction of legacy agency budgets.`,
    relationships: "High-touch operational setup followed by automated portal support.",
    channels: "Direct sales outreach, B2B marketplaces, local tech accelerators.",
    segments: cleanAudience,
    costs: "Compute server instance subscriptions, talent payroll, direct customer marketing.",
    revenues: "Monthly active subscription plans, tailored enterprise APIs, custom integrations."
  };

  const leanCanvas = {
    problem: cleanProblem,
    solution: `Deploying a custom ${cleanTech} pipeline optimized with the developer's ${cleanSkills}.`,
    uvp: `The only ${cleanTech} platform built specifically to streamline ${cleanIndustry} workflows in ${cleanCountry}.`,
    unfairAdvantage: `Proprietary localized dataset fine-tuning and stateful session caching algorithms.`,
    segments: cleanAudience,
    channels: "Digital tech forums, outbound LinkedIn outreach, software referral networks.",
    metrics: "Monthly Active Users (MAU), Customer Acquisition Cost (CAC), Net Promoter Score (NPS).",
    costs: `Development hardware procurement (${estimatedCost}), server hosting, basic legal setups.`,
    revenues: "Direct pay-per-use token API rates and tiered monthly team dashboards."
  };

  const growthRate = 12 + (hash % 14); 
  const marketSizeVal = 100 + (hash % 850); 
  const marketResearch = {
    marketSize: `$${marketSizeVal} Million (Global Target Sector)`,
    growthRate: `CAGR ${growthRate}.5% (Projected 2026-2031)`,
    trends: cleanTrends,
    regionalOpportunities: `High regional growth detected in major commercial cities across ${cleanCountry}.`,
    governmentSupport: `Subsidized credits under regional digitalization policies in ${cleanCountry}.`,
    customers: cleanAudience
  };

  const competitor1 = `Alpha ${cleanIndustry} Tech`;
  const competitor2 = `Nexus ${cleanTech} Labs`;
  const competitors = [
    {
      name: competitor1,
      website: `www.${competitor1.toLowerCase().replace(/\s+/g, '')}.com`,
      funding: `$${(2 + (hash % 10))}M Seed`,
      businessModel: "B2B SaaS Subscriptions",
      strengths: "Early market entry, established client base.",
      weaknesses: "Slow feature development cycles, high integration overheads.",
      differentiation: `Uses generic APIs, whereas our system offers highly customized workflows using ${cleanSkills}.`,
      opportunityGap: "Lacks localized edge support and lightweight low-cost configurations."
    },
    {
      name: competitor2,
      website: `www.${competitor2.toLowerCase().replace(/\s+/g, '')}.com`,
      funding: "Bootstrapped / Profitable",
      businessModel: "Custom Agency Consulting",
      strengths: "Strong service customizability, close customer relationships.",
      weaknesses: "Extremely difficult to scale, high implementation costs.",
      differentiation: "Fully automated, instant self-serve dashboards.",
      opportunityGap: "Not built as a product, making it slow and expensive for smaller clients."
    }
  ];

  const patentYear = 1998 + (hash % 15);
  const patentNum = 5000000 + (hash % 1882048);
  const patents = [
    {
      id: `US-${patentNum}-A`,
      title: `Expired patent for automated scheduling loops in ${cleanIndustry} frameworks (${patentYear})`,
      revivalPath: `Revive and rewrite the archaic hardware logic using modern ${cleanTech} and ${cleanSkills} models on edge microcontrollers.`,
      commercialPotential: "High (solves legacy implementation blockers)",
      difficulty: "Medium",
      investment: "Low ($5,000 - $10,000)"
    }
  ];

  const failedStartups = [
    { name: "Solyndra", sector: "Green Energy", year: 2011, mistake: "High silicon fabrication overheads." },
    { name: "Rowbot", sector: "Agriculture", year: 2016, mistake: "Heavy machinery and legacy navigation components." },
    { name: "Cue Health", sector: "Healthcare", year: 2024, mistake: "High cartridge manufacturing costs and regulatory delays." },
    { name: "Pebble", sector: "Hardware", year: 2016, mistake: "Overextended app store scaling instead of core BLE focus." }
  ];
  const failedStartup = failedStartups[hash % failedStartups.length];

  const revBase = 12 + (hash % 18); 
  const pricingOptions = ["SaaS Subscription model", "Transactional API pricing", "Tiered licensing"];
  const revenueForecast = {
    monthly: `$${revBase}K / Month`,
    annual: `$${revBase * 12}K / Year`,
    breakeven: `${(4 + (hash % 6))} Months`,
    roi: `${(150 + (hash % 200))}% over 24 Months`,
    pricing: pricingOptions[hash % pricingOptions.length]
  };

  const pitchDeck = {
    elevator: `We are building ${title} to solve the critical problem where ${cleanProblem}. By using ${cleanTech}, we help ${cleanAudience} save up to 80% of legacy costs.`,
    slides: [
      { slideNum: 1, title: "The Problem", content: `SMEs face massive inefficiencies: "${cleanProblem}"` },
      { slideNum: 2, title: "The Solution", content: `Introducing ${title}: utilizing ${cleanTech} to streamline operations.` },
      { slideNum: 3, title: "Market Opportunity", content: `A $${marketSizeVal}M target sector growing at CAGR ${growthRate}.5%.` },
      { slideNum: 4, title: "Revenue & Projections", content: `Targeting ${revenueForecast.monthly} with break-even in ${revenueForecast.breakeven}.` }
    ],
    speakerNotes: [
      "Welcome, investors. Today, we are excited to introduce a massive efficiency vector in the business industry.",
      "The core bottleneck today is that organizations lose time and resources on repetitive, unoptimized tasks.",
      "Our solution is lightweight, scales instantly, and utilizes low-cost microcontrollers.",
      "We project reaching profitability within a few months. Thank you."
    ],
    questions: [
      "How do you plan to acquire your first 50 corporate customers?",
      `What is your technical defense model against big tech platforms copying your ${cleanTech} pipeline?`,
      "What are the major data storage privacy policies under your country's jurisdiction?"
    ]
  };

  const risks = [
    { category: "Technical", description: "Integration limits with legacy client database setups.", mitigation: "Provide universal REST API endpoints and simple Webhook listeners." },
    { category: "Financial", description: "Server computation costs exceeding budget limits during high traffic.", mitigation: "Implement caching, edge model execution, and strict API rate caps." },
    { category: "Legal", description: "Varying compliance and safety regulations regarding digital data storage.", mitigation: "Fully encrypt all user credentials and store metadata locally on user nodes." }
  ];

  const roadmap = [
    { milestone: "Market Research & Validation", status: "Completed", duration: "2 weeks" },
    { milestone: "Capillary Cap/Software Prototyping", status: "In Progress", duration: "4 weeks" },
    { milestone: "Core MVP Integration Testing", status: "Planned", duration: "3 weeks" },
    { milestone: "Staging Portal Deployment", status: "Planned", duration: "2 weeks" },
    { milestone: "Launch & Seed Fundraising", status: "Planned", duration: "6 weeks" }
  ];

  const fundingSchemes = [
    { name: "Regional Innovation Grant Program", type: "Non-dilutive Grant", amount: "$25,000", eligibility: "Early-stage tech startups solving regional problems.", link: "https://www.startupindia.gov.in" },
    { name: "Tech Seed Accelerator Cohort", type: "Equity Investment", amount: "$100,000 for 7%", eligibility: "Prototype ready with initial user interest.", link: "https://www.ycombinator.com" }
  ];

  const innovationOpportunities = [
    `Create a low-cost e-paper display hub for monitoring ${cleanIndustry} node logs.`,
    `Build an edge AI model to pre-filter diagnostic logs before cloud uploads.`,
    `Establish a local mesh network to communicate diagnostic signals in remote areas.`
  ];

  res.json({
    success: true,
    idea: {
      title,
      description: `A next-generation business venture leveraging ${cleanTech} and ${cleanSkills} to automate operations in the ${cleanIndustry} industry within ${cleanCountry}.`,
      problem: cleanProblem,
      solution: `A decentralized, high-efficiency ${cleanTech} workspace tailored to optimize tasks, resolving the critical pain point of "${cleanProblem}".`,
      targetCustomers: cleanAudience,
      revenueModel: revenueForecast.pricing,
      businessModel: "B2B SaaS / Usage API Mappings",
      marketOpportunity: `Target market size of $${marketSizeVal}M growing at ${growthRate}.5% CAGR.`,
      techStack: `${cleanTech}, Python, Node.js, SQLite, React, Docker`,
      budget: cleanBudget,
      timeline,
      difficulty,
      innovationScore,
      commercialPotential,
      technicalFeasibility,
      marketFeasibility,
      financialFeasibility,
      riskScore,
      scalabilityScore,
      overallSuccessProb,
      swot,
      bmc,
      leanCanvas,
      marketResearch,
      competitors,
      patents,
      failedStartup: {
        name: failedStartup.name,
        failureReason: failedStartup.mistake,
        mistakes: `Scaling sales channels too quickly without validating core TRL capability.`,
        lessonsLearned: `Maintain lean burn rates and focus on proving customer demand before factory toolings.`,
        revivalEnablers: `Using modern ${cleanTech} and high-efficiency batteries to cut manufacturing and operating costs by 70%.`
      },
      fundingSchemes,
      innovationOpportunities,
      revenueForecast,
      investmentReadiness: {
        pitchQuality: 75 + (hash % 15),
        validation: 70 + (hash % 20),
        productReady: 60 + (hash % 25),
        businessReady: 70 + (hash % 20),
        techReadiness: 75 + (hash % 15),
        investorScore: Math.round(70 + (hash % 20))
      },
      pitchDeck,
      risks,
      roadmap
    }
  });
};

const savedStartupsFile = path.join(__dirname, '../database/saved_startups.json');

const loadSavedStartups = () => {
  try {
    if (!fs.existsSync(path.dirname(savedStartupsFile))) {
      fs.mkdirSync(path.dirname(savedStartupsFile), { recursive: true });
    }
    if (!fs.existsSync(savedStartupsFile)) {
      fs.writeFileSync(savedStartupsFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(savedStartupsFile, 'utf8'));
  } catch (e) {
    return [];
  }
};

const saveSavedStartups = (data) => {
  fs.writeFileSync(savedStartupsFile, JSON.stringify(data, null, 2));
};

export const saveStartupIdea = async (req, res) => {
  const { idea } = req.body;
  if (!idea || !idea.title) {
    return res.status(400).json({ success: false, message: "A valid business idea is required to save." });
  }

  const saved = await loadSavedStartupsFromDB();
  const existsIdx = saved.findIndex(s => s.title.toLowerCase() === idea.title.toLowerCase());
  if (existsIdx > -1) {
    saved[existsIdx] = { ...saved[existsIdx], ...idea, savedAt: new Date().toISOString() };
  } else {
    saved.push({ ...idea, savedAt: new Date().toISOString() });
  }
  await await saveSavedStartups(saved);

  res.json({ success: true, message: "Business idea saved successfully to workspace database." });
};

export const getSavedStartupIdeas = async (req, res) => {
  const saved = await loadSavedStartupsFromDB();
  res.json({ success: true, startups: saved });
};

export const regenerateSection = async (req, res) => {
  const { title, industry, technology, sectionKey } = req.body;
  if (!sectionKey) {
    return res.status(400).json({ success: false, message: "sectionKey is required." });
  }

  const cleanTitle = title || "Venture System";
  const cleanIndustry = industry || "General Technology";
  const cleanTech = technology || "AI & Cloud Integrations";
  const hash = Math.floor(Math.random() * 1000);

  let updatedContent = null;

  switch (sectionKey) {
    case 'description':
      updatedContent = `A decentralized, high-efficiency business venture built to scale operations in the ${cleanIndustry} sector by integrating custom ${cleanTech} pipeline controls.`;
      break;
    case 'problem':
      updatedContent = `Organizations in the ${cleanIndustry} sector lose up to 35% productivity to manually managing repetitive validation checklists and unoptimized hardware allocations.`;
      break;
    case 'solution':
      updatedContent = `Deploying the ${cleanTitle} network: utilizing specialized ${cleanTech} models to automatically route logs, verify signatures, and run local neural filters.`;
      break;
    case 'techStack':
      const stacks = [
        `${cleanTech}, Rust, Actix-web, PostgreSQL, Kubernetes`,
        `${cleanTech}, Python, FastAPI, MongoDB, AWS Lambda, React`,
        `${cleanTech}, Go, Gin-Gonic, Redis, SQLite, Docker, Tailwind`
      ];
      updatedContent = stacks[hash % stacks.length];
      break;
    case 'revenueModel':
      const pricing = ["Tiered B2B SaaS licensing", "Transactional API credit rates", "Pay-as-you-go NPU compute scales"];
      updatedContent = pricing[hash % pricing.length];
      break;
    case 'swot':
      updatedContent = {
        strengths: [
          `Highly customizability using the developer's unique stack.`,
          `Edge execution capability cuts server cost overheads by 80%.`,
          `Fully compliant with local regional grids.`
        ],
        weaknesses: [
          `Initial deployment requires dedicated customer onboarding.`,
          `Dependency on external model updates.`,
          `Model bias checks require ongoing compliance audits.`
        ],
        opportunities: [
          `Rapid expansion into new logistics hubs.`,
          `Licensing the proprietary pipeline to enterprise partners.`,
          `Securing non-dilutive government research grants.`
        ],
        threats: [
          `Baseline hardware pricing fluctuations.`,
          `New open-source models offering default copy tools.`,
          `Data localization laws restricting cross-border transfers.`
        ]
      };
      break;
    case 'revenueForecast':
      const revBase = 15 + (hash % 15);
      updatedContent = {
        monthly: `$${revBase}K / Month`,
        annual: `$${revBase * 12}K / Year`,
        breakeven: `${4 + (hash % 4)} Months`,
        roi: `${180 + (hash % 120)}% over 24 Months`,
        pricing: "B2B SaaS / Usage Billing Mappings"
      };
      break;
    case 'risks':
      updatedContent = [
        { category: "Technical", description: "Interoperability bottlenecks with old database systems.", mitigation: "Use universal REST API endpoints and simple Webhook triggers." },
        { category: "Security", description: "Vulnerability to prompt injection or model leakage.", mitigation: "Enforce strict query filtering and execute models locally on user nodes." }
      ];
      break;
    case 'roadmap':
      updatedContent = [
        { milestone: "Proof of Concept Research", status: "Completed", duration: "1 week" },
        { milestone: "Core API Engineering", status: "In Progress", duration: "3 weeks" },
        { milestone: "User Testing & Launch", status: "Planned", duration: "4 weeks" }
      ];
      break;
    default:
      updatedContent = `Freshly compiled content for section ${sectionKey} initialized successfully.`;
  }

  res.json({
    success: true,
    content: updatedContent
  });
};

export const getInnovationOpportunities = async (req, res) => {
  const { industry, technology, domain, problemStatement } = req.body;

  const cleanIndustry = industry || "Agriculture";
  const cleanTech = technology || "IoT, Edge AI";
  const cleanDomain = domain || "Sensors & Irrigation";
  const cleanProblem = problemStatement || "SMEs lose productivity due to manual tracking loops.";

  const seedText = `${cleanIndustry} ${cleanTech} ${cleanDomain} ${cleanProblem}`;
  const hash = seedText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const titles = [
    `Autonomous ${cleanIndustry} Revival Node`,
    `Optimized ${cleanTech} for ${cleanIndustry} Systems`,
    `Integrated Smart ${cleanDomain} Hub`,
    `Edge AI-Enabled ${cleanIndustry} Orchestrator`
  ];
  const projectTitle = titles[hash % titles.length];

  const failedList = [
    { name: "Rowbot", year: 2016, mistake: "Heavy machinery and heavy batteries with 4-hour caps." },
    { name: "Theranos", year: 2018, mistake: "Promising diagnostic validation thresholds before clinical laboratory controls are established." },
    { name: "Pebble", year: 2016, mistake: "Overextended app store scaling instead of core BLE focus." },
    { name: "Cue Health", year: 2024, mistake: "High cartridge manufacturing costs and regulatory validation limits." }
  ];
  const origFail = failedList[hash % failedList.length];

  const innovationScore = 80 + (hash % 16);
  const commercialPotential = 78 + (hash % 18);
  const patentOpportunity = 82 + (hash % 14);
  const startupPotential = 75 + (hash % 20);

  const hackathonMatches = [
    {
      name: "Unstop Generative AI Hackathon 2026",
      deadline: "2026-11-12",
      link: "https://unstop.com/hackathons/unstop-genai-2026",
      reason: `Matches your interest in ${cleanIndustry} and ${cleanTech} stack perfectly.`
    },
    {
      name: "Knowafest National AgriTech Hackathon 2026",
      deadline: "2026-10-05",
      link: "https://www.knowafest.com/college-fests/agritech-2026",
      reason: `High synergy with agricultural telemetry and low-cost sensor optimization.`
    }
  ];

  const innovation = {
    title: projectTitle,
    description: `A decentralized, high-efficiency system designed to revive expired structural patents and failed business concepts in the ${cleanIndustry} industry, utilizing modern ${cleanTech} stacks.`,
    originalInnovation: origFail.name,
    whyItFailed: origFail.mistake,
    currentLimitations: `Previous platforms exceeded standard consumer cost thresholds and lacked low-latency telemetry protocols.`,
    modernTechnologies: `Edge AI microcontrollers, low-power mesh radios (ESP32), high-density e-paper displays, foveated neural networks.`,
    suggestedImprovements: `Offload raw processing layers to local edge nodes; replace high-voltage cellular models with mesh BLE relays.`,
    techStack: `${cleanTech}, Python, React, Flask, SQLite, Docker`,
    difficulty: (hash % 3 === 0) ? "Easy" : ((hash % 3 === 1) ? "Medium" : "High"),
    innovationScore,
    commercialPotential,
    patentOpportunity,
    startupPotential,
    budget: `$${10 + (hash % 40)}K`,
    timeline: `${2 + (hash % 6)} Months`,
    futureScope: `Expansion into global regional hubs with automated local localization features.`,
    sustainabilityImpact: `Reduces operating carbon footprint by 65% by substituting cloud server instances with edge-execution devices.`,
    researchPapers: [
      { title: `Real-time static code auditing via local ML models in ${cleanIndustry}`, link: "https://arxiv.org/abs/2306.0123" },
      { title: `Low-power mesh relays in high-density diagnostics`, link: "https://spie.org/publications" }
    ],
    githubProjects: [
      { name: `awesome-${cleanIndustry.toLowerCase()}-revival-pipelines`, link: `https://github.com/mit-eecs/awesome-${cleanIndustry.toLowerCase()}` },
      { name: `decentralized-${cleanTech.toLowerCase().replace(/[\s,]+/g, '-')}-nodes`, link: "https://github.com/vance-labs/decentralized-auth-gate" }
    ],
    similarProjects: [
      { name: `US-6481639-B2: Drip irrigation loops`, type: "Patent", similarity: "85%" },
      { name: `BioFarm soil diagnostics`, type: "Startup Case", similarity: "78%" }
    ],
    hackathonMatches,
    guidanceSteps: [
      { step: 1, text: "Initial Research & Feasibility Completed", completed: true },
      { step: 2, text: "Read related Research Papers and Expired Patents", completed: false },
      { step: 3, text: "Design System Architecture & Mesh routing", completed: false },
      { step: 4, text: "Fabricate Hardware prototype / Staging Code", completed: false },
      { step: 5, text: "Validation Testing & Performance audits", completed: false },
      { step: 6, text: "Prepare Hackathon Pitch deck and Video demo", completed: false }
    ]
  };

  res.json({
    success: true,
    innovation
  });
};

