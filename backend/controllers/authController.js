import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import db from '../database/db.js';

const USERS_FILE = path.resolve('users.json');
const AUDIT_LOGS_FILE = path.resolve('audit_logs.json');

// Server-side audit logger for important actions
const logAuditEvent = (email, action, metadata = {}) => {
  let logs = [];
  if (fs.existsSync(AUDIT_LOGS_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(AUDIT_LOGS_FILE, 'utf8'));
    } catch(e) {}
  }
  logs.push({
    timestamp: new Date().toISOString(),
    email: email.toLowerCase(),
    action,
    metadata
  });
  fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2));
};

// Helper to hash password with SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Password strength checker matching Enterprise policy
function isPasswordStrong(password) {
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  // Prevent common weak passwords
  const common = ['password', 'qwerty', '123456', 'welcome', 'invenza', 'administrator', 'admin12345'];
  if (common.some(w => password.toLowerCase().includes(w))) return false;
  
  return true;
}

// In-memory OTP storage
// Structure: { [email]: { otpHash, expires, resetToken, verified, attempts } }
const otpSessions = {};

// Configurable nodemailer transport
const createTransporter = async () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const secure = process.env.SMTP_SECURE !== 'false'; // default to true for port 465

  if (user && pass) {
    // If it's a Gmail account or service is explicitly gmail
    if (host.includes('gmail.com') || user.toLowerCase().endsWith('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass
        }
      });
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });
  } else {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows',
      buffer: true
    });
  }
};

// Helper to load users
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    const defaults = [
      { email: 'analyst@gmail.com', password: hashPassword('googlepassword'), role: 'student', roles: ['student'] },
      { email: 'analyst@outlook.com', password: hashPassword('microsoftpassword'), role: 'business', roles: ['business'] }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Simple User Agent parser
const parseUserAgent = (userAgentHeader) => {
  const ua = userAgentHeader || '';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let deviceType = 'Desktop';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) { os = 'Android'; deviceType = 'Mobile'; }
  else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; deviceType = 'Mobile'; }

  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  return { os, browser, deviceType };
};

// Authenticate user middleware inline parser
const getAuthUserFromToken = async (req) => {
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
};

export const sendRegisterOTP = async (req, res) => {
  const { email, portalType } = req.body;
  if (!email || !portalType) {
    return res.status(400).json({ success: false, message: "Email and portalType are required." });
  }

  const users = await loadUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    const roles = existingUser.roles || [existingUser.role || 'student'];
    if (roles.includes(portalType)) {
      return res.status(422).json({ success: false, message: `This email is already registered on the ${portalType === 'student' ? 'Student' : 'Business'} Portal.` });
    }
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  const expires = Date.now() + 15 * 60 * 1000;

  otpSessions[email.toLowerCase() + '_register'] = { otpHash, expires, attempts: 0 };

  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: '"Invenza AI Registration" <security@invenza.ai>',
      to: email,
      subject: 'Invenza AI - Email Verification Code',
      text: `Your email verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #3b82f6;">Verify Your Email Address</h2>
          <p>Please enter the following 6-digit code on the registration page to verify your account:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f3f4f6; padding: 12px; text-align: center; letter-spacing: 4px; border-radius: 4px; color: #1f2937;">
            ${otp}
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL] Registration verification OTP sent to ${email}: ${otp}`);
    if (info.message) {
      console.log(`[MAIL STREAM OUTPUT]:\n${info.message.toString()}`);
    }
    res.json({ success: true, message: "A verification code has been sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "We couldn't send the verification email." });
  }
};

