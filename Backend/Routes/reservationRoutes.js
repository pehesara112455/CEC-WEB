const express = require('express');
const router = express.Router();

// Import Controller
const resController = require('../Controllers/ReservationController');

// CHANGE THIS: Use .post instead of .get to match your Frontend Axios call
router.post('/add-reservation', resController.testAdd);

module.exports = router;