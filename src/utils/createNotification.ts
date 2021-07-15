import { firebase, firestore, rtdb } from '../firebase';
import { v4 as uuid } from 'uuid';

interface Options {
	[index: string]: any;
	title: string;
	type: 'interaction' | 'error' | 'popup';
	target: string;
	body?: string;
	sent_by?: string;
	content_id?: string;
	content_type?: 'post' | 'comment';
	url?: string;
}

export interface Notification extends Partial<Options> {
	id: string;
	unread: boolean;
	created_at: {
		[key: string]: any;
	};
}

export default async function createNotification(options: Options) {
	const id = uuid();
	const ref = rtdb.ref(`notifications/${options.target}/${id}`);

	const notification: Notification = {
		id,
		title: options.title,
		type: options.type,
		unread: true,
		created_at: firebase.database.ServerValue.TIMESTAMP,
	};

	['body', 'sent_by', 'content_id', 'content_type', 'url'].forEach((x) => (x in options ? (notification[x] = options[x]) : ''));

	await ref.set(notification);
}
