import { Router } from 'express';
const router = Router();

import deleteNotification from './delete';
import readNotifications from './read';

router.get('/', (req, res) => res.send('notif page'));
router.use('/deleteNotification', deleteNotification);
router.use('/readNotifications', readNotifications);

export default router;
