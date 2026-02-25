import { Router } from 'express';
import { createAjoGroup, getAllAjoGroups, joinAjoGroup, startAjoGroup, contributeToAjo } from './ajo.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createAjoGroup);
router.get('/', getAllAjoGroups);
router.post('/:id/join', joinAjoGroup);
router.post('/:id/start', startAjoGroup);
router.post('/:id/contribute', contributeToAjo);

export default router;
