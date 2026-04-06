import React, { useState, useEffect } from "react";
import Header from "../Components/Navbar";
import Slideshow from "../Components/SlideShow";
import Footer from "../Components/Footer";

export default function Homepage() {
  const [featuredPrograms, setFeaturedPrograms] = useState([]); 
  const [completedPrograms, setCompletedPrograms] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.blogs)) {
          const upcoming = data.blogs.filter(
            blog => blog.status && blog.status.toLowerCase() === 'upcoming'
          );
          setFeaturedPrograms(upcoming.slice(0, 3));

          const completed = data.blogs.filter(
            blog => blog.status && blog.status.toLowerCase() === 'completed'
          );
          setCompletedPrograms(completed.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="relative w-full bg-gray-50 flex flex-col min-h-screen overflow-hidden">
      
      {/* =========================================
          CUSTOM ANIMATIONS
      ========================================= */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>

      {/* Make sure your Header has a high z-index (like z-50) inside its own component so it stays above the slideshow! */}
      <Header />

      {/* =========================================
          SECTION 1: HERO (Full Screen)
      ========================================= */}
      {/* Added 'h-screen' so it takes exactly 100% of the viewport height */}
      <div className="relative w-full h-screen">
        
        {/* NOTE: Make sure your Slideshow component is set to w-full and h-full inside its own file! */}
        <div className="absolute inset-0 w-full h-full">
          <Slideshow />
        </div>
        
        {/* Dark overlay & Text Content */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 md:px-30 pointer-events-none">
          <div className="animate-fade-in-up max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-2xl leading-[1.1] mb-6 pointer-events-auto">
              Community <br className="hidden md:block" />
              Education Center
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl font-medium drop-shadow-md mb-10 max-w-2xl pointer-events-auto leading-relaxed">
              Empowering communities through education, shared spaces, and meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto w-full sm:w-auto justify-center md:justify-start">
              <a href="/programs" className="w-full sm:w-auto bg-[#8B0000] hover:bg-red-900 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center text-lg">
                Explore Programs
              </a>
              <a href="/training-center" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#8B0000] font-bold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center text-lg">
                Book a Space
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 2: WHAT WE OFFER
      ========================================= */}
      <div className="bg-gray-50 py-20 border-t border-gray-200">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#8B0000] mb-16 uppercase tracking-wide animate-fade-in-up">
          Our Core Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6 md:px-12 lg:px-20 max-w-screen-2xl mx-auto">
          
          {/* Card 1 */}
          <div className="animate-fade-in-up group flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100 cursor-pointer">
            <img src="src/assets/HomepageIcons/tdesign_education-filled-min.png" alt="Education" className="h-24 w-24 mb-6 transition-transform duration-300 group-hover:scale-110" />
            <h1 className="font-bold text-2xl mb-4 text-gray-800">Educational Programs</h1>
            <p className="text-gray-600 text-lg leading-relaxed">Courses, trainings, and workshops designed to upskill and empower the community.</p>
          </div>
          
          {/* Card 2 (Added animation delay) */}
          <div className="animate-fade-in-up group flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100 cursor-pointer" style={{ animationDelay: '0.2s' }}>
            <img src="src/assets/HomepageIcons/today (1)-min.png" alt="Reservation" className="h-24 w-24 mb-6 transition-transform duration-300 group-hover:scale-110" />
            <h1 className="font-bold text-2xl mb-4 text-gray-800">Rooms & Halls</h1>
            <p className="text-gray-600 text-lg leading-relaxed">Book our premium facilities for your meetings, events, and community gatherings.</p>
          </div>
          
          {/* Card 3 (Added animation delay) */}
          <div className="animate-fade-in-up group flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100 cursor-pointer" style={{ animationDelay: '0.4s' }}>
            <img src="src/assets/HomepageIcons/fluent_people-community-24-filled-min.png" alt="Community" className="h-24 w-24 mb-6 transition-transform duration-300 group-hover:scale-110" />
            <h1 className="font-bold text-2xl mb-4 text-gray-800">Community Events</h1>
            <p className="text-gray-600 text-lg leading-relaxed">Stay updated and participate in local events, programs, and outreach initiatives.</p>
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 3: UPCOMING PROGRAMS
      ========================================= */}
      <div className="bg-white py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 border-b-2 border-gray-100 pb-6 gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center sm:text-left">Upcoming Programs</h2>
            <a href="/programs" className="text-[#8B0000] font-bold hover:underline hidden sm:flex items-center gap-2 transition-transform hover:translate-x-2">
              View All Programs <span>→</span>
            </a>
          </div>

          {loading && <p className="text-center text-gray-500 font-bold text-lg animate-pulse">Loading latest programs...</p>}

          {!loading && featuredPrograms.length === 0 && (
             <p className="text-center text-gray-500 bg-gray-50 p-8 rounded-2xl text-lg border border-gray-100">No upcoming programs scheduled at the moment.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {!loading && featuredPrograms.map((program, index) => (
              <div 
                key={program.id} 
                className="animate-fade-in-up bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col group transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={program.thumbnail || "https://images.unsplash.com/photo-1593113565214-80afcb4a4571?q=80&w=1000&auto=format&fit=crop"} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-[#F4D03F] text-[#8B0000] text-xs font-extrabold px-4 py-2 rounded-full shadow-md uppercase tracking-wider">
                    Upcoming
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#8B0000] transition-colors">{program.title}</h3>
                  <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">{program.paragraph1}</p>
                  <div className="mt-auto pt-5 border-t border-gray-100">
                    <a href="/programs" className="text-[#8B0000] font-bold hover:underline text-sm uppercase tracking-wide flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit">
                      Read More <span className="text-xl leading-none">›</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 4: RECENTLY COMPLETED
      ========================================= */}
      <div className="bg-gray-50 py-20 px-6 md:px-12 lg:px-20 border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 border-b-2 border-gray-200 pb-6 gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center sm:text-left">Our Recent Impact</h2>
            <a href="/programs" className="text-[#8B0000] font-bold hover:underline hidden sm:flex items-center gap-2 transition-transform hover:translate-x-2">
              View All Completed <span>→</span>
            </a>
          </div>

          {loading && <p className="text-center text-gray-500 font-bold text-lg animate-pulse">Loading past events...</p>}

          {!loading && completedPrograms.length === 0 && (
             <p className="text-center text-gray-500 bg-white p-8 rounded-2xl border border-gray-100 text-lg">No completed programs available yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {!loading && completedPrograms.map((program, index) => (
              <div 
                key={program.id} 
                className="animate-fade-in-up bg-white rounded-3xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={program.thumbnail || "https://images.unsplash.com/photo-1593113565214-80afcb4a4571?q=80&w=1000&auto=format&fit=crop"} 
                    alt={program.title} 
                    className="w-full h-full object-cover grayscale-[40%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0" 
                  />
                  <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-md uppercase tracking-wider">
                    Completed
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{program.title}</h3>
                  <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">{program.paragraph1}</p>
                  <div className="mt-auto pt-5 border-t border-gray-100">
                    <a href="/programs" className="text-gray-500 group-hover:text-[#8B0000] font-bold hover:underline text-sm uppercase tracking-wide flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit">
                      View Details <span className="text-xl leading-none">›</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <a href="/programs" className="bg-[#8B0000] text-white font-bold py-4 px-10 rounded-full shadow-lg w-full block text-lg">
              View All Programs
            </a>
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 5: IMPACT COUNTERS
      ========================================= */}
      <div className="bg-[#8B0000] py-16">
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-red-800">
          <div className="py-6 md:py-0 animate-fade-in-up">
            <h3 className="text-6xl font-extrabold text-white mb-3">50+</h3>
            <p className="text-red-200 font-bold uppercase tracking-widest text-sm">Projects Completed</p>
          </div>
          <div className="py-6 md:py-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-6xl font-extrabold text-[#F4D03F] mb-3">120+</h3>
            <p className="text-red-200 font-bold uppercase tracking-widest text-sm">Active Volunteers</p>
          </div>
          <div className="py-6 md:py-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-6xl font-extrabold text-white mb-3">15+</h3>
            <p className="text-red-200 font-bold uppercase tracking-widest text-sm">Partner Organizations</p>
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 6: FINAL CALL TO ACTION
      ========================================= */}
      <div className="bg-white py-24 px-6 text-center">
        <div className="animate-fade-in-up max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">Ready to make a difference?</h2>
          <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
            Whether you want to learn, book a space for your next event, or support our upcoming community projects, we are here for you.
          </p>
          <button 
            onClick={() => window.location.href = "mailto:cecntc13@gmail.com"}
            className="bg-[#F4D03F] hover:bg-[#E8C635] text-[#8B0000] font-extrabold py-4 px-12 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-lg uppercase tracking-wide"
          >
            Contact Us Today
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}