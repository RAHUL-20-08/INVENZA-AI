import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { loadInnovationsFromDB } from '../utils/dbFetcher.js';
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

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'InvenzaDiagnosticsApp/2.0 (contact: support@invenza.ai)'
        }
      };
      https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}. Raw data: ${data.slice(0, 100)}`));
          }
        });
      }).on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

const extractTechnicalKeywords = (text, title) => {
  if (!text) return [title];
  const stopWords = new Set([
    'the', 'and', 'of', 'to', 'in', 'is', 'a', 'was', 'for', 'on', 'by', 'an', 'it', 'with', 'as', 'at', 
    'from', 'that', 'this', 'be', 'or', 'which', 'were', 'are', 'its', 'their', 'but', 'not', 'he', 'she', 
    'they', 'who', 'has', 'have', 'had', 'been', 'would', 'could', 'should', 'more', 'most', 'some', 'any',
    'other', 'such', 'into', 'than', 'then', 'also', 'first', 'two', 'new', 'used', 'using', 'use', 'made',
    'after', 'before', 'during', 'under', 'over', 'between', 'through', 'about', 'against', 'these', 'those'
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
    if (/^(However|Although|Therefore|Furthermore|Initially|Subsequently|During|Under|Despite|Unlike)$/.test(cleanMatch)) continue;
    
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

const generateSWOT = (topic, keywords) => {
  return `### 📊 SWOT Analysis for Revived ${topic}

Here is a customized SWOT profile for modernizing **${topic}** using **${keywords[0]}**, **${keywords[1]}**, and **${keywords[2]}**:

| Strengths (Internal) | Weaknesses (Internal) |
| :--- | :--- |
| • Open source registry leverage cuts early IP costs.<br>• Integrates modern **${keywords[0]}** for superior capabilities. | • Early prototype setups are highly complex.<br>• Dependency on active API access keys. |

| Opportunities (External) | Threats (External) |
| :--- | :--- |
| • Growing market demand for decentralized **${keywords[1]}** tools.<br>• High scaling potential via modular B2B **${keywords[2]}** models. | • Aggressive fast-mover clones copying features.<br>• Changing localized data compliance regulations. |

*Type **"Canvas"** to generate the Business Model Canvas next, or **"Budget"** to see financial breakdowns!*`;
};

const generateBusinessCanvas = (topic, keywords) => {
  return `### 💼 Business Model Canvas for ${topic}

Here is a structured business canvas to launch the modern vector of **${topic}**:

* **Key Partners**: Cloud host infrastructure nodes, developer communities, open-source maintainers.
* **Key Activities**: Refactoring core libraries, training local **${keywords[0]}** parameters, securing patent licenses.
* **Value Propositions**: A low-latency, modular alternative to centralized legacy systems powered by **${keywords[1]}**.
* **Customer Relationships**: Transparent open-source documentation, developer dashboards, self-hosted options.
* **Customer Segments**: B2B software engineering teams, independent researchers, and system operators.
* **Key Resources**: Proprietary training data nodes, hardware accelerators, registry clearance records.
* **Channels**: GitHub developer community, ProductHunt, tech publications, and API registries.
* **Cost Structure**: Server hosting instances, micro-chip fabrication materials, API data storage.
* **Revenue Streams**: SaaS subscriptions, premium API calls for **${keywords[2]}**, and custom enterprise setups.

*Type **"SWOT"** to view strengths and weaknesses, or **"Budget"** to see development costs!*`;
};

const generateFinancialBreakdown = (topic) => {
  return `### 💰 Financial & Development Budget: ${topic}

Here is the estimated cost breakdown to build and launch the modernized proof-of-concept for **${topic}**:

* 🛠️ **R&D & Engineering**: **$180,000** (Full-stack developer contracts, custom software libraries, algorithm training).
* ⚙️ **Hardware & Prototyping**: **$95,000** (Dev board units, sensor calibration units, local GPU rendering instances).
* 📁 **IP & Compliance**: **$35,000** (Patent filing fees, regulatory audits, legal clearances).
* 📢 **Marketing & Scaling**: **$40,000** (Developer community outreach, API launch promotions).

**Total Estimated Budget**: **$350,000**
*Recommended Funding Source*: Seed rounds, university research grants, or VC incubators (e.g. Y Combinator).

*Type **"Explain"** to read dynamic breakdowns of the suggested accelerators!*`;
};

const generateAcceleratorExplanation = (topic, keywords) => {
  return `### 💡 Accelerator Explanations: ${topic}

Here is a breakdown of how the suggested accelerators solve the bottlenecks of **${topic}**:

