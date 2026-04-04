import React, { useState, useEffect } from 'react';
import NavBar from "./../Components/AdminNav.jsx"; // IMPORT NAVBAR

const DonationDetails = () => {
  // 1. State
  const [allData, setAllData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // --- SIDEBAR STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- MODAL & FORM STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    contact: '',
    date: new Date().toISOString().split('T')[0],
    amount: ''
  });
   
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // API URL (Ensure your backend is running on this port)
  const API_URL = 'http://localhost:5000/api/donations';

  // --- FETCH DATA FROM BACKEND ---
  const fetchDonations = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      setAllData(data);
      setDonations(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // 2. Search Handler (Client-side search)
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
        setDonations(allData);
    } else {
        const filtered = allData.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            item.country.toLowerCase().includes(term)
        );
        setDonations(filtered);
    }
    setCurrentPage(1); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- OPEN MODAL FOR ADDING ---
  const handleOpenAddModal = () => {
    setEditingId(null); 
    setFormData({
        name: '', 
        country: '', 
        contact: '', 
        date: new Date().toISOString().split('T')[0], 
        amount: ''
    });
    setIsModalOpen(true);
  };

  // --- OPEN MODAL FOR EDITING ---
  const handleEdit = (item) => {
    setEditingId(item.id); 
    
    // Remove "Rs." prefix for the input field
    const cleanAmount = item.amount.toString().replace(/Rs\.\s?|Rs/gi, '');

    setFormData({
        name: item.name,
        country: item.country,
        contact: item.contact,
        date: item.date,
        amount: cleanAmount
    });
    setIsModalOpen(true);
  };

  // --- API: SUBMIT (CREATE / UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format amount with Rs.
    const formattedAmount = formData.amount.toLowerCase().startsWith('rs') 
        ? formData.amount 
        : `Rs.${formData.amount}`;

    // Prepare data object
    const payload = {
        name: formData.name,
        country: formData.country,
        contact: formData.contact,
        date: formData.date,
        amount: formattedAmount
    };

    try {
        if (editingId) {
            // UPDATE Request
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // CREATE Request
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        // Refresh Data locally
        await fetchDonations();

        // Reset and Close
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', country: '', contact: '', date: '', amount: '' });
        setSearchTerm(''); 
        setCurrentPage(1);

    } catch (error) {
        console.error("Error saving document: ", error);
        alert("Error saving donation details");
    }
  };

  // --- API: DELETE ---
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this donation?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            // Refresh Data
            fetchDonations();
        } catch (error) {
            console.error("Error deleting: ", error);
        }
    }
  }

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = donations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(donations.length / itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;

  return (
    // FIX: Main container set to flex, h-screen, and overflow-hidden for sidebar integration
    <div className="flex bg-[#FFF5F5] h-screen overflow-hidden font-sans relative">
       
      {/* FIX: Add NavBar Component */}
      <NavBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* FIX: Main scrolling content area */}
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 min-w-0">
        <div className="max-w-6xl mx-auto">
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">         
            <div>
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-[#8B0000] uppercase tracking-wide">
                        DONATION DETAILS
                    </h1>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search donations..."
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

                        <button 
                            onClick={handleOpenAddModal} 
                            className="bg-[#8B0000] text-white px-6 py-2.5 rounded-md font-bold hover:bg-red-900 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2 active:scale-95"
                        >
                             + ADD NEW
                        </button>
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="overflow-x-auto min-h-[380px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b-2 border-[#8B0000]">
                        {['Name', 'Country', 'Contact', 'Date', 'Amount', 'Actions'].map((header) => (
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
                        <tr
                        key={item.id}
                        className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-16"
                        >
                        <td className="px-2 font-bold text-gray-800 text-sm">{item.name}</td>
                        <td className="px-2 text-gray-600 font-medium text-sm">{item.country}</td>
                        <td className="px-2 text-gray-600 font-medium text-sm">{item.contact}</td>
                        <td className="px-2 text-gray-600 font-medium text-sm">{item.date}</td>
                        <td className="px-2 font-black text-[#8B0000] text-sm">{item.amount}</td>
                        <td className="px-2">
                            <div className="flex items-center gap-3">
                            
                            {/* EDIT BUTTON */}
                            <button 
                                onClick={() => handleEdit(item)} 
                                className="text-orange-500 hover:text-orange-600 hover:scale-110 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                            
                            {/* DELETE BUTTON */}
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all"
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
                    </tbody>
                </table>

                {!loading && donations.length === 0 && (
                    <div className="text-center py-20 text-gray-400 font-medium italic">
                    No results found for "{searchTerm}"
                    </div>
                )}
                </div>
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

      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-[110] animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
                {/* Close Button */}
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl transition-colors"
                >
                    &times;
                </button>

                <div className="p-8">
                    {/* Header */}
                    <h3 className="text-2xl font-bold text-[#8B0000] text-center mb-6 uppercase tracking-tight">
                        {editingId ? 'EDIT DONATION' : 'ADD NEW DONATION'}
                    </h3>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
                        
                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Full Name *</label>
                            <input 
                                required
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium text-gray-700"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#8B0000] font-bold mb-1">Country *</label>
                                <input 
                                    required
                                    type="text" 
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium text-gray-700"
                                    placeholder="e.g. USA"
                                />
                            </div>
                            <div>
                                <label className="block text-[#8B0000] font-bold mb-1">Date *</label>
                                <input 
                                    required
                                    type="date" 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Contact Number *</label>
                            <input 
                                required
                                type="text" 
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium text-gray-700"
                                placeholder="e.g. +1 234 567 890"
                            />
                        </div>

                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Amount (Rs) *</label>
                            <input 
                                required
                                type="number" 
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium text-gray-700"
                                placeholder="e.g. 5000"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-8 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg active:scale-95 shadow hover:bg-orange-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 bg-[#8B0000] text-white font-bold py-3 rounded-lg active:scale-95 shadow hover:bg-red-800 transition-all"
                            >
                                {editingId ? 'Update' : 'Submit'}
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

export default DonationDetails;