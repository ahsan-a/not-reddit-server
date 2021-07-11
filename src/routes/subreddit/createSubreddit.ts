import { Router } from 'express';
const router = Router();

import { firebase, firestore } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

router.post('/', async (req, res): Promise<any> => {
	let verifyStatus = verifyValues(req.body, ['name', 'description', 'user_id', 'id_token'], ['image']);
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

	//long validation
	if (!/^[0-9a-zA-Z_]+$/.test(req.body.name)) return error('Your title must only contain alphanumeric characters and undersco without spaces.');

	if (req.body.name.length > 25 || req.body.name.length < 1) return error('Your subreddit name must not be over 25 letters long, or under 1.');
	if (req.body.description.length > 150 || req.body.description.length < 5)
		return error('Your description must not be over 150 letters long, or under 5.');
	if (!req.body.description.replace(/\s/g, '').length) return error('Your description must not be empty.');
	if (req.body.image !== undefined && !/^https:\/\//gi.test(req.body.image)) return error(`Your image must be an https link.`);

	// subreddit existance checking
	const dbSubredditExists = await firestore.collection('subreddits').where('name_lowercase', '==', req.body.name.toLowerCase()).get();
	if (!dbSubredditExists.empty) return error(`r/${req.body.name} already exists.`);

	// user checking
	const user = await firestore.collection('users').doc(req.body.user_id).get();
	if (!user.exists) return error("This user doesn't exist.");

	const subreddit = firestore.collection('subreddits').doc();
	const subredditSet: {
		approved: boolean;
		created_at: firebase.firestore.FieldValue;
		name: string;
		name_lowercase: string;
		id: string;
		description: string;
		user_id: string;
		image?: string;
	} = {
		approved: false,
		created_at: firebase.firestore.FieldValue.serverTimestamp(),
		name: req.body.name.replace(/\s/g, ''),
		name_lowercase: req.body.name.replace(/\s/g, '').toLowerCase(),
		id: subreddit.id,
		description: req.body.description,
		user_id: req.body.user_id,
	};

	if (req.body.image) subredditSet.image = req.body.image;

	await subreddit.set(subredditSet);
	res.send({ success: true });
});

export default router;
