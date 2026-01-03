import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import NavBar from '../Components/AdminNav';
import ReservationTable from '../Components/Reservation';
import AddReservation from '../Components/addNewReservation';
import AddReservationStage2 from '../Components/addNewreservation2';

const ReservationsDashboard = () => {
  const [active, setActive] = useState("reservationTable");
  const [allData, setAllData] = useState({});

  const handelDataStage1 = (stage1Data) => {
    setAllData({ ...allData, ...stage1Data });
    setActive('addReservationStage2');
  }

  // This runs when the Confirm button is clicked in Stage 2
  const handelDataStage2 = async (stage2Data) => {
    // 1. Combine everything into one final object
    const finalBookingData = { ...allData, ...stage2Data };

    try {
      // 2. Send the big package to your Node.js backend
      const response = await axios.post('http://localhost:5000/add-reservation', finalBookingData);
      
      alert("Reservation Saved Successfully!");
      
      // 3. Clear the suitcase and go back to the table
      setAllData({});
    } catch (error) {
      console.error("Error saving to database:", error);
      alert("Failed to save. Check if your backend server is running.");
    }
  }

  return (
    <div className="flex bg-gray-50 font-sans">
      <NavBar/>
      {active === "reservationTable" && (
        <ReservationTable openAddRes={() => setActive('addReservation')} />
      )}
      
      {active === "addReservation" && (
        <AddReservation onNext={handelDataStage1} savedData={allData} />
      )}

      {active === "addReservationStage2" && (
        <AddReservationStage2 
          onNext={handelDataStage2} 
          onBack={() => setActive('addReservation')} 
        />
      )}
    </div>
  );
};

export default ReservationsDashboard;