import { Router } from 'express';
import { getMe, updateMe, changePassword } from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.put('/password', requireAuth, changePassword);

export default router;