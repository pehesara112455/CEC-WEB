const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "softstack-c7861.appspot.com" // 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };