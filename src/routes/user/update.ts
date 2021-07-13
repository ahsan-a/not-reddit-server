import { Router } from 'express';
const router = Router();

import fetch from 'node-fetch';

import { firebase, firestore } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

router.post('/', async (req, res): Promise<any> => {
	let verifyStatus = verifyValues(req.body, ['name', 'about', 'admin', 'image', 'user_id', 'id_token'], ['target_id']);
	if (!verifyStatus.success) return res.send(verifyStatus);

	const error = Error(res);

	if (req.body.admin && !req.body.target_id) return error('do better.');

	const verifiedUser = await verifyLogin(req.body.id_token, req.body.user_id);

	let admin = false;
	if (!verifiedUser.success) {
		// check if user is admin
		admin = (await firestore.collection('users').doc('user_id').get()).data()?.admin;

		if (!admin) return error('You must be an admin to do this.');

		switch (verifiedUser.type) {
			case 0:
				return error('wtf');
			case 1:
				return error('An error occurred.');
		}
	}

	if (typeof req.body.name !== 'string' || req.body.name.length > 25 || req.body.name.length < 3)
		return error('Your name must be below 25 characters long and above 3.');

	if (!req.body.image.replace(/\s/g, '').length) {
		if (!/https:\/\//gi.test(req.body.image)) return error('Your image must be an https link.');

		await fetch(req.body.image)
			.then((res) => {
				if (res.status !== 200) return error('This may be a dead link.');
			})
			.catch((e) => {
				return error('This may be a dead link.');
			});
	}

	if (typeof req.body.about !== 'string' || req.body.length > 400) return error('Your about is too long.');

	if (!admin && req.body.admin) return error('wtf');

	req.body.about = req.body.about.replace(/\n{3}\n*/g, '\n\n');
	req.body.name = req.body.name.replace(/\n+/g, '');

	await firestore
		.collection('users')
		.doc(req.body.target_id || req.body.user_id)
		.update({
			name: req.body.name,
			about: req.body.about,
			admin: req.body.admin,
			image: req.body.image,
		});

	res.send({ success: true });
});

export default router;
