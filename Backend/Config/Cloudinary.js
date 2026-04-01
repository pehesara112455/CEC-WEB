// Backend/Config/Cloudinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  // FIX: These names now strictly match what we setup in your .env file
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;