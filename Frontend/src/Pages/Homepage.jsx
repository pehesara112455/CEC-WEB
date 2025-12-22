import React from "react";
import Header from "../Components/Navbar";
import Slideshow from "../Components/SlideShow";
import Footer from "../Components/Footer"

export default function Homepage () {
    return(
        <div classname = "relative w-full">
            <Header/>
            <Slideshow/>
            <h1 className="text-4xl sm:text-6xl font-bold text-white absolute top-25 left-10 drop-shadow-lg leading-10 sm:leading-17">Community <br/>Education Center</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 p-8 max-w-7xl mx-auto">
    
    {/* Item 1: Educational Programs */}
    <div className="flex flex-col items-center justify-center text-center p-4">
        <img src="src\assets\HomepageIcons\tdesign_education-filled-min.png" alt="Education" className="h-16 w-16 sm:h-32 sm:w-32 mb-2"/>
        <h1 className="font-bold text-xl sm:text-2xl mb-1">Educational Programs</h1>
        <p className="text-sm sm:text-base">Courses, Trainings and workshops for the community.</p>
    </div>
    
    {/* Item 2: Rooms & Halls Reservations */}
    <div className="flex flex-col items-center justify-center text-center p-4">
        <img src="src\assets\HomepageIcons\today (1)-min.png" alt="Reservation" className="h-16 w-16 sm:h-32 sm:w-32 mb-2"/>
        <h1 className="font-bold text-xl sm:text-2xl mb-1">Rooms & Halls Reservations</h1>
        <p className="text-sm sm:text-base">Book facilities for your stayings, meetings, events and more.</p>
    </div>
    
    {/* Item 3: Community Events */}
    <div className="flex flex-col items-center justify-center text-center p-4">
        <img src="src\assets\HomepageIcons\fluent_people-community-24-filled-min.png" alt="Community" className="h-16 w-16 sm:h-32 sm:w-32 mb-2"/>
        <h1 className="font-bold text-xl sm:text-2xl mb-1">Community Events</h1> 
        <p className="text-sm sm:text-base">Stay updated on local events, programs and more.</p>
    </div>
            
</div>
<Footer/>
</div>
    )
}