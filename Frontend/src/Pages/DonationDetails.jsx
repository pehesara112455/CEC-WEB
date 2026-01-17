import React, { useState, useEffect } from 'react';

// FIREBASE IMPORTS
import { db } from '../firebase'; 
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  updateDoc, 
  doc,
  query, 
  orderBy 
} from 'firebase/firestore';

const DonationDetails = () => {
  // 1. State
  const [allData, setAllData] = useState([]);
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  // FIREBASE: Fetch Data
  // NOTE: orderBy("date", "desc") ensures the newest dates appear first in the table
  useEffect(() => {
    const q = query(collection(db, "donations"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataList = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setAllData(dataList);
      setDonations(dataList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Search Handler
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

  // --- FIREBASE: SUBMIT ---
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
        amount: formattedAmount,
        // Optional: Store creation time to help with sorting if needed later
        createdAt: new Date().toISOString() 
    };

    try {
        if (editingId) {
            // Update
            const docRef = doc(db, "donations", editingId);
            // We remove createdAt from update to preserve original creation time
            const { createdAt, ...updateData } = payload; 
            await updateDoc(docRef, updateData);
        } else {
            // Create
            await addDoc(collection(db, "donations"), payload);
        }

        // Reset and Close
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', country: '', contact: '', date: '', amount: '' });
        setSearchTerm(''); 
        setCurrentPage(1); // Reset to page 1 to see the new entry at top

    } catch (error) {
        console.error("Error saving document: ", error);
        alert("Error saving donation details");
    }
  };

  // FIREBASE: Delete Data
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this donation?")) {
        try {
            await deleteDoc(doc(db, "donations", id));
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
    <div className="min-h-screen bg-[#FFF5F5] p-8 font-sans relative">
       
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">         
        <div>
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-[#8B0000] uppercase tracking-wide ml-12 md:ml-14">
                    DONATION DETAILS
                </h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search donations..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-5 pr-10 py-2 rounded-md border border-gray-300 text-gray-600 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition-all"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <button 
                        onClick={handleOpenAddModal} 
                        className="bg-[#8B0000] text-white px-6 py-2 rounded-md font-bold hover:bg-red-900 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                    >
                         + ADD NEW
                    </button>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b-2 border-[#8B0000]">
                    {['Name', 'Country', 'Contact', 'Date', 'Amount', 'Actions'].map((header) => (
                    <th key={header} className="py-4 px-2 font-bold text-[#8B0000] text-sm tracking-wide">
                        {header}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                
                {loading && (
                    <tr><td colSpan="6" className="text-center py-4">Loading data...</td></tr>
                )}

                {!loading && currentItems.map((item) => (
                    <tr
                    key={item.id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-15"
                    >
                    <td className="px-2 font-bold text-gray-800 text-sm">{item.name}</td>
                    <td className="px-2 text-gray-500 text-sm">{item.country}</td>
                    <td className="px-2 text-gray-500 text-sm">{item.contact}</td>
                    <td className="px-2 text-gray-500 text-sm">{item.date}</td>
                    <td className="px-2 font-bold text-gray-900 text-sm">{item.amount}</td>
                    <td className="px-2">
                        <div className="flex items-center gap-3">
                        
                        {/* EDIT BUTTON */}
                        <button 
                            onClick={() => handleEdit(item)} 
                            className="text-orange-400 hover:text-orange-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        
                        {/* DELETE BUTTON */}
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
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
                    <tr key={`empty-${index}`} className="h-15 border-b border-transparent">
                        <td colSpan={6}></td>
                    </tr>
                ))}
                </tbody>
            </table>

            {!loading && donations.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                No results found for "{searchTerm}"
                </div>
            )}
            </div>
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
                <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                        currentPage === i + 1 
                        ? "bg-[#8B0000] text-white shadow-lg scale-110" 
                        : "text-gray-400 hover:text-[#8B0000] hover:bg-white"
                    }`}
                    >
                    {i + 1}
                    </button>
                ))}
                </div>

                <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </div>
        )}
      </div>

      {/* --- POPUP MODAL (STYLED EXACTLY LIKE SERVICES) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-110 animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
                {/* Close Button */}
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl"
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
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20"
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
                                    className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20"
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
                                    className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20"
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
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20"
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
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20"
                                placeholder="e.g. 5000"
                            />
                        </div>

                        {/* Buttons (Services Style) */}
                        <div className="flex gap-4 mt-8 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-lg active:scale-95 shadow hover:bg-orange-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 bg-[#8B0000] text-white font-bold py-2.5 rounded-lg active:scale-95 shadow hover:bg-red-800 transition-colors"
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