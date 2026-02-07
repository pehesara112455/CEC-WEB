

const NavBar = ({ isOpen, setIsOpen }) => {
  const menuItems = [

    { name: 'RESERVATIONS', href: '/reservation' },
    { name: 'CLIENT DETAILS', href: 'clientDetailsTable' },
    { name: 'ROOMS & HALLS', href: '/admin/add-halls-rooms' },

    { name: 'BLOG POSTS', href: '#' },
    { name: 'SERVICES', href: '#' },
    { name: 'DONATIONS', href: '#' },
  ];

  return (
    <>
      {/* --- FLOATING OPEN BUTTON --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#8B0000] text-white rounded-md shadow-lg hover:bg-red-800 transition-colors"
          title="Open Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* --- SIDEBAR --- */}
      {/* Changed 'fixed' to 'sticky' so it stays on screen during scroll but pushes content */}
      <aside 
        className={`sticky top-0 h-screen z-40 bg-[#8B0000] text-white flex flex-col font-sans shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        {/* Header Section */}
        <div className="p-6 flex items-center gap-3 whitespace-nowrap">
          <button 
            onClick={() => setIsOpen(false)}
            className="focus:outline-none hover:bg-red-800 p-1 rounded transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide">ADMIN PANEL</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-8 py-4 whitespace-nowrap">
          <ul className="divide-y divide-white/30">
            {menuItems.map((item, index) => (
              <li key={index} className="py-4">
                <a 
                  href={item.href} 
                  className="block text-sm font-medium tracking-wide hover:text-[#EFB506] transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-6 flex justify-center pb-10 whitespace-nowrap">
          <button className="bg-white text-[#8B0000] font-bold py-2 px-10 rounded shadow hover:bg-[#EFB506] hover:text-[#8B0000] transition-colors duration-200"> 
            LOG OUT
          </button>
        </div>
      </aside>
    </>
  );
};

export default NavBar;