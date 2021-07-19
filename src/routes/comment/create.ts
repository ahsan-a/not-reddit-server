import { Router } from 'express';
const router = Router();

import { firebase, firestore } from '../../firebase';
import { verifyValues, Error, verifyLogin, createNotification } from '../../utils';

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

	let parent: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null = null;

	if (req.body.parent_id !== null) {
		parent = await firestore.collection('comments').doc(req.body.parent_id).get();
		if (!parent.exists) return error('The parent comment does not exist.');
	}

	const post = await firestore.collection('posts').doc(req.body.post_id).get();
	const user = await firestore.collection('users').doc(req.body.user_id).get();
	const subreddit = await firestore.collection('subreddits').doc(req.body.subreddit_id).get();
	if (!post.exists) return error('The post does not exist.');
	if (!subreddit.exists) return error('The subreddit does not exist.');
	if (!user.exists) return error('The user does not exist.');
	if (post.data()?.subreddit_id !== req.body.subreddit_id) return error('You cannot comment on a post from a different subreddit.');
	if (post.data()?.subreddit_id !== subreddit.ref.id) return error('Something went very wrong');

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

	if (parent && req.body.user_id !== post.data()?.user_id) {
		createNotification({
			target: post.data()?.user_id,
			title: `${user.data()?.name} commented on your post`,
			type: 'interaction',
			body: `"${(req.body.content as string).length > 128 ? (req.body.content as string).slice(0, 128) + '...' : req.body.content}"`,
			content_id: comment.id,
			content_type: 'comment',
			sent_by: user.data()?.id ?? user.id,
			url: `/r/${subreddit.data()?.name}/${post.ref.id}`,
		});

		if (req.body.parent_id && parent.data()?.user_id !== post.data()?.user_id && req.body.user_id !== parent.data()?.user_id) {
			createNotification({
				target: parent.data()?.user_id,
				title: `${user.data()?.name} replied to your comment`,
				type: 'interaction',
				body: `"${(req.body.content as string).length > 128 ? (req.body.content as string).slice(0, 128) + '...' : req.body.content}"`,
				content_id: comment.id,
				content_type: 'comment',
				sent_by: user.data()?.id ?? user.id,
				url: `/r/${subreddit.data()?.name}/${post.ref.id}`,
			});
		}
	}

	res.send({ success: true });
});

export default router;
