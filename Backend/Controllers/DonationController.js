import { db } from "../Config/firebase.js";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy,
  query
} from "firebase/firestore";

// 1. Get All Donations
export const getAllDonations = async (req, res) => {
  try {
    const q = query(collection(db, "donations"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    
    const donations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create Donation
export const createDonation = async (req, res) => {
  try {
    const newDoc = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "donations"), newDoc);
    res.status(201).json({ id: docRef.id, ...newDoc });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Update Donation
export const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donationRef = doc(db, "donations", id);
    
    await updateDoc(donationRef, req.body);
    res.status(200).json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Delete Donation
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, "donations", id));
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};