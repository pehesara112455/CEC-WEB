const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const db = admin.firestore();
console.log ("Firebase Admin has been initialized!")

{/*async function testDatabase() {
  try {
    // This creates a "collection" called 'test' and adds a document
    await db.collection("test").add({
      message: "Hello from my Node.js server!",
      time: new Date()
    });
    console.log("Success! Data saved to Firebase.");
  } catch (error) {
    console.error("Error connecting to Firebase:", error);
  }
}

// Run the test function
testDatabase();*/}