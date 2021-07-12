import { Router } from 'express';
const router = Router();

import { firebase, firestore } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

router.post('/', async (req, res): Promise<any> => {
	const error = Error(res);

	let verifyStatus = verifyValues(req.body, ['title', 'content', 'user_id', 'subreddit_id', 'id_token']);
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

	// long verif again
	if (!req.body.title.replace(/\s/g, '').length && req.body.title.length < 100)
		return error('Your title must not be blank and be shorter than 100 characters.');

	if (typeof req.body.content !== 'string') return error('Your content is not a string. (?!?!?!???)');

	const subreddit = await firestore.collection('subreddits').doc(req.body.subreddit_id).get();
	if (!subreddit.exists) return error("This subreddit doesn't exist.");

	const user = await firestore.collection('users').doc(req.body.user_id).get();
	if (!user.exists) return error("This user doesn't exist.");

	const post = firestore.collection('posts').doc();
	const subredditSet = {
		title: req.body.title,
		content: req.body.content,
		subreddit_id: req.body.subreddit_id,
		user_id: req.body.user_id,
		created_at: firebase.firestore.FieldValue.serverTimestamp(),
		updated_at: firebase.firestore.FieldValue.serverTimestamp(),
		id: post.id,
	};

	post.set(subredditSet);

	res.send({ success: true });
});

export default router;
