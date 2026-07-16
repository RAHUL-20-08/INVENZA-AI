import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/database.json');

// Helper to generate UUIDs
const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;

// Sample domains and sectors
const domains = ['Quantum Computing', 'Biotechnology', 'Artificial Intelligence', 'Neurotechnology', 'Clean Energy', 'Nanotechnology', 'Space Exploration'];
const sectors = ['HealthTech', 'FinTech', 'DeepTech', 'EdTech', 'AgriTech', 'SpaceTech', 'ClimateTech'];

// Generation Helpers
const generatePapers = (count) => {
  const papers = [];
  for (let i = 0; i < count; i++) {
    const domain = domains[i % domains.length];
    papers.push({
      id: generateId('paper'),
      title: `Advanced Methods in ${domain} for Next-Generation Scalability - Part ${i + 1}`,
      authors: [`Dr. Scientist ${i}`, `Prof. Researcher ${i+1}`],
      publishedYear: 2020 + (i % 6),
      institution: `Global Institute of ${domain} Studies`,
      domain: domain,
      abstract: `This paper explores the foundational mechanics and theoretical boundaries of ${domain}. By leveraging novel algorithmic architectures, we demonstrated a 40% efficiency increase over traditional models.`,
      keyFindings: [
        "Established new theoretical upper bounds for efficiency.",
        "Demonstrated a novel framework for scalable deployment.",
        "Identified 3 key bottleneck resolutions."
      ],
      commercialApplications: [
        "Can be integrated into enterprise infrastructure.",
        "Reduces computational overhead for consumer applications."
      ],
      citations: Math.floor(Math.random() * 500) + 10,
      doiUrl: `https://doi.org/10.1000/xyz${i}`
    });
  }
  return papers;
};

const generatePatents = (count) => {
  const patents = [];
  for (let i = 0; i < count; i++) {
    const domain = domains[i % domains.length];
    patents.push({
      id: generateId('patent'),
      title: `System and Method for Automated ${domain} Optimization`,
      inventor: `Inventor ${i} Name`,
      patentId: `US-${Math.floor(Math.random() * 9000000 + 1000000)}-B2`,
      yearFiled: 2005 + (i % 15),
      expiryYear: 2025 + (i % 15),
      status: i % 3 === 0 ? 'Expired' : 'Active',
      classifications: [domain, 'Hardware Systems', 'Algorithmic Optimization'],
      claims: [
        "A system comprising a centralized processing unit and distributed nodes.",
        "A method for dynamically allocating resources based on real-time loads.",
        "An apparatus configured to automatically reduce thermal output during peak loads."
      ],
      description: `A comprehensive patent detailing the architecture for improving ${domain} workflows using proprietary hardware-software integration.`,
      modernEnablers: [
        "Large Language Models for dynamic code synthesis.",
        "Neural Processing Units (NPUs) for local edge inference."
      ]
    });
  }
  return patents;
};

const generateFailedStartups = (count) => {
  const startups = [];
  for (let i = 0; i < count; i++) {
    const sector = sectors[i % sectors.length];
    startups.push({
      id: generateId('failed'),
      name: `${sector} Visionary Inc ${i}`,
      founder: `Founder ${i}`,
      sector: sector,
      yearFounded: 2012 + (i % 5),
      yearClosed: 2017 + (i % 5),
      totalFunding: `$${(Math.random() * 50 + 1).toFixed(1)}M`,
      coreConcept: `Attempted to revolutionize ${sector} by introducing a decentralized hardware mesh network.`,
      failureBottlenecks: [
        "Hardware manufacturing costs were too high for consumer adoption.",
        "Network latency issues caused poor user experience.",
        "Lack of developer ecosystem and third-party integrations."
      ],
      revivalViability: Math.floor(Math.random() * 40) + 50,
      aiEnhancementVector: [
        "Replace expensive proprietary hardware with AI-driven software emulation.",
        "Use edge-caching LLMs to eliminate network latency.",
        "Deploy automated API wrapper generators to instantly build a developer ecosystem."
      ],
      swot: {
        strengths: ["Strong initial patent portfolio", "High-profile angel investors"],
        weaknesses: ["High burn rate", "Complex onboarding"],
        opportunities: ["Modern AI APIs lower the barrier to entry", "Cloud computing costs have plummeted"],
        threats: ["Open source alternatives", "Entrenched legacy competitors"]
      }
    });
  }
  return startups;
};

const generateStartupIdeas = (count) => {
  const ideas = [];
  for (let i = 0; i < count; i++) {
    const sector = sectors[i % sectors.length];
    ideas.push({
      id: generateId('idea'),
      title: `AI-Powered ${sector} Copilot`,
      sector: sector,
      targetAudience: `Enterprise teams in ${sector}`,
      problemStatement: `Professionals in ${sector} spend 40% of their time on manual, repetitive data processing tasks that lead to high error rates and burnout.`,
      solutionArchitecture: `A cloud-based SaaS platform that uses fine-tuned LLMs and specialized RAG pipelines to instantly process, classify, and generate insights from industry-specific data.`,
      roadmap: [
        { step: "Phase 1: Minimum Viable Product", desc: "Develop the core RAG pipeline using open-source models." },
        { step: "Phase 2: Beta Testing", desc: "Onboard 10 enterprise clients for closed beta testing." },
        { step: "Phase 3: Scale & Launch", desc: "Integrate billing, scale database infrastructure, and launch publicly." }
      ],
      financials: {
        estimatedCost: `$${(Math.random() * 100 + 50).toFixed(0)}K`,
        requiredSkills: ["Full-Stack Development", "Machine Learning Engineering", "B2B Sales"],
        targetIndustries: [sector, "B2B SaaS", "Automation"]
      }
    });
  }
  return ideas;
};

const seedDatabase = () => {
  console.log("Reading database.json...");
  let data = { innovations: [] };
  
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      data = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not parse existing database, starting fresh.");
    }
  }

  // Preserve existing innovations if any
  const existingInnovations = data.innovations || [];

  // Generate 50 items for each new category
  console.log("Generating mock data models...");
  const newPapers = generatePapers(50);
  const newPatents = generatePatents(50);
  const newFailedStartups = generateFailedStartups(50);
  const newStartupIdeas = generateStartupIdeas(50);

  // Compile final DB
  const newDb = {
    innovations: existingInnovations, // keep old ones
    papers: newPapers,
    patents: newPatents,
    failedStartups: newFailedStartups,
    startupIdeas: newStartupIdeas
  };

  console.log("Writing to database.json...");
  fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2));
  console.log(`Successfully seeded database with:
- ${newPapers.length} Research Papers
- ${newPatents.length} Patents
- ${newFailedStartups.length} Failed Startups
- ${newStartupIdeas.length} Startup Ideas`);
};

seedDatabase();
