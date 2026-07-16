import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/authController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// Add DB import
if (!content.includes("import db from '../database/db.js';")) {
  content = content.replace("import nodemailer from 'nodemailer';", "import nodemailer from 'nodemailer';\nimport db from '../database/db.js';");
}

// 1. Rewrite loadUsers
const loadUsersRegex = /const loadUsers = \(\) => \{[\s\S]*?return \[\];\n  \}\n\};/;
const newLoadUsers = `const loadUsers = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
};`;
content = content.replace(loadUsersRegex, newLoadUsers);

// 2. Rewrite saveUsers
const saveUsersRegex = /const saveUsers = \(users\) => \{[\s\S]*?fs\.writeFileSync\(USERS_FILE.*?;\n\};/;
const newSaveUsers = `const saveUsers = async (users) => {
  for (const u of users) {
    await db.query(\`
      INSERT INTO users (
        email, password, role, roles, mfaEnabled, mfaType, totpSecret,
        backupCodes, loginFailures, lockoutUntil, activeSessions, loginHistory,
        studentProfile, businessProfile
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password=VALUES(password), role=VALUES(role), roles=VALUES(roles),
        mfaEnabled=VALUES(mfaEnabled), mfaType=VALUES(mfaType), totpSecret=VALUES(totpSecret),
        backupCodes=VALUES(backupCodes), loginFailures=VALUES(loginFailures), lockoutUntil=VALUES(lockoutUntil),
        activeSessions=VALUES(activeSessions), loginHistory=VALUES(loginHistory),
        studentProfile=VALUES(studentProfile), businessProfile=VALUES(businessProfile)
    \`, [
      u.email, u.password, u.role, JSON.stringify(u.roles || []), u.mfaEnabled ? 1 : 0,
      u.mfaType || 'none', u.totpSecret || null, JSON.stringify(u.backupCodes || []),
      u.loginFailures || 0, u.lockoutUntil || null, JSON.stringify(u.activeSessions || []),
      JSON.stringify(u.loginHistory || []), JSON.stringify(u.studentProfile || null),
      JSON.stringify(u.businessProfile || null)
    ]);
  }
};`;
content = content.replace(saveUsersRegex, newSaveUsers);

// 3. Rewrite logAuditEvent
const logAuditRegex = /const logAuditEvent = \(email, action, metadata = \{\}\) => \{[\s\S]*?fs\.writeFileSync\(AUDIT_LOGS_FILE.*?;\n\};/;
const newLogAudit = `const logAuditEvent = async (email, action, metadata = {}) => {
  try {
    await db.query(\`
      INSERT INTO audit_logs (timestamp, email, action, metadata)
      VALUES (?, ?, ?, ?)
    \`, [new Date().toISOString(), email.toLowerCase(), action, JSON.stringify(metadata)]);
  } catch(e) { console.error(e); }
};`;
content = content.replace(logAuditRegex, newLogAudit);

// 4. Rewrite getAuthUserFromToken
const authTokenRegex = /const getAuthUserFromToken = \(req\) => \{[\s\S]*?return users\.find.*?catch\(e\) \{\n    return null;\n  \}\n\};/;
const newAuthToken = `const getAuthUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    const users = await loadUsers();
    return users.find(u => u.email.toLowerCase() === payload.email.toLowerCase()) || null;
  } catch(e) {
    return null;
  }
};`;
content = content.replace(authTokenRegex, newAuthToken);

// Make all invocations async
content = content.replace(/const users = loadUsers\(\);/g, 'const users = await loadUsers();');
content = content.replace(/let users = loadUsers\(\);/g, 'let users = await loadUsers();');
content = content.replace(/saveUsers\(/g, 'await saveUsers(');
content = content.replace(/logAuditEvent\(/g, 'await logAuditEvent(');
content = content.replace(/const user = getAuthUserFromToken\(req\);/g, 'const user = await getAuthUserFromToken(req);');
content = content.replace(/const superadmin = getAuthUserFromToken\(req\);/g, 'const superadmin = await getAuthUserFromToken(req);');

fs.writeFileSync(controllerPath, content);
console.log('authController.js rewritten successfully.');
