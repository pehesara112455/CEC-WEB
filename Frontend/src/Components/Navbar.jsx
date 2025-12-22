// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const location = useLocation(); // Get the current URL path
  const [isOpen, setIsOpen] = useState(false); // State to control the mobile menu visibility

  // Helper function to determine if a link is active
  const isActive = (path) => { return(
    location.pathname === path
    ? 'bg-red-700 lg:bg-transparent lg:border-b-2 lg:border-white' //Is Active style to Both desktop and mobile
    : ''
  )
  };

  // Function to close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Function to toggle the mobile menu 
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-red-900 text-white shadow-lg sticky top-0 z-50">{/*Main container*/} 
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center"> {/* Navbar container*/}
        
        {/* Logo and Org Name */}
        <div className="flex items-center space-x-12"> 
          <img 
            src="src\assets\image 4.png" 
            alt="CEC Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12" // Smaller logo on mobile
          />
          <div className="text-xl sm:text-3xl font-bold tracking-wide">
            CEC
          </div>
        </div>

        {/* 1. Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-16"> 
          <Link to="/" className={`text-lg font-medium hover:text-red-200 transition duration-150 ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/About" className={`text-lg font-medium hover:text-red-200 transition duration-150 ${isActive('/About')}`}>
            About
          </Link>
          <Link to="/TrainingCenter" className={`text-lg font-medium hover:text-red-200 transition duration-150 ${isActive('/TrainingCenter')}`}>
            Training Center
          </Link>
          <Link to="/services" className={`text-lg font-medium hover:text-red-200 transition duration-150 ${isActive('/services') }`}>
            Services
          </Link>
          <Link to="/programs" className={`text-lg font-medium hover:text-red-200 transition duration-150 ${isActive('/programs')}`}>
            Programs
          </Link>
          <Link to="/contact" className={`text-lg font-medium hover:text-red-200 transition duration-150 ${isActive('/contact') }`}>
            Contact
          </Link>
        </div>

        {/* 2. Mobile Menu Button (Hamburger Icon)*/}
        <div className="lg:hidden"> 
          <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-white">
            {/* Conditional rendering for the icon */}
            {isOpen ? (
              // X icon when menu is open
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* 3. Mobile Menu Links */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0' // Animation for opening/closing
        } bg-red-800`}
      >
        <div className="flex flex-col space-y-2 px-4">
          <Link 
            to="/" 
            onClick={handleLinkClick} // Close menu on click
            className={`block py-2 text-lg font-medium hover:bg-red-700 rounded-md transition duration-150 ${isActive('/')}`}
          >
            Home
          </Link>
          <Link 
            to="/About" 
            onClick={handleLinkClick}
            className={`block py-2 text-lg font-medium hover:bg-red-700 rounded-md transition duration-150 ${isActive('/About') }`}
          >
            About
          </Link>
          <Link 
            to="/TrainingCenter" 
            onClick={handleLinkClick}
            className={`block py-2 text-lg font-medium hover:bg-red-700 rounded-md transition duration-150 ${isActive('/TrainingCenter') }`}
          >
            Training Center
          </Link>
          <Link 
            to="/services" 
            onClick={handleLinkClick}
            className={`block py-2 text-lg font-medium hover:bg-red-700 rounded-md transition duration-150 ${isActive('/services') }`}
          >
            Services
          </Link>
          <Link 
            to="/programs" 
            onClick={handleLinkClick}
            className={`block py-2 text-lg font-medium hover:bg-red-700 rounded-md transition duration-150 ${isActive('/programs') }`}
          >
            Programs
          </Link>
          <Link 
            to="/contact" 
            onClick={handleLinkClick}
            className={`block py-2 text-lg font-medium hover:bg-red-700 rounded-md transition duration-150 ${isActive('/contact') }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;