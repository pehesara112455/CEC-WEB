// Backend/Routes/serviceRoutes.js
const express = require('express');
const multer = require('multer');

// Import controllers using destructuring
const { 
  getServices, 
  createService, 
  updateService, 
  deleteService 
} = require('../Controllers/serviceController'); 

const router = express.Router();

// --- MULTER CONFIGURATION ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]);

// --- ROUTES ---
router.get('/', getServices);
router.post('/', uploadFields, createService);
router.put('/:id', uploadFields, updateService);
router.delete('/:id', deleteService);

module.exports = router;