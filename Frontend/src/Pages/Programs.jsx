import React, { useState } from 'react';
import Header from '../Components/Navbar';
import Footer from '../Components/Footer';

// Importing the images exactly as you named them
import upcomingImg from '../assets/projects-upcoming.png';
import completedImg from '../assets/projects-completed.png';

const Programs = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleDonationClick = () => {
    window.location.href = "mailto:cecntc13@gmail.com?subject=Donation Inquiry";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Tab Selection */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-300 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-16 py-3 font-semibold transition-all ${
                  activeTab === 'upcoming' 
                  ? 'bg-[#8B0000] text-white' 
                  : 'text-gray-700 hover:bg-gray-400'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-16 py-3 font-semibold transition-all ${
                  activeTab === 'completed' 
                  ? 'bg-[#8B0000] text-white' 
                  : 'text-gray-700 hover:bg-gray-400'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Upcoming Content */}
          {activeTab === 'upcoming' && (
            <div className="space-y-8">
              
              {/* Donation Button */}
              <div className="text-center">
                <button 
                  onClick={handleDonationClick}
                  className="bg-[#F4D03F] hover:bg-[#E8C635] text-[#8B0000] font-bold py-3 px-12 rounded-md shadow-md transition-all inline-flex items-center gap-2"
                >
                  For Donations ➤
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  Support us by donating for our upcoming projects
                </p>
              </div>

              {/* World Food Day Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-5/12 p-8">
                    <img 
                      src={upcomingImg} 
                      alt="World Food Day" 
                      className="rounded-lg w-full h-auto object-cover"
                    />
                  </div>
                  <div className="md:w-7/12 p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">World Food Day</h2>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Honoring Food, Sustainability, and Community Well-being
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      The Community Education Centre is pleased to announce that we will be joining the global observance 
                      of World Food Day. While specific program details are yet to be finalized, the celebration will 
                      focus on raising awareness around food security, sustainable agriculture, and the role of communities 
                      in building a healthier future. Stay tuned for more updates!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed Content */}
          {activeTab === 'completed' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-5/12 p-8">
                  <img 
                    src={completedImg} 
                    alt="Waste Management Field Visit" 
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
                <div className="md:w-7/12 p-8 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Field Visit on Sustainable Waste Management
                  </h2>
                  <h3 className="text-base font-semibold text-gray-700 mb-4 italic">
                    Compost-Based Practices in Dambulla – Degampathaha (with Partner Organizations) 18.02.2025
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This field visit brought together CEC participants and partner organizations to explore practical approaches 
                    to sustainable waste management in Degampathaha, Dambulla. The visit focused on community-led composting 
                    methods, organic waste processing, and local innovations in environmental sustainability. Participants 
                    engaged in hands-on learning, site observations, and knowledge-sharing with rural waste management stakeholders.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Programs;