import React, { useState, useEffect, useCallback } from 'react';

// Using external URLs to prevent "File Not Found" crashes
const imageSources = [
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&w=1200&q=80"
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
        <div className="relative w-full mx-auto overflow-hidden shadow-2xl">
            <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {imageSources.map((imageUrl, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        <img 
                            src={imageUrl} 
                            alt={`Slide ${index + 1}`} 
                            className="w-full h-[400px] sm:h-[600px] object-cover"
                        />
                    </div>
                ))}
            </div>

            <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-white/30 rounded-full text-white hover:bg-white/50 z-10 hidden sm:block">
                <IconChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white/30 rounded-full text-white hover:bg-white/50 z-10 hidden sm:block">
                <IconChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {imageSources.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slideshow;