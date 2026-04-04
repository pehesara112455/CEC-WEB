import { useState } from "react";
import Header from "../Components/Navbar";
import Footer from "../Components/Footer";
import TabsINtrainingCenter from "../Components/TabsINtrainigCenter";
import HallCard from "../Components/Hallcomponents";
import RoomsCardSmall from "../Components/RoomsComponents";
import MealsAndFacilities from "../Components/OtherFacilitiesComponents";
import MenuComponent from "../Components/MenuComponent";

const HallsComponent = () => <HallCard/>;
const RoomsComponent = () => <RoomsCardSmall/>
const FacilitiesComponent = () => <MealsAndFacilities/>
const MenusComponent = () => <MenuComponent/>;

export default function trainingCenter () {

    const [currentView, setCurrentView] = useState("Halls");
    const contentMap = {
    "Halls": <HallsComponent />,
    "Rooms": <RoomsComponent />,
    "Other Facilities": <FacilitiesComponent />,
    "Menus": <MenusComponent />
  };

    return(

        <div>
            <Header/>
            <div className="relative w-full flex justify-center items-center">
                <img src="src\assets\TrainingCenterPageIcons\Mask group (1).png" alt="TrainingCenter-Image" className="absolute w-full h-full object-cover" />
                <h1 className="font-bold text-6xl text-white z-10 mt-15">Training Center</h1>
            </div>
            <div className="flex justify-center">
                <TabsINtrainingCenter
                activeTab={currentView} 
                onTabChange={setCurrentView}/>
            </div>

            <div>
                {contentMap[currentView]}
            </div>
           

            <Footer/>
        </div>
    )
}