import { Router } from 'express';
const router = Router();

import subreddit from './subreddit';
import post from './post';

router.get('/', (_req, res) => res.send('wtf get off'));

router.use('/subreddit', subreddit);
router.use('/post', post);

export default router;