1. **Modern ${keywords[0]} Integration**:
   * *The Problem*: Legacy configurations lacked localized computational power, bottlenecking frame processing or coordinate calculations.
   * *The Solution*: Edge-computing processors allow the device to run neural parameters directly on-device in under 30ms, eliminating server latency.

2. **Decentralized ${keywords[1]} Workflows**:
   * *The Problem*: Storing massive files or running index search queries on centralized servers caused high operational costs and scalability limits.
   * *The Solution*: A distributed storage pattern leverages idle network nodes, cutting infrastructure costs by up to 60%.

3. **Scalable ${keywords[2]} Deployment**:
   * *The Problem*: Closed software architectures blocked external developers, limiting the product's ecosystem.
   * *The Solution*: Packaging functionalities in lightweight API endpoints allows external creators to build integrations, scaling the platform organically.

*Type **"SWOT"** or **"Canvas"** to continue auditing other dimensions!*`;
};

export const chatWithAI = async (req, res) => {
  const { messages, currentContext } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ success: false, message: 'Messages array is required.' });
  }

  const userQuery = messages[messages.length - 1].content;
  const latestMessage = userQuery.toLowerCase().trim();
  const db = await loadInnovationsFromDB();
  let responseText = "";

  // Check for common greetings
  const greetingKeywords = ["hi", "hello", "hey", "who are you", "what is this", "welcome", "help", "howdy", "greetings"];
  const isGreeting = greetingKeywords.some(g => latestMessage === g || latestMessage.startsWith(g + " ") || latestMessage.endsWith(" " + g));

  if (isGreeting) {
    responseText = `### 👋 Welcome to Invenza AI Copilot!
    
I am **ReviveAI**, your platform companion operating as a real-time diagnostics assistant. I can search global registries, analyze forgotten patents, and outline modern startup revival vectors for any tech concept.

**Try asking me details about specific projects or custom tech ideas:**
* 🔍 *"How can we revive the Lytro camera today?"*
* 📊 *"What are the main bottlenecks of Google Glass?"*
* 💡 *"Suggest a startup roadmap for Pebble Smartwatch"*
* 🔋 *"Tell me how to improve solid-state batteries"*`;

    return res.json({
      success: true,
      message: {
        role: "assistant",
        content: responseText
      }
    });
  }

  // --- CONVERSATIONAL CONTEXT SCANNER ---
  // Find the last discussed topic and keywords in the message history
  let activeTopic = null;
  let activeKeywords = ["Edge AI", "Decentralized RAG", "SaaS APIs"];
  
  for (let i = messages.length - 2; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      const content = messages[i].content;
      // Match "Search: Topic" or "Audit: Topic" or "Diagnostics: Topic"
      const match = content.match(/### (?:🔍 Real-Time System Search|🌟 Real-Time Registry Audit|⚡ Invenza Real-Time Diagnostics):\s*"?([^#\n"]+)"?/);
      if (match) {
        activeTopic = match[1].trim();
        // Try to extract keywords previously suggested
        const kwMatches = content.match(/modern \*\*([^*]+)\*\*|real-time \*\*([^*]+)\*\*|scalable \*\*([^*]+)\*\*/gi);
        if (kwMatches) {
          activeKeywords = kwMatches.map(m => m.replace(/modern |real-time |scalable |\*\*/gi, '').trim());
        }
        break;
      }
    }
  }

  // Handle follow-ups if activeTopic exists
  if (activeTopic) {
    if (latestMessage.includes("swot") || latestMessage.includes("strengths") || latestMessage.includes("weaknesses") || latestMessage.includes("opportunities") || latestMessage.includes("threats")) {
      responseText = generateSWOT(activeTopic, activeKeywords);
    } else if (latestMessage.includes("canvas") || latestMessage.includes("business model") || latestMessage.includes("b2c") || latestMessage.includes("monetiz")) {
      responseText = generateBusinessCanvas(activeTopic, activeKeywords);
    } else if (latestMessage.includes("budget") || latestMessage.includes("cost") || latestMessage.includes("financial") || latestMessage.includes("price") || latestMessage.includes("how much") || latestMessage.includes("funding")) {
      responseText = generateFinancialBreakdown(activeTopic);
    } else if (latestMessage.includes("explain") || latestMessage.includes("accelerator") || latestMessage.includes("point") || latestMessage.includes("how does") || latestMessage.includes("detail")) {
      responseText = generateAcceleratorExplanation(activeTopic, activeKeywords);
    } else if (latestMessage.includes("more") || latestMessage.includes("what else") || latestMessage.includes("next")) {
      responseText = `### ➔ Interactive Options for ${activeTopic}
      
