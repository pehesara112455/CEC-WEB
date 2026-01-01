const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors()); // This allows your React app to talk to Node
app.use(express.json()); // This allows the server to read the data you send
const port = 5000;

const admin = require("firebase-admin"); // Call firebase-admin Library.
const serviceAccount = require("./serviceAccountKey.json"); // Use keys from serviceAccountKey.json

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); // Check availability 

const db = admin.firestore();
console.log("Firebase Admin has been initialized!");// Successful massage.

const reservationRoutes = require('./Routes/reservationRoutes');



app.use('/', reservationRoutes);


// THIS IS THE MOST IMPORTANT PART
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

{
  /*async function testDatabase() {
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
testDatabase();*/
}
