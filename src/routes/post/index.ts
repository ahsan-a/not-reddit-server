import { Router } from 'express';
const router = Router();

import createPost from './createPost';

router.get('/', (req, res) => res.send('post page'));
router.use('/createPost', createPost);

export default router;
