const express = require("express");
const cors = require("cors");
const db = require("./Config/Firebase");

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server is Running Successfully!");
});

// Routes

// POST: Add Hall or Room to Firebase
app.post("/api/add-item", async (req, res) => {
  try {
    const { collectionType, name, capacity, type, amount, extraHour } = req.body;

    // Input validation
    const docRef = await db.collection(collectionType).add({
      name,
      capacity: Number(capacity),
      type,
      amount: Number(amount),
      extraHour: extraHour || null, 
      createdAt: new Date().toISOString()
    });

    res.status(200).send({ id: docRef.id, message: "Data saved to Firebase!" });
  } catch (error) {
    console.error("Firebase Error:", error);
    res.status(500).send("Failed to save data to Firebase.");
  }
});

// GET: Fetch all data
app.get("/api/get-items/:type", async (req, res) => {
  try {
    const snapshot = await db.collection(req.params.type).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE: Remove an item by ID
app.delete("/api/delete-item/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    await db.collection(collection).doc(id).delete();
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));