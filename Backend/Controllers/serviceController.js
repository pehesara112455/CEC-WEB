// backend/controllers/serviceController.js
import { db } from '../Config/firebase.js';
import cloudinary from '../Config/Cloudinary.js'; // Import the config we made
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

// --- HELPER: Upload file to Cloudinary ---
const uploadToCloudinary = async (fileBuffer) => {
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
export const getServices = async (req, res) => {
  try {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE SERVICE (OPTIMIZED)
export const createService = async (req, res) => {
  try {
    const { serviceName, description } = req.body;
    
    // 1. Prepare Upload Promises (Do not await yet)
    const uploadPromises = [];
    let imageUrls = { image1: '', image2: '', image3: '' };

    if (req.files) {
        if (req.files.image1) {
            uploadPromises.push(uploadToCloudinary(req.files.image1[0].buffer).then(url => imageUrls.image1 = url));
        }
        if (req.files.image2) {
            uploadPromises.push(uploadToCloudinary(req.files.image2[0].buffer).then(url => imageUrls.image2 = url));
        }
        if (req.files.image3) {
            uploadPromises.push(uploadToCloudinary(req.files.image3[0].buffer).then(url => imageUrls.image3 = url));
        }
    }

    // 2. Run all uploads in PARALLEL (This is the speed boost)
    await Promise.all(uploadPromises);

    // 3. Save to Database
    const newService = {
      serviceName,
      description,
      ...imageUrls,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "services"), newService);
    res.status(201).json({ id: docRef.id, ...newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SERVICE (OPTIMIZED)
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description } = req.body;
    
    // Start with existing URLs or empty strings
    let updatedData = { 
        serviceName, 
        description,
        image1: req.body.image1 || '', 
        image2: req.body.image2 || '', 
        image3: req.body.image3 || '' 
    };

    // 1. Prepare Upload Promises for NEW files only
    const uploadPromises = [];

    if (req.files) {
        if (req.files.image1) {
            uploadPromises.push(uploadToCloudinary(req.files.image1[0].buffer).then(url => updatedData.image1 = url));
        }
        if (req.files.image2) {
            uploadPromises.push(uploadToCloudinary(req.files.image2[0].buffer).then(url => updatedData.image2 = url));
        }
        if (req.files.image3) {
            uploadPromises.push(uploadToCloudinary(req.files.image3[0].buffer).then(url => updatedData.image3 = url));
        }
    }

    // 2. Run uploads in PARALLEL
    await Promise.all(uploadPromises);

    // 3. Update Database
    const docRef = doc(db, "services", id);
    await updateDoc(docRef, updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE SERVICE
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "services", id));
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};