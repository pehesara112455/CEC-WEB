// Backend/Controllers/serviceController.js

// 1. Correct Import: Matching your working Donation controller!
const admin = require('firebase-admin');
const db = admin.firestore();

// Cloudinary imports
const cloudinary = require('../Config/Cloudinary');
const streamifier = require('streamifier');

// --- HELPER: Upload file to Cloudinary safely ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'services' },
      (error, result) => {
        if (error) {
            console.error("Cloudinary Error:", error);
            reject(error);
        } else {
            resolve(result.secure_url);
        }
      }
    );
    
    // Use streamifier to handle the file buffer properly
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// 2. GET ALL SERVICES
const getServices = async (req, res) => {
  try {
    const snapshot = await db.collection("services").orderBy("createdAt", "desc").get();
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. CREATE SERVICE
const createService = async (req, res) => {
  try {
    const { serviceName, description } = req.body;
    
    const uploadPromises = [];
    let imageUrls = { image1: '', image2: '', image3: '' };

    if (req.files) {
        if (req.files.image1) uploadPromises.push(uploadToCloudinary(req.files.image1[0].buffer).then(url => imageUrls.image1 = url));
        if (req.files.image2) uploadPromises.push(uploadToCloudinary(req.files.image2[0].buffer).then(url => imageUrls.image2 = url));
        if (req.files.image3) uploadPromises.push(uploadToCloudinary(req.files.image3[0].buffer).then(url => imageUrls.image3 = url));
    }

    await Promise.all(uploadPromises);

    const newService = {
      serviceName,
      description,
      ...imageUrls,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection("services").add(newService);
    
    res.status(201).json({ id: docRef.id, ...newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE SERVICE
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description } = req.body;
    
    // Step 1 - Get the existing data from Firebase first
    const docRef = db.collection("services").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Service not found" });
    }

    const existingData = doc.data();

    // Step 2 - Set default images to the old images, NOT empty strings
    let updatedData = { 
        serviceName, 
        description,
        image1: existingData.image1 || '', 
        image2: existingData.image2 || '', 
        image3: existingData.image3 || '',
        updatedAt: new Date().toISOString()
    };

    // Step 3 - Overwrite with new images ONLY if the user uploaded them
    const uploadPromises = [];
    if (req.files) {
        if (req.files.image1) uploadPromises.push(uploadToCloudinary(req.files.image1[0].buffer).then(url => updatedData.image1 = url));
        if (req.files.image2) uploadPromises.push(uploadToCloudinary(req.files.image2[0].buffer).then(url => updatedData.image2 = url));
        if (req.files.image3) uploadPromises.push(uploadToCloudinary(req.files.image3[0].buffer).then(url => updatedData.image3 = url));
    }

    await Promise.all(uploadPromises);

    // Step 4 - Save to database
    await docRef.update(updatedData);
    
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// 5. DELETE SERVICE
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("services").doc(id).delete();
    
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: error.message });
  }
};

// 6. Export all functions using CommonJS
module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};