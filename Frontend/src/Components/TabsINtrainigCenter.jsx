import React from 'react';

export default function TabsINtrainingCenter({ activeTab, onTabChange }) {
  const tabs = ["Halls", "Rooms", "Other Facilities", "Menus"];

  return (
    // 1. Changed w-3xl to w-full max-w-4xl for responsive sizing
    <div className="w-full max-w-4xl px-2 md:px-4 py-4 mx-auto">
      
      {/* 2. Added overflow-x-auto so it can scroll on incredibly small screens if needed */}
      <div className="bg-gray-300 rounded-2xl flex items-center overflow-x-auto scrollbar-hide">
        
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)} 
            // 3. Made text responsive (xs on mobile, lg on desktop) and added whitespace-nowrap
            className={`
              flex-1 py-2.5 md:py-3 px-3 md:px-6 text-xs sm:text-sm md:text-lg font-bold rounded-2xl transition-all duration-300 relative whitespace-nowrap
              ${
                activeTab === tab
                  ? "bg-[#800000] text-white shadow-md"
                  : "text-black hover:bg-gray-400/20"
              }
            `}
          >
            {tab}
            
            {/* White Separator Line Logic (Kept hidden on mobile for cleaner look) */}
            {index !== tabs.length - 1 && activeTab !== tab && activeTab !== tabs[index+1] && (
               <span className="absolute right-0 top-1/4 h-1/2 w-[2px] bg-white hidden md:block"></span>
            )}
          </button>
        ))}
        
      </div>
    </div>
  );
}