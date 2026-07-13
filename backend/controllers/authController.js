import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const USERS_FILE = path.resolve('users.json');

// Helper to hash password with SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getRoleFromEmail(email) {
  const lower = email.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('business') || lower.includes('startup') || lower.includes('outlook') || lower.includes('boss')) return 'business';
  return 'student'; // Default to student
}

// Helper to load users
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    // Seed default users
    const defaults = [
      { email: 'analyst@gmail.com', password: hashPassword('googlepassword'), role: 'student' },
      { email: 'analyst@outlook.com', password: hashPassword('microsoftpassword'), role: 'business' }
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

// Helper to save users
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// In-memory OTP storage
// Structure: { [email]: { otpHash, expires, resetToken, verified, attempts } }
const otpSessions = {};

// Configurable nodemailer transport
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Fallback: Create a clean local streaming transport that always succeeds and logs to console
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows',
      buffer: true
    });
  }
};

export const sendRegisterOTP = async (req, res) => {
  const { email, portalType } = req.body;
  if (!email || !portalType) {
    return res.status(400).json({ success: false, message: "Email and portalType are required." });
  }

  const users = loadUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    const roles = existingUser.roles || [existingUser.role || 'student'];
    if (roles.includes(portalType)) {
      return res.status(422).json({ success: false, message: `This email is already registered on the ${portalType === 'student' ? 'Student' : 'Business'} Portal.` });
    }
  }

  // Generate 6-digit verification code
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  const expires = Date.now() + 15 * 60 * 1000; // 15 mins expiry

  otpSessions[email.toLowerCase() + '_register'] = {
    otpHash,
    expires,
    attempts: 0
  };

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
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
            This verification code is valid for 15 minutes. If you did not request this, please ignore this email.
          </p>
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
    res.status(500).json({ success: false, message: "We couldn't send the verification email. Please try again." });
  }
};

