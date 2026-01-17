// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components
import AdminNav from './Components/AdminNav.jsx';
import Services from './Pages/Services.jsx';

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
            {/* When the URL is '/admin', show the Services page */}
            <Route path="/admin" element={<Services />} />
            
            {/* Future routes can go here, e.g.: */}
            {/* <Route path="/admin/rooms" element={<Rooms />} /> */}
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;