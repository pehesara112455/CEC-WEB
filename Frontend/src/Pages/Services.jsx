import React from 'react';
import Header from '../Components/Navbar'; // Changed to Navbar to match your file explorer
import Footer from '../Components/Footer';
import servicesImg from '../assets/services.png';

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-10 border border-gray-100">
            
            <div className="w-full md:w-1/2">
              <img 
                src={servicesImg} 
                alt="Preschool Children" 
                className="w-full h-auto rounded-xl object-cover shadow-md"
              />
            </div>

            <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                “Singithi Divihuru Niwasa” Preschool Service
              </h2>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-6 italic">
                Enhancing Early Childhood Education through Community Engagement
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                The Preschool Service Project aims to uplift early childhood 
                education by creating a supportive, engaging, and developmentally 
                appropriate learning environment for preschool aged children. This 
                initiative involves providing essential learning materials, organizing 
                interactive play-based sessions, and improving classroom 
                infrastructure with the help of volunteers and community support.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;