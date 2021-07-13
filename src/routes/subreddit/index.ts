import { Router } from 'express';
const router = Router();

import createSubreddit from './create';
import admin from './admin';

router.get('/', (req, res) => res.send('test'));
router.use('/createSubreddit', createSubreddit);
router.use('/admin', admin);

export default router;
