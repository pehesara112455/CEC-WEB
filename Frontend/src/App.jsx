import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router-dom'; // <--- Import Routes and Route

import { BrowserRouter } from 'react-router-dom'; // <--- Import the BrowserRouter
import AdminNav from './Components/AdminNav.jsx';

function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/admin" element={<AdminNav />} />
    </Routes>
   </BrowserRouter>
    
     
    
  );
}
export default App;
