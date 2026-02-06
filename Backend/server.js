require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// 1. Initialize Firebase Admin
// This must happen before you use any routes that talk to Firestore
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin has been initialized!");
}

const db = admin.firestore();
const app = express();
const port = 5000;

// 2. Middleware
app.use(cors()); 
app.use(express.json()); 

// 3. Import Routes and Auth Middleware
const authRoutes = require('./Routes/authRoutes');
const reservationRoutes = require('./Routes/reservationRoutes');
const verifyToken = require('./middleware/authMiddleware');

// --- 4. PUBLIC ROUTES ---
// The login route must stay ABOVE the verifyToken middleware
app.use('/auth', authRoutes); 

// --- 5. PROTECTED ROUTES ---
// Any route defined below this line will require a Bearer Token in the header
app.use('/',verifyToken, reservationRoutes);

// 6. Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});