import { Router } from 'express';
const router = Router();

import createPost from './create';

router.get('/', (req, res) => res.send('post page'));
router.use('/createPost', createPost);

export default router;
