const express = require('express');
const router = express.Router();

// Import Controller
const resController = require('../Controllers/ReservationController');
const availabilityController = require('../Controllers/check-availability');

// CHANGE THIS: Use .post instead of .get to match your Frontend Axios call
router.post('/add-reservation', resController.testAdd);
router.get('/check-availability', availabilityController.getOccupiedRooms);
router.get('/get-all-rooms', resController.getAllRooms);


module.exports = router;