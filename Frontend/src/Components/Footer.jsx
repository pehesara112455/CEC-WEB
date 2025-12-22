// src/components/Footer.jsx

import React from 'react';
import { FaFacebook } from "react-icons/fa";
// We will use Font Awesome icons via inline SVG or placeholder text
// If you are using a library like react-icons/fa, you would import FaFacebook here.

const Footer = () => {
  return (
    // Outer container: Dark red background matching your header
    <footer className="bg-red-900 text-white pt-10 pb-6 shadow-2xl">
      <div className="container mx-auto px-4">
        {/* Main Grid Layout: 3 columns on medium screens (md) and up, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">

          {/* === 1. CONTACT INFO === */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-white pb-2 mb-4 tracking-wide">
              CONTACT INFO
            </h3>
            <div className="space-y-2 text-sm">
              {/* Location */}
              <p>
                <i className="fas fa-map-marker-alt w-5 h-5 text-red-300 mr-3 mt-1"></i>
                <span>No.117, Thalahena, Malabe, Sri Lanka</span>
              </p>
              {/* Phone Numbers */}
              <p>
                <i className="fas fa-phone w-5 h-5 text-red-300 mr-3"></i>
                <span>0112 789 459 / 0777 666 272</span>
              </p>
              {/* Email Addresses */}
              <p>
                <i className="fas fa-envelope w-5 h-5 text-red-300 mr-3"></i>
                <span>cec@slitnet.lk / cecntc13@gmail.com</span>
              </p>
            </div>
          </div>

          {/* === 2. QUICK LINKS === */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-white pb-2 mb-4 tracking-wide">
              QUICK LINKS
            </h3>
            {/* Flex container to arrange links side-by-side on desktop */}
            <div className="flex space-x-12">
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li><a href="/about" className="hover:text-red-300 transition duration-150">About</a></li>
                <li><a href="/training-centre" className="hover:text-red-300 transition duration-150">Training Centre</a></li>
                <li><a href="/services" className="hover:text-red-300 transition duration-150">Services</a></li>
              </ul>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li><a href="/programs" className="hover:text-red-300 transition duration-150">Programs</a></li>
                <li><a href="/contact" className="hover:text-red-300 transition duration-150">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* === 3. FOLLOW US / COPYRIGHT === */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-wide">
              FOLLOW US ON
            </h3>
            
            {/* Facebook Link */}
            <div className="border-b-2 border-white pb-4">
                <a href="https://facebook.com/yourpage" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center text-sm hover:text-red-300 transition duration-150"
                >
                   <FaFacebook className="w-6 h-6 text-white drop-shadow-lg mr-2" />
        FACEBOOK
                </a>
            </div>

            {/* Copyright */}
            <p className="text-sm">
              © 2025 Community Education Centre.<br/>All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;