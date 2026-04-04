//Frontend/src/Pages/Services.jsx
import React, { useState, useEffect } from 'react';
import NavBar from "./../Components/AdminNav.jsx"; // IMPORT NAVBAR

const Services = () => {
  // --- STATE ---
  const [allData, setAllData] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- SIDEBAR STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- MODAL & FORM STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Stores File objects for new uploads
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    image1: null, 
    image2: null,
    image3: null
  });

  // Stores string URLs for existing images (when editing)
  const [existingImages, setExistingImages] = useState({
    image1: '',
    image2: '',
    image3: ''
  });

  // --- API CONFIGURATION ---
  const API_URL = 'http://localhost:5000/api/services';

  // --- API: READ DATA ---
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      // FIX: Check if data is an array to prevent .slice() crash
      if (Array.isArray(data)) {
        setAllData(data);
        setServices(data);
      } else {
        console.error("Backend sent invalid data:", data);
        setAllData([]);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setAllData([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // --- SEARCH HANDLER ---
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
        setServices(allData);
    } else {
        const filtered = allData.filter(item => 
            item.serviceName.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term)
        );
        setServices(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Updated to store the File object
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
        setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleClear = () => {
    setFormData({
        serviceName: '',
        description: '',
        image1: null,
        image2: null,
        image3: null
    });
    setExistingImages({ image1: '', image2: '', image3: '' });
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    handleClear();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    
    // Populate text fields
    setFormData({
        serviceName: item.serviceName,
        description: item.description,
        image1: null, // Reset file inputs
        image2: null,
        image3: null
    });

    // Save existing URLs
    setExistingImages({
        image1: item.image1 || '',
        image2: item.image2 || '',
        image3: item.image3 || ''
    });

    setIsModalOpen(true);
  };

  // --- API: CREATE & UPDATE (Updated for FormData) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    
    // Use FormData for file uploads
    const dataToSend = new FormData();
    dataToSend.append('serviceName', formData.serviceName);
    dataToSend.append('description', formData.description);

    // Append new files if selected
    if (formData.image1) dataToSend.append('image1', formData.image1);
    if (formData.image2) dataToSend.append('image2', formData.image2);
    if (formData.image3) dataToSend.append('image3', formData.image3);

    // If Editing, send old URLs for fields that didn't get a new file
    if (editingId) {
        if (!formData.image1) dataToSend.append('image1', existingImages.image1);
        if (!formData.image2) dataToSend.append('image2', existingImages.image2);
        if (!formData.image3) dataToSend.append('image3', existingImages.image3);
    }

    try {
        if (editingId) {
            // Update Service via API
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                body: dataToSend 
            });
        } else {
            // Create Service via API
            await fetch(API_URL, {
                method: 'POST',
                body: dataToSend
            });
        }
        
        setIsModalOpen(false);
        setEditingId(null);
        handleClear();
        setCurrentPage(1); 
        fetchServices(); // Refresh list from backend

    } catch (error) {
        console.error("Error saving service: ", error);
        alert("Error saving service");
    } finally {
      setIsSubmitting(false); 
    }
  };

  // --- API: DELETE ---
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this service?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchServices(); // Refresh list from backend
        } catch (error) {
            console.error("Error deleting: ", error);
        }
    }
  };

  return (
    // FIX: Main container set to flex, h-screen, and overflow-hidden for sidebar integration
    <div className="flex min-h-screen bg-[#FDF2F2] font-sans h-screen overflow-hidden">
      
      {/* FIX: Add NavBar Component */}
      <NavBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* FIX: Main Content Area scrolling setup */}
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 min-w-0">
        
        {/* Main White Card Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              
              {/* --- HEADER SECTION --- */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <h1 className="text-2xl font-bold text-[#8B0000] uppercase tracking-wide ml-2 md:ml-4">
                      SERVICES
                  </h1>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                      {/* Search Bar */}
                      <div className="relative group w-full md:w-72">
                          <input
                              type="text"
                              placeholder="Search services..."
                              value={searchTerm}
                              onChange={handleSearch}
                              className="w-full pl-5 pr-10 py-2.5 rounded-md border border-gray-300 text-gray-600 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition-all font-medium"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                          </div>
                      </div>

                      {/* + ADD NEW Button */}
                      <button 
                          onClick={handleOpenAddModal}
                          className="bg-[#8B0000] text-white px-6 py-2.5 rounded-md font-bold hover:bg-red-900 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2 active:scale-95"
                      >
                           + ADD NEW
                      </button>
                  </div>
              </div>

              {/* --- TABLE SECTION --- */}
              <div className="overflow-x-auto min-h-[380px]">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b-2 border-[#8B0000]">
                              {['Service', 'Description', 'Image 1', 'Image 2', 'Image 3', 'Actions'].map((header) => (
                                  <th key={header} className="py-4 px-2 font-bold text-[#8B0000] text-sm tracking-wide uppercase">
                                      {header}
                                  </th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {loading && (
                              <tr><td colSpan="6" className="text-center py-20 font-medium text-gray-500">Loading data...</td></tr>
                          )}

                          {!loading && currentItems.map((item) => (
                              <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-16">
                                  <td className="px-2 font-bold text-gray-800 text-sm">{item.serviceName}</td>
                                  <td className="px-2 text-gray-600 text-sm truncate max-w-xs font-medium">{item.description}</td>
                                  
                                  {/* Updated to show Image BIGGER (h-16 w-16) and CENTERED */}
                                  <td className="px-2 text-gray-400 text-xs italic text-center align-middle">
                                      {item.image1 ? <img src={item.image1} alt="1" className="h-16 w-16 object-cover rounded mx-auto border border-gray-200 shadow-sm"/> : '-'}
                                  </td>
                                  <td className="px-2 text-gray-400 text-xs italic text-center align-middle">
                                      {item.image2 ? <img src={item.image2} alt="2" className="h-16 w-16 object-cover rounded mx-auto border border-gray-200 shadow-sm"/> : '-'}
                                  </td>
                                  <td className="px-2 text-gray-400 text-xs italic text-center align-middle">
                                      {item.image3 ? <img src={item.image3} alt="3" className="h-16 w-16 object-cover rounded mx-auto border border-gray-200 shadow-sm"/> : '-'}
                                  </td>

                                  <td className="px-2">
                                      <div className="flex items-center gap-3">
                                          <button 
                                              onClick={() => handleEdit(item)}
                                              className="text-orange-500 hover:text-orange-600 hover:scale-110 transition-all"
                                              title="Edit"
                                          >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                              </svg>
                                          </button>
                                          <button 
                                              onClick={() => handleDelete(item.id)}
                                              className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all"
                                              title="Delete"
                                          >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                              </svg>
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}

                          {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, index) => (
                              <tr key={`empty-${index}`} className="h-16 border-b border-transparent">
                                  <td colSpan={6}></td>
                              </tr>
                          ))}

                          {!loading && services.length === 0 && (
                              <tr><td colSpan="6" className="text-center py-20 text-gray-400 font-medium italic">No results found.</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>

              {/* --- PAGINATION --- */}
              {totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-gray-100 pt-6">
                      <span className="text-sm font-bold text-gray-400 tracking-wide">
                          Page {currentPage} of {totalPages}
                      </span>
                      
                      <div className="flex gap-2">
                          <button
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage(prev => prev - 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                              </svg>
                          </button>

                          {[...Array(totalPages)].map((_, i) => (
                              <button
                                  key={i}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-10 h-10 rounded-md font-bold text-sm transition-all duration-200 shadow-sm ${
                                      currentPage === i + 1 
                                      ? "bg-[#8B0000] text-white" 
                                      : "bg-[#8E8E8E] text-white hover:bg-gray-500"
                                  }`}
                              >
                                  {i + 1}
                              </button>
                          ))}

                          <button
                              disabled={currentPage === totalPages}
                              onClick={() => setCurrentPage(prev => prev + 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                          </button>
                      </div>
                  </div>
              )}
          </div>
        </div>
      </div>

      {/* --- MODAL SECTION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-[110] animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl transition-colors"
                >
                  &times;
                </button>
                
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#8B0000] text-center mb-6 uppercase tracking-tight">
                        {editingId ? 'EDIT SERVICE' : 'NEW SERVICE'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Service Name *</label>
                            <input 
                              required 
                              type="text" 
                              name="serviceName" 
                              value={formData.serviceName} 
                              onChange={handleInputChange} 
                              className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium text-gray-700"
                              placeholder="e.g. Catering"
                            />
                        </div>
                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Description *</label>
                            <textarea 
                              required 
                              rows="4" 
                              name="description" 
                              value={formData.description} 
                              onChange={handleInputChange} 
                              className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors resize-none font-medium text-gray-700"
                              placeholder="Describe the service..."
                            ></textarea>
                        </div>
                        
                        {['image1', 'image2', 'image3'].map((imgField, index) => (
                            <div key={imgField}>
                                <label className="block text-[#8B0000] font-bold mb-1">Image {index + 1}</label>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    <input 
                                      type="file" 
                                      name={imgField} 
                                      onChange={handleFileChange} 
                                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#8B0000] file:text-white hover:file:bg-red-800 cursor-pointer transition-colors"
                                    />
                                    {/* Display New File Name OR Existing Image if editing */}
                                    {formData[imgField] ? (
                                        <p className="mt-2 text-xs text-green-600 font-bold pl-1">Selected: {formData[imgField].name}</p>
                                    ) : (
                                        editingId && existingImages[imgField] && (
                                            <div className="mt-2 pl-1 flex items-center gap-2">
                                              <span className="text-xs text-gray-500 font-medium">Current:</span>
                                              <img src={existingImages[imgField]} alt="current" className="h-8 w-8 object-cover rounded border border-gray-200"/>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex gap-4 mt-8 pt-4">
                            <button 
                              type="button" 
                              onClick={handleClear} 
                              className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg active:scale-95 shadow hover:bg-orange-600 transition-all"
                            >
                              Clear
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} // Disable while uploading
                                className={`flex-1 font-bold py-3 rounded-lg shadow transition-all text-white flex items-center justify-center gap-2 ${
                                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B0000] hover:bg-red-800 active:scale-95'
                                }`}
                            >
                                {/* Change text based on state */}
                                {isSubmitting && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isSubmitting ? 'Processing...' : (editingId ? 'Update' : 'Submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Services;