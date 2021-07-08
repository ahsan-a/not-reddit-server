import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.serviceKey || '{}');
if (!Object.keys(serviceAccount).length) process.exit(1);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

export { firestore };
