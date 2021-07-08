import { Router } from 'express';
const router = Router();

import subreddit from './subreddit';

router.get('/', (req, res) => res.send('wtf get off'));

router.use('/subreddit', subreddit);

export default router;
