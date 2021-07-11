import { Router } from 'express';
const router = Router();

import subreddit from './subreddit';
import post from './post';
import comment from './comment';

router.get('/', (_req, res) => res.send('wtf get off'));

router.use('/subreddit', subreddit);
router.use('/post', post);
router.use('/comment', comment);

export default router;
