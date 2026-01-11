import React, { useState } from 'react';
import axios from 'axios'; 
import NavBar from '../Components/AdminNav';
import ReservationTable from '../Components/Reservation';
import AddReservation from '../Components/addNewReservation';
import AddReservationStage2 from '../Components/addNewreservation2';
import EditReservation from '../Components/Editreservation'; 
import EditReservation2 from '../Components/Editreservation2'; 

const ReservationsDashboard = () => {
  const [active, setActive] = useState("reservationTable");
  
  // State for Add Process
  const [allData, setAllData] = useState({
    CompanyName: '', Contact: '', DateFrom: '', DateTo: '',
    Rooms: [], Meals: [], Others: []
  });

  // State for Edit Process
  const [editingData, setEditingData] = useState(null);

  // --- HELPERS ---
  const resetAndReturn = () => {
    setAllData({ CompanyName: '', Contact: '', DateFrom: '', DateTo: '', Rooms: [], Meals: [], Others: [] });
    setEditingData(null);
    setActive("reservationTable");
  };

  // --- ADD HANDLERS ---
  const handelDataStage1 = (stage1Data) => {
    setAllData((prev) => ({ ...prev, ...stage1Data }));
    setActive('addReservationStage2');
  };

  const handelDataStage2 = async (stage2Data) => {
    const finalBookingData = { ...allData, ...stage2Data };
    try {
      await axios.post('http://localhost:5000/add-reservation', finalBookingData);
      alert("Reservation Saved Successfully!");
      resetAndReturn();
    } catch (error) {
      alert("Failed to save. Check your server.");
    }
  };

  // --- EDIT HANDLERS ---
  const initiateEdit = (reservationToEdit) => {
    setEditingData(reservationToEdit);
    setActive('editReservation');
  };

  const handleEditStage1 = (updatedStage1Data) => {
    setEditingData((prev) => ({ ...prev, ...updatedStage1Data }));
    setActive('editReservationStage2');
  };

  const handleFinalUpdate = async (updatedStage2Data) => {
    const finalUpdatedData = { ...editingData, ...updatedStage2Data };
    try {
      // We use the displayId (e.g., RES-2026-001) to find the correct document
      await axios.patch(`http://localhost:5000/update-reservation/${finalUpdatedData.displayId}`, finalUpdatedData);
      alert("Reservation Updated Successfully!");
      resetAndReturn();
    } catch (error) {
      alert("Error updating reservation.");
    }
  };

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      <NavBar/>
      <div className="flex-grow p-6">
        {/* VIEW 1: TABLE */}
        {active === "reservationTable" && (
          <ReservationTable openAddRes={() => setActive('addReservation')} onEdit={initiateEdit} />
        )}
        
        {/* VIEW 2: ADD FLOW */}
        {active === "addReservation" && <AddReservation onNext={handelDataStage1} savedData={allData} />}
        {active === "addReservationStage2" && <AddReservationStage2 onNext={handelDataStage2} onBack={() => setActive('addReservation')} savedData={allData} />}

        {/* VIEW 3: EDIT FLOW */}
        {active === "editReservation" && <EditReservation savedData={editingData} onNext={handleEditStage1} onCancel={() => setActive("reservationTable")} />}
        {active === "editReservationStage2" && <EditReservation2 savedData={editingData} onNext={handleFinalUpdate} onBack={() => setActive('editReservation')} />}
      </div>
    </div>
  );
};

export default ReservationsDashboard;