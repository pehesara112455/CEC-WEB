import React, { useState, useEffect } from 'react';
import Header from '../Components/Navbar'; 
import Footer from '../Components/Footer';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Used for slider arrows

// --- 1. The Custom Image Slider Component ---
const ImageSlider = ({ images }) => {
  // Filter out any empty strings or null values so we only slide through real images
  const validImages = images.filter((img) => img && img.trim() !== '');
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images exist, show a placeholder
  if (validImages.length === 0) {
    return (
      <div className="w-full h-64 md:h-80 bg-gray-200 rounded-xl flex items-center justify-center shadow-md">
        <span className="text-gray-400 font-medium">No images available</span>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? validImages.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md group">
      {/* The current image */}
      <img 
        src={validImages[currentIndex]} 
        alt={`Slide ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-all duration-500"
      />

      {/* Only show arrows if there is more than 1 image */}
      {validImages.length > 1 && (
        <>
          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronLeft size={20} />
          </button>
          
          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronRight size={20} />
          </button>

          {/* Dots Indicator at the bottom */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {validImages.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- 2. The Main Services Page ---
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the services from the backend when the page loads
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <h1 className="text-4xl font-extrabold text-center text-[#800000] mb-12 uppercase tracking-wide">
            Our Services
          </h1>

          {/* Loading State */}
          {loading && (
            <p className="text-center text-gray-500 font-bold text-xl">Loading services...</p>
          )}

          {/* Empty State */}
          {!loading && services.length === 0 && (
            <p className="text-center text-gray-500 font-bold text-xl">No services available right now.</p>
          )}

          {/* 3. Loop through the fetched services */}
          <div className="space-y-10">
            {!loading && services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                
                {/* Left Side: The Image Slider */}
                <div className="w-full md:w-1/2 shrink-0">
                  <ImageSlider images={[service.image1, service.image2, service.image3]} />
                </div>

                {/* Right Side: The Text Content */}
                <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-12 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 capitalize border-b-2 border-[#800000] inline-block pb-2">
                    {service.serviceName}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;