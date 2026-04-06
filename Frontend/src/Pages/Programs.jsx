import React, { useState, useEffect } from 'react';
import Header from '../Components/Navbar';
import Footer from '../Components/Footer';

const Programs = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch blogs from the backend when the page loads
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) => blog.status && blog.status.toLowerCase() === activeTab
  );

  const handleDonationClick = () => {
    window.location.href = "mailto:cecntc13@gmail.com?subject=Donation Inquiry";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* INJECT CUSTOM ANIMATION FOR INITIAL RENDER */}
      <style>{`
        @keyframes fadeInUpStagger {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Header />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#800000] mb-10 uppercase tracking-wide">
            Our Programs
          </h1>

          {/* =========================================
              RESPONSIVE TAB SELECTION
          ========================================= */}
          <div className="flex justify-center mb-12">
            {/* Added flex-col sm:flex-row to handle very small phone screens safely */}
            <div className="flex flex-col sm:flex-row bg-gray-200 rounded-2xl sm:rounded-full overflow-hidden shadow-inner p-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`w-full sm:w-48 py-3 font-bold text-sm md:text-base rounded-xl sm:rounded-full transition-all duration-300 ${
                  activeTab === 'upcoming' 
                  ? 'bg-[#8B0000] text-white shadow-md transform scale-100' 
                  : 'text-gray-600 hover:bg-gray-300 hover:text-gray-800'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`w-full sm:w-48 py-3 font-bold text-sm md:text-base rounded-xl sm:rounded-full transition-all duration-300 mt-1 sm:mt-0 sm:ml-1 ${
                  activeTab === 'completed' 
                  ? 'bg-[#8B0000] text-white shadow-md transform scale-100' 
                  : 'text-gray-600 hover:bg-gray-300 hover:text-gray-800'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
               <p className="text-center text-gray-500 font-bold text-xl animate-pulse">Loading programs...</p>
            </div>
          )}

          {/* Donation Button (Only shows on 'upcoming' tab) */}
          {activeTab === 'upcoming' && !loading && (
             <div className="text-center mb-12 animate-[fadeInUpStagger_0.6s_ease-out_forwards]">
               <button 
                 onClick={handleDonationClick}
                 className="bg-[#F4D03F] hover:bg-[#E8C635] text-[#8B0000] font-extrabold py-4 px-12 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2 uppercase tracking-wide"
               >
                 For Donations ➤
               </button>
               <p className="text-gray-500 font-medium text-sm mt-4">
                 Support us by donating for our upcoming projects.
               </p>
             </div>
          )}

          {/* Empty State if no blogs match the filter */}
          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center bg-white p-12 rounded-3xl shadow-md border border-gray-100 animate-[fadeInUpStagger_0.6s_ease-out_forwards]">
              <p className="text-gray-500 font-bold text-xl">No {activeTab} programs available at the moment.</p>
            </div>
          )}

          {/* =========================================
              PROGRAM CARDS WITH ANIMATIONS
          ========================================= */}
          <div className="space-y-10">
            {!loading && filteredBlogs.map((blog, index) => (
              <div 
                key={blog.id} 
                // STAGGERED RENDER ANIMATION & HOVER EFFECTS
                style={{ 
                  animation: `fadeInUpStagger 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.15}s`,
                  opacity: 0
                }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row h-full">
                  
                  {/* Blog Image (Thumbnail) */}
                  <div className="md:w-5/12 overflow-hidden relative h-64 md:h-auto shrink-0">
                    <img 
                      src={blog.thumbnail || "https://images.unsplash.com/photo-1593113565214-80afcb4a4571?q=80&w=1000&auto=format&fit=crop"} 
                      alt={blog.title} 
                      // IMAGE ZOOM ON HOVER
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dynamic Badge based on tab */}
                    <div className={`absolute top-4 left-4 text-xs font-extrabold px-4 py-2 rounded-full shadow-md uppercase tracking-wider ${activeTab === 'upcoming' ? 'bg-[#F4D03F] text-[#8B0000]' : 'bg-gray-800 text-white'}`}>
                      {activeTab}
                    </div>
                  </div>
                  
                  {/* Blog Text Content */}
                  <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-[#800000] transition-colors">
                      {blog.title}
                    </h2>
                    
                    {/* Show SubTitle if it exists */}
                    {blog.subTitle && (
                      <h3 className="text-lg font-semibold text-[#800000] mb-5 italic border-l-4 border-[#F4D03F] pl-3">
                        {blog.subTitle}
                      </h3>
                    )}
                    
                    {/* Paragraph 1 */}
                    <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                      {blog.paragraph1}
                    </p>
                  </div>

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

export default Programs;