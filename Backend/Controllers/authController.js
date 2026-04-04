const admin = require('firebase-admin');
const axios = require('axios'); // We use this to call the Firebase Auth REST API

// Replace this with your Web API Key from Firebase Project Settings
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Authenticate with Firebase Auth REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    // 2. Get the ID Token from the response
    const idToken = response.data.idToken;

    // 3. Return success and the token to the frontend
    res.status(200).json({
      message: "Login successful",
      token: idToken,
      expiresIn: response.data.expiresIn
    });

  } catch (error) {
    console.error("Auth Error:", error.response?.data?.error?.message || error.message);
    res.status(401).json({ 
      message: "Authentication failed. Please check your credentials." 
    });
  }
};