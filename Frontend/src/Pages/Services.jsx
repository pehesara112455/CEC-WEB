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

const Services = () => {
  // --- STATE ---
  const [allData, setAllData] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- MODAL & FORM STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    image1: '', 
    image2: '',
    image3: ''
  });

  // --- FIREBASE: READ DATA ---
  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("serviceName", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllData(dataList);
      setServices(dataList);
      setLoading(false);
    });

    return () => unsubscribe();
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
        setFormData({ ...formData, [name]: files[0].name });
    }
  };

  const handleClear = () => {
    setFormData({
        serviceName: '',
        description: '',
        image1: '',
        image2: '',
        image3: ''
    });
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    handleClear();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
        serviceName: item.serviceName,
        description: item.description,
        image1: item.image1 || '',
        image2: item.image2 || '',
        image3: item.image3 || ''
    });
    setIsModalOpen(true);
  };

  // --- FIREBASE: CREATE & UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editingId) {
            const docRef = doc(db, "services", editingId);
            await updateDoc(docRef, formData);
        } else {
            await addDoc(collection(db, "services"), formData);
        }
        setIsModalOpen(false);
        setEditingId(null);
        handleClear();
    } catch (error) {
        console.error("Error saving service: ", error);
        alert("Error saving service");
    }
  };

  // --- FIREBASE: DELETE ---
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this service?")) {
        try {
            await deleteDoc(doc(db, "services", id));
        } catch (error) {
            console.error("Error deleting: ", error);
        }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDF2F2] font-sans">
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        
        {/* Main White Card Container */}
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
                            className="w-full pl-5 pr-10 py-2 rounded-md border border-gray-300 text-gray-600 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition-all"
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
                        className="bg-[#8B0000] text-white px-6 py-2 rounded-md font-bold hover:bg-red-900 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
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
                                <th key={header} className="py-4 px-2 font-bold text-[#8B0000] text-sm tracking-wide">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan="6" className="text-center py-12 text-gray-400">Loading data...</td></tr>
                        )}

                        {!loading && currentItems.map((item) => (
                            <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors h-15">
                                <td className="px-2 font-bold text-gray-800 text-sm">{item.serviceName}</td>
                                <td className="px-2 text-gray-600 text-sm truncate max-w-xs">{item.description}</td>
                                <td className="px-2 text-gray-400 text-xs italic text-center">{item.image1 || '-'}</td>
                                <td className="px-2 text-gray-400 text-xs italic text-center">{item.image2 || '-'}</td>
                                <td className="px-2 text-gray-400 text-xs italic text-center">{item.image3 || '-'}</td>
                                <td className="px-2">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="text-orange-400 hover:text-orange-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
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

                        {!loading && services.length === 0 && (
                            <tr><td colSpan="6" className="text-center py-12 text-gray-400">No results found.</td></tr>
                        )}
                    </tbody>
                </table>
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
      </div>

      {/* --- MODAL SECTION (Kept the nice style from previous request) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-110 animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl">&times;</button>
                
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#8B0000] text-center mb-6 uppercase tracking-tight">
                        {editingId ? 'EDIT SERVICE' : 'NEW SERVICE'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Service Name *</label>
                            <input required type="text" name="serviceName" value={formData.serviceName} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20"/>
                        </div>
                        <div>
                            <label className="block text-[#8B0000] font-bold mb-1">Description *</label>
                            <textarea required rows="4" name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20 resize-none"></textarea>
                        </div>
                        {['image1', 'image2', 'image3'].map((imgField, index) => (
                            <div key={imgField}>
                                <label className="block text-[#8B0000] font-bold mb-1">Image {index + 1}</label>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    <input type="file" name={imgField} onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B0000] file:text-white hover:file:bg-red-800 cursor-pointer"/>
                                    {formData[imgField] && <p className="mt-1 text-xs text-green-600 font-medium pl-2">Selected: {formData[imgField]}</p>}
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 mt-8 pt-4">
                            <button type="button" onClick={handleClear} className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-lg active:scale-95 shadow hover:bg-orange-600 transition-colors">Clear</button>
                            <button type="submit" className="flex-1 bg-[#8B0000] text-white font-bold py-2.5 rounded-lg active:scale-95 shadow hover:bg-red-800 transition-colors">{editingId ? 'Update' : 'Submit'}</button>
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