I remember we are currently discussing **${activeTopic}**. What would you like to analyze next?
* 📊 Type **"SWOT"** to generate a strengths/weaknesses grid.
* 💼 Type **"Canvas"** to build a 9-block Business Model Canvas.
* 💰 Type **"Budget"** to see a detailed development cost breakdown.
* 💡 Type **"Explain"** to read detailed breakdowns of the 3 suggested accelerators.`;
    }
    
    if (responseText) {
      return res.json({
        success: true,
        message: {
          role: "assistant",
          content: responseText
        }
      });
    }
  }

  // --- GENERAL SEARCH ROUTE ---
  // 1. Check if user is asking about a specific local database innovation
  let referencedInnovation = null;
  db.innovations.forEach(item => {
    if (latestMessage.includes(item.name.toLowerCase()) || latestMessage.includes(item.id.replace('-', ' '))) {
      referencedInnovation = item;
    }
  });

  if (referencedInnovation) {
    const keywords = extractTechnicalKeywords(referencedInnovation.description, referencedInnovation.name);
    const keyword1 = keywords[0] || "Edge AI";
    const keyword2 = keywords[1] || "Decentralized RAG";
    const keyword3 = keywords[2] || "Modular APIs";

    responseText = `### 🌟 Real-Time Registry Audit: ${referencedInnovation.name}

Based on the system's local database indexing, here is the revival vector analysis for **${referencedInnovation.name}**:

#### 📋 Technology Abstract
"${referencedInnovation.description}"

#### ⚙️ Technical Working & Status Details
* **Operating Status**: DISCONTINUED / DEFUNCT (Historical Index)
* **Filing Era**: Year ${referencedInnovation.yearFiled || 2012} (Patent Status: ${ (referencedInnovation.yearFiled + 20) < new Date().getFullYear() ? 'EXPIRED - Public Domain' : 'ACTIVE - IP Protected' })
* **Primary Bottleneck**: ${referencedInnovation.failureBottlenecks[0]}

#### 💡 Suggested Modern Revival Accelerators
* **➔ Integrate Edge Computing**: Combine advanced computational layers with modern **${keyword1}** frameworks to bypass legacy hardware limitations.
* **➔ Decentralize Infrastructure**: Deploy distributed micro-networks to optimize real-time **${keyword2}** workflows.
* **➔ Leverage Smart Materials**: Apply scalable **${keyword3}** solutions to drive enterprise commercialization paths.

#### 📊 Startup & Commercialization Pathway
* **Estimated Budget**: ${referencedInnovation.financials.estimatedCost}
* **Suggested Funding**: ${referencedInnovation.financials.potentialInvestors.slice(0, 2).join(" & ")}
* **Milestone Checklist**:
  1. *Phase 1 (Wireframing)*: Design layout endpoints and mock telemetry monitors.
  2. *Phase 2 (MVP prototype)*: Fabricate small-scale verification modules.
  3. *Phase 3 (Validation)*: Run local performance audits.

Would you like me to generate a detailed **Business Canvas** or a **SWOT Analysis** for this project?`;

    return res.json({
      success: true,
      message: {
        role: "assistant",
        content: responseText
      }
    });
  }

  // 2. Perform Real-Time Wikipedia Search for general questions (ChatGPT/Perplexity Simulator)
  try {
    const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(userQuery)}&origin=*`;
    const searchData = await fetchJson(wikiSearchUrl);

    if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
      const bestWikiMatch = searchData.query.search[0];
      
      // Fetch detailed page abstract
      const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(bestWikiMatch.title)}&origin=*`;
      const detailData = await fetchJson(detailUrl);
      
      const pages = detailData.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pageId !== "-1" ? pages[pageId].extract : "";

      if (extract && extract.trim().length > 30) {
        // Determine operating status from Wikipedia abstract
        let operatingStatus = "INACTIVE (Historical Technology)";
        const lowerExtract = extract.toLowerCase();
        if (lowerExtract.includes("discontinued") || lowerExtract.includes("ceased") || lowerExtract.includes("defunct") || lowerExtract.includes("abandoned") || lowerExtract.includes("shut down") || lowerExtract.includes("cancelled")) {
          operatingStatus = "DISCONTINUED / OBSOLETE";
        } else if (lowerExtract.includes("active") || lowerExtract.includes("ongoing") || lowerExtract.includes("currently in use") || lowerExtract.includes("current")) {
          operatingStatus = "ACTIVE / OPERATIONAL";
        }

        // Extrapolate filing date from text
        let filedYear = 2010;
        const yearMatches = extract.match(/\b(19\d{2}|20\d{2})\b/g);
        if (yearMatches) {
          const validYears = yearMatches
            .map(y => parseInt(y, 10))
            .filter(y => y >= 1950 && y <= new Date().getFullYear());
          if (validYears.length > 0) {
            filedYear = Math.min(...validYears);
          }
        }

        // Dynamic accelerators suggestions derived from the actual Wikipedia page abstract!
        const keywords = extractTechnicalKeywords(extract, bestWikiMatch.title);
        const keyword1 = keywords[0] || "Edge AI";
        const keyword2 = keywords[1] || "Decentralized RAG";
        const keyword3 = keywords[2] || "Modular APIs";

        responseText = `### 🔍 Real-Time System Search: ${bestWikiMatch.title}

