import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router-dom'; 
import { BrowserRouter } from 'react-router-dom'; 
import AdminNav from './Components/AdminNav.jsx';
import AddHallsRooms from './Pages/AddHalls&Rooms.jsx';

function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/admin" element={<AdminNav />} />
      <Route path="/admin/add-halls-rooms" element={<AddHallsRooms />} />
    </Routes>
   </BrowserRouter>
    
     
    
  );
}
export default App;
