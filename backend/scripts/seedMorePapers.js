import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/database.json');

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;

const domains = [
  'Quantum Computing', 'Biotechnology', 'Artificial Intelligence', 'Neurotechnology', 
  'Clean Energy', 'Nanotechnology', 'Space Exploration', 'Materials Science', 
  'Robotics', 'Genomics', 'Photonics', 'Synthetic Biology', 'Cryptography', 'Nuclear Fusion'
];

const buzzwords = ["Optimization", "Scalability", "Neural Networks", "Synthesis", "Dynamics", "Architectures", "Frameworks", "Interfaces", "Algorithms"];
const prefixes = ["A Novel Approach to", "Empirical Analysis of", "Theoretical Foundations of", "Advances in", "Next-Generation", "Deep Dive into", "Revolutionizing"];

const generatePapers = (count) => {
  const papers = [];
  for (let i = 0; i < count; i++) {
    const domain = domains[i % domains.length];
    const buzzword = buzzwords[Math.floor(Math.random() * buzzwords.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    papers.push({
      id: generateId('paper'),
      title: `${prefix} ${domain}: ${buzzword} and Applications`,
      authors: [`Dr. ${String.fromCharCode(65 + (i % 26))} Smith`, `Prof. ${String.fromCharCode(65 + ((i+3) % 26))} Johnson`],
      publishedYear: 2015 + Math.floor(Math.random() * 11),
      institution: `Institute of ${domain} Research`,
      domain: domain,
      abstract: `This paper presents a comprehensive study on the integration of ${buzzword.toLowerCase()} within the field of ${domain}. We propose a new theoretical model that reduces operational latency by ${Math.floor(Math.random()*40 + 10)}%.`,
      keyFindings: [
        `Achieved unprecedented scalability in ${domain}.`,
        `Reduced energy consumption by ${Math.floor(Math.random()*30 + 15)}%.`,
        `Established a new benchmark for ${buzzword.toLowerCase()}.`
      ],
      commercialApplications: [
        "Enterprise-scale software deployment.",
        "Consumer electronics integration.",
        "Healthcare and medical diagnostics."
      ],
      citations: Math.floor(Math.random() * 2000) + 50,
      doiUrl: `https://doi.org/10.1038/s41586-024-000${i}`
    });
  }
  return papers;
};

const seedMorePapers = () => {
  console.log("Reading database.json...");
  let data = { innovations: [], papers: [], patents: [], failedStartups: [], startupIdeas: [] };
  
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      data = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not parse existing database, starting fresh.");
    }
  }

  // Ensure papers array exists
  if (!data.papers) data.papers = [];

  console.log("Generating 250 new research papers...");
  const newPapers = generatePapers(250);

  data.papers = [...data.papers, ...newPapers];

  console.log("Writing to database.json...");
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log(`Successfully added 250 papers! Total papers is now ${data.papers.length}`);
};

seedMorePapers();
