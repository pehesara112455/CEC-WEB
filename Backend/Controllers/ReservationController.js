const reservation = require('../Models/reservationModel');
const admin = require("firebase-admin");
const db = admin.firestore();

exports.testAdd = async (req, res) => {
  try {
    const { CompanyName, Contact, DateFrom, DateTo, Rooms, Meals, Others } = req.body;

    const myRes = new reservation(CompanyName, Contact, DateFrom, DateTo);
    const result = await db.collection('reservations').add(myRes.toFirestore());
    const resId = result.id; 

    // 1. ADD ROOMS (Correct)
    if (Rooms && Array.isArray(Rooms) && Rooms.length > 0){
      const roomRef = db.collection("reservations").doc(resId).collection("Rooms");
      const roomPromises = Rooms.map(room => { 
        return roomRef.add(reservation.roomsSubCollection(room))
      });
      await Promise.all(roomPromises);
    }

    // 2. ADD MEALS (Correct)
    if (Meals && Array.isArray(Meals) && Meals.length > 0){
      const mealRef = db.collection("reservations").doc(resId).collection("Meals");
      const mealPromises = Meals.map(meal => { 
        return mealRef.add(reservation.mealsSubCollection(meal))
      });
      await Promise.all(mealPromises);
    }

    // 3. ADD OTHERS (Fixed)
    if (Others && Array.isArray(Others) && Others.length > 0){
      // FIX: Changed "Meals" to "Others"
      const otherRef = db.collection("reservations").doc(resId).collection("Others");
      const otherPromises = Others.map(other => { 
        // FIX: Ensure you use the correct model function for Others
        return otherRef.add(reservation.othersSubCollection(other))
      });
      await Promise.all(otherPromises);
    }

    res.status(201).send(`Success! Document ID: ${result.id}`);
  } catch (error) {
    console.error("Error details:", error.message);
    res.status(500).send("Error: " + error.message);
  }
};