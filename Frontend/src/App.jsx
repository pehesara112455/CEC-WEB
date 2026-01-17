// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components
import AdminNav from './Components/AdminNav.jsx';
import DonationDetails from './Pages/DonationDetails.jsx'; // Ensure you created this file

function App() {
  return (
    <BrowserRouter>
      {/* Main Layout Container */}
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        
        {/* 1. Sidebar (Always visible) */}
        {/* We place this outside the Routes so it stays on screen while pages change */}
        <AdminNav />

        {/* 2. Content Area (Changes based on URL) */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* When the URL is '/admin', show the Donation Details table */}
            <Route path="/admin" element={<DonationDetails />} />
            
            {/* Future routes can go here, e.g.: */}
            {/* <Route path="/admin/rooms" element={<Rooms />} /> */}
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;