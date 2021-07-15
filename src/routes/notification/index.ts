import { Router } from 'express';
const router = Router();

import deleteNotification from './delete';
import readNotification from './read';

router.get('/', (req, res) => res.send('notif page'));
router.use('/deleteNotification', deleteNotification);
router.use('/readNotification', readNotification);

export default router;
