import { useState, useEffect } from "react";
import Header from "../Components/Navbar";
import Footer from "../Components/Footer";
import TabsINtrainingCenter from "../Components/TabsINtrainigCenter";
import HallCard from "../Components/Hallcomponents";
import RoomsCardSmall from "../Components/RoomsComponents";
import MealsAndFacilities from "../Components/OtherFacilitiesComponents";
import MenuComponent from "../Components/MenuComponent";

const HallsComponent = () => <HallCard/>;
const RoomsComponent = () => <RoomsCardSmall/>;
const FacilitiesComponent = () => <MealsAndFacilities/>;
const MenusComponent = () => <MenuComponent/>;

export default function TrainingCenter() {
  const [currentView, setCurrentView] = useState("Halls");
  
  // State to control the fade-in animation
  const [isAnimating, setIsAnimating] = useState(false);

  const contentMap = {
    "Halls": <HallsComponent />,
    "Rooms": <RoomsComponent />,
    "Other Facilities": <FacilitiesComponent />,
    "Menus": <MenusComponent />
  };

  // Trigger the animation every time the tab changes
  useEffect(() => {
    setIsAnimating(false); // Hide the content instantly
    
    // Show the content with a tiny delay so the CSS transition catches it
    const timer = setTimeout(() => {
      setIsAnimating(true); 
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header/>

      <main className="flex-grow flex flex-col">
        
        {/* 1. REDUCED BANNER HEIGHT: Sleeker and highly mobile-responsive */}
        <div className="relative w-full flex justify-center items-center h-[200px] md:h-[280px]">
          <img 
            src="src/assets/TrainingCenterPageIcons/Mask group (1).png" 
            alt="TrainingCenter-Image" 
            className="absolute w-full h-full object-cover" 
          />
          <div className="absolute w-full h-full bg-black/40"></div>
          
          <h1 className="font-bold text-4xl md:text-5xl text-white z-10 mt-10 drop-shadow-lg px-4 text-center">
            Training Center
          </h1>
        </div>
        
        {/* Mobile Responsive Tabs Wrapper (Allows scrolling on very small phones if needed) */}
        <div className="flex justify-center pt-8 pb-4 px-2 w-full overflow-x-auto">
          <TabsINtrainingCenter
            activeTab={currentView} 
            onTabChange={setCurrentView}
          />
        </div>

        {/* 2. ANIMATED CONTENT WRAPPER */}
        <div 
          className={`w-full pb-16 px-4 transition-all duration-700 ease-out transform ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {contentMap[currentView]}
        </div>

      </main>

      <Footer/>
    </div>
  );
}