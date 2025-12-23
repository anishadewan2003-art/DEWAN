import express from 'express';
import {
  submitQuizResults,
  getQuizResults,
  getUserQuizResults
} from '../controllers/quizController.js';
import { validateQuizSubmission } from '../middleware/validation.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public route (with optional auth)
router.post('/submit', optionalAuth, validateQuizSubmission, submitQuizResults);

// Protected routes
router.get('/results/:userId', authenticate, getUserQuizResults);
router.get('/results', authenticate, getQuizResults);

export default router;

