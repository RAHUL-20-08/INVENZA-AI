import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/chatController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

if (!content.includes("import { loadInnovationsFromDB } from '../utils/dbFetcher.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { loadInnovationsFromDB } from '../utils/dbFetcher.js';");
}

// Remove old loadDatabase
content = content.replace(/const loadDatabase = \(\) => \{[\s\S]*?return \{ innovations: \[\] \};\n  \}\n\};\n\n/, '');

// Replace sync call with async
content = content.replace(/const db = loadDatabase\(\);/g, 'const db = await loadInnovationsFromDB();');

fs.writeFileSync(controllerPath, content);
console.log('chatController.js rewritten to use TiDB successfully.');
