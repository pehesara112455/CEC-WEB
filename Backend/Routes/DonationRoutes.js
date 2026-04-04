const express = require('express');
const { 
    getAllDonations, 
    createDonation, 
    updateDonation, 
    deleteDonation 
} = require('../Controllers/DonationController.js');

const router = express.Router();

router.get('/', getAllDonations);
router.post('/', createDonation);
router.put('/:id', updateDonation);
router.delete('/:id', deleteDonation);

// Export the router using CommonJS so server.js can read it correctly
module.exports = router;