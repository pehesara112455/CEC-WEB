// 1. Make sure these imports are at the TOP of your file
const ClientDetails = require('../Models/clientDetails'); 
const admin = require('firebase-admin');
const db = admin.firestore();

exports.addClient = async (req, res) => {
  try {
    // 2. Log the data to see what React is sending
    console.log("Data received from Frontend:", req.body);

    const { 
      companyName, contactNumber, address, email, 
      type, contactPerson, secondaryContact, nic 
    } = req.body;

    // 3. Generate a Client ID
    // We fetch the count to make a unique ID like CL-2026-001
    const snapshot = await db.collection('clientdetails').count().get();
    const count = snapshot.data().count + 1;
    const clientId = `CL-2026-${String(count).padStart(3, '0')}`;

    // 4. Create the Model Instance
    const newClient = new ClientDetails(
      companyName, 
      contactNumber, 
      address, 
      email, 
      type, 
      contactPerson, 
      secondaryContact, 
      nic, 
      clientId
    );

    // 5. Save to Firestore
    // Using .doc(clientId) ensures the document name matches our custom ID
    await db.collection('clientdetails').doc(clientId).set(newClient.toFirestore());

    res.status(201).json({ message: "Client created", id: clientId });
  } catch (error) {
    // 6. This will show exactly what went wrong in your Terminal
    console.error("FIREBASE ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    // 1. Reference the collection and sort by createdAt
    // We sort descending (desc) so the newest clients appear first
    const clientRef = db.collection('clientdetails').orderBy('createdAt', 'desc');
    const snapshot = await clientRef.get();

    // 2. Check if the collection is empty
    if (snapshot.empty) {
      return res.status(200).json([]); // Return an empty array if no clients exist
    }

    // 3. Map the documents into a clean array of objects
    const clients = snapshot.docs.map(doc => ({
      id: doc.id,         // The Firestore Document ID (e.g., CL-2026-001)
      ...doc.data()       // Spread the rest of the data (companyName, contact, etc.)
    }));

    // 4. Send the data back to the frontend
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch client list. " + error.message });
  }
};

// DELETE A CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params; // Get the Client ID (e.g., CL-2026-001) from the URL

    // 1. Check if the client exists before deleting
    const clientDoc = db.collection('clientdetails').doc(id);
    const doc = await clientDoc.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Client not found." });
    }

    // 2. Perform the deletion
    await clientDoc.delete();

    // 3. Send success response
    res.status(200).json({ message: `Client ${id} deleted successfully.` });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete client. " + error.message });
  }
};