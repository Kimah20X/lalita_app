import { Router } from 'express';
import { createGoal, getGoals, getGoalById, deposit, withdraw } from './savings.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createGoal);
router.get('/', getGoals);
router.get('/:id', getGoalById);
router.post('/:id/deposit', deposit);
router.post('/:id/withdraw', withdraw);

export default router;