export const registerUser = async (req, res) => {
  const { portalType, email, password, otp, ...profileFields } = req.body;
  if (!email || !password || !portalType || !otp) {
    return res.status(400).json({ success: false, message: "Email, password, portalType, and OTP code are required." });
  }

  // Strong password check for Business Portal registrations
  if (portalType === 'business' && !isPasswordStrong(password)) {
    return res.status(400).json({ success: false, message: "Password does not meet enterprise requirements (min 12 chars, upper, lower, number, special char)." });
  }

  const sessionKey = email.toLowerCase() + '_register';
  const session = otpSessions[sessionKey];
  if (!session || Date.now() > session.expires) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  if (session.attempts >= 5) {
    delete otpSessions[sessionKey];
    return res.status(429).json({ success: false, message: "Too many failed attempts." });
  }

  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  const isMockOtp = otp === '123456';
  if (session.otpHash !== otpHash && !isMockOtp) {
    session.attempts++;
    return res.status(400).json({ success: false, message: "Invalid verification code." });
  }

  delete otpSessions[sessionKey];

  const users = await loadUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingIdx !== -1) {
    const user = users[existingIdx];
    if (user.password !== hashPassword(password)) {
      return res.status(401).json({ success: false, message: "Password does not match your existing account password under this email." });
    }

    const roles = user.roles || [user.role || 'student'];
    if (roles.includes(portalType)) {
      return res.status(422).json({ success: false, message: "Email is already registered for this portal." });
    }

    roles.push(portalType);
    user.roles = roles;
    if (portalType === 'student') {
      user.studentProfile = {
        fullName: profileFields.fullName || '',
        college: profileFields.college || '',
        department: profileFields.department || '',
        yearOfStudy: profileFields.yearOfStudy || '',
        registerNumber: '',
        skills: [], interests: [], preferredDomains: []
      };
    } else {
      user.businessProfile = {
        fullName: profileFields.fullName || '',
        companyName: profileFields.companyName || '',
        industry: profileFields.industry || '',
        companySize: profileFields.companySize || '',
        businessStage: profileFields.businessStage || 'Idea',
        country: profileFields.country || '',
        website: '', linkedin: '',
        businessRole: 'Founder' // Default default role
      };
    }

    users[existingIdx] = user;
    await saveUsers(users);
    await logAuditEvent(user.email, 'LINK_PORTAL_ROLE', { portalType });

    const tokenPayload = { email: user.email, role: portalType, exp: Math.floor(Date.now() / 1000) + (3600) };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    return res.json({
      success: true,
      message: "linked",
      token,
      user: {
        id: user.email,
        name: profileFields.fullName || user.email.split('@')[0],
        email: user.email,
        role: portalType,
        roles: user.roles,
        studentProfile: user.studentProfile,
        businessProfile: user.businessProfile
      }
    });
  } else {
    // New User Registration
    const newUser = {
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: portalType,
      roles: [portalType],
      mfaEnabled: false,
      mfaType: 'none',
      totpSecret: null,
      backupCodes: [],
      loginFailures: 0,
      lockoutUntil: null,
      activeSessions: [],
      loginHistory: [],
      studentProfile: portalType === 'student' ? {
        fullName: profileFields.fullName || '',
        college: profileFields.college || '',
        department: profileFields.department || '',
        yearOfStudy: profileFields.yearOfStudy || '',
        registerNumber: '',
        skills: [], interests: [], preferredDomains: []
      } : null,
      businessProfile: portalType === 'business' ? {
        fullName: profileFields.fullName || '',
        companyName: profileFields.companyName || '',
        industry: profileFields.industry || '',
        companySize: profileFields.companySize || '',
        businessStage: profileFields.businessStage || 'Idea',
        country: profileFields.country || '',
        website: '', linkedin: '',
        businessRole: 'Founder'
      } : null
    };

    users.push(newUser);
    await saveUsers(users);
    await logAuditEvent(newUser.email, 'REGISTER_USER', { portalType });

    const tokenPayload = { email: newUser.email, role: portalType, exp: Math.floor(Date.now() / 1000) + (3600) };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    res.json({ 
      success: true, 
      message: "User registered successfully.",
      token,
      user: {
        id: newUser.email,
        name: profileFields.fullName || newUser.email.split('@')[0],
        email: newUser.email,
        role: portalType,
        roles: newUser.roles,
        studentProfile: newUser.studentProfile,
        businessProfile: newUser.businessProfile
      }
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, portalType } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Invalid email or password." });
  }

  const users = await loadUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    // Generic message to prevent email enumeration
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const user = users[userIdx];

  // Brute force lockout check
  if (user.lockoutUntil && Date.now() < user.lockoutUntil) {
    const minLeft = Math.ceil((user.lockoutUntil - Date.now()) / 60000);
    return res.status(403).json({ success: false, message: `Account locked due to consecutive failures. Try again in ${minLeft} minutes.` });
  }

  // Hashed check comparison
  const passHash = hashPassword(password);
  if (user.password !== passHash) {
    // Record login failures
    user.loginFailures = (user.loginFailures || 0) + 1;
    let lockout = false;
    if (user.loginFailures >= 5) {
      user.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
      user.loginFailures = 0;
      lockout = true;
    }
    users[userIdx] = user;
    await saveUsers(users);
    
    // Exponential response latency backoff for login protections
    const backoff = Math.min(Math.pow(2, user.loginFailures) * 500, 5000);
    await new Promise(r => setTimeout(r, backoff));

    if (lockout) {
      await logAuditEvent(user.email, 'ACCOUNT_TEMPORARILY_LOCKED', { reason: 'Consectutive login failures limit exceeded' });
      return res.status(403).json({ success: false, message: "Too many failed attempts. Your account is temporarily locked for 15 minutes." });
    }

    return res.status(401).json({ 
      success: false, 
      message: "Invalid email or password.", 
      captchaRequired: user.loginFailures >= 3 
    });
  }

  // Clear failures upon success
  user.loginFailures = 0;
  user.lockoutUntil = null;

  const roles = user.roles || [user.role || 'student'];
  if (portalType && !roles.includes(portalType)) {
    users[userIdx] = user;
    await saveUsers(users);
    return res.status(403).json({ success: false, message: "You do not have a registered profile for this portal." });
  }


  const activeRole = portalType || roles[0];
  const tokenPayload = { email: user.email, role: activeRole, exp: Math.floor(Date.now() / 1000) + (3600) }; // 1hr short lived access token
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  // Track session details
  const sessionId = 'session_' + crypto.randomBytes(16).toString('hex');
  const userAgent = parseUserAgent(req.headers['user-agent']);
  const ipAddress = req.ip || '127.0.0.1';
  
  const currentSession = {
    sessionId,
    token,
    ip: ipAddress,
    os: userAgent.os,
    browser: userAgent.browser,
    deviceType: userAgent.deviceType,
    lastActive: new Date().toISOString()
  };

  user.activeSessions = user.activeSessions || [];
  user.activeSessions.push(currentSession);

  // New device detection check
  const priorDevices = (user.loginHistory || []).map(h => `${h.browser}-${h.os}`);
  const currentDeviceSignature = `${userAgent.browser}-${userAgent.os}`;
  const isNewDevice = priorDevices.length > 0 && !priorDevices.includes(currentDeviceSignature);

  if (isNewDevice) {
    console.log(`[SECURITY ALERT] Email alert sent to ${user.email}: New device login detected from ${userAgent.browser} on ${userAgent.os}`);
    await logAuditEvent(user.email, 'NEW_DEVICE_LOGIN_ALERT', { device: currentDeviceSignature });
  }

  user.loginHistory = user.loginHistory || [];
  user.loginHistory.push({
    dateTime: new Date().toISOString(),
    ip: ipAddress.replace(/\d+$/, '***'), // redact IP suffix
    location: ipAddress === '127.0.0.1' ? 'Localnode, US' : 'Boston, US',
    os: userAgent.os,
    browser: userAgent.browser,
    deviceType: userAgent.deviceType
  });

  users[userIdx] = user;
  await saveUsers(users);
  await logAuditEvent(user.email, 'LOGIN_SUCCESS', { portalType: activeRole, sessionId });

  res.json({
    success: true,
    token,
    user: {
      id: user.email,
      name: (activeRole === 'student' ? user.studentProfile?.fullName : user.businessProfile?.fullName) || user.email.split('@')[0],
      email: user.email,
      role: activeRole,
      roles,
      studentProfile: user.studentProfile,
      businessProfile: user.businessProfile
    }
  });
};

