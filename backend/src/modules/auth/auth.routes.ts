import { Router } from 'express';
import { login, register, updatePushToken } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/push-token', authenticate, updatePushToken);

export default router;
