import React from "react";
import Header from "../Components/Navbar";
import Slideshow from "../Components/SlideShow";

export default function Homepage () {
    return(
        <div classname = "relative w-full">
            <Header/>
            <Slideshow/>
            <h1 className="text-6xl font-bold text-white absolute top-25 left-10 gap-7 drop-shadow-lg leading-17">Community <br/>Education Center</h1>
        </div>
    )
}