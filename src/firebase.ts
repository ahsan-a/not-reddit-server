import * as firebase from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.serviceKey || '{}');
if (!Object.keys(serviceAccount).length) process.exit(1);

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
});

const firestore = firebase.firestore();

export { firebase, firestore };
