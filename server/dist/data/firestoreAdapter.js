"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFirestore = initFirestore;
exports.addProperty = addProperty;
exports.listProperties = listProperties;
exports.addConversation = addConversation;
exports.listConversations = listConversations;
exports.addMessage = addMessage;
exports.getMessagesForConversation = getMessagesForConversation;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let db = null;
function initFirestore() {
    if (db)
        return db;
    const svc = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!svc)
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_BASE64 must be provided to use Firestore');
    let serviceAccount;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
            const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
            serviceAccount = JSON.parse(decoded);
        }
        else {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        }
    }
    catch (e) {
        throw new Error('Failed to parse service account JSON for Firestore: ' + String(e));
    }
    try {
        firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(serviceAccount) });
        db = firebase_admin_1.default.firestore();
        console.log('Initialized Firestore');
        return db;
    }
    catch (e) {
        console.error('Failed to initialize Firestore', e);
        throw e;
    }
}
function addProperty(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = initFirestore();
        const docRef = yield db.collection('properties').add(Object.assign(Object.assign({}, payload), { createdAt: new Date().toISOString() }));
        const snap = yield docRef.get();
        return Object.assign({ id: docRef.id }, snap.data());
    });
}
function listProperties() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = initFirestore();
        const snaps = yield db.collection('properties').get();
        return snaps.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    });
}
function addConversation(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = initFirestore();
        const docRef = yield db.collection('conversations').add(Object.assign(Object.assign({}, payload), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
        const snap = yield docRef.get();
        return Object.assign({ id: docRef.id }, snap.data());
    });
}
function listConversations() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = initFirestore();
        const snaps = yield db.collection('conversations').get();
        return snaps.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    });
}
function addMessage(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = initFirestore();
        const docRef = yield db.collection('messages').add(Object.assign(Object.assign({}, payload), { ts: new Date().toISOString() }));
        const snap = yield docRef.get();
        // update conversation updatedAt
        if (payload.conversationId) {
            const cRef = db.collection('conversations').doc(String(payload.conversationId));
            yield cRef.update({ updatedAt: new Date().toISOString() }).catch(() => { });
        }
        return Object.assign({ id: docRef.id }, snap.data());
    });
}
function getMessagesForConversation(conversationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = initFirestore();
        const snaps = yield db.collection('messages').where('conversationId', '==', conversationId).orderBy('ts', 'asc').get();
        return snaps.docs.map(d => (Object.assign({ id: d.id }, d.data())));
    });
}
