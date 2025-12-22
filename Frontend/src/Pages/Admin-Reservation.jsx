import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import NavBar from '../Components/AdminNav';

const ReservationsDashboard = () => {
  // 1. State for our reservation data
  const [reservations, setReservations] = useState([
    { id: "001", name: "John Doe", contact: "0771234567", date: "2023-10-25", advance: 500, total: 2000, status: "Pending" },
    { id: "002", name: "Jane Smith", contact: "0719876543", date: "2023-10-26", advance: 1000, total: 5000, status: "Paid" },
    { id: "003", name: "Amal Perera", contact: "0755554433", date: "2023-10-27", advance: 200, total: 1500, status: "Pending" },
    { id: "004", name: "Sara Connor", contact: "0721112233", date: "2023-10-28", advance: 800, total: 3000, status: "Pending" },
    { id: "005", name: "Kamal Silva", contact: "0788889900", date: "2023-10-29", advance: 0, total: 4500, status: "Pending" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Logic to delete a row
  const deleteRow = (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      setReservations(reservations.filter(item => item.id !== id));
    }
  };

  // 3. Logic to filter data based on search
  const filteredData = reservations.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.includes(searchTerm)
  );

  return (
    <div className=" flex bg-gray-50 font-sans">

        <NavBar/>

      <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-red-900 tracking-tight">RESERVATIONS</h1>
          
          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
            {/* Status Filter Dropdown */}
            <div className="relative border-b-2 border-red-800 pb-1 flex items-center">
              <select className="appearance-none bg-transparent pr-8 focus:outline-none font-semibold text-gray-700 cursor-pointer">
                <option>Pending</option>
                <option>Paid</option>
              </select>
              <ChevronDown className="absolute right-0 w-4 h-4 text-red-800 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="flex items-center border rounded-md overflow-hidden bg-white shadow-sm">
              <input 
                type="text" 
                placeholder="Search" 
                className="px-3 py-1.5 focus:outline-none w-40 md:w-56"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-red-900 p-2 text-white">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <button className="flex items-center gap-2 bg-red-900 text-white px-5 py-2 rounded font-bold hover:bg-red-800 transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
              ADD NEW
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-900 font-bold border-b text-sm">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Client Name</th>
                <th className="py-4 px-2">Contact</th>
                <th className="py-4 px-2">Date</th>
                <th className="py-4 px-2">Advance</th>
                <th className="py-4 px-2">Total Amount</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm md:text-base">
              {filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50/80" : "bg-white"}>
                  <td className="py-4 px-2 font-medium text-gray-800">{item.id}</td>
                  <td className="py-4 px-2">{item.name}</td>
                  <td className="py-4 px-2">{item.contact}</td>
                  <td className="py-4 px-2">{item.date}</td>
                  <td className="py-4 px-2">
                    <input 
                      type="text" 
                      defaultValue={item.advance} 
                      className="w-24 border rounded-full px-3 py-0.5 text-center focus:ring-1 focus:ring-red-800 outline-none"
                    />
                  </td>
                  <td className="py-4 px-2 font-semibold text-gray-800">{item.total}</td>
                  <td className="py-4 px-2">
                    <select className="border rounded px-2 py-1 bg-white focus:outline-none w-28 text-sm">
                      <option>{item.status}</option>
                      <option>{item.status === 'Paid' ? 'Pending' : 'Paid'}</option>
                    </select>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-4">
                      <button className="text-gray-800 hover:text-blue-600 transition-colors">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteRow(item.id)}
                        className="text-gray-800 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="bg-orange-500 text-white px-4 py-1.5 rounded text-xs font-bold uppercase hover:bg-orange-600 shadow-sm">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="text-center py-10 text-gray-400">No reservations found.</div>
          )}
        </div>

        {/* PAGINATION SECTION */}
        <div className="mt-auto flex justify-end items-center gap-6 pt-6 border-t border-gray-100">
          <button className="text-gray-400 hover:text-red-900 transition-colors"><ChevronLeft className="w-8 h-8" /></button>
          <span className="font-bold text-xl text-gray-700">1</span>
          <button className="text-gray-400 hover:text-red-900 transition-colors"><ChevronRight className="w-8 h-8" /></button>
        </div>
      </div>
    </div>
  );
};

export default ReservationsDashboard;