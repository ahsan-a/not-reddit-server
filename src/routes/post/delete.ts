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

	const post = firestore.collection('posts').doc(req.body.id);
	if (!(await post.get()).exists) return error('Post not found.');

	await post.delete();

	for (let comment of (await firestore.collection('comments').where('post', '==', req.body.id).get()).docs) comment.ref.delete();

	res.send({ success: true });
});

export default router;
