import React, { useState } from 'react';

export default function DateSearchBar({ onSearch }) {
  const [selectedDate, setSelectedDate] = useState("");

  const handleSearchClick = () => {
    if (selectedDate && onSearch) {
      onSearch(selectedDate); 
    } else {
      alert("Please select a check-in date!");
    }
  };

  return (
    <div className="w-full flex justify-center md:justify-end px-4 py-4 md:py-10">
      
      {/* --- Main Container --- */}
      {/* Mobile: Stacked Card (rounded-2xl, flex-col). Desktop: Pill (rounded-full, flex-row) */}
      <div className="bg-white rounded-2xl md:rounded-full shadow-xl border border-gray-200 p-4 md:p-2 flex flex-col md:flex-row items-center justify-between w-full max-w-[95%] md:max-w-md hover:shadow-2xl transition-all duration-300 gap-4 md:gap-0">
        
        {/* --- DATE INPUT ZONE --- */}
        <div className="flex-1 w-full px-2 md:px-6 py-2 md:py-0 relative flex flex-col justify-center h-full group cursor-pointer hover:bg-gray-50 md:hover:bg-gray-100 rounded-xl md:rounded-full transition-colors">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 md:mb-1 group-hover:text-[#800000] transition-colors cursor-pointer">
            Check-In Date
          </label>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Calendar Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#800000] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              // Mobile: slightly smaller text so standard dates fit. Desktop: text-lg
              className="w-full bg-transparent outline-none text-gray-700 font-bold text-base md:text-lg cursor-pointer"
            />
          </div>
        </div>

        {/* --- MODERN SEARCH BUTTON --- */}
        {/* Mobile: Full width (w-full). Desktop: Auto width (md:w-auto) */}
        <button 
          onClick={handleSearchClick}
          className="w-full md:w-auto bg-gradient-to-r from-[#800000] to-red-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-full font-bold text-base md:text-lg shadow-lg shadow-red-900/20 hover:from-red-900 hover:to-[#800000] transition-all active:scale-95 shrink-0 md:ml-2"
        >
          Search
        </button>

      </div>
    </div>
  );
}