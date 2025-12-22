import React from 'react';

export default function DateSearchBar() {
  return (
    // 1. Container: 'justify-center' on Mobile, 'justify-end' on Desktop
    <div className="w-full flex justify-center md:justify-end px-4 py-4 md:py-10">
      
      {/* --- Main Container (Pill Shape) --- */}
      {/* 2. Padding: Smaller (p-1) on mobile, Regular (p-2) on desktop */}
      <div className="bg-white rounded-full shadow-xl border border-gray-200 p-1 md:p-2 flex items-center justify-between w-full max-w-[340px] md:max-w-xl hover:shadow-2xl transition-all duration-300">
        
        {/* 1. Date Input Section */}
        {/* 3. Padding: Reduced 'px-3' on mobile */}
        <div className="flex-1 px-3 md:px-6 relative flex flex-col justify-center h-full group cursor-pointer">
          
          {/* Label: Smaller text on mobile */}
          <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-0 md:mb-1 group-hover:text-[#800000] transition-colors">
            Check Availability
          </label>
          
          {/* The Date Input */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Calendar Icon: Hidden on very small phones if needed, or just smaller */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 md:w-5 md:h-5 text-[#800000]" // Responsive icon size
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>

            {/* Native HTML Date Picker */}
            {/* Text size: text-sm on mobile, text-lg on desktop */}
            <input 
              type="date" 
              className="w-full bg-transparent outline-none text-gray-700 font-bold text-sm md:text-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 2. The Search Button */}
        {/* Padding and Text Size drastically reduced for mobile */}
        <button className="bg-[#800000] text-white px-5 py-2 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg shadow-md hover:bg-red-900 transition-transform active:scale-95 shrink-0">
          Search
        </button>

      </div>

    </div>
  );
}