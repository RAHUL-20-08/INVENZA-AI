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

export const synthesizeSynergy = (req, res) => {
  const { itemA, itemB } = req.body;

  if (!itemA || !itemB) {
    return res.status(400).json({ success: false, message: 'Both technology items A and B are required.' });
  }

  const nameA = itemA.name || "Concept A";
  const nameB = itemB.name || "Concept B";

  const keywordsA = extractTechnicalKeywords(itemA.description || "", nameA);
  const keywordsB = extractTechnicalKeywords(itemB.description || "", nameB);

  const keyA = keywordsA[0] || "Hardware";
  const keyB = keywordsB[0] || "Software";

  const hybridName = `${nameA.split(' ')[0]} x ${nameB.split(' ')[0]} Synergy Platform`;
  const viability = Math.round(((itemA.revivalViability || 75) + (itemB.revivalViability || 75)) / 2) + 5;

  // Synthesize custom proposition and features using the distinct keywords
  const proposition = `Combines the structural architecture and **${keyA}** systems of ${nameA} with the advanced analytical **${keyB}** processing layers of ${nameB}. This hybrid integration resolves legacy bottlenecks of both parent systems.`;

  const features = [
    `➔ **Integrated Visual Telemetry**: Projects real-time coordination feeds and **${keyA}** metrics from ${nameA} directly onto the display overlays of ${nameB}.`,
    `➔ **Autonomous Core Synchronization**: Regulates local physical actuators and **${keywordsA[1] || "transceivers"}** of ${nameA} utilizing the decentralized **${keywordsB[1] || "RAG pipelines"}** of ${nameB}.`,
    `➔ **Modular Chassis Architecture**: Consolidates lightweight circuit grids and **${keywordsA[2] || "energy cells"}** into a durable housing equipped with **${keywordsB[2] || "SaaS API dashboards"}**.`
  ];

  const marketFit = `Targeting industrial inspection teams, smart facility logistics operations, and enterprise developer divisions working in both ${itemA.sector || "General Tech"} and ${itemB.sector || "Advanced Software"} sectors.`;

  res.json({
    success: true,
    report: {
      name: hybridName,
      sector: `${itemA.sector || "Hardware"} / ${itemB.sector || "Software"}`,
      viability,
      proposition,
      features,
      marketFit
    }
  });
};
