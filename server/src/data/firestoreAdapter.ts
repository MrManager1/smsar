import admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

export function initFirestore() {
  if (db) return db;

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!svc) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_BASE64 must be provided to use Firestore');

  let serviceAccount: any;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decoded);
    } else {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string);
    }
  } catch (e) {
    throw new Error('Failed to parse service account JSON for Firestore: ' + String(e));
  }

  try {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
    console.log('Initialized Firestore');
    return db;
  } catch (e) {
    console.error('Failed to initialize Firestore', e);
    throw e;
  }
}

export async function addProperty(payload: any) {
  const db = initFirestore();
  const docRef = await db.collection('properties').add({ ...payload, createdAt: new Date().toISOString() });
  const snap = await docRef.get();
  return { id: docRef.id, ...snap.data() };
}

export async function listProperties() {
  const db = initFirestore();
  const snaps = await db.collection('properties').get();
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addConversation(payload: any) {
  const db = initFirestore();
  const docRef = await db.collection('conversations').add({ ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const snap = await docRef.get();
  return { id: docRef.id, ...snap.data() };
}

export async function listConversations() {
  const db = initFirestore();
  const snaps = await db.collection('conversations').get();
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addMessage(payload: any) {
  const db = initFirestore();
  const docRef = await db.collection('messages').add({ ...payload, ts: new Date().toISOString() });
  const snap = await docRef.get();
  // update conversation updatedAt
  if (payload.conversationId) {
    const cRef = db.collection('conversations').doc(String(payload.conversationId));
    await cRef.update({ updatedAt: new Date().toISOString() }).catch(() => {});
  }
  return { id: docRef.id, ...snap.data() };
}

export async function getMessagesForConversation(conversationId: any) {
  const db = initFirestore();
  const snaps = await db.collection('messages').where('conversationId', '==', conversationId).orderBy('ts', 'asc').get();
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}
