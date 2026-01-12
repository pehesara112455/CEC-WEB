const express = require('express');
const router = express.Router();

// Import Controller
const resController = require('../Controllers/ReservationController');
const availabilityController = require('../Controllers/check-availability');

// CHANGE THIS: Use .post instead of .get to match your Frontend Axios call
router.post('/add-reservation', resController.testAdd);
router.get('/check-availability', availabilityController.getOccupiedRooms);
router.get('/get-all-rooms', resController.getAllRooms);
router.get('/get-all-reservations', resController.getAllReservations);
router.patch('/update-reservation/:id', resController.updateReservation);
router.delete('/delete-reservation/:id', resController.deleteReservation);
router.get('/get-reservation-rooms/:id', resController.getReservationRooms);
router.get('/get-reservation-meals/:id', resController.getReservationMeals);
router.get('/get-reservation-others/:id', resController.getReservationOthers);
router.get('/get-invoice-data/:id', resController.getInvoiceData);


module.exports = router;