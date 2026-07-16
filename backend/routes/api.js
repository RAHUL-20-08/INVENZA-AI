import express from 'express';
import { getInnovations, getInnovationById, searchPatents, getSuggestions } from '../controllers/searchController.js';
import { analyzeIdea, reviewCode, generateDocs, validateStartup, discoverIdeas, saveStartupIdea, getSavedStartupIdeas, regenerateSection, getInnovationOpportunities } from '../controllers/analysisController.js';
import { chatWithAI } from '../controllers/chatController.js';
import { getKnowledgeGraph } from '../controllers/graphController.js';
import { getPitchCritique, getPitchQuestions, evaluatePitchAnswer } from '../controllers/pitchController.js';
import { getGitCode } from '../controllers/gitController.js';
import { getPaperLinks } from '../controllers/paperLinksController.js';
import { searchPapers } from '../controllers/papersController.js';
import { synthesizeSynergy } from '../controllers/synergyController.js';
import { 
  registerUser, 
  loginUser, 
  requestForgotPassword, 
  verifyOTP, 
  resetPassword, 
  sendRegisterOTP,
  verifyMFA,
  getSecurityProfile,
  setupMFA,
  enableMFA,
  disableMFA,
  terminateSession,
  terminateAllSessions,
  changePassword,
  deleteAccount,
  verifySensitiveAction,
  getOauthConfig,
  oauthCallback,
  completeOnboarding,
  refreshTokenRotation,
  adminOauthConfig
} from '../controllers/authController.js';
import { getHackathons, getPrepGuide } from '../controllers/hackathonController.js';

import fs from 'fs';
import path from 'path';

const USERS_FILE = path.resolve('users.json');

// Helper to parse cookie strings natively
const parseCookies = (cookieHeader) => {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
};

const authenticateToken = (roleRequired) => {
  return (req, res, next) => {
    let token = null;
    
    // 1. Read token from HttpOnly cookie
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.auth_token) {
      token = cookies.auth_token;
    } 
    // 2. Fallback to Authorization Header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Clearance token is missing." });
    }

    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        return res.status(401).json({ success: false, message: "Security token has expired." });
      }
      
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const user = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
      
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid clearance identity." });
      }

      const roles = user.roles || [user.role || 'student'];
      if (roleRequired && !roles.includes(roleRequired)) {
        return res.status(403).json({ success: false, message: "Access forbidden. Role permissions insufficient." });
      }

      // Stateful session validation check: verify token is present in activeSessions registry
      const activeSessions = user.activeSessions || [];
      const hasSession = activeSessions.some(s => s.token === token);
      if (!hasSession && activeSessions.length > 0) {
        return res.status(401).json({ success: false, message: "Session revoked or expired." });
      }

      req.user = user;
      next();
    } catch(e) {
      return res.status(401).json({ success: false, message: "Clearance verification failed." });
    }
  };
};

const router = express.Router();

router.get('/innovations', getInnovations);
router.get('/suggestions', getSuggestions);
router.get('/innovations/:id', getInnovationById);
router.get('/patents', searchPatents);
router.post('/analyze', analyzeIdea);
router.post('/startup-validate', authenticateToken('business'), validateStartup);
router.post('/discover-ideas', authenticateToken('business'), discoverIdeas);
router.post('/code-review', reviewCode);
router.post('/generate-docs', generateDocs);
router.post('/chat', chatWithAI);
router.get('/knowledge-graph', getKnowledgeGraph);
router.post('/pitch-critique', getPitchCritique);
router.post('/pitch-questions', getPitchQuestions);
router.post('/pitch-evaluate', evaluatePitchAnswer);
router.post('/synergy', authenticateToken('student'), synthesizeSynergy);
router.get('/git-code', getGitCode);
router.get('/paper-links', getPaperLinks);
router.get('/search-papers', searchPapers);

// Hackathon Discovery endpoints
router.get('/hackathons', getHackathons);
router.post('/hackathons/:id/prepare', getPrepGuide);

// Secure Auth endpoints
router.post('/auth/send-register-otp', sendRegisterOTP);
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgot-password', requestForgotPassword);
router.post('/auth/verify-otp', verifyOTP);
router.post('/auth/reset-password', resetPassword);

// Enterprise Security endpoints
router.post('/auth/verify-mfa', verifyMFA);
router.get('/auth/security-profile', authenticateToken(), getSecurityProfile);
router.post('/auth/security/mfa/setup', authenticateToken(), setupMFA);
router.post('/auth/security/mfa/enable', authenticateToken(), enableMFA);
router.post('/auth/security/mfa/disable', authenticateToken(), disableMFA);
router.post('/auth/security/sessions/:sessionId/terminate', authenticateToken(), terminateSession);
router.post('/auth/security/sessions/terminate-all', authenticateToken(), terminateAllSessions);
router.post('/auth/security/change-password', authenticateToken(), changePassword);
router.post('/auth/security/delete-account', authenticateToken(), deleteAccount);
router.post('/auth/security/verify-sensitive', authenticateToken(), verifySensitiveAction);

// OAuth 2.0 Auth endpoints
router.get('/auth/oauth/config', getOauthConfig);
router.post('/auth/oauth/callback', oauthCallback);
router.post('/auth/oauth/onboarding', authenticateToken(), completeOnboarding);
router.post('/auth/refresh', refreshTokenRotation);
router.get('/auth/admin/config', authenticateToken(), adminOauthConfig);
router.post('/analysis/save-startup', authenticateToken('business'), saveStartupIdea);
router.get('/analysis/saved-startups', authenticateToken('business'), getSavedStartupIdeas);
router.post('/analysis/regenerate-section', authenticateToken('business'), regenerateSection);
router.post('/analysis/innovate-engine', getInnovationOpportunities);

export default router;
