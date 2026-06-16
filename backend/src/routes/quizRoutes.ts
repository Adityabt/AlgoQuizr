import { Router } from 'express';
import { getTopics, getQuestions, createAttempt, getAttempts, getProgress } from '../controllers/quizController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/topics', getTopics);
router.get('/topics/:slug/questions', getQuestions);
router.post('/attempts', requireAuth, createAttempt);
router.get('/attempts', requireAuth, getAttempts);
router.get('/progress', requireAuth, getProgress);

export default router;