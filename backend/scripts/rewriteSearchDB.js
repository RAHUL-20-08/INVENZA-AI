import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/searchController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// Add import
if (!content.includes("import { loadInnovationsFromDB } from '../utils/dbFetcher.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { loadInnovationsFromDB } from '../utils/dbFetcher.js';");
}

// 1. Remove old loadDatabase
content = content.replace(/const loadDatabase = \(\) => \{[\s\S]*?return \{ innovations: \[\] \};\n  \}\n\};\n\n/, '');

// 2. Make getInnovations async and use DB
content = content.replace(/export const getInnovations = \(req, res\) => \{/g, 'export const getInnovations = async (req, res) => {');
content = content.replace(/const db = loadDatabase\(\);/g, 'const db = await loadInnovationsFromDB();');

// 3. Make getInnovationById async and use DB
content = content.replace(/export const getInnovationById = \(req, res\) => \{/g, 'export const getInnovationById = async (req, res) => {');

// The rest are already async (searchPatents, getSuggestions) and use 'const db = await loadInnovationsFromDB();' now.

fs.writeFileSync(controllerPath, content);
console.log('searchController.js rewritten to use TiDB successfully.');
