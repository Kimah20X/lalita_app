import { Router } from 'express';
import { depositToWallet, withdrawFromWallet, getVirtualAccount, handleMonnifyWebhook } from './wallet.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Webhook is public (verification handled in controller)
router.post('/webhook', handleMonnifyWebhook);

// Protected routes
router.use(authenticate);
router.post('/deposit', depositToWallet);
router.post('/withdraw', withdrawFromWallet);
router.get('/account', getVirtualAccount);

export default router;
