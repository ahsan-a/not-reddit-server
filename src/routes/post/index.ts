import { Router } from 'express';
const router = Router();

import createPost from './create';
import deletePost from './delete';

router.get('/', (req, res) => res.send('post page'));
router.use('/createPost', createPost);
router.use('/deletePost', deletePost);

export default router;
