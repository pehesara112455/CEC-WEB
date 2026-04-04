import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components and pages
import AdminNav from './Components/AdminNav.jsx';
import Homepage from './Pages/Homepage.jsx';
import Services from './Pages/Services.jsx';
import Programs from './Pages/Programs.jsx';
import Contact from './Pages/Contact.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminNav />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;