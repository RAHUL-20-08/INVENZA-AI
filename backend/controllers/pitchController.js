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

export const getPitchCritique = (req, res) => {
  const { name, sector, revivalViability, readinessLevel, failureBottlenecks, aiEnhancementVector, description, financials } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Innovation details are required.' });
  }

  const cost = financials?.estimatedCost || "$300,000";
  const viability = revivalViability || 75;
  const trl = readinessLevel || 4;
  
  const descText = description || (failureBottlenecks || []).join(" ") + " " + (aiEnhancementVector || []).join(" ");
  const keywords = extractTechnicalKeywords(descText, name);
  const keyword1 = keywords[0] || "Edge AI";
  const keyword2 = keywords[1] || "Decentralized RAG";
  const keyword3 = keywords[2] || "SaaS APIs";

  // Dynamic critique generation using extracted technical parameters
  const critiques = [
    {
      role: "Venture Capital Partner (Tech Transfer Specialist)",
      feedback: `The ${name} blueprint shows a solid TRL of ${trl}/9. However, our primary concern lies in the physical integration of **${keyword1}** components. To justify the proposed R&D ask of ${cost}, we recommend dedicating at least 20% of engineering hours to stress-testing latency boundary conditions, and running freedom-to-operate reviews to ensure no active patent claims are violated before initiating a seed round.`
    },
    {
      role: "Managing Director (Hardware & DeepTech Fund)",
      feedback: `A revival viability of ${viability}% is highly attractive, largely because modern **${keyword2}** and lower-cost microcontrollers resolve historical compute bottlenecks. Your main focus should be the competitive defensive moat: can you package this **${name}** variant into a proprietary developer SDK, or is it easily cloneable by large tech incumbents? Focus on detailing this IP fence on Slide 3.`
    },
    {
      role: "Angel Syndicate Lead (SaaS & Hardware Systems)",
      feedback: `Targeting the ${sector || "General Tech"} market makes sense, but we'd like to see a shorter timeline to commercial monetization. Rather than waiting for full-scale consumer production in Phase 4, you should establish a B2B **${keyword3}** subscription vector by Phase 2. This creates early cashflow while validating user engagement metrics in real-time.`
    }
  ];

  res.json({
    success: true,
    critiques
  });
};

export const getPitchQuestions = (req, res) => {
  const { name, sector, failureBottlenecks } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "Name is required." });
  
  const bottleneck = failureBottlenecks?.[0] || "obsolete hardware limitations";

  const questions = [
    {
      id: 0,
      question: `How exactly does your modern team bypass the legacy constraint of "${bottleneck}" in this configuration?`,
      helper: "Highlight modern AI or software upgrades (like Edge AI NPU chips or cloud scale frameworks)."
    },
    {
      id: 1,
      question: `What defensive IP moat are you building for ${name} to prevent clone entries in the ${sector || 'General Tech'} market?`,
      helper: "Focus on proprietary SDK licenses, local datasets, or unique integrations."
    },
    {
      id: 2,
      question: `If VC partners grant the cost estimate of ${req.body.financials?.estimatedCost || "$300,000"}, what are the specific milestones for Phase 1 and 2?`,
      helper: "Discuss wireframing, MVP validation, and testing schedules."
    }
  ];

  res.json({ success: true, questions });
};

export const evaluatePitchAnswer = (req, res) => {
  const { name, question, answer } = req.body;
  if (!answer || answer.trim().length < 8) {
    return res.json({
      success: true,
      score: 45,
      convictionChange: -2,
      feedback: "Answer is too short. Try to provide a detailed technical or business explanation to convince the investors."
    });
  }

  const cleanAns = answer.toLowerCase();
  let score = 70;
  let feedback = "";
  let convictionChange = 2;

  // Keyword check to reward tech jargon
  const techTerms = ["api", "sdk", "npu", "edge", "decentralized", "patent", "open source", "b2b", "calibration", "data", "scale", "mvp", "revenue"];
  let matches = 0;
  techTerms.forEach(term => {
    if (cleanAns.includes(term)) {
      score += 4;
      matches++;
    }
  });

  if (cleanAns.length > 100) {
    score += 5;
  }

  score = Math.min(95, score);

  if (score >= 85) {
    convictionChange = 6;
    feedback = `Excellent pitch delivery! Your answer incorporates critical parameters (e.g. ${techTerms.filter(t => cleanAns.includes(t)).slice(0,3).join(", ")}) and outlines clear metrics. Investors are highly receptive.`;
  } else if (score >= 70) {
    convictionChange = 3;
    feedback = `Strong start, but could be refined. We suggest making a stronger reference to the hardware deployment metrics or detailing the B2B licensing costs specifically.`;
  } else {
    convictionChange = -1;
    feedback = `The answer lacks specific investor metrics. Focus on explaining how the Modern AI layer reduces capital expenditures or bypasses the patent constraints.`;
  }

  res.json({
    success: true,
    score,
    convictionChange,
    feedback
  });
};