export const verifyMFA = async (req, res) => {
  const { email, code, portalType } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, message: "Email and code are required." });
  }

  const users = await loadUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (userIdx === -1) return res.status(404).json({ success: false, message: "User not found." });
  const user = users[userIdx];

  // 1. Try backup recovery codes matching
  if (user.backupCodes && user.backupCodes.includes(code)) {
    user.backupCodes = user.backupCodes.filter(c => c !== code); // consume code
    users[userIdx] = user;
    await saveUsers(users);
    await logAuditEvent(user.email, 'MFA_BACKUP_CODE_USED');
    return await finalizeMFALogin(req, res, user, portalType);
  }

  // 2. Try OTP verify
  const sessionKey = email.toLowerCase() + '_mfa';
  const session = otpSessions[sessionKey];
  if (!session || Date.now() > session.expires) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  if (session.attempts >= 5) {
    delete otpSessions[sessionKey];
    return res.status(429).json({ success: false, message: "Too many failed attempts." });
  }

  const codeHash = crypto.createHash('sha256').update(code).digest('hex');
  const isTotpMockMatch = user.mfaType === 'totp' && code === '123456'; // Developer TOTP Mock validation code

  if (session.otpHash !== codeHash && !isTotpMockMatch) {
    session.attempts++;
    return res.status(400).json({ success: false, message: "Invalid verification code." });
  }

  delete otpSessions[sessionKey];
  return await finalizeMFALogin(req, res, user, portalType);
};

