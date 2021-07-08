import { Router } from 'express';
const router = Router();

import { firestore } from '@/firebase';
import { verifyValues } from '@/utils';

router.post('/', (req, res) => {
	res.send(typeof req.body.approved);
});

export default router;
