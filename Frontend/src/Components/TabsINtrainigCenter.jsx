import React from 'react';

// We receive props here instead of creating state inside
export default function TabsINtrainingCenter({ activeTab, onTabChange }) {
  
  const tabs = ["Halls", "Rooms", "Other Facilities", "Menus"];

  return (
    <div className="w-3xl px-4 py-4">
      <div className="bg-gray-300 rounded-2xl flex items-center">
        
        {tabs.map((tab, index) => (
          <button
            key={tab}
            // When clicked, we call the function passed from the Home Page
            onClick={() => onTabChange(tab)} 
            className={`
              flex-1 py-3 text-lg font-bold rounded-2xl transition-all duration-300 relative
              ${
                activeTab === tab
                  ? "bg-[#800000] text-white shadow-md"
                  : "text-black hover:bg-gray-400/20"
              }
            `}
          >
            {tab}
            
            {/* White Separator Line Logic */}
            {index !== tabs.length - 1 && activeTab !== tab && activeTab !== tabs[index+1] && (
               <span className="absolute right-0 top-1/4 h-1/2 w-[2px] bg-white hidden md:block"></span>
            )}
          </button>
        ))}
        
      </div>
    </div>
  );
}