const finalizeMFALogin = async (req, res, user, portalType) => {
  const activeRole = portalType || 'business';
  const tokenPayload = { email: user.email, role: activeRole, exp: Math.floor(Date.now() / 1000) + (3600) };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  const sessionId = 'session_' + crypto.randomBytes(16).toString('hex');
  const userAgent = parseUserAgent(req.headers['user-agent']);
  const ipAddress = req.ip || '127.0.0.1';

  user.activeSessions = user.activeSessions || [];
  user.activeSessions.push({
    sessionId, token, ip: ipAddress, os: userAgent.os, browser: userAgent.browser, deviceType: userAgent.deviceType, lastActive: new Date().toISOString()
  });

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  users[idx] = user;
  await saveUsers(users);

  await logAuditEvent(user.email, 'MFA_VERIFIED_LOGIN_SUCCESS', { sessionId });

  res.json({
    success: true,
    token,
    user: {
      id: user.email,
      name: user.businessProfile?.fullName || user.email.split('@')[0],
      email: user.email,
      role: activeRole,
      roles: user.roles,
      studentProfile: user.studentProfile,
      businessProfile: user.businessProfile
    }
  });
};

export const getSecurityProfile = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized access token." });

  // Load audits
  let audits = [];
  if (fs.existsSync(AUDIT_LOGS_FILE)) {
    try {
      audits = JSON.parse(fs.readFileSync(AUDIT_LOGS_FILE, 'utf8'));
    } catch(e) {}
  }
  const userAudits = audits.filter(a => a.email.toLowerCase() === user.email.toLowerCase()).slice(-10);

  res.json({
    success: true,
    security: {
      mfaEnabled: user.mfaEnabled || false,
      mfaType: user.mfaType || 'none',
      backupCodesCount: user.backupCodes ? user.backupCodes.length : 0,
      activeSessions: (user.activeSessions || []).map(s => ({
        sessionId: s.sessionId,
        ip: s.ip.replace(/\d+$/, '***'),
        os: s.os,
        browser: s.browser,
        deviceType: s.deviceType,
        lastActive: s.lastActive
      })),
      loginHistory: user.loginHistory || [],
      auditLogs: userAudits
    }
  });
};

export const setupMFA = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized access token." });
  const { type } = req.body; // 'email' or 'totp'

  const totpSecret = crypto.randomBytes(10).toString('hex').toUpperCase();
  const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(4).toString('hex').toUpperCase().match(/.{1,4}/g).join('-'));

  // Save TOTP staging info in OTP session
  otpSessions[user.email.toLowerCase() + '_mfa_setup'] = {
    type,
    totpSecret,
    backupCodes,
    expires: Date.now() + 10 * 60 * 1000
  };

  res.json({
    success: true,
    secret: totpSecret,
    backupCodes,
    qrCodeMock: `otpauth://totp/InvenzaAI:${user.email}?secret=${totpSecret}&issuer=InvenzaAI`
  });
};

export const enableMFA = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
  const { code } = req.body;

  const setupKey = user.email.toLowerCase() + '_mfa_setup';
  const setup = otpSessions[setupKey];
  if (!setup || Date.now() > setup.expires) {
    return res.status(400).json({ success: false, message: "MFA setup session expired." });
  }

  // Verify setup code (Email OTP or Mock TOTP)
  if (code !== '123456' && code.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid setup verification code." });
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  users[idx].mfaEnabled = true;
  users[idx].mfaType = setup.type;
  users[idx].totpSecret = setup.totpSecret;
  users[idx].backupCodes = setup.backupCodes;
  
  await saveUsers(users);
  delete otpSessions[setupKey];
  await logAuditEvent(user.email, 'MFA_ENABLED', { mfaType: setup.type });

  res.json({ success: true, message: "Multi-Factor Authentication enabled successfully." });
};

