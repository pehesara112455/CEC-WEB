const db = require("../Config/Firebase");

exports.addItem = async (req, res) => {
  try {
    const { collectionType, name, capacity, type, amount, extraHour } = req.body;
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
    res.status(500).send("Failed to save data to Firebase.");
  }
};

exports.getItems = async (req, res) => {
  try {
    const snapshot = await db.collection(req.params.type).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { collection, id } = req.params;
    await db.collection(collection).doc(id).delete();
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const { name, capacity, type, amount, extraHour } = req.body;
    const updatedData = {
      name: name.trim(),
      capacity: Number(capacity),
      type,
      amount: Number(amount),
      extraHour: extraHour || null,
      updatedAt: new Date().toISOString()
    };
    await db.collection(collection).doc(id).update(updatedData);
    res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};