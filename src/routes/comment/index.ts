import { Router } from 'express';
const router = Router();

import createComment from './create';
import deleteComment from './delete';

router.get('/', (req, res) => res.send('comment page'));
router.use('/createComment', createComment);
router.use('/deleteComment', deleteComment);

export default router;
