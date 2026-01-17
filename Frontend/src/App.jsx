import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Components/AdminNav.jsx"; // ඔයාගේ file name එකට අනුව
import Blog from "./Pages/Blog.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* මුළු screen එකම flex එකක් කරනවා */}
      <div className="flex h-screen overflow-hidden">
        
        {/* වම් පැත්තේ Sidebar එක */}
        <NavBar />

        {/* දකුණු පැත්තේ ප්‍රධාන Content එක */}
        <main className="flex-1 h-screen overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<h1 className="p-10">Admin Home</h1>} />
            <Route path="/" element={<h1 className="p-10">Welcome Dashboard</h1>} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;