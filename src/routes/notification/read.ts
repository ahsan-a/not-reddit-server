import { Router } from 'express';
const router = Router();

import { rtdb } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

router.post('/', async (req, res): Promise<any> => {
	const error = Error(res);
	let verifyStatus = verifyValues(req.body, ['id_token', 'user_id']);
	if (!verifyStatus.success) return res.send(verifyStatus);

	const verifiedUser = await verifyLogin(req.body.id_token, req.body.user_id);
	if (!verifiedUser.success) {
		switch (verifiedUser.type) {
			case 0:
				return error('wtf');
			case 1:
				return error('An error occurred.');
		}
	}

	const notifs = await rtdb.ref(`/notifications/${req.body.user_id}`).get();

	notifs.forEach((notif) => {
		notif.ref.update({ unread: false });
	});

	res.send({ success: true });
});

export default router;
