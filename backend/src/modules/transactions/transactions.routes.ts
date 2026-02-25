import { Router } from 'express';
import { getTransactions } from './transactions.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getTransactions);

export default router;
