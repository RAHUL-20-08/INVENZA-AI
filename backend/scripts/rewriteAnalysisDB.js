import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/analysisController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

if (!content.includes("import { loadInnovationsFromDB, loadSavedStartupsFromDB } from '../utils/dbFetcher.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { loadInnovationsFromDB, loadSavedStartupsFromDB } from '../utils/dbFetcher.js';\nimport db from '../database/db.js';");
}

// Remove old load functions
content = content.replace(/const loadDatabase = \(\) => \{[\s\S]*?return \{ innovations: \[\] \};\n  \}\n\};\n\n/, '');
content = content.replace(/const loadSavedStartups = \(\) => \{[\s\S]*?return \[\];\n  \}\n\};\n\n/, '');

const oldSaveStartups = /const saveSavedStartups = \(data\) => \{[\s\S]*?\};\n/;
const newSaveStartups = `const saveSavedStartups = async (startups) => {
  for (const s of startups) {
    await db.query(\`
      INSERT INTO saved_startups (id, title, description, savedAt, data)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title=VALUES(title), description=VALUES(description), savedAt=VALUES(savedAt), data=VALUES(data)
    \`, [s.id, s.title, s.description, s.savedAt, JSON.stringify(s)]);
  }
};\n`;
content = content.replace(oldSaveStartups, newSaveStartups);

// Replace sync calls with async
content = content.replace(/const db = loadDatabase\(\);/g, 'const db = await loadInnovationsFromDB();');
content = content.replace(/const saved = loadSavedStartups\(\);/g, 'const saved = await loadSavedStartupsFromDB();');
content = content.replace(/saveSavedStartups\(saved\);/g, 'await saveSavedStartups(saved);');

fs.writeFileSync(controllerPath, content);
console.log('analysisController.js rewritten to use TiDB successfully.');
