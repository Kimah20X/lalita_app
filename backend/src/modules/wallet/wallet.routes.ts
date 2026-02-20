import { Router } from 'express';
import { depositToWallet, withdrawFromWallet, getVirtualAccount } from './wallet.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/deposit', depositToWallet);
router.post('/withdraw', withdrawFromWallet);
router.get('/account', getVirtualAccount);

export default router;