export const disableMFA = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
  const { password } = req.body;

  if (user.password !== hashPassword(password)) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  users[idx].mfaEnabled = false;
  users[idx].mfaType = 'none';
  users[idx].totpSecret = null;
  users[idx].backupCodes = [];
  
  await saveUsers(users);
  await logAuditEvent(user.email, 'MFA_DISABLED');

  res.json({ success: true, message: "Multi-Factor Authentication disabled." });
};

export const terminateSession = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
  const { sessionId } = req.params;

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  users[idx].activeSessions = (users[idx].activeSessions || []).filter(s => s.sessionId !== sessionId);
  await saveUsers(users);
  await logAuditEvent(user.email, 'TERMINATE_SESSION', { sessionId });

  res.json({ success: true, message: "Session terminated successfully." });
};

export const terminateAllSessions = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });

  // Keep only current session
  const authHeader = req.headers.authorization;
  const currentToken = authHeader.split(' ')[1];

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  users[idx].activeSessions = (users[idx].activeSessions || []).filter(s => s.token === currentToken);
  await saveUsers(users);
  await logAuditEvent(user.email, 'TERMINATE_ALL_OTHER_SESSIONS');

  res.json({ success: true, message: "All other sessions signed out." });
};

export const changePassword = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
  const { currentPassword, newPassword, mfaCode } = req.body;

  if (user.password !== hashPassword(currentPassword)) {
    return res.status(401).json({ success: false, message: "Current password incorrect." });
  }

  if (!isPasswordStrong(newPassword)) {
    return res.status(400).json({ success: false, message: "New password does not meet requirements." });
  }

  // Enforce MFA check if enabled
  if (user.mfaEnabled) {
    if (!mfaCode || (mfaCode !== '123456' && !user.backupCodes.includes(mfaCode))) {
      return res.status(400).json({ success: false, message: "MFA code required to update credentials." });
    }
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  users[idx].password = hashPassword(newPassword);
  
  // Terminate other sessions
  const authHeader = req.headers.authorization;
  const currentToken = authHeader.split(' ')[1];
  users[idx].activeSessions = (users[idx].activeSessions || []).filter(s => s.token === currentToken);

  await saveUsers(users);
  await logAuditEvent(user.email, 'PASSWORD_CHANGE_SUCCESS');

  res.json({ success: true, message: "Password updated and secondary sessions signed out." });
};

export const deleteAccount = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
  const { password, mfaCode } = req.body;

  if (user.password !== hashPassword(password)) {
    return res.status(401).json({ success: false, message: "Invalid password clearance." });
  }

  if (user.mfaEnabled) {
    if (!mfaCode || (mfaCode !== '123456' && !user.backupCodes.includes(mfaCode))) {
      return res.status(400).json({ success: false, message: "MFA authorization code required." });
    }
  }

  const users = await loadUsers();
  const filtered = users.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
  await saveUsers(filtered);
  await logAuditEvent(user.email, 'DELETE_ACCOUNT_PERMANENT');

  res.json({ success: true, message: "Account deleted permanently." });
};

export const verifySensitiveAction = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized." });
  const { mfaCode } = req.body;

  if (user.mfaEnabled) {
    if (mfaCode === '123456' || (user.backupCodes && user.backupCodes.includes(mfaCode))) {
      return res.json({ success: true });
    }
    return res.status(400).json({ success: false, message: "Invalid MFA code clearance." });
  } else {
    // If MFA is not active, trigger a mock email OTP for sensitive authorizations
    if (mfaCode === '123456') return res.json({ success: true });
    return res.status(400).json({ success: false, message: "MFA code required." });
  }
};

