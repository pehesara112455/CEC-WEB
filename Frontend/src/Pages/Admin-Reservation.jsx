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
  
  // SHARED STATE: Controls the sidebar width and the dashboard layout
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
      await axios.patch(`http://localhost:5000/update-reservation/${finalUpdatedData.displayId}`, finalUpdatedData);
      alert("Reservation Updated Successfully!");
      resetAndReturn();
    } catch (error) {
      alert("Error updating reservation.");
    }
  };

  return (
    /* CORE FIX: 
       1. 'h-screen' locks the app to the height of the screen.
       2. 'overflow-hidden' prevents the body from scrolling.
    */
    <div className="flex bg-gray-50 font-sans h-screen overflow-hidden">
      
      {/* 3. SIDEBAR: It now sits inside a non-scrolling parent */}
      <NavBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* 4. MAIN CONTENT AREA: 
          FIX: 'h-full' and 'overflow-y-auto' makes ONLY this section scrollable.
          The sidebar is a sibling to this div, so it stays fixed in place.
      */}
      <div className="flex-1 h-full overflow-y-auto p-6 transition-all duration-300 ease-in-out min-w-0">
        
        {/* VIEW 1: TABLE */}
        {active === "reservationTable" && (
          <ReservationTable 
            openAddRes={() => setActive('addReservation')} 
            onEdit={initiateEdit} 
          />
        )}
        
        {/* VIEW 2: ADD FLOW */}
        {active === "addReservation" && (
          <AddReservation onNext={handelDataStage1} savedData={allData} />
        )}
        {active === "addReservationStage2" && (
          <AddReservationStage2 
            onNext={handelDataStage2} 
            onBack={() => setActive('addReservation')} 
            savedData={allData} 
          />
        )}

        {/* VIEW 3: EDIT FLOW */}
        {active === "editReservation" && (
          <EditReservation 
            savedData={editingData} 
            onNext={handleEditStage1} 
            onCancel={() => setActive("reservationTable")} 
          />
        )}
        {active === "editReservationStage2" && (
          <EditReservation2 
            savedData={editingData} 
            onNext={handleFinalUpdate} 
            onBack={() => setActive('editReservation')} 
          />
        )}
      </div>
    </div>
  );
};

export default ReservationsDashboard;