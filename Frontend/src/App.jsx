import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Components/AdminNav.jsx";
import Blog from "./Pages/Blog.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <NavBar />

        {/* Main Content */}
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
