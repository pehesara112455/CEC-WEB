// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom'; // Import useLocation to check current path

function Header() {
  const location = useLocation(); // Get the current URL path

  // Helper function to determine if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-red-900 text-white shadow-lg"> {/* Dark red background */}
      <nav className="container mx-auto py-2 flex justify-between items-center">
        
        {/* Logo and Org Name */}
        <div className="flex items-center space-x-6">
         
          <img src="src\assets\image 4.png" alt="CEC Logo" className="h-15 w-15" />
          <div className="text-4xl font-bold tracking-wide">
            CEC
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-12"> {/* Increased space between links */}
          <Link
            to="/"
            className={`
              text-lg font-medium hover:text-red-200 transition duration-150
              ${isActive('/') ? 'border-b-2 border-white' : ''}
            `}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`
              text-lg font-medium hover:text-red-200 transition duration-150
              ${isActive('/about') ? 'border-b-2 border-white' : ''}
            `}
          >
            About
          </Link>
          <Link
            to="/training-center" // New path for Training Center
            className={`
              text-lg font-medium hover:text-red-200 transition duration-150
              ${isActive('/training-center') ? 'border-b-2 border-white' : ''}
            `}
          >
            Training Center
          </Link>
          <Link
            to="/services"
            className={`
              text-lg font-medium hover:text-red-200 transition duration-150
              ${isActive('/services') ? 'border-b-2 border-white' : ''}
            `}
          >
            Services
          </Link>
          <Link
            to="/programs" // New path for Programs
            className={`
              text-lg font-medium hover:text-red-200 transition duration-150
              ${isActive('/programs') ? 'border-b-2 border-white' : ''}
            `}
          >
            Programs
          </Link>
          <Link
            to="/contact"
            className={`
              text-lg font-medium hover:text-red-200 transition duration-150
              ${isActive('/contact') ? 'border-b-2 border-white' : ''}
            `}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;