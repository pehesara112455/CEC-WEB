const db = require("../Config/Firebase");
const cloudinary = require("../Config/Cloudinary");

// ADD ITEM
exports.addItem = async (req, res) => {
  try {
    const { collectionType, name, capacity, type, amount, extraHour } = req.body;
  
    // Validation
    if (!name || !capacity || !type || !amount || !req.file) {
      return res.status(400).json({ error: "All fields except 'Extra Hour' are required." });
    }
  
    let imageUrl = null;

    // Upload image if file exists
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: collectionType },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
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
      image: imageUrl,
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

    // Validation
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
      // Upload new image if provided
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

    // If no existing image and no new image, reject
    const docSnapshot = await db.collection(collection).doc(id).get();
    if (!updatedData.image && !docSnapshot.data().image) {
      return res.status(400).json({ error: "Image is required." });
    }

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
