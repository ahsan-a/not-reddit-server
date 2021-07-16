import { Router } from 'express';
const router = Router();

import deleteNotification from './delete';
import readNotifications from './read';
import cleanNotifications from './clean';

router.get('/', (req, res) => res.send('notif page'));
router.use('/deleteNotification', deleteNotification);
router.use('/readNotifications', readNotifications);
router.use('/cleanNotifications', cleanNotifications);

export default router;
