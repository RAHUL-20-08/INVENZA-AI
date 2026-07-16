import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/analysisController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// Add import
if (!content.includes("import { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';");
}

// Rewrite fetchWikiData
const fetchWikiDataRegex = /const fetchWikiData = async \(query\) => \{[\s\S]*?console\.error\("Wikipedia API fetch error:", [^\)]+\);\n    return null;\n  \}\n\};/;

const newFetchWikiData = `const fetchWikiData = async (query) => {
  try {
    const cerebrasData = await fetchCerebrasSearch(query);
    if (!cerebrasData) return null;
    return {
      title: cerebrasData.title || query,
      snippet: (cerebrasData.classifications || "") + " " + (cerebrasData.inventor || ""),
      extract: cerebrasData.description || ""
    };
  } catch (error) {
    console.error("Cerebras API fetch error:", error);
    return null;
  }
};`;

content = content.replace(fetchWikiDataRegex, newFetchWikiData);

fs.writeFileSync(controllerPath, content);
console.log('analysisController.js rewritten to use Cerebras API successfully.');
