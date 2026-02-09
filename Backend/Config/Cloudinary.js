// backend/Config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Ensure config is loaded (safe to call multiple times)
dotenv.config();

// --- DEBUGGING START ---
// This will print to your terminal when the server starts
console.log("---------------------------------------");
console.log("CLOUDINARY DEBUG CHECK:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Loaded Successfully" : "MISSING / UNDEFINED");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded Successfully" : "MISSING / UNDEFINED");
console.log("---------------------------------------");
// --- DEBUGGING END ---

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;