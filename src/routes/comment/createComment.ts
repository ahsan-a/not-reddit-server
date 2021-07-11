import { Router } from 'express';
const router = Router();

import { firebase, firestore } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

router.post('/', async (req, res): Promise<any> => {
	const error = Error(res);
	let verifyStatus = verifyValues(req.body, ['content', 'parent_id', 'user_id', 'subreddit_id', 'post_id', 'id_token']);
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

	// verification
	if (req.body.content.replace(/\s/g, '').length < 1) return error('Your comment is too short.');

	if (req.body.parent_id !== null && !(await firestore.collection('comments').doc(req.body.parent_id).get()).exists)
		return error('The parent comment does not exist.');

	if (!(await firestore.collection('posts').doc(req.body.post_id).get()).exists) return error('The post does not exist.');
	if (!(await firestore.collection('subreddits').doc(req.body.subreddit_id).get()).exists) return error('The subreddit does not exist.');
	if (!(await firestore.collection('users').doc(req.body.user_id).get()).exists) return error('The user does not exist.');

	const comment = firestore.collection('comments').doc();

	comment.set({
		content: req.body.content,
		id: comment.id,
		parent_id: req.body.parent_id,
		user_id: req.body.user_id,
		subreddit_id: req.body.subreddit_id,
		post_id: req.body.post_id,
		created_at: firebase.firestore.FieldValue.serverTimestamp(),
		updated_at: firebase.firestore.FieldValue.serverTimestamp(),
	});

	res.send({ success: true });
});

export default router;
