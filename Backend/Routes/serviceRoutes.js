// backend/routes/serviceRoutes.js
import express from 'express';
import multer from 'multer';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService 
} from '../Controllers/serviceController.js'; 

const router = express.Router();

// --- MULTER CONFIGURATION ---
// Store files in memory temporarily so we can stream them to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure fields: we expect up to 3 image fields
const uploadFields = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]);

// --- ROUTES ---
router.get('/', getServices);

// Apply 'uploadFields' middleware to POST and PUT to handle file uploads
router.post('/', uploadFields, createService);
router.put('/:id', uploadFields, updateService);
router.delete('/:id', deleteService);

export default router;