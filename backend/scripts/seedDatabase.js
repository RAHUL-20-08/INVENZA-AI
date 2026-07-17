import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database/database.json');

// Helper to wait
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchPatents() {
  console.log("Fetching Patents from Europe PMC API...");
  try {
    const response = await fetch('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=SRC:PAT%20AND%20technology&format=json&resultType=lite&pageSize=20');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    if (data.resultList && data.resultList.result) {
      return data.resultList.result.map(p => {
        return {
          id: p.id,
          patentId: p.id,
          title: p.title || "Unknown Patent",
          inventor: p.authorString || 'Unknown',
          assignee: "Individual / Organization",
          filedYear: p.pubYear ? parseInt(p.pubYear) : new Date().getFullYear(),
          expiryYear: (p.pubYear ? parseInt(p.pubYear) : new Date().getFullYear()) + 20,
          status: "Active",
          classifications: ["General Tech"],
          claims: ["See full patent text on European Patent Office."],
          description: p.abstractText || "No abstract provided."
        };
      });
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch patents", err);
    return [];
  }
}

async function fetchOpenAlex() {
  console.log("Fetching Research Papers from OpenAlex...");
  try {
    const response = await fetch('https://api.openalex.org/works?search=technology&per-page=20&sort=cited_by_count:desc');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    if (data.results) {
      return data.results.map(work => {
        let abstract = "No abstract available.";
        if (work.abstract_inverted_index) {
          const words = [];
          for (const word in work.abstract_inverted_index) {
            work.abstract_inverted_index[word].forEach(pos => {
              words[pos] = word;
            });
          }
          abstract = words.join(' ').trim();
        }
        
        return {
          id: work.id,
          title: work.title,
          authors: work.authorships ? work.authorships.map(a => a.author.display_name).join(', ') : "Unknown",
          journal: work.primary_location?.source?.display_name || "Unknown Journal",
          year: work.publication_year || new Date().getFullYear(),
          citations: work.cited_by_count || 0,
          doi: work.doi,
          publisher: work.primary_location?.source?.host_organization_name || "Unknown",
          tags: work.concepts ? work.concepts.slice(0,3).map(c => c.display_name) : ["Research", "Technology"],
          abstract: abstract,
          pdfLink: work.open_access?.oa_url || null
        };
      });
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch OpenAlex", err);
    return [];
  }
}

async function fetchWikipediaFailedStartups() {
  console.log("Fetching Failed Startups from Wikipedia...");
  const failedStartups = ["Theranos", "Quibi", "Juicero", "Jawbone", "Essential Products", "Color Labs", "ScaleFactor", "Katerra"];
  const results = [];
  
  for (const name of failedStartups) {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(name)}&format=json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== "-1") {
        const extract = pages[pageId].extract;
        results.push({
          id: `wiki-failed-${name.toLowerCase().replace(/\s/g,'-')}`,
          name: name,
          sector: "Defunct Startup",
          status: "Failed",
          description: extract.substring(0, 500) + (extract.length > 500 ? "..." : ""),
          failureBottlenecks: [
            "Market/Product Fit",
            "Financial mismanagement",
            "Strategic failure"
          ],
          yearFiled: 2015,
          inventor: "Various Founders"
        });
      }
      await delay(500); // Be polite to Wikipedia
    } catch (err) {
      console.error(`Failed to fetch Wikipedia for ${name}`, err);
    }
  }
  return results;
}

async function fetchGitHubStartups() {
  console.log("Fetching Active Tech Startups/Innovations from GitHub...");
  try {
    const query = encodeURIComponent("stars:>10000 pushed:>2023-01-01 topic:machine-learning");
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`, {
      headers: {
        'User-Agent': 'Invenza-Seed-Script'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    if (data.items) {
      return data.items.map(repo => {
        return {
          id: `github-${repo.id}`,
          name: repo.name,
          sector: "Open Source Tech",
          status: "Active",
          description: repo.description || "No description provided.",
          gitRepo: repo.full_name,
          gitLang: repo.language,
          stars: repo.stargazers_count,
          url: repo.html_url,
          inventor: repo.owner.login,
          yearFiled: parseInt(repo.created_at.split('-')[0]),
        };
      });
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch GitHub", err);
    return [];
  }
}

async function main() {
  console.log("Starting Database Seeder...");
  
  // Ensure database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Read existing DB
  let db = { innovations: [], patents: [], papers: [] };
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      console.warn("Could not parse existing DB, creating new structure.");
    }
  }
  
  // Assure structure
  db.innovations = db.innovations || [];
  db.patents = db.patents || [];
  db.papers = db.papers || [];

  const [patents, papers, failedStartups, activeStartups] = await Promise.all([
    fetchPatents(),
    fetchOpenAlex(),
    fetchWikipediaFailedStartups(),
    fetchGitHubStartups()
  ]);
  
  console.log(`Fetched ${patents.length} Patents.`);
  console.log(`Fetched ${papers.length} Papers.`);
  console.log(`Fetched ${failedStartups.length} Failed Startups.`);
  console.log(`Fetched ${activeStartups.length} GitHub Innovations.`);
  
  // Merge Patents (dedupe by ID)
  const existingPatentIds = new Set(db.patents.map(p => p.id));
  patents.forEach(p => {
    if (!existingPatentIds.has(p.id)) {
      db.patents.push(p);
    }
  });

  // Merge Papers
  const existingPaperIds = new Set(db.papers.map(p => p.id));
  papers.forEach(p => {
    if (!existingPaperIds.has(p.id)) {
      db.papers.push(p);
    }
  });
  
  // Merge Startups into Innovations
  const existingInnovationIds = new Set(db.innovations.map(i => i.id));
  
  [...failedStartups, ...activeStartups].forEach(i => {
    if (!existingInnovationIds.has(i.id)) {
      db.innovations.push(i);
    }
  });
  
  // Write back to file
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log("Database seeded successfully!");
}

main().catch(console.error);
