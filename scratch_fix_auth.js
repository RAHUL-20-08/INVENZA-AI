const fs = require('fs');
let code = fs.readFileSync('backend/controllers/authController.js', 'utf8');

if (!code.includes('fileURLToPath')) {
  code = code.replace(
    "import db from '../database/db.js';",
    "import db from '../database/db.js';\nimport { fileURLToPath } from 'url';\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));"
  );
  code = code.replace(
    "const USERS_FILE = path.resolve('users.json');",
    "const USERS_FILE = path.join(__dirname, '../users.json');"
  );
  code = code.replace(
    "const AUDIT_LOGS_FILE = path.resolve('audit_logs.json');",
    "const AUDIT_LOGS_FILE = path.join(__dirname, '../audit_logs.json');"
  );
}

if (!code.includes("!roles.includes('founder')")) {
  code = code.replace(
    "if (portalType && !roles.includes(portalType)) {",
    "if (portalType && !roles.includes(portalType) && !roles.includes('founder')) {"
  );
}

fs.writeFileSync('backend/controllers/authController.js', code);
console.log('Fixed authController.js');
