import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, ChevronDown, Plus } from 'lucide-react';
import NavBar from './AdminNav';

const EditReservation = () => {
  // Mock data for an existing reservation
  const [resId] = useState("RES-2023-001");
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Grand Hall', type: 'Wedding', qty: 1, extraHours: 2, extraAmount: 500, perUnit: 5000, total: 5500 },
    { id: 2, name: 'Deluxe Room', type: 'Stay', qty: 2, extraHours: 0, extraAmount: 0, perUnit: 2500, total: 5000 },
  ]);

  return (

    <div className='flex w-full'>
        <NavBar/>
         <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans text-gray-800">
      
      {/* Reservation ID Header */}
      <div className="flex items-center gap-4 mb-10">
        <label className="text-lg font-bold text-gray-700">Res-ID</label>
        <input 
          type="text" 
          value={resId} 
          readOnly 
          className="border-2 border-red-800 rounded-lg px-4 py-1 text-red-900 font-bold bg-gray-50 outline-none w-48 shadow-inner"
        />
      </div>

      {/* SECTION 1: CLIENT DETAILS */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Client Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          
          <div className="flex items-center gap-4">
            <label className="w-36 font-semibold">Company Name</label>
            <div className="relative flex-grow">
              <select className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 appearance-none focus:border-red-900 outline-none">
                <option>Acme Corporation</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-36 font-semibold">Contact</label>
            <input type="text" defaultValue="0771234567" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-16 font-semibold">Date</label>
            <label className="w-16 text-gray-500">From</label>
            <div className="relative flex-grow">
              <input type="date" defaultValue="2023-12-22" className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-16 text-gray-500">To</label>
            <div className="relative flex-grow">
              <input type="date" defaultValue="2023-12-24" className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Red Divider Line */}
      <div className="h-1 bg-red-900 rounded-full mb-10"></div>

      {/* SECTION 2: ROOMS AND HALLS */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-red-900 uppercase tracking-wide">Rooms and Halls</h2>
          <button className="bg-red-900 text-white px-8 py-1.5 rounded-lg font-bold hover:bg-red-800 transition-colors shadow-md">
            Add
          </button>
        </div>

        {/* Dynamic Edit Table */}
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-900 font-bold border-b-2 border-gray-100 bg-gray-50">
                <th className="py-4 px-4">Room/ Hall</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Qty</th>
                <th className="py-4 px-4">Extra Hours</th>
                <th className="py-4 px-4">Extra Amount</th>
                <th className="py-4 px-4">Per Unit</th>
                <th className="py-4 px-4">Total Amount</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={room.id} className={index % 2 === 0 ? "bg-[#F8F1F1]" : "bg-white"}>
                  <td className="py-4 px-4">{room.name}</td>
                  <td className="py-4 px-4">{room.type}</td>
                  <td className="py-4 px-4">{room.qty}</td>
                  <td className="py-4 px-4">{room.extraHours}</td>
                  <td className="py-4 px-4">{room.extraAmount}</td>
                  <td className="py-4 px-4">{room.perUnit}</td>
                  <td className="py-4 px-4 font-bold">{room.total}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-4 justify-end">
                      <button className="text-gray-800 hover:text-blue-600 transition-colors">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button className="text-gray-800 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Actions */}
      <div className="mt-16 flex justify-end">
        <button className="bg-red-900 text-white px-12 py-3 rounded-xl font-bold hover:bg-red-800 shadow-md transition-all active:scale-95">
          Next
        </button>
      </div>
    </div>
    </div>
   
  );
};

export default EditReservation;