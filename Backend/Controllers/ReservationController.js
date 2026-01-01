const reservation = require('../Models/reservationModel');
const admin = require("firebase-admin");
const db = admin.firestore();

exports.testAdd = async (req, res) => {
  try {
    //Get the data from the frontend form
    const { CompanyName, Contact, DateFrom, DateTo } = req.body;

    //Create a new instance (Pass the data as separate variables, not as one {obj})
    const myRes = new reservation(CompanyName, Contact, DateFrom, DateTo);

    // 3. Save to Firebase using the name 'myRes' 
    const result = await db.collection('reservations').add(myRes.toFirestore());

    res.status(201).send(`Success! Document ID: ${result.id}`);
  } catch (error) {
    console.error("Error details:", error.message);
    res.status(500).send("Error: " + error.message);
  }
};