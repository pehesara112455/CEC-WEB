import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import NavBar from './AdminNav';
import axios from 'axios';

const AddReservation = () => {
  // 1. Initialize state to capture input values
  const [formData, setFormData] = useState({
    CompanyName: '',
    Contact: '',
    DateFrom: '',
    DateTo: ''
  });

  // 2. Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Spreads existing data and updates only the field being typed in
    setFormData({ ...formData, [name]: value });
  };

  // 3. Function to send the data to the Node.js backend
  const handleSubmit = async () => {
    // Basic validation to ensure fields aren't empty
    if (!formData.CompanyName || !formData.Contact || !formData.DateFrom || !formData.DateTo) {
      alert("Please fill in all client details before saving.");
      return;
    }

    try {
      // POST request to your backend endpoint
      const response = await axios.post('http://localhost:5000/add-reservation', formData);
      alert("Reservation saved successfully! ID: " + response.data);
      
      // Optional: Clear form after success
      setFormData({ CompanyName: '', Contact: '', DateFrom: '', DateTo: '' });
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Failed to save. Make sure your backend server is running and CORS is enabled.");
    }
  };

  return (
    <div className='flex w-full min-h-screen bg-gray-50'>
      <NavBar />
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans border border-gray-100 m-4">
        
        {/* SECTION 1: CLIENT DETAILS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Company Name Input */}
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Company Name</label>
              <div className="relative flex-grow flex items-center">
                <input 
                  type="text"
                  name="CompanyName" // Matches key in state
                  value={formData.CompanyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 transition-colors" 
                />
              </div>
            </div>

            {/* Contact Input */}
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Contact</label>
              <input 
                type="text" 
                name="Contact" // Matches key in state
                value={formData.Contact}
                onChange={handleChange}
                placeholder="Phone number"
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 transition-colors" 
              />
            </div>

            {/* Date From Input */}
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Date - From</label>
              <div className="relative flex-grow">
                <input 
                  type="date" 
                  name="DateFrom" // Matches key in state
                  value={formData.DateFrom}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 transition-colors" 
                />
              </div>
            </div>

            {/* Date To Input */}
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Date - To</label>
              <div className="relative flex-grow">
                <input 
                  type="date" 
                  name="DateTo" // Matches key in state
                  value={formData.DateTo}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 transition-colors" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Red Divider Line */}
        <div className="h-1 bg-red-900 rounded-full mb-10"></div>

        {/* SECTION 2: ROOMS AND HALLS */}
        <section>
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Rooms and Halls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Room / Hall</label>
              <div className="relative flex-grow">
                <select className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 pr-10">
                  <option value="">Select</option>
                  <option value="hall-a">Main Hall</option>
                  <option value="room-1">Luxury Room</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Quantity</label>
              <input type="number" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" />
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <button className="bg-red-900 text-white p-2.5 rounded-full hover:bg-red-800 shadow-md transition-transform hover:scale-110">
              <Plus className="w-6 h-6 stroke-[3px]" />
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-gray-900 font-bold border-b-2 border-gray-100">
                  <th className="py-3 px-4">Room/ Hall</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4 text-center">Per Unit</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#F8F1F1] border-b border-gray-100">
                  <td className="py-3 px-4">Sample Hall</td>
                  <td className="py-3 px-4">AC</td>
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4 text-center">50,000</td>
                  <td className="py-3 px-4">50,000</td>
                  <td className="py-3 px-4 text-right"><X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-600" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-end">
          <button 
            onClick={handleSubmit} 
            className="bg-red-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-800 shadow-lg transition-all active:scale-95"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReservation;