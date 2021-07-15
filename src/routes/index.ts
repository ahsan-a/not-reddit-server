import { Router } from 'express';
const router = Router();

import subreddit from './subreddit';
import post from './post';
import comment from './comment';
import user from './user';
import notification from './notification';

router.get('/', (_req, res) => res.send('wtf get off'));

router.use('/subreddit', subreddit);
router.use('/post', post);
router.use('/comment', comment);
router.use('/user', user);
router.use('/notification', notification);

export default router;
