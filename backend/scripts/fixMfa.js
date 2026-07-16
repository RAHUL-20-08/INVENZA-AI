import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/authController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

content = content.replace('const finalizeMFALogin = (req, res, user, portalType) => {', 'const finalizeMFALogin = async (req, res, user, portalType) => {');
content = content.replace(/return finalizeMFALogin/g, 'return await finalizeMFALogin');

fs.writeFileSync(controllerPath, content);
console.log('Fixed finalizeMFALogin to be async.');
