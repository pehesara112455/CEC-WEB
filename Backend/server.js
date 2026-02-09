import dotenv from 'dotenv';


import express from 'express';

import cors from 'cors';

// Load environment variables immediately
dotenv.config(); 

// Import your routes
// Note: In CommonJS (require), you usually don't need the .js extension
import serviceRoutes from './Routes/serviceRoutes.js';


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server is Running Successfully!");
});

// Mount the routes
app.use("/api/services", serviceRoutes);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));