import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/searchController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// Add import
if (!content.includes("import { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';");
}

// 1. Rewrite searchPatents Wikipedia fallback
const oldSearchPatentsWiki = `    // If not found locally, fetch from Wikipedia API
    try {
      const wikiUrl = \`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=\${encodeURIComponent(query)}&utf8=1\`;
      const response = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)' }
      });
      const searchData = await response.json();
      
      if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
        const bestMatch = searchData.query.search[0];
        
        // Fetch detailed page abstract
        const detailUrl = \`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original&titles=\${encodeURIComponent(bestMatch.title)}\`;
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
        
        const yearMatches = extract.match(/\\b(19\\d{2}|20\\d{2})\\b/);
        if (yearMatches) {
          yearFiled = parseInt(yearMatches[0], 10);
        }

        // Determine custom patent classifications and claims dynamically
        let classifications = "Information System / Tech";
        let claims = [
          \`A method for operating a \${bestMatch.title} device utilizing cloud API modules.\`,
          "A transmission channel routing data packets dynamically to feedback devices.",
          "An array layout mapping sensor outputs to coordinate structures."
        ];

        const s = bestMatch.title.toLowerCase();
        if (s.includes("health") || s.includes("medical") || s.includes("blood") || s.includes("theranos") || s.includes("bio") || s.includes("diagnostic")) {
          classifications = "Biomedical / Diagnostics";
          claims = [
            \`A microfluidic test cartridge layout for \${bestMatch.title} routing liquid samples.\`,
            "A spectrophotometer sensor array verifying chemical agent reaction rates.",
            "A software calibration array adjusting fluorescence lookup values dynamically."
          ];
        } else if (s.includes("glass") || s.includes("ar") || s.includes("vr") || s.includes("camera") || s.includes("optics") || s.includes("lens") || s.includes("waveguide") || s.includes("display")) {
          classifications = "Waveguide Optics / Displays";
          claims = [
            \`A diffractive waveguide prism array directing color light streams for \${bestMatch.title}.\`,
            "A microLED light projection system adjusting brightness matching ambient levels.",
            "An eye tracking sensor loop mapping user focal coordinates to display buffers."
          ];
        } else if (s.includes("watch") || s.includes("wearable") || s.includes("pebble") || s.includes("device") || s.includes("phone")) {
          classifications = "Wearables / Mobile Hardware";
          claims = [
            \`A low-power electrophoretic display interface for a \${bestMatch.title} device.\`,
            "A communication scheduler adjusting Bluetooth handshake sleep intervals.",
            "A snap-on modular magnetic terminal system permitting chassis disassembly."
          ];
        } else if (s.includes("scooter") || s.includes("car") || s.includes("stabilizer") || s.includes("gyro") || s.includes("mobility") || s.includes("vehicle")) {
          classifications = "Micro-Mobility / Self-Balancing";
          claims = [
            \`A gyroscopic self-stabilizing motor feedback controller for \${bestMatch.title}.\`,
            "A sensor array mapping tilt coordinates to brushless motor voltage limits.",
            "A geofencing transit limiter automatically lowering vehicle speed on sidewalks."
          ];
        } else if (s.includes("game") || s.includes("console") || s.includes("streaming") || s.includes("video") || s.includes("media") || s.includes("play")) {
          classifications = "Digital Media & Gaming";
          claims = [
            \`A cloud frame encoding interface transmitting game streams for \${bestMatch.title}.\`,
            "A packet loss concealment loop interpolating dropped WebRTC video frames.",
            "A decentralized node selector leasing local GPU resource pipelines dynamically."
          ];
        } else if (s.includes("water") || s.includes("filter") || s.includes("purify") || s.includes("filtration") || s.includes("environmental")) {
          classifications = "Environmental / Water Systems";
          claims = [
            \`A physical filtration membrane cartridge layout for \${bestMatch.title}.\`,
            "An optical fouling detection system scheduling automatic membrane backwash flows.",
            "A solar direct-drive motor regulating pump velocities to photovoltaic levels."
          ];
        } else if (s.includes("drone") || s.includes("flight") || s.includes("aerospace") || s.includes("aviation")) {
          classifications = "Aerospace / Flight Systems";
          claims = [
            \`A lightweight carbon-fiber composite wing layout for \${bestMatch.title} aircraft.\`,
            "An adaptive flight control surface adjusting servo positions in under 30ms.",
            "A weather navigation feedback loop mapping wind sensors to flight routes."
          ];
        }

        // Dynamic Patent Object
        const newPatent = {
          id: "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
          title: \`\${bestMatch.title} Patent System\`,
          inventor: inventor,
          filedYear: yearFiled,
          expiryYear: yearFiled + 20,
          status: yearFiled + 20 < new Date().getFullYear() ? "Expired (Public Domain)" : "Active (Licensing Req.)",
          classifications: classifications,
          claims: claims,
          description: extract || \`Intellectual property specifications describing the mechanical and digital integration of \${bestMatch.title}.\`
        };

        return res.json({ success: true, count: 1, data: [newPatent] });
      }
    } catch (e) {
      console.warn("Wikipedia API lookup failed for patent search, using local fallback.", e);
    }`;

const newSearchPatents = `    // If not found locally, fetch from Cerebras API
    try {
      const cerebrasData = await fetchCerebrasSearch(query);
      if (cerebrasData) {
        const newPatent = {
          id: "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
          title: cerebrasData.title || \`\${query} Patent\`,
          inventor: cerebrasData.inventor || "Unknown",
          filedYear: cerebrasData.year || 2023,
          expiryYear: (cerebrasData.year || 2023) + 20,
          status: "Active",
          classifications: cerebrasData.classifications || "General Tech",
          claims: cerebrasData.claims || ["A computational apparatus.", "A software interface.", "A hardware component."],
          description: cerebrasData.description || "Detailed analysis generated by AI."
        };
        return res.json({ success: true, count: 1, data: [newPatent] });
      }
    } catch (e) {
      console.warn("Cerebras API lookup failed for patent search, using local fallback.", e);
    }`;

if (content.includes('// If not found locally, fetch from Wikipedia API')) {
  // It's a huge string, so string replace might fail if there's any mismatch. 
  // Let's use Regex instead for robustness.
  const regex = /\/\/ If not found locally, fetch from Wikipedia API[\s\S]*?catch \([^\)]+\) \{[\s\S]*?\n    \}/;
  content = content.replace(regex, newSearchPatents);
}


// 2. Rewrite getSuggestions Wikipedia fallback
const getSuggestionsRegex = /try \{\n      const wikiUrl = \`https:\/\/en\.wikipedia\.org.*?return res\.json\(\{ success: true, suggestions: wikiSuggestions \}\);\n    \} catch \(e\) \{\n      console\.warn\("Wikipedia API suggestion fetch offline or failed\."\);\n    \}/;
const newGetSuggestions = `try {
      const cerebrasData = await fetchCerebrasSearch(cleanQuery);
      if (cerebrasData) {
        const aiSuggestion = {
          name: cerebrasData.title || cleanQuery,
          id: "ai_" + Date.now(),
          source: 'cerebras_ai_search'
        };
        const aiSuggestions = [...localMatches, aiSuggestion].slice(0, 5);
        suggestionsCache.set(cleanQuery, aiSuggestions);
        return res.json({ success: true, suggestions: aiSuggestions });
      }
    } catch (e) {
      console.warn("Cerebras API suggestion fetch offline or failed.");
    }`;

content = content.replace(getSuggestionsRegex, newGetSuggestions);

fs.writeFileSync(controllerPath, content);
console.log('searchController.js rewritten to use Cerebras API successfully.');
