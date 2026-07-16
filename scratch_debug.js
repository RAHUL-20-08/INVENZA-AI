const fs = require('fs');
let code = fs.readFileSync('backend/controllers/authController.js', 'utf8');
code = code.replace(
  'const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());',
  'const userIdx = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase()); console.log("Login attempt:", email, "userIdx:", userIdx, "users length:", users.length, "password matches:", userIdx !== -1 ? (users[userIdx].password === hashPassword(password)) : false);'
);
fs.writeFileSync('backend/controllers/authController.js', code);
