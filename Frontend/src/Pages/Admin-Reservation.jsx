import React, { useState } from 'react';
import axios from 'axios'; 
import NavBar from '../Components/AdminNav';
import ReservationTable from '../Components/Reservation';
import AddReservation from '../Components/addNewReservation';
import AddReservationStage2 from '../Components/addNewreservation2';

const ReservationsDashboard = () => {
  const [active, setActive] = useState("reservationTable");
  
  // This state stores all data from both stages
  const [allData, setAllData] = useState({
    CompanyName: '',
    Contact: '',
    DateFrom: '',
    DateTo: '',
    Rooms: [],
    Meals: [],
    Others: []
  });

  // Runs when Stage 1 (Rooms) is finished
  const handelDataStage1 = (stage1Data) => {
    // We save Stage 1 data into allData
    setAllData((prev) => ({ ...prev, ...stage1Data }));
    setActive('addReservationStage2');
  }

  // Runs when Stage 2 (Meals/Others) is finished and Confirm is clicked
  const handelDataStage2 = async (stage2Data) => {
    // 1. Combine Stage 1 (allData) with Stage 2 (stage2Data)
    const finalBookingData = { ...allData, ...stage2Data };

    try {
      // 2. Send the complete data to the backend
      const response = await axios.post('http://localhost:5000/add-reservation', finalBookingData);
      
      if (response.status === 201) {
        alert("Reservation Saved Successfully!");
        
        // 3. Reset state and go back to the main table
        setAllData({
          CompanyName: '',
          Contact: '',
          DateFrom: '',
          DateTo: '',
          Rooms: [],
          Meals: [],
          Others: []
        });
        setActive("reservationTable");
      }
    } catch (error) {
      console.error("Error saving to database:", error);
      alert("Failed to save. Check if your backend server is running.");
    }
  }

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <NavBar/>
      
      <div className="flex-grow p-6">
        {/* VIEW 1: MAIN TABLE */}
        {active === "reservationTable" && (
          <ReservationTable openAddRes={() => setActive('addReservation')} />
        )}
        
        {/* VIEW 2: STAGE 1 (CLIENT & ROOMS) */}
        {active === "addReservation" && (
          <AddReservation 
            onNext={handelDataStage1} 
            savedData={allData} 
          />
        )}

        {/* VIEW 3: STAGE 2 (MEALS & OTHERS) */}
        {active === "addReservationStage2" && (
          <AddReservationStage2 
            onNext={handelDataStage2} 
            onBack={() => setActive('addReservation')} 
            // FIXED: We must pass savedData here so Stage 2 can see the Rooms
            savedData={allData} 
          />
        )}
      </div>
    </div>
  );
};

export default ReservationsDashboard;