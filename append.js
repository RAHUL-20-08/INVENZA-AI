const fs = require('fs');
const path = 'backend/controllers/authController.js';
let code = fs.readFileSync(path, 'utf8');
code += `

// Get global audit logs for founder
export const getFounderAuditLogs = async (req, res) => {
  const roles = req.user.roles || [];
  if (!roles.includes('founder') && req.user.role !== 'founder') {
    return res.status(403).json({ success: false, message: 'Access denied. Founder role required.' });
  }

  // Load audit logs
  let audits = [];
  if (fs.existsSync(AUDIT_LOGS_FILE)) {
    try {
      audits = JSON.parse(fs.readFileSync(AUDIT_LOGS_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading audit logs:', e);
    }
  }

  // Load user history
  const users = await loadUsers();
  const userHistory = users.map(u => ({
    email: u.email,
    roles: u.roles,
    loginHistory: u.loginHistory || [],
    loginFailures: u.loginFailures,
    lockoutUntil: u.lockoutUntil
  }));

  res.json({
    success: true,
    auditLogs: audits,
    userHistory: userHistory
  });
};
`;
fs.writeFileSync(path, code);
console.log('Appended successfully');
