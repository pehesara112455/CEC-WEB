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
    const { id } = req.params; // e.g., RES-2026-002
    const batch = db.batch();
    const resRef = db.collection('reservations').doc(id);

    // 1. Delete the main Reservation document
    batch.delete(resRef);

    // 2. Helper function to find and mark subcollection docs for deletion
    const deleteSubcollection = async (subName) => {
      const snapshot = await resRef.collection(subName).get();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
    };

    // 3. Queue up subcollection deletions
    await deleteSubcollection('Rooms');
    await deleteSubcollection('Meals');
    await deleteSubcollection('Others');

    // 4. Delete from global 'bookings' collection
    // Note: Make sure the field name matches (you used 'reservationId' previously)
    const bookingsSnapshot = await db.collection('bookings')
      .where('reservationId', '==', id)
      .get();

    bookingsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 5. Commit all deletions at once
    await batch.commit();

    res.status(200).json({ 
      message: `Reservation ${id}, subcollections, and global bookings deleted successfully.` 
    });

  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ error: "Failed to delete: " + error.message });
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
    const { id } = req.params; // This is the reservationId (e.g., RES-2026-001)
    const { Rooms, Meals, Others, ...topLevelData } = req.body;

    const reservationRef = db.collection('reservations').doc(id);
    const batch = db.batch();

    // 1. Update Top-Level Data
    batch.update(reservationRef, {
      ...topLevelData,
      updatedAt: new Date()
    });

    // 2. Sync Sub-collections (Meals & Others)
    const syncStandardSub = async (collectionName, dataArray) => {
      const subRef = reservationRef.collection(collectionName);
      const snapshot = await subRef.get();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      if (dataArray && Array.isArray(dataArray)) {
        dataArray.forEach((item) => {
          const { id, ...itemData } = item;
          batch.set(subRef.doc(), itemData);
        });
      }
    };

    // 3. SPECIAL SYNC: Rooms & Global Bookings
    const syncRoomsAndBookings = async (roomsArray) => {
      const roomSubRef = reservationRef.collection('Rooms');
      const globalBookingRef = db.collection('bookings');

      // A. Delete old rooms from Sub-collection
      const oldRoomsSnapshot = await roomSubRef.get();
      oldRoomsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      // B. Delete old records from Global Bookings where reservationId matches
      const oldGlobalBookings = await globalBookingRef.where('reservationId', '==', id).get();
      oldGlobalBookings.docs.forEach((doc) => batch.delete(doc.ref));

      // C. Add new rooms to both places
      if (roomsArray && Array.isArray(roomsArray)) {
        roomsArray.forEach((room) => {
          const { id: dummyId, ...roomData } = room;

          // Add to Sub-collection
          batch.set(roomSubRef.doc(), roomData);

          // Add to Global Bookings (using your Model's mapping)
          // Ensure you use the same structure as your Add function
          batch.set(globalBookingRef.doc(), {
            RoomName: roomData.RoomName,
            DateFrom: roomData.DateFrom,
            DateTo: roomData.DateTo,
            reservationId: id, // Link back to this reservation
            updatedAt: new Date()
          });
        });
      }
    };

    // 4. Execute the syncs
    await syncRoomsAndBookings(Rooms);
    await syncStandardSub('Meals', Meals);
    await syncStandardSub('Others', Others);

    // 5. Commit all changes atomically
    await batch.commit();

    res.status(200).json({ 
      message: "Reservation and global availability updated successfully!" 
    });

  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update: " + error.message });
  }
};

exports.getInvoiceData = async (req, res) => {
  try {
    const { id } = req.params; // This is 'RES-2026-003'
    const resRef = db.collection('reservations').doc(id);
    
    // Fetch main document and all sub-collections at the same time
    const [mainDoc, roomsSnap, mealsSnap, othersSnap] = await Promise.all([
      resRef.get(),
      resRef.collection('Rooms').get(),
      resRef.collection('Meals').get(),
      resRef.collection('Others').get()
    ]);

    if (!mainDoc.exists) {
      return res.status(404).json({ error: "Reservation not found in database" });
    }

    // Combine the data into one object
    const invoiceData = {
      ...mainDoc.data(), // This includes CompanyName, DateFrom, TotalAmount, etc.
      id: mainDoc.id,
      Rooms: roomsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      Meals: mealsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      Others: othersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    };

    console.log("Sending data to frontend:", invoiceData); // Check your terminal to see this
    res.status(200).json(invoiceData);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
};