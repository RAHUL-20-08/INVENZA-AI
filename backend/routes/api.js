import express from 'express';
import { getInnovations, getInnovationById, searchPatents, getSuggestions } from '../controllers/searchController.js';
import { analyzeIdea, reviewCode, generateDocs, validateStartup, discoverIdeas } from '../controllers/analysisController.js';
import { chatWithAI } from '../controllers/chatController.js';
import { getKnowledgeGraph } from '../controllers/graphController.js';
import { getPitchCritique, getPitchQuestions, evaluatePitchAnswer } from '../controllers/pitchController.js';
import { getGitCode } from '../controllers/gitController.js';
import { getPaperLinks } from '../controllers/paperLinksController.js';
import { searchPapers } from '../controllers/papersController.js';
import { synthesizeSynergy } from '../controllers/synergyController.js';
import { registerUser, loginUser, requestForgotPassword, verifyOTP, resetPassword, sendRegisterOTP } from '../controllers/authController.js';
import { getHackathons, getPrepGuide } from '../controllers/hackathonController.js';

const router = express.Router();

router.get('/innovations', getInnovations);
router.get('/suggestions', getSuggestions);
router.get('/innovations/:id', getInnovationById);
router.get('/patents', searchPatents);
router.post('/analyze', analyzeIdea);
router.post('/startup-validate', validateStartup);
router.post('/discover-ideas', discoverIdeas);
router.post('/code-review', reviewCode);
router.post('/generate-docs', generateDocs);
router.post('/chat', chatWithAI);
router.get('/knowledge-graph', getKnowledgeGraph);
router.post('/pitch-critique', getPitchCritique);
router.post('/pitch-questions', getPitchQuestions);
router.post('/pitch-evaluate', evaluatePitchAnswer);
router.post('/synergy', synthesizeSynergy);
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

export default router;
