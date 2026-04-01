// 1. Correct Import: Use require and grab db directly
const admin = require('firebase-admin');
const db = admin.firestore();


// 2. Get All Donations (Admin SDK Syntax)
const getAllDonations = async (req, res) => {
  try {
    const snapshot = await db.collection("donations").orderBy("date", "desc").get();
    
    const donations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Create Donation
const createDonation = async (req, res) => {
  try {
    const newDoc = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection("donations").add(newDoc);
    res.status(201).json({ id: docRef.id, ...newDoc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. Update Donation
const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("donations").doc(id).update(req.body);
    res.status(200).json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Delete Donation
const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("donations").doc(id).delete();
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Export all functions using CommonJS
module.exports = {
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation
};