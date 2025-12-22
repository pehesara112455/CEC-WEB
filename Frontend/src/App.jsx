import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router-dom'; // <--- Import Routes and Route

import { BrowserRouter } from 'react-router-dom'; // <--- Import the BrowserRouter
import AdminNav from './Components/AdminNav.jsx';
import Reservation from "./Pages/Admin-Reservation.jsx";
import AddReservation from './Components/addNewReservation.jsx';
import AddReservationStage2 from './Components/addNewreservation2.jsx';
import EditReservation from './Components/Editreservation.jsx';
import EditReservationStage2 from './Components/Editreservation2.jsx';

function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/admin" element={<AdminNav />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/addReservation" element={<AddReservation />} />
      <Route path="/addReservationStage2" element={<AddReservationStage2 />} />
      <Route path="/editReservation" element={<EditReservation />} />
      <Route path="/editReservationStage2" element={<EditReservationStage2 />} />


    </Routes>
   </BrowserRouter>
    
     
    
  );
}
export default App;
