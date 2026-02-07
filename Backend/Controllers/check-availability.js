const admin = require("firebase-admin");
const db = admin.firestore();

exports.getOccupiedRooms = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // QUERY: Fetch all bookings that overlap with the requested range
    const snapshot = await db.collection('bookings')
      .where('DateFrom', '<=', endDate)
      .get();

    // FILTER: Manual check for the second half of the overlap logic
    const occupiedRoomNames = snapshot.docs
      .map(doc => doc.data())
      .filter(booking => booking.DateTo >= startDate)
      .map(booking => booking.RoomName);

    // Remove duplicates and send unique occupied names
    res.status(200).json([...new Set(occupiedRoomNames)]);
  } catch (error) {
    res.status(500).send("Availability check failed: " + error.message);
  }
};