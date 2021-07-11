import { Router } from 'express';
const router = Router();

import createComment from './createComment';

router.get('/', (req, res) => res.send('comment page'));
router.use('/createComment', createComment);

export default router;
