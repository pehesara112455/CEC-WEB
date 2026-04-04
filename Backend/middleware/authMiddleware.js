const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided. Access denied." });
  }

  try {
    // Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next(); // Proceed to the controller
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;