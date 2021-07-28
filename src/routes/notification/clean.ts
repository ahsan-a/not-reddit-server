import { Router } from 'express';
const router = Router();

import { rtdb, firestore, firebase } from '../../firebase';
import { verifyValues, Error, verifyLogin } from '../../utils';

const cleaning: { [user: string]: boolean } = {};

router.post('/', async (req, res): Promise<any> => {
	const error = Error(res);
	let verifyStatus = verifyValues(req.body, ['id_token', 'user_id']);
	if (!verifyStatus.success) return res.send(verifyStatus);

	if (cleaning[req.body.user_id]) return res.send({ success: false, error: 'Already cleaning' });

	const verifiedUser = await verifyLogin(req.body.id_token, req.body.user_id);
	if (!verifiedUser.success) {
		switch (verifiedUser.type) {
			case 0:
				return error('wtf');
			case 1:
				return error('An error occurred.');
		}
	}
	cleaning[req.body.user_id] = true;

	const dbNotifs = await rtdb.ref(`/notifications/${req.body.user_id}`).get();
	const notifs: firebase.database.DataSnapshot[] = [];

	dbNotifs.forEach((notif) => {
		notifs.push(notif);
	});

	for (const notifSnapshot of notifs) {
		const notif = await notifSnapshot.val();

		switch (notif.content_type) {
			case 'comment': {
				const comment = await firestore.collection('comments').doc(notif.content_id).get();

				if (!comment.exists) {
					notifSnapshot.ref.remove();
					continue;
				}

				const post = await firestore.collection('posts').doc(comment.data()?.post_id).get();
				if (!post.exists) {
					notifSnapshot.ref.remove();
					continue;
				}

				break;
			}
		}
	}

	delete cleaning[req.body.user_id];
	res.send({ success: true });
});

export default router;
