// Backend/server.js
import dotenv from 'dotenv';
dotenv.config(); // <--- THIS MUST BE THE FIRST LINE OF CODE
import express from 'express';
import cors from 'cors';

// IMPORTANT: Check if your folder is named "Routes" or "routes"
// It must match exactly. Based on your previous files, use:
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