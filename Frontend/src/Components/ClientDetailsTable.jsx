import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import NavBar from './AdminNav'; 
import AddNewClient from './AddNewClient'; // Using this for both Add and Edit

const ClientDetailsTable = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // SHARED STATE: Controls the layout width
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // MODAL STATES: For adding and editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-all-clients');
      setClients(response.data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId) => {
    if (window.confirm(`Are you sure you want to delete client ${clientId}?`)) {
      try {
        await axios.delete(`http://localhost:5000/delete-client/${clientId}`);
        setClients(prev => prev.filter(c => c.clientId !== clientId));
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  // Open modal for editing
  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Open modal for adding new
  const handleAddNew = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const filteredClients = clients.filter(client => 
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.clientId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR AREA */}
      <NavBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-8 transition-all duration-300 ease-in-out min-w-0 bg-gray-50/30">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-red-900 tracking-tight uppercase whitespace-nowrap">
            CLIENT DETAILS
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="border-2 border-gray-200 rounded-lg pl-3 pr-10 py-1.5 text-sm focus:outline-none focus:border-red-900 w-48 md:w-72 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-0 bg-red-900 p-2.5 rounded-r-lg">
                <Search size={16} className="text-white" />
              </div>
            </div>

            <button 
              onClick={handleAddNew}
              className="bg-red-900 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-red-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} /> ADD NEW
            </button>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-[12px] font-bold text-gray-700 bg-gray-50/80 border-b uppercase tracking-wider">
                  <th className="py-4 px-4">Company Name</th>
                  <th className="py-4 px-2">Phone</th>
                  <th className="py-4 px-2">Address</th>
                  <th className="py-4 px-2">Email</th>
                  <th className="py-4 px-2">Contact Person</th>
                  <th className="py-4 px-2 text-center">Number</th>
                  <th className="py-4 px-2">NIC</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              
              <tbody className="text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-20 font-bold text-red-900 animate-pulse uppercase tracking-widest">
                      Loading Database...
                    </td>
                  </tr>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client, index) => (
                    <tr 
                      key={client.clientId || index} 
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-red-50/40 transition-colors border-b border-gray-50`}
                    >
                      <td className="py-4 px-4 font-bold text-gray-800">{client.companyName}</td>
                      <td className="py-4 px-2 text-gray-600">{client.contactNumber}</td>
                      <td className="py-4 px-2 text-gray-500 truncate max-w-[180px]">{client.address || "N/A"}</td>
                      <td className="py-4 px-2 text-gray-500">{client.email || "N/A"}</td>
                      <td className="py-4 px-2 font-medium">{client.contactPerson || "N/A"}</td>
                      <td className="py-4 px-2 text-center text-gray-600">{client.secondaryContact || "N/A"}</td>
                      <td className="py-4 px-2 text-gray-500">{client.nic || "N/A"}</td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => handleEdit(client)} 
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(client.clientId)} 
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-20 text-gray-400 italic">
                      No client records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- ADD/EDIT MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-900 z-10"
            >
              <Plus size={30} className="rotate-45" />
            </button>
            <AddNewClient 
              editData={selectedClient} 
              onSuccess={() => {
                setIsModalOpen(false);
                fetchClients();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsTable;