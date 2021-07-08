import { Router } from 'express';
const router = Router();

import createSubreddit from './createSubreddit';

router.get('/', (req, res) => res.send('test'));
router.use('/createSubreddit', createSubreddit);

export default router;
