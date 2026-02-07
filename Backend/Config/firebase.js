const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// Logic: Check if any Firebase app is already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Export the db instance for your controllers
module.exports = db;