export const registerUser = async (req, res) => {
  const { portalType, email, password, otp, ...profileFields } = req.body;
  if (!email || !password || !portalType || !otp) {
    return res.status(400).json({ success: false, message: "Email, password, portalType, and OTP verification code are required." });
  }

  // Verify OTP
  const sessionKey = email.toLowerCase() + '_register';
  const session = otpSessions[sessionKey];
  if (!session) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  if (Date.now() > session.expires) {
    delete otpSessions[sessionKey];
    return res.status(400).json({ success: false, message: "Verification code has expired. Please request a new one." });
  }

  if (session.attempts >= 5) {
    delete otpSessions[sessionKey];
    return res.status(429).json({ success: false, message: "Too many failed attempts. Please request a new code." });
  }

  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  if (session.otpHash !== otpHash) {
    session.attempts++;
    return res.status(400).json({ success: false, message: "Invalid verification code. Please try again." });
  }

  // OTP verified successfully, clear OTP session
  delete otpSessions[sessionKey];

  const users = loadUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingIdx !== -1) {
    // Email already registered. We will link/add the role if it doesn't exist.
    const user = users[existingIdx];
    
    // Check password matches existing password for security
    if (user.password !== hashPassword(password)) {
      return res.status(401).json({ success: false, message: "Password does not match your existing account password under this email." });
    }

    const roles = user.roles || [user.role || 'student'];
    if (roles.includes(portalType)) {
      return res.status(422).json({ success: false, message: "Email is already registered for this portal." });
    }

    // Link the new role and save profile
    roles.push(portalType);
    user.roles = roles;
    if (portalType === 'student') {
      user.studentProfile = {
        fullName: profileFields.fullName || '',
        college: profileFields.college || '',
        department: profileFields.department || '',
        yearOfStudy: profileFields.yearOfStudy || '',
        registerNumber: profileFields.registerNumber || '',
        skills: Array.isArray(profileFields.skills) ? profileFields.skills : (profileFields.skills ? profileFields.skills.split(',').map(s=>s.trim()) : []),
        interests: Array.isArray(profileFields.interests) ? profileFields.interests : (profileFields.interests ? profileFields.interests.split(',').map(s=>s.trim()) : []),
        preferredDomains: Array.isArray(profileFields.preferredDomains) ? profileFields.preferredDomains : (profileFields.preferredDomains ? profileFields.preferredDomains.split(',').map(s=>s.trim()) : [])
      };
    } else {
      user.businessProfile = {
        fullName: profileFields.fullName || '',
        companyName: profileFields.companyName || '',
        industry: profileFields.industry || '',
        companySize: profileFields.companySize || '',
        businessStage: profileFields.businessStage || 'Idea',
        country: profileFields.country || '',
        website: profileFields.website || '',
        linkedin: profileFields.linkedin || ''
      };
    }

    users[existingIdx] = user;
    saveUsers(users);
    
    // Return token and user info
    const tokenPayload = { email: user.email, role: portalType, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
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
    // Create new user
    const newUser = {
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: portalType, // primary role
      roles: [portalType],
      studentProfile: portalType === 'student' ? {
        fullName: profileFields.fullName || '',
        college: profileFields.college || '',
        department: profileFields.department || '',
        yearOfStudy: profileFields.yearOfStudy || '',
        registerNumber: profileFields.registerNumber || '',
        skills: Array.isArray(profileFields.skills) ? profileFields.skills : (profileFields.skills ? profileFields.skills.split(',').map(s=>s.trim()) : []),
        interests: Array.isArray(profileFields.interests) ? profileFields.interests : (profileFields.interests ? profileFields.interests.split(',').map(s=>s.trim()) : []),
        preferredDomains: Array.isArray(profileFields.preferredDomains) ? profileFields.preferredDomains : (profileFields.preferredDomains ? profileFields.preferredDomains.split(',').map(s=>s.trim()) : [])
      } : null,
      businessProfile: portalType === 'business' ? {
        fullName: profileFields.fullName || '',
        companyName: profileFields.companyName || '',
        industry: profileFields.industry || '',
        companySize: profileFields.companySize || '',
        businessStage: profileFields.businessStage || 'Idea',
        country: profileFields.country || '',
        website: profileFields.website || '',
        linkedin: profileFields.linkedin || ''
      } : null
    };

    users.push(newUser);
    saveUsers(users);

    const tokenPayload = { email: newUser.email, role: portalType, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
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
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const users = loadUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === hashPassword(password));
  if (found) {
    const roles = found.roles || [found.role || 'student'];
    
    // If logging in via a specific portal, make sure they have access to it!
    if (portalType && !roles.includes(portalType)) {
      return res.status(403).json({ 
        success: false, 
        message: `You do not have a registered account for the ${portalType === 'student' ? 'Student' : 'Business'} Portal.`,
        code: "ROLE_NOT_FOUND" 
      });
    }

    const activeRole = portalType || roles[0];
    const tokenPayload = { email: found.email, role: activeRole, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    res.json({ 
      success: true, 
      token,
      user: {
        id: found.email,
        name: (activeRole === 'student' ? found.studentProfile?.fullName : found.businessProfile?.fullName) || found.email.split('@')[0],
        email: found.email,
        role: activeRole,
        roles,
        studentProfile: found.studentProfile,
        businessProfile: found.businessProfile
      }
    });
  } else {
    res.status(401).json({ success: false, message: "Wrong email or password." });
  }
};

export const requestForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email address is required." });
  }

  const users = loadUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    return res.status(404).json({ success: false, message: "No account found with this email address." });
  }

  // Generate 6-digit cryptographically secure random code
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  const expires = Date.now() + 15 * 60 * 1000; // 15 mins expiry

  otpSessions[email.toLowerCase()] = {
    otpHash,
    expires,
    attempts: 0,
    verified: false,
    resetToken: null
  };

  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: '"Invenza AI Security" <security@invenza.ai>',
      to: email,
      subject: 'Invenza AI - Secure Password Reset Code',
      text: `Your password reset code is: ${otp}\n\nThis code expires in 15 minutes.\nIf you did not request this, ignore this email.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #3b82f6;">Invenza AI Password Reset</h2>
          <p>You requested a secure password reset. Use the verification code below to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f3f4f6; padding: 12px; text-align: center; letter-spacing: 4px; border-radius: 4px; color: #1f2937;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
            This verification code is valid for 15 minutes. If you did not trigger this request, please contact security support.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log code to server console (mock terminal log) for secure retrieval during local audits
    console.log(`[MAIL] Password Reset OTP sent to ${email}: ${otp}`);
    if (info.message) {
      console.log(`[MAIL STREAM OUTPUT]:\n${info.message.toString()}`);
    }

    res.json({ success: true, message: "A password reset link/code has been sent to your registered email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "We couldn't send the verification email. Please try again." });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required." });
  }

  const session = otpSessions[email.toLowerCase()];
  if (!session) {
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  if (Date.now() > session.expires) {
    delete otpSessions[email.toLowerCase()];
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  if (session.attempts >= 5) {
    delete otpSessions[email.toLowerCase()];
    return res.status(429).json({ success: false, message: "Too many failed attempts. Please request a new code." });
  }

  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  if (session.otpHash !== otpHash) {
    session.attempts++;
    return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
  }

  // Generate secure resetToken
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

  const session = otpSessions[email.toLowerCase()];
  if (!session || !session.verified || session.resetToken !== resetToken) {
    return res.status(400).json({ success: false, message: "Invalid reset session token." });
  }

  const users = loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "User account not found." });
  }

  // Update password
  users[idx].password = hashPassword(newPassword);
  saveUsers(users);

  // Invalidate OTP
  delete otpSessions[email.toLowerCase()];

  res.json({ success: true, message: "Your password has been changed successfully." });
};
