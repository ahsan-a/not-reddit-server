import { Router } from 'express';
const router = Router();

import approve from './approve';
import deny from './deny';

router.use('/approve', approve);
router.use('/deny', deny);

export default router;
