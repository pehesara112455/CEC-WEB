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
        // Save to sub-collection (Inside the reservation document)
        const subCollectionPromise = roomSubRef.add(reservation.roomsSubCollection(room));
        
        // Save to global collection (For availability checking)
        // We pass 'resId' here so we know which reservation this room belongs to
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

// Controller to fetch all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const snapshot = await db.collection('reservations').get();
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update an existing reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params; // This is the displayId (e.g., RES-2026-001)
    const updatedData = req.body; // Contains all fields from the Edit stages

    // Reference the specific document using the custom ID
    const reservationRef = db.collection('reservations').doc(id);

    // .update() only changes the fields provided in updatedData
    await reservationRef.update({
      ...updatedData,
      updatedAt: new Date() // Good practice to track when changes were made
    });

    res.status(200).json({ 
      message: `Reservation ${id} updated successfully`,
      id: id 
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a reservation document
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params; // This is the displayId (e.g., RES-2026-002)

    // Reference the document by its ID and delete it
    await db.collection('reservations').doc(id).delete();

    res.status(200).json({ message: `Reservation ${id} deleted successfully` });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getReservationRooms = async (req, res) => {
  try {
    const { id } = req.params; // displayId (e.g., RES-2026-001)
    
    // Reference the specific document's sub-collection
    const roomsSnapshot = await db.collection('reservations').doc(id).collection('Rooms').get();
    
    const rooms = roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Meals Sub-collection
exports.getReservationMeals = async (req, res) => {
  try {
    const snapshot = await db.collection('reservations').doc(req.params.id).collection('Meals').get();
    const meals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(meals);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Fetch Others Sub-collection
exports.getReservationOthers = async (req, res) => {
  try {
    const snapshot = await db.collection('reservations').doc(req.params.id).collection('Others').get();
    const others = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(others);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params; // displayId (e.g., RES-2026-001)
    // 1. Destructure the arrays and the top-level data
    const { Rooms, Meals, Others, ...topLevelData } = req.body;

    const reservationRef = db.collection('reservations').doc(id);
    const batch = db.batch();

    // 2. Update Top-Level Data in the batch
    batch.update(reservationRef, {
      ...topLevelData,
      updatedAt: new Date()
    });

    /**
     * HELPER FUNCTION: Sync Sub-collections
     * It deletes all existing documents in a sub-collection and replaces them 
     * with the new ones from your React state.
     */
    const syncSubCollection = async (collectionName, dataArray) => {
      const subRef = reservationRef.collection(collectionName);
      const snapshot = await subRef.get();
      
      // Mark old documents for deletion in the batch
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      
      // Mark new documents for creation in the batch
      if (dataArray && Array.isArray(dataArray)) {
        dataArray.forEach((item) => {
          // We remove the 'id' field if it exists to let Firestore generate a fresh auto-ID
          const { id, ...itemData } = item; 
          const newDocRef = subRef.doc(); 
          batch.set(newDocRef, itemData);
        });
      }
    };

    // 3. Queue up the sync operations for all three sub-collections
    // We use await here to fetch the snapshots, but changes are only saved at .commit()
    await syncSubCollection('Rooms', Rooms);
    await syncSubCollection('Meals', Meals);
    await syncSubCollection('Others', Others);

    // 4. Commit all changes at once (Main doc + Deletions + Insertions)
    await batch.commit();

    res.status(200).json({ 
      message: "Reservation, Rooms, Meals, and Services updated successfully!" 
    });

  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update database: " + error.message });
  }
};