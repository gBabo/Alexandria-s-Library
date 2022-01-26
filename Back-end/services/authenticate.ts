import * as admin from 'firebase-admin';

admin.initializeApp({ credential: admin.credential.cert('./config/serviceAccountKey.json') });

export default async function authenticate(idToken: string) {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken.email;
  } catch (err) {
    return null;
  }
}
