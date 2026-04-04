// Backend/Controllers/serviceController.js
const db = require('../Config/firebase'); // Importing the Admin SDK instance
const cloudinary = require('../Config/Cloudinary');

// --- HELPER: Upload file to Cloudinary ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'services' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// GET ALL SERVICES
exports.getServices = async (req, res) => {
  try {
    // Admin SDK syntax: db.collection().orderBy().get()
    const snapshot = await db.collection("services").orderBy("createdAt", "desc").get();
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE SERVICE
exports.createService = async (req, res) => {
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

    // Admin SDK syntax: db.collection().add()
    const docRef = await db.collection("services").add(newService);
    
    res.status(201).json({ id: docRef.id, ...newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description } = req.body;
    
    let updatedData = { 
        serviceName, 
        description,
        image1: req.body.image1 || '', 
        image2: req.body.image2 || '', 
        image3: req.body.image3 || '' 
    };

    const uploadPromises = [];
    if (req.files) {
        if (req.files.image1) uploadPromises.push(uploadToCloudinary(req.files.image1[0].buffer).then(url => updatedData.image1 = url));
        if (req.files.image2) uploadPromises.push(uploadToCloudinary(req.files.image2[0].buffer).then(url => updatedData.image2 = url));
        if (req.files.image3) uploadPromises.push(uploadToCloudinary(req.files.image3[0].buffer).then(url => updatedData.image3 = url));
    }

    await Promise.all(uploadPromises);

    // Admin SDK syntax: db.collection().doc().update()
    await db.collection("services").doc(id).update(updatedData);
    
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    // Admin SDK syntax: db.collection().doc().delete()
    await db.collection("services").doc(id).delete();
    
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};