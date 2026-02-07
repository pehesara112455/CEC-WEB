const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// POST /login
router.post('/login', authController.login);

module.exports = router;