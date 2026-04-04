import React from 'react';

export default function MealsAndFacilities() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-10 items-start">
      
      {/* --- LEFT SIDE: MEALS CARD --- */}
      <div className="w-full lg:w-1/3">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <FoodIcon />
          <h2 className="text-[#990000] text-3xl font-extrabold tracking-wide">MEALS</h2>
        </div>

        {/* Red Card */}
        <div className="bg-[#990000] text-white rounded-[30px] p-8 shadow-xl h-full min-h-[400px]">
          <ul className="space-y-6 text-lg font-medium">
            {["Bed Tea", "Breakfast", "Morning Refreshments", "Lunch", "Evening Refreshments", "Dinner"].map((item, index) => (
              <li key={index} className="flex items-center gap-4">
                {/* White Bullet Point */}
                <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- RIGHT SIDE: FACILITIES --- */}
      <div className="w-full lg:w-2/3">
        
        {/* Title */}
        <h2 className="text-[#990000] text-2xl font-extrabold mb-4 flex items-center gap-2">
          <span className="text-3xl">+</span> OUR FACILITIES
        </h2>

        {/* Paragraph Text */}
        <p className="text-gray-800 leading-relaxed mb-10 text-justify">
          At the Community Education Centre, we provide a wide range of modern facilities
          to ensure your events run smoothly and professionally. Our fully-equipped rooms
          feature state-of-the-art sound systems, multimedia projectors, and presentation
          screens to support seminars, workshops, and conferences. Whether you're
          planning a small meeting, a large-scale event, or a special celebration, our halls
          are also available for weddings, parties, and other occasions, offering a welcoming
          and flexible setting to meet all your technical and hospitality needs.
        </p>

        {/* Icons Grid (5 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          
          <FacilityCard label="WI FI">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </FacilityCard>

          <FacilityCard label="Sounds">
            <circle cx="12" cy="12" r="4" />
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
          </FacilityCard>

          <FacilityCard label="Projectors">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M6 18v2" />
            <path d="M18 18v2" />
          </FacilityCard>

          <FacilityCard label="Parking">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
            {/* Simple 'P' Sign above car */}
            <rect x="12" y="2" width="8" height="6" fill="white" fillOpacity="0.3" rx="1"/>
            <text x="14" y="6.5" fontSize="5" fill="currentColor" fontWeight="bold">P</text>
          </FacilityCard>

          <FacilityCard label="AC">
            <path d="M12 3v18" />
            <path d="m5 12 14 0" />
            <path d="m17 7-3 3" />
            <path d="m7 17 3-3" />
            <path d="m17 17-3-3" />
            <path d="m7 7 3 3" />
          </FacilityCard>

        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

// 1. The Small Icon Card (Orange Gradient)
function FacilityCard({ label, children }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl text-white 
                    bg-gradient-to-b from-[#cc3300] to-[#992600] shadow-lg hover:scale-105 transition-transform">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="40" height="100" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="mb-3"
      >
        {children}
      </svg>
      <span className="font-bold text-sm sm:text-base">{label}</span>
    </div>
  );
}

// 2. The Food Cover Icon (Above 'MEALS')
function FoodIcon() {
  return (
    <div className="text-[#990000]">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v2" />
        <path d="m6 4 2 2" />
        <path d="m18 4-2 2" />
        <path d="M2 12h20" />
        <path d="M3 12a9 9 0 0 1 18 0" />
        <path d="M12 16a4 4 0 0 1-4-4" />
        <path d="M12 16a4 4 0 0 0 4-4" />
      </svg>
    </div>
  );
}