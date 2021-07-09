import { firebase } from '../firebase';

export default async function verifyLogin(id_token: string, uid: string) {
	try {
		const token = await firebase.auth().verifyIdToken(id_token);
		if (uid !== token.uid)
			return {
				success: false,
				type: 0,
			};
		else return { success: true };
	} catch (e) {
		return { success: false, type: 1 };
	}
}
