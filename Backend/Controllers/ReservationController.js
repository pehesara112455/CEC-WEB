const reservation = require('../Models/reservationModel');
const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * Processes a new reservation with a custom formatted ID (e.g., RES-2026-001).
 */
exports.testAdd = async (req, res) => {
  try {
    // 1. Get data from frontend. Use TotalAmount (or GrandTotal) correctly.
    const { CompanyName, Contact, DateFrom, DateTo, Rooms, Meals, Others, TotalAmount } = req.body;

    // --- CUSTOM ID GENERATION ---
    const currentYear = new Date().getFullYear();
    const reservationsRef = db.collection('reservations');
    
    // Count existing documents to generate the next sequence number
    const snapshot = await reservationsRef.count().get();
    const count = snapshot.data().count;
    
    // Format the number (e.g., 1 becomes 001)
    const sequenceNumber = String(count + 1).padStart(3, '0');
    const customResId = `RES-${currentYear}-${sequenceNumber}`;

    // 2. CREATE MODEL INSTANCE
    // We match your Model: (CompanyName, Contact, DateFrom, DateTo, displayId, TotalAmount)
    const myRes = new reservation(
      CompanyName, 
      Contact, 
      DateFrom, 
      DateTo, 
      customResId, 
      Number(TotalAmount || 0) // Ensure this is a number for math
    );
    
    // 3. SAVE MAIN DOCUMENT
    // We use .set(myRes.toFirestore()) so all 6 fields are saved correctly.
    await reservationsRef.doc(customResId).set(myRes.toFirestore());

    const resId = customResId; 

    // 1. ADD ROOMS TO SUB-COLLECTION
    if (Rooms && Array.isArray(Rooms) && Rooms.length > 0) {
        const roomSubRef = db.collection("reservations").doc(resId).collection("Rooms");
        const globalBookingRef = db.collection('bookings');
        
        const roomPromises = Rooms.map(async (room) => {
            const subCollectionPromise = roomSubRef.add(reservation.roomsSubCollection(room));
            const globalCollectionPromise = globalBookingRef.add(
                reservation.globalBookingMapping(room, resId)
            );
            return Promise.all([subCollectionPromise, globalCollectionPromise]);
        });
        await Promise.all(roomPromises);
    }

    // 2. ADD MEALS TO SUB-COLLECTION
    if (Meals && Array.isArray(Meals) && Meals.length > 0) {
      const mealRef = db.collection("reservations").doc(resId).collection("Meals");
      const mealPromises = Meals.map(meal => mealRef.add(reservation.mealsSubCollection(meal)));
      await Promise.all(mealPromises);
    }

    // 3. ADD OTHERS TO SUB-COLLECTION
    if (Others && Array.isArray(Others) && Others.length > 0) {
      const otherRef = db.collection("reservations").doc(resId).collection("Others");
      const otherPromises = Others.map(other => otherRef.add(reservation.othersSubCollection(other)));
      await Promise.all(otherPromises);
    }

    // Send JSON response so React can easily read it
    res.status(201).json({ message: "Success", id: resId });
    
  } catch (error) {
    console.error("Error saving reservation:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches all rooms for the frontend dropdown.
 */
exports.getAllRooms = async (req, res) => {
  try {
    const snapshot = await db.collection('rooms').get();
    const rooms = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        // Matches your Firestore fields: 'name' and 'amount'
        name: data.name || "Unknown Room", 
        amount: data.amount || 0 
      };
    });
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ error: error.message });
  }
};