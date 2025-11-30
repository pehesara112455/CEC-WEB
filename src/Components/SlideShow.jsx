import React, { useState, useEffect, useCallback } from 'react';


// Your image imports are necessary to load the image paths correctly:
import image1 from "../assets/cecimage1.jpg"
import image2 from "../assets/cecimage2.jpg"
import image3 from "../assets/cecimage3.jpg"

// --- Image Sources Array ---
const imageSources = [image1, image2, image3];
const totalSlides = imageSources.length;

const Slideshow = () => {
    // State to track which slide is currently visible (0, 1, or 2)
    const [currentSlide, setCurrentSlide] = useState(0);

    // Constants for behavior
    const slideInterval = 5000; // 5 seconds auto-play speed

    // Function to move to the next slide, wrapping back to the first slide (index 0)
    const nextSlide = useCallback(() => {
        setCurrentSlide((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
    }, [totalSlides]);

    // Function to move to the previous slide, wrapping back to the last slide
    const prevSlide = () => {
        setCurrentSlide((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
    };

    // useEffect hook to handle the automatic sliding
    useEffect(() => {
        const intervalId = setInterval(nextSlide, slideInterval);
        return () => clearInterval(intervalId);
    }, [nextSlide]); 

    // --- Inline SVG Icons for Navigation (Chevron Left/Right) ---
    const IconChevronLeft = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m15 18-6-6 6-6"/>
        </svg>
    );
    const IconChevronRight = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );

    return (
        <div className="relative w-full mx-auto overflow-hidden shadow-2xl">
            {/* --- Slide Content Area (The moving track that holds all slides) --- */}
            <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                
                {imageSources.map((imageUrl, index) => (
                    <div 
                        key={index} 
                        // Note: Increased height slightly for a better visual display of images only
                        className="w-full flex-shrink-0 relative"
                    >
                        {/* Background Image: Directly uses the imported image variable */}
                        <img 
                            src={imageUrl} 
                            alt={`CEC Slide ${index + 1}`} 
                            className="w-full h-100 object-cover"
                            // Error handler for image loading
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x650/000000/ffffff?text=Image+Not+Found"; }}
                        />
                        
                        {/* TEXT OVERLAY REMOVED: Only the image is visible */}
                    </div>
                ))}
            </div>

            {/* --- Navigation Arrows (Only visible on tablet/desktop) --- */}
            <button 
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white/30 rounded-full text-white hover:bg-white/50 transition duration-300 backdrop-blur-sm z-10 hidden sm:block"
                aria-label="Previous Slide"
            >
                <IconChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white/30 rounded-full text-white hover:bg-white/50 transition duration-300 backdrop-blur-sm z-10 hidden sm:block"
                aria-label="Next Slide"
            >
                <IconChevronRight className="w-6 h-6" />
            </button>

            {/* --- Dot Indicators (Visible on all screens) --- */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {imageSources.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        // Styles the active dot differently (wider and solid white)
                        className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slideshow;