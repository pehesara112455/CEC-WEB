import React from 'react';
import SearchBar from './Searchbar';

export default function HallCardSmall() {
  return (
    <div className='flex flex-col items-center w-full px-2'>
      
      <SearchBar/>
      
      {/* RESPONSIVE GRID:
         - justify-center: Centers items
         - gap-4: Adds space between cards (better for mobile scrolling)
      */}
      <div className='flex w-full flex-wrap justify-center gap-4 mb-5'> 
        
        {/* --- Main Card Container --- */}
        {/* MOBILE: w-full (takes full width of phone), max-w-[280px] (prevents being too wide)
           DESKTOP: md:max-w-[320px] (Restores your original size)
        */}
        <div className="bg-white rounded-[25px] shadow-2xl p-4 flex flex-col items-center gap-3 w-full max-w-[280px] md:max-w-[320px] transition-all duration-300">
        
          {/* 1. Top: Image & Badge */}
          {/* MOBILE: h-32 | DESKTOP: md:h-40 (Restores original height) */}
          <div className="relative w-full h-32 md:h-40 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
              alt="Hall Room" 
              className="w-full h-full object-cover rounded-[20px]"
            />
            
            {/* Badge */}
            <div className="absolute top-3 left-3 bg-[#009900] text-white px-3 py-1 text-[10px] md:text-xs rounded-full font-bold shadow-sm">
              Available
            </div>
          </div>

          {/* 2. Bottom: Text & Icons */}
          <div className="w-full flex flex-col justify-center items-center px-1 pb-2 gap-1 md:gap-2">
            
            {/* Title: Smaller on Mobile (text-2xl), Original on Desktop (md:text-3xl) */}
            <h2 className="text-[#800000] text-2xl md:text-3xl font-bold text-center">
                HALL No.01
            </h2>
            
            {/* Time: Smaller on Mobile (text-lg), Original on Desktop (md:text-2xl) */}
            <p className="text-gray-400 text-lg md:text-2xl font-medium">
                8.00 am - 5.00 pm
            </p>

            {/* Icons Row */}
            <div className="flex gap-3 md:gap-4 mt-2 md:mt-4">
              
              {/* Icon 1: Chair */}
              <FeatureIconSmall label="110">
                <path d="M7 13v-8a3 3 0 0 0-3-3a3 3 0 0 0-3 3v8h6Z" />
                <path d="M4 16v5" />
                <path d="M16 16v5" />
                <path d="M4 13h12" />
                <path d="M13 13v-8a3 3 0 0 1 3-3a3 3 0 0 1 3 3v8h-6Z" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </FeatureIconSmall>

              {/* Icon 2: A/C */}
              <FeatureIconSmall label="A/C">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 10h.01" />
                <path d="M10 10h.01" />
                <path d="M14 10h.01" />
                <path d="M6 18v2" />
                <path d="M10 18v2" />
                <path d="M14 18v2" />
              </FeatureIconSmall>

              {/* Icon 3: Wifi */}
              <FeatureIconSmall label="WIFI">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </FeatureIconSmall>

            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
}

// --- Helper Component for Small Icons ---
function FeatureIconSmall({ children, label }) {
  return (
    <div className="flex flex-col items-center">
      
      {/* RESPONSIVE CIRCLE:
         - Mobile: w-12 h-12 (Smaller)
         - Desktop: md:w-14 md:h-14 (Restores your original look. Note: w-15 is not standard, I used 14 which is cleaner, or use w-[60px] if you want exact custom size)
      */}
      <div className="w-15 h-15 md:w-14 md:h-14 bg-[#800000] rounded-full flex items-center justify-center text-white shadow-sm transition-all">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          // Responsive SVG size using standard CSS classes inside SVG not supported well, 
          // so we keep it fixed or adjust via container padding. 
          // Here 18px is usually fine for both, but the container shrinks.
          width="18" 
          height="18" 
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
      
      {/* Label Text: Smaller on mobile */}
      <span className="text-[#800000] font-bold mt-1 text-[10px] md:text-xs whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}