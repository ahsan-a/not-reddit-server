import { Router } from 'express';
const router = Router();

import { firebase, firestore } from '../../../firebase';
import { verifyValues, Error, verifyLogin } from '../../../utils';

router.post('/', async (req, res): Promise<any> => {
	let verifyStatus = verifyValues(req.body, ['id', 'user_id', 'id_token']);
	if (!verifyStatus.success) return res.send(verifyStatus);

	const error = Error(res);

	const verifiedUser = await verifyLogin(req.body.id_token, req.body.user_id);
	if (!verifiedUser.success) {
		switch (verifiedUser.type) {
			case 0:
				return error('wtf');
			case 1:
				return error('An error occurred.');
		}
	}

	const user = await firestore.collection('users').doc(req.body.user_id).get();
	if (!user.exists || !user.data()?.admin) return error('You must be an admin to perform this action.');

	const subreddit = await firestore.collection('subreddits').doc(req.body.id).get();

	if (!subreddit.exists) return error('This subreddit does not exist.');
	if (subreddit.data()?.approved) return error('This subreddit has already been approved.');

	await subreddit.ref.update({ approved: true });
	res.send({ success: true });
});

export default router;