Based on current global registries and technical archives, here is a diagnostic review of **${bestWikiMatch.title}**:

#### 📋 Technology Abstract
"${extract.slice(0, 320) + (extract.length > 320 ? "..." : "")}"

#### ⚙️ Technical Working & Status Details
* **Operating Status**: ${operatingStatus}
* **Filing Era**: Estimated founding/filed in ${filedYear} (Patent Clearance: ${ (filedYear + 20) < new Date().getFullYear() ? 'EXPIRED - Public Domain' : 'ACTIVE - IP Protected' })

#### 💡 Suggested Modern Revival Accelerators
* **➔ Integrate Edge Computing**: Combine advanced computational layers with modern **${keyword1}** frameworks to bypass legacy hardware limitations.
* **➔ Decentralize Infrastructure**: Deploy distributed grid micro-networks to route currents based on real-time **${keyword2}** patterns.
* **➔ Leverage Smart Materials**: Apply scalable **${keyword3}** solutions to drive enterprise commercialization paths.

#### 📊 Startup & Commercialization Pathway
* **Estimated Budget**: $450,000 to construct a modular proof-of-concept.
* **Suggested Funding**: Venture capital micro-funds, green technology grants, and local incubators.
* **Development Milestones**:
  1. *Phase 1 (Wireframing)*: Design layout endpoints and mock telemetry monitors.
  2. *Phase 2 (MVP prototype)*: Fabricate small-scale verification modules.
  3. *Phase 3 (Validation)*: Run local charging loop performance audits.

Is there any specific detail or code snippet you would like me to generate for this project?`;

        return res.json({
          success: true,
          message: {
            role: "assistant",
            content: responseText
          }
        });
      }
    }
  } catch (err) {
    console.warn("Wikipedia Registry query failed inside Chat Copilot:", err);
  }

  // 3. Fallback smart simulator for general tech topics when Wikipedia doesn't return page content
  let hash = 0;
  for (let i = 0; i < latestMessage.length; i++) hash += latestMessage.charCodeAt(i);
  const guessedYear = 2005 + (hash % 14);
  const isExpired = (guessedYear + 20) < new Date().getFullYear();

  responseText = `### ⚡ Invenza Real-Time Diagnostics: "${userQuery}"

I have analyzed your query **"${userQuery}"**. While I couldn't pull an exact match from historical registry files, here is a dynamic feasibility projection for this technical concept:

#### 📋 Concept Abstract
"A custom technical configuration targeting modern hardware efficiency, software API integrations, and cloud architectures."

#### ⚙️ Technical Working & Status Details
* **Operating Status**: CONCEPT / IDEATION PHASE
* **Filing Era**: Projected timeline of ${guessedYear} (Patent Clearance: ${isExpired ? 'EXPIRED - Public Domain' : 'ACTIVE - IP Protected'})

#### 💡 Suggested Modern Revival Accelerators
* **➔ Integrate Edge Computing**: Combine advanced computational layers with modern **Edge Computing** systems to bypass legacy bottlenecks.
* **➔ Decentralize Infrastructure**: Deploy distributed grid micro-networks to route currents based on real-time **Decentralized Data** patterns.
* **➔ Leverage Smart Materials**: Apply scalable **Modular Microservices** solutions to drive enterprise commercialization paths.

#### 📊 Startup & Commercialization Pathway
* **Estimated Budget**: $250,000 to construct a modular proof-of-concept.
* **Suggested Funding**: Angel syndicates, hackathon sponsors, and startup incubators.
* **Development Milestones**:
  1. *Phase 1 (Wireframing)*: Design layout endpoints and mock telemetry monitors.
  2. *Phase 3 (Validation)*: Run local performance audits.

How would you like to proceed with this custom innovation? I can outline a targeted SWOT analysis for it!`;

  res.json({
    success: true,
    message: {
      role: "assistant",
      content: responseText
    }
  });
};
