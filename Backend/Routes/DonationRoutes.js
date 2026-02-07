import express from 'express';
import { 
    getAllDonations, 
    createDonation, 
    updateDonation, 
    deleteDonation 
} from '../Controllers/DonationController.js'; // Note the .js extension!

const router = express.Router();

router.get('/', getAllDonations);
router.post('/', createDonation);
router.put('/:id', updateDonation);
router.delete('/:id', deleteDonation);

export default router;