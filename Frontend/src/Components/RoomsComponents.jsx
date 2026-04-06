import React, { useState, useEffect } from 'react';
import SearchBar from './Searchbar';

export default function RoomCardSmall() {
  // 1. Create State to hold the room data
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the Data when the page loads
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Notice the URL ends in /rooms this time!
        const response = await fetch('http://localhost:5000/api/halls-rooms/get-items/rooms');        
        const data = await response.json();
        
        // Make sure the data is an array before saving it
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false); // Stop loading animation when done
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8">
      
      {/* INJECT CUSTOM ANIMATION FOR INITIAL RENDER */}
      <style>{`
        @keyframes fadeInUpStagger {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <SearchBar />
      
      {/* Show a loading message while waiting for the backend */}
      {loading && <p className="mt-5 text-gray-500 font-bold animate-pulse">Loading rooms...</p>}

      {/* Show a message if the database is empty */}
      {!loading && rooms.length === 0 && (
        <p className="mt-5 text-gray-500 font-bold bg-white p-6 rounded-xl shadow-sm">No rooms available right now.</p>
      )}

      {/* INCREASED GAP: Changed to gap-8 on mobile and gap-14 on larger screens */}
      <div className="flex w-full flex-wrap justify-center gap-8 md:gap-14 mb-10 mt-6"> 
        
        {/* 3. Loop through the data using .map() and use 'index' for the animation delay */}
        {!loading && rooms.map((room, index) => (
          
          <div 
            key={room.id} 
            // RENDER ANIMATION STYLE: Staggered based on index
            style={{ 
              animation: `fadeInUpStagger 0.6s ease-out forwards`,
              animationDelay: `${index * 0.15}s`,
              opacity: 0 // Starts hidden until animation triggers
            }}
            // MODERN HOVER: 'group' enables nested hover effects, '-translate-y-3' makes it float up
            className="group bg-white rounded-[25px] shadow-lg hover:shadow-2xl hover:-translate-y-3 p-4 flex flex-col items-center gap-3 w-full max-w-[300px] md:max-w-[340px] transition-all duration-300 cursor-pointer border border-gray-50"
          >
          
            {/* Added 'overflow-hidden' to keep the zooming image inside the rounded corners */}
            <div className="relative w-full h-40 md:h-48 shrink-0 overflow-hidden rounded-[20px]">
              {/* 4. Inject dynamic image from Cloudinary */}
              <img 
                src={room.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"} 
                alt={room.name} 
                // IMAGE ZOOM HOVER: Smoothly scales up when the card is hovered
                className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute top-3 left-3 bg-[#009900] text-white px-3 py-1 text-[10px] md:text-xs rounded-full font-bold shadow-md z-10">
                Available
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-center px-2 pb-3 gap-1 md:gap-2 mt-2">
              
              {/* 4. Inject dynamic Room Name */}
              <h2 className="text-[#800000] text-2xl md:text-3xl font-extrabold text-center uppercase tracking-wide group-hover:text-red-700 transition-colors">
                {room.name}
              </h2>
              
              {/* 4. Inject dynamic Price/Amount */}
              <p className="text-gray-500 text-lg md:text-xl font-semibold bg-gray-100 px-4 py-1 rounded-full mt-1">
                Rs. {room.amount} <span className="text-sm font-medium">/ Day</span>
              </p>

              <div className="flex gap-4 md:gap-6 mt-4 border-t border-gray-100 w-full justify-center pt-4">
                
                {/* 4. Inject dynamic Capacity */}
                <FeatureIconSmall label={room.capacity}>
                  <path d="M7 13v-8a3 3 0 0 0-3-3a3 3 0 0 0-3 3v8h6Z" />
                  <path d="M4 16v5" />
                  <path d="M16 16v5" />
                  <path d="M4 13h12" />
                  <path d="M13 13v-8a3 3 0 0 1 3-3a3 3 0 0 1 3 3v8h-6Z" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </FeatureIconSmall>

                {/* 4. Inject dynamic Type (A/C or Non-A/C) */}
                <FeatureIconSmall label={room.type === "AC" ? "A/C" : "Non-A/C"}>
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 10h.01" />
                  <path d="M10 10h.01" />
                  <path d="M14 10h.01" />
                  <path d="M6 18v2" />
                  <path d="M10 18v2" />
                  <path d="M14 18v2" />
                </FeatureIconSmall>

                {/* Static WIFI Icon */}
                <FeatureIconSmall label="WIFI">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </FeatureIconSmall>

              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

// --- Helper Component for Small Icons ---
function FeatureIconSmall({ children, label }) {
  return (
    <div className="flex flex-col items-center">
      {/* Standardized Tailwind widths for better responsiveness */}
      <div className="w-12 h-12 md:w-14 md:h-14 bg-[#800000] group-hover:bg-red-800 rounded-full flex items-center justify-center text-white shadow-md transition-colors duration-300">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {children}
        </svg>
      </div>
      <span className="text-[#800000] font-bold mt-2 text-[10px] md:text-xs whitespace-nowrap uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}