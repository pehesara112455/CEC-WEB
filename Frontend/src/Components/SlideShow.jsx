import React, { useState, useEffect, useCallback } from 'react';

// Upgraded to w=1920 for high-definition full-screen desktop viewing
const imageSources = [
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&w=1920&q=80"
];

const totalSlides = imageSources.length;

const Slideshow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideInterval = 5000;

    const nextSlide = useCallback(() => {
        setCurrentSlide((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
    };

    useEffect(() => {
        const intervalId = setInterval(nextSlide, slideInterval);
        return () => clearInterval(intervalId);
    }, [nextSlide]); 

    const IconChevronLeft = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
    );
    const IconChevronRight = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
    );

    return (
        // 1. Added h-full here so it takes up the entire parent container
        <div className="relative w-full h-full mx-auto overflow-hidden bg-black">
            
            {/* 2. Added h-full to the sliding track and made the transition smoother */}
            <div 
                className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {imageSources.map((imageUrl, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                        {/* 3. Replaced fixed heights with h-full object-cover */}
                        <img 
                            src={imageUrl} 
                            alt={`Slide ${index + 1}`} 
                            className="w-full h-full object-cover"
                        />
                        {/* Optional: Dark gradient at the bottom so the white dots are always visible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                ))}
            </div>

            {/* 4. Modern Glassmorphism Buttons */}
            <button 
                onClick={prevSlide} 
                className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white z-20 hidden sm:block transition-all duration-300 hover:scale-110"
            >
                <IconChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button 
                onClick={nextSlide} 
                className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white z-20 hidden sm:block transition-all duration-300 hover:scale-110"
            >
                <IconChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* 5. Refined indicator dots (moved slightly up with bottom-8) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                {imageSources.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-500 shadow-md ${
                            index === currentSlide ? 'bg-white w-10' : 'bg-white/40 w-2 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            
        </div>
    );
};

export default Slideshow;