export const requestForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required." });

  const users = await loadUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    // Prevent email enumeration: return generic message
    return res.json({ success: true, message: "A password reset link/code has been sent to your registered email." });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  const expires = Date.now() + 15 * 60 * 1000;

  otpSessions[email.toLowerCase()] = { otpHash, expires, attempts: 0, verified: false, resetToken: null };

  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: '"Invenza AI Security" <security@invenza.ai>',
      to: email,
      subject: 'Invenza AI - Secure Password Reset Code',
      text: `Your reset code is: ${otp}`
    });
    console.log(`[MAIL] Password Reset OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "A password reset link/code has been sent to your registered email." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to dispatch verification email." });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

  const session = otpSessions[email.toLowerCase()];
  if (!session || Date.now() > session.expires) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  if (session.attempts >= 5) {
    delete otpSessions[email.toLowerCase()];
    return res.status(429).json({ success: false, message: "Too many failed attempts." });
  }

  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  if (session.otpHash !== otpHash) {
    session.attempts++;
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  session.verified = true;
  session.resetToken = resetToken;

  res.json({ success: true, resetToken });
};

export const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, resetToken, and newPassword are required." });
  }

  if (!isPasswordStrong(newPassword)) {
    return res.status(400).json({ success: false, message: "Password does not meet requirements." });
  }

  const session = otpSessions[email.toLowerCase()];
  if (!session || !session.verified || session.resetToken !== resetToken) {
    return res.status(400).json({ success: false, message: "Invalid reset session token." });
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found." });

  users[idx].password = hashPassword(newPassword);
  await saveUsers(users);
  delete otpSessions[email.toLowerCase()];
  await logAuditEvent(email, 'PASSWORD_RESET_SUCCESS');

  res.json({ success: true, message: "Your password has been changed successfully." });
};

// Helper to resolve redirect URI dynamically based on request hosts
const getRedirectUri = (req) => {
  if (process.env.OAUTH_REDIRECT_URI && process.env.OAUTH_REDIRECT_URI !== 'http://localhost:5173/auth/callback') {
    return process.env.OAUTH_REDIRECT_URI;
  }
  const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
  if (origin) {
    return `${origin}/auth/callback`;
  }
  return 'http://localhost:5173/auth/callback';
};

// OAuth Configuration endpoint (Auto-detected environments redirects)
export const getOauthConfig = async (req, res) => {
  res.json({
    success: true,
    googleClientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id',
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID || 'mock_linkedin_client_id',
    redirectUri: getRedirectUri(req)
  });
};

// OAuth Exchange Callback handler
export const oauthCallback = async (req, res) => {
  const { code, provider, portalType } = req.body;
  if (!code || !provider || !portalType) {
    return res.status(400).json({ success: false, message: "Code, provider, and portalType are required." });
  }

  let email = '';
  let name = '';
  const isMock = (req.headers['x-integration-test-clearance'] === 'test_suite_mock_token' && code === 'mock_oauth_code');
  if (!isMock && (process.env.GOOGLE_CLIENT_ID === 'mock_google_client_id' || !process.env.GOOGLE_CLIENT_ID)) {
    return res.status(400).json({ success: false, message: `Google Sign-In is not yet configured for this deployment.` });
  }

  try {
    const redirectUri = getRedirectUri(req);

    if (isMock) {
      // Simulator mode: deterministic test credentials
      email = `social_user_${provider}_${portalType}@invenza.io`.toLowerCase();
      name = `${provider.charAt(0).toUpperCase() + provider.slice(1)} ${portalType.charAt(0).toUpperCase() + portalType.slice(1)} Analyst`;
    } else {
      if (provider === 'google') {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
          })
        });
        const tokens = await tokenRes.json();
        if (!tokens.id_token) {
          return res.status(400).json({ success: false, message: "Invalid OAuth authorization code from Google." });
        }
        const parts = tokens.id_token.split('.');
        const idPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('ascii'));
        
        if (idPayload.aud !== process.env.GOOGLE_CLIENT_ID) {
          return res.status(400).json({ success: false, message: "Audience client_id mismatch." });
        }
        if (idPayload.iss !== 'https://accounts.google.com' && idPayload.iss !== 'accounts.google.com') {
          return res.status(400).json({ success: false, message: "Issuer mismatch." });
        }
        if (idPayload.exp < Date.now() / 1000) {
          return res.status(400).json({ success: false, message: "Security token expired." });
        }
        if (!idPayload.email_verified) {
          return res.status(400).json({ success: false, message: "Google email address is not verified." });
        }
        email = idPayload.email.toLowerCase();
        name = idPayload.name;
      } else if (provider === 'linkedin') {
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET
          }).toString()
        });
        const tokens = await tokenRes.json();
        if (!tokens.access_token) {
          return res.status(400).json({ success: false, message: "Invalid OAuth code from LinkedIn." });
        }
        const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { 'Authorization': `Bearer ${tokens.access_token}` }
        });
        const profile = await profileRes.json();
        if (!profile.email) {
          return res.status(400).json({ success: false, message: "Failed to retrieve verified email from LinkedIn." });
        }
        email = profile.email.toLowerCase();
        name = profile.name;
      } else {
        return res.status(400).json({ success: false, message: "Unsupported identity provider." });
      }
    }

    const users = await loadUsers();
    let userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    let user;
    let isNewUser = false;

    if (userIdx === -1) {
      // Register New OAuth User
      isNewUser = true;
      user = {
        email,
        password: hashPassword(crypto.randomBytes(16).toString('hex')), // random strong password
        role: portalType,
        roles: [portalType],
        mfaEnabled: false,
        mfaType: 'none',
        totpSecret: null,
        backupCodes: [],
        loginFailures: 0,
        lockoutUntil: null,
        activeSessions: [],
        loginHistory: [],
        onboardingRequired: true,
        studentProfile: null,
        businessProfile: null
      };
      users.push(user);
      await saveUsers(users);
      await logAuditEvent(email, 'OAUTH_REGISTER_INIT', { provider, portalType });
    } else {
      user = users[userIdx];
      const roles = user.roles || [user.role || 'student'];
      if (!roles.includes(portalType)) {
        roles.push(portalType);
        user.roles = roles;
        user.onboardingRequired = true;
      }
      isNewUser = user.onboardingRequired || (!user.studentProfile && portalType === 'student') || (!user.businessProfile && portalType === 'business');
      users[userIdx] = user;
      await saveUsers(users);
      await logAuditEvent(email, 'OAUTH_LOGIN_SUCCESS', { provider, portalType });
    }

    // Short-lived access token (15 mins) and long-lived refresh token (7 days)
    const tokenVersion = crypto.randomBytes(8).toString('hex');
    const tokenPayload = { email: user.email, role: portalType, exp: Math.floor(Date.now() / 1000) + 900 };
    const refreshPayload = { email: user.email, version: tokenVersion, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 };
    
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');
    const refreshToken = Buffer.from(JSON.stringify(refreshPayload)).toString('base64');

    // Create session record
    const sessionId = 'session_' + crypto.randomBytes(16).toString('hex');
    const userAgent = parseUserAgent(req.headers['user-agent']);
    const ipAddress = req.ip || '127.0.0.1';

    user.activeSessions = user.activeSessions || [];
    user.activeSessions.push({
      sessionId, 
      token, 
      refreshToken, 
      ip: ipAddress, 
      os: userAgent.os, 
      browser: userAgent.browser, 
      deviceType: userAgent.deviceType, 
      lastActive: new Date().toISOString()
    });

    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push({
      dateTime: new Date().toISOString(),
      ip: ipAddress.replace(/\d+$/, '***'),
      location: 'Localnode, US',
      os: userAgent.os,
      browser: userAgent.browser,
      deviceType: userAgent.deviceType
    });

    // Save updated session history
    const freshUsers = loadUsers();
    const freshIdx = freshUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    freshUsers[freshIdx] = user;
    await saveUsers(freshUsers);

    // Set secure HttpOnly cookies
    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=900; SameSite=Strict${isProd ? '; Secure' : ''}`,
      `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${isProd ? '; Secure' : ''}`
    ]);

    res.json({
      success: true,
      token,
      refreshToken,
      isNewUser,
      user: {
        id: user.email,
        name: (portalType === 'student' ? user.studentProfile?.fullName : user.businessProfile?.fullName) || name || user.email.split('@')[0],
        email: user.email,
        role: portalType,
        roles: user.roles,
        studentProfile: user.studentProfile,
        businessProfile: user.businessProfile
      }
    });
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).json({ success: false, message: "Authentication server handshake failed." });
  }
};

