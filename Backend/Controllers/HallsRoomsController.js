const db = require("../Config/firebase"); // Changed to lowercase 'firebase' to match your file system
const cloudinary = require("../Config/Cloudinary");

// ADD ITEM
exports.addItem = async (req, res) => {
  try {
    const { collectionType, name, capacity, type, amount, extraHour } = req.body;
  
    if (!name || !capacity || !type || !amount || !req.file) {
      return res.status(400).json({ error: "All fields except 'Extra Hour' are required." });
    }
  
    let imageUrl = null;

    // Stream the incoming memory buffer directly to Cloudinary
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: collectionType },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url); // Returns the secure HTTPS link
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const docRef = await db.collection(collectionType).add({
      name: name.trim(),
      capacity: Number(capacity),
      type,
      amount: Number(amount),
      extraHour: extraHour || null,
      image: imageUrl, // Save ONLY the link to Firestore
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ id: docRef.id, message: "Data saved successfully!" });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({ error: "Failed to save item." });
  }
};

// UPDATE ITEM
exports.updateItem = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const { name, capacity, type, amount, extraHour } = req.body;

    if (!name || !capacity || !type || !amount) {
      return res.status(400).json({ error: "All fields except 'Extra Hour' are required." });
    }

    let updatedData = {
      name: name.trim(),
      capacity: Number(capacity),
      type,
      amount: Number(amount),
      extraHour: extraHour || null,
      updatedAt: new Date().toISOString(),
    };

    if (req.file) {
      // If the user selected a NEW image, upload it and overwrite the old link
      const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: collection },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
      updatedData.image = imageUrl;
    }

    // If they didn't upload a new file, updatedData.image remains undefined.
    // Firestore's .update() function safely ignores undefined fields, keeping the old image!

    await db.collection(collection).doc(id).update(updatedData);

    res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ error: "Failed to update item." });
  }
};

// DELETE ITEM
exports.deleteItem = async (req, res) => {
  try {
    const { collection, id } = req.params;
    await db.collection(collection).doc(id).delete();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ITEMS
exports.getItems = async (req, res) => {
  try {
    const snapshot = await db.collection(req.params.type).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ error: error.message });
  }
};