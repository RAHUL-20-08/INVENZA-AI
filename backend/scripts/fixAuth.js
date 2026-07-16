import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/authController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// The exact string in authController.js right now for this function:
// const getAuthUserFromToken = (req) => {
// ...
//     const users = await loadUsers();

content = content.replace('const getAuthUserFromToken = (req) => {', 'const getAuthUserFromToken = async (req) => {');

fs.writeFileSync(controllerPath, content);
console.log('Fixed getAuthUserFromToken to be async.');
