import React, { useState } from 'react';
// IMPORT CHANGED: Use your custom axios instance to automatically attach the login token
import axiosInstance from '../api/axiosInstance'; 

const AddNewClient = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactNumber: '',
    address: '',
    email: '',
    type: '',
    contactPerson: '',
    secondaryContact: '',
    nic: ''
  });

  const [loading, setLoading] = useState(false);

  // 1. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Reset Form
  const handleClear = () => {
    setFormData({
      companyName: '',
      contactNumber: '',
      address: '',
      email: '',
      type: '',
      contactPerson: '',
      secondaryContact: '',
      nic: ''
    });
  };

  // 3. Submit Data to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // URL CHANGED: Pointing to the correct, protected backend route using the instance
      const response = await axiosInstance.post('/api/clients/add-client', formData);
      
      // If successful:
      alert(`Success! Client ID: ${response.data.id}`);
      handleClear();
      
      // If this component is being used as a popup, tell the parent to close it
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Server Error Response:", error.response?.data);
      alert("Backend Error: " + (error.response?.data?.error || "Unknown Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-10 font-sans shadow-lg">
        
        {/* TITLE */}
        <h1 className="text-3xl font-black text-red-900 text-center uppercase tracking-wider mb-12">
          ADD A NEW CLIENT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: COMPANY DETAILS */}
          <div>
            <h2 className="text-sm font-black text-black uppercase mb-6 tracking-tight">
              COMPANY / ORGANIZATION DETAILS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center">
                <label className="w-40 text-sm font-semibold text-gray-700">Company Name</label>
                <input 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-sm font-semibold text-gray-700">Contact Number</label>
                <input 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX"
                  className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-sm font-semibold text-gray-700">Address</label>
                <input 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-sm font-semibold text-gray-700">E-mail</label>
                <input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-sm font-semibold text-gray-700">Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
            </div>
          </div>

          {/* RED DIVIDER LINE */}
          <div className="border-t-[3px] border-red-900 my-8"></div>

          {/* SECTION 2: PERSONAL DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-gray-700">Contact person</label>
              <input 
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Manager/Owner name"
                className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-gray-700">Contact Number</label>
              <input 
                name="secondaryContact"
                value={formData.secondaryContact}
                onChange={handleChange}
                placeholder="Secondary phone"
                className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-gray-700 uppercase">NIC</label>
              <input 
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="NIC number"
                className="flex-1 border border-black rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-red-900 shadow-sm"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-12">
            <button 
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="bg-[#C87600] text-white px-10 py-2 rounded-lg font-bold shadow-md hover:bg-[#A66200] transition-colors active:scale-95 disabled:opacity-50"
            >
              Clear
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-red-900 text-white px-10 py-2 rounded-lg font-bold shadow-md hover:bg-red-800 transition-colors active:scale-95 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddNewClient;