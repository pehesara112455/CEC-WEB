require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// 1. Firebase Initialization Guard
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin has been initialized!");
}
const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Global Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increased limits for image uploads (useful for Blogs/Halls)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Import Route Modules
const authRoutes = require('./Routes/authRoutes');
const reservationRoutes = require('./Routes/reservationRoutes');
const hallsRoomsRoutes = require("./Routes/HallsRoomsRoutes");
const blogRoutes = require('./Routes/blogRoutes');
const verifyToken = require('./middleware/authMiddleware');
const donationRoutes = require('./Routes/DonationRoutes');
const clientRoutes = require('./Routes/clientRoutes');

// 4. Public Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running', version: '1.0.0' });
});

app.use('/auth', authRoutes);
app.use("/api/halls-rooms", hallsRoomsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/donations", donationRoutes);
app.use('/api/clients',clientRoutes);

// 5. Protected Routes (Admin Only)
app.use('/reservations', verifyToken, reservationRoutes);

// 6. 404 & Error Handling
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 50MB.' });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 7. Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