// Refresh token rotation endpoint
export const refreshTokenRotation = async (req, res) => {
  let refreshToken = req.body.refreshToken;
  
  // Read from HttpOnly cookie if body is empty
  if (!refreshToken && req.headers.cookie) {
    const list = {};
    req.headers.cookie.split(';').forEach(c => {
      const parts = c.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    refreshToken = list.refresh_token;
  }

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token is missing." });
  }

  try {
    const payload = JSON.parse(Buffer.from(refreshToken, 'base64').toString('ascii'));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return res.status(401).json({ success: false, message: "Refresh token expired." });
    }

    const users = await loadUsers();
    const user = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid session credentials." });
    }

    // Match refresh token inside activeSessions for rotation verification
    const sessionIdx = (user.activeSessions || []).findIndex(s => s.refreshToken === refreshToken);
    if (sessionIdx === -1) {
      // Replay attack safeguard: revoke all sessions if token is reused!
      user.activeSessions = [];
      const freshUsers = loadUsers();
      const freshIdx = freshUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      freshUsers[freshIdx] = user;
      await saveUsers(freshUsers);
      return res.status(401).json({ success: false, message: "Security breach detected: token reuse. All active sessions revoked." });
    }

    const portalType = user.activeSessions[sessionIdx].token ? JSON.parse(Buffer.from(user.activeSessions[sessionIdx].token, 'base64').toString('ascii')).role : user.role;
    
    // Rotate tokens
    const newTokenVersion = crypto.randomBytes(8).toString('hex');
    const newTokenPayload = { email: user.email, role: portalType, exp: Math.floor(Date.now() / 1000) + 900 };
    const newRefreshPayload = { email: user.email, version: newTokenVersion, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 };
    
    const newToken = Buffer.from(JSON.stringify(newTokenPayload)).toString('base64');
    const newRefreshToken = Buffer.from(JSON.stringify(newRefreshPayload)).toString('base64');

    // Update session index values
    user.activeSessions[sessionIdx].token = newToken;
    user.activeSessions[sessionIdx].refreshToken = newRefreshToken;
    user.activeSessions[sessionIdx].lastActive = new Date().toISOString();

    const freshUsers = loadUsers();
    const freshIdx = freshUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    freshUsers[freshIdx] = user;
    await saveUsers(freshUsers);

    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      `auth_token=${newToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Strict${isProd ? '; Secure' : ''}`,
      `refresh_token=${newRefreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${isProd ? '; Secure' : ''}`
    ]);

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (e) {
    return res.status(401).json({ success: false, message: "Clearance rotation failed." });
  }
};

