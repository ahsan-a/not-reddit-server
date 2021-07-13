import { Router } from 'express';
const router = Router();

import update from './update';

router.get('/', (req, res) => res.send('test'));
router.use('/update', update);

export default router;
