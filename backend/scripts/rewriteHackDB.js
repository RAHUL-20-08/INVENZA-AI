import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/hackathonController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

if (!content.includes("import { loadHackathonsFromDB } from '../utils/dbFetcher.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { loadHackathonsFromDB } from '../utils/dbFetcher.js';");
}

const getHackRegex = /export const getHackathons = async \(req, res\) => \{[\s\S]*?let list = HACKATHON_SEEDS;/;
const newGetHack = `export const getHackathons = async (req, res) => {
    try {
      const profile = req.query.profile ? JSON.parse(req.query.profile) : null;
      let list = await loadHackathonsFromDB();`;
      
content = content.replace(getHackRegex, newGetHack);

fs.writeFileSync(controllerPath, content);
console.log('hackathonController.js rewritten to use TiDB successfully.');
