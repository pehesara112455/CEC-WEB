import React from 'react';
import { Plus, X, Calendar, ChevronDown } from 'lucide-react';
import NavBar from './AdminNav';

const AddReservation = () => {
  return ( 
    <div className='flex w-full'>
        <NavBar/>
         <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans border border-gray-100">
      
      {/* SECTION 1: CLIENT DETAILS */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Client Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          
          {/* Company Name */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Company Name</label>
            <div className="relative flex-grow flex items-center">
              <select className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 pr-10">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-10 w-5 h-5 text-gray-500 pointer-events-none" />
              <button className="ml-3 text-gray-800 hover:text-red-900 transition-colors">
                <Plus className="w-6 h-6 border-2 border-gray-800 rounded-full p-0.5" />
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Contact</label>
            <input type="text" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" />
          </div>

          {/* Date From */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Date - From</label>
            <div className="relative flex-grow">
              <input type="date" className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" />
            </div>
          </div>

          {/* Date To */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Date - To</label>
            <div className="relative flex-grow">
              <input type="date" className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" />
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
          
          {/* Room / Hall Selection */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Room / Hall</label>
            <div className="relative flex-grow">
              <select className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 pr-10">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-3 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Quantity</label>
            <input type="number" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" />
          </div>

          {/* Type */}
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-700 font-semibold">Type</label>
            <div className="relative flex-grow">
              <select className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 pr-10">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-3 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="flex justify-end mb-8">
          <button className="bg-red-900 text-white p-2.5 rounded-full hover:bg-red-800 shadow-md transition-transform hover:scale-110">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {/* Summary Table */}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-left">
            <thead>
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
              {/* Row 1 (Pink background) */}
              <tr className="bg-[#F8F1F1]">
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-center">
                  <div className="inline-block w-24 h-8 border-2 border-gray-400 bg-white rounded-full"></div>
                </td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-right">
                  <X className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-600" />
                </td>
              </tr>
              {/* Row 2 (White background) */}
              <tr className="bg-white">
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-center">
                  <div className="inline-block w-24 h-8 border-2 border-gray-400 bg-white rounded-full"></div>
                </td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-right">
                  <X className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-600" />
                </td>
              </tr>
              {/* Row 3 (Pink background) */}
              <tr className="bg-[#F8F1F1]">
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-center">
                  <div className="inline-block w-24 h-8 border-2 border-gray-400 bg-white rounded-full"></div>
                </td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-right">
                  <X className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-600" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Actions */}
      <div className="mt-12 flex justify-end">
        <button className="bg-gray-500 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-gray-600 shadow-md transition-colors">
          Next
        </button>
      </div>
    </div>
    </div>
   
  );
};

export default AddReservation;