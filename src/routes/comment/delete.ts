import { Router } from 'express';
const router = Router();

import { firebase, firestore } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

router.post('/', async (req, res): Promise<any> => {
	const error = Error(res);
	let verifyStatus = verifyValues(req.body, ['id', 'id_token', 'user_id']);
	if (!verifyStatus.success) return res.send(verifyStatus);

	const verifiedUser = await verifyLogin(req.body.id_token, req.body.user_id);
	if (!verifiedUser.success) {
		const user = await firestore.collection('users').doc(req.body.user_id).get();

		if (!user.data()?.admin) return error('Invalid user id.');

		switch (verifiedUser.type) {
			case 0:
				return error('wtf');
			case 1:
				return error('An error occurred.');
		}
	}

	const comment = firestore.collection('comments').doc(req.body.id);
	if (!(await comment.get()).exists) return error('Comment not found.');

	if ((await firestore.collection('comments').where('parent_id', '==', req.body.id).get()).empty) {
		await comment.delete();
	} else {
		comment.update({
			content: '[deleted]',
			user_id: null,
			updated_at: firebase.firestore.FieldValue.serverTimestamp(),
			deleted: true,
		});
	}

	res.send({ success: true });
});

export default router;