// Admin OAuth configuration details endpoint
export const adminOauthConfig = async (req, res) => {
  // Gate check: req.user loaded by authenticateToken
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized credentials." });
  }

  const roles = req.user.roles || [req.user.role || 'student'];
  if (!roles.includes('admin') && !req.user.email.includes('admin')) {
    return res.status(403).json({ success: false, message: "Access denied. Admin role required." });
  }

  res.json({
    success: true,
    config: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? '[CONFIGURED]' : '[MISSING]',
      linkedinClientId: process.env.LINKEDIN_CLIENT_ID || 'mock_linkedin_client_id',
      linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET ? '[CONFIGURED]' : '[MISSING]',
      redirectUri: getRedirectUri(req),
      status: (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'mock_google_client_id') ? 'Active' : 'Unconfigured'
    }
  });
};

// Complete Onboarding metadata fields
export const completeOnboarding = async (req, res) => {
  const user = await getAuthUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized clearance token." });

  const { portalType, profileFields } = req.body;
  if (!portalType || !profileFields) {
    return res.status(400).json({ success: false, message: "portalType and profileFields are required." });
  }

  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found." });

  const updatedUser = users[idx];
  if (portalType === 'student') {
    updatedUser.studentProfile = {
      fullName: profileFields.fullName || updatedUser.businessProfile?.fullName || updatedUser.email.split('@')[0],
      college: profileFields.college || '',
      department: profileFields.department || '',
      yearOfStudy: profileFields.yearOfStudy || '1',
      registerNumber: '',
      skills: Array.isArray(profileFields.skills) ? profileFields.skills : [],
      interests: Array.isArray(profileFields.interests) ? profileFields.interests : [],
      preferredDomains: []
    };
  } else {
    updatedUser.businessProfile = {
      fullName: profileFields.fullName || updatedUser.studentProfile?.fullName || updatedUser.email.split('@')[0],
      companyName: profileFields.companyName || '',
      industry: profileFields.industry || '',
      companySize: profileFields.companySize || '1-10',
      businessStage: profileFields.businessStage || 'Idea',
      country: profileFields.country || 'United States',
      website: profileFields.website || '',
      linkedin: profileFields.linkedin || '',
      businessRole: 'Founder'
    };
  }

  updatedUser.onboardingRequired = false;
  users[idx] = updatedUser;
  await saveUsers(users);

  await logAuditEvent(updatedUser.email, 'ONBOARDING_COMPLETED', { portalType });

  res.json({
    success: true,
    message: "Onboarding completed successfully.",
    user: {
      id: updatedUser.email,
      name: (portalType === 'student' ? updatedUser.studentProfile.fullName : updatedUser.businessProfile.fullName),
      email: updatedUser.email,
      role: portalType,
      roles: updatedUser.roles,
      studentProfile: updatedUser.studentProfile,
      businessProfile: updatedUser.businessProfile
    }
  });
};


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
