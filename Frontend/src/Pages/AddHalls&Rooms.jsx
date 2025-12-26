import React, { useState } from "react";
import NavBar from "./../Components/AdminNav.jsx";

const AddHallsRooms = () => {
  // Modal states
  const [isHallModalOpen, setIsHallModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Mock Data (To be replaced by your backend later)
  const halls = [
    { id: "hall000", name: "hall000", cap: 100, type: "Non A/C", extra: 1000, amount: 15500 },
    { id: "hall001", name: "hall001", cap: 55, type: "A/C", extra: "-", amount: 13500 },
  ];

  const rooms = [
    { id: "room001", name: "room001", cap: 2, type: "Non A/C", amount: 3000 },
    { id: "room002", name: "room002", cap: 1, type: "A/C", amount: 4000 },
  ];

  // Reusable Table Component for UI consistency
  const DataTable = ({ title, data, onAdd, type }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#8B0000] uppercase tracking-wider">{title}</h2>
        <button 
          onClick={onAdd}
          className="bg-[#8B0000] text-white px-4 py-2 rounded-md font-bold hover:bg-red-800 transition-colors shadow-md text-sm"
        >
          ADD NEW
        </button>
      </div>
      
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#8B0000] text-[#8B0000] font-bold">
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Capacity</th>
              <th className="py-3 px-2">Type</th>
              {type === 'hall' && <th className="py-3 px-2">Extra Hrs</th>}
              <th className="py-3 px-2">Image</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-gray-700">
                <td className="py-4 px-2">{item.name}</td>
                <td className="py-4 px-2">{item.cap}</td>
                <td className="py-4 px-2 text-[#8B0000]">{item.type}</td>
                {type === 'hall' && <td className="py-4 px-2">{item.extra}</td>}
                <td className="py-4 px-2 text-blue-500 italic underline cursor-pointer">image</td>
                <td className="py-4 px-2">{item.amount}</td>
                <td className="py-4 px-2 flex gap-3">
                  <button className="text-orange-500 hover:scale-110">✏️</button>
                  <button className="text-red-500 hover:scale-110">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Reusable Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl">×</button>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-[#8B0000] text-center mb-6 uppercase">{title}</h3>
            {children}
            <div className="flex gap-4 mt-8">
              <button onClick={onClose} className="flex-1 bg-orange-500 text-white font-bold py-2 rounded shadow hover:bg-orange-600 transition-colors">Clear</button>
              <button className="flex-1 bg-[#8B0000] text-white font-bold py-2 rounded shadow hover:bg-red-900 transition-colors">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDF2F2]">
      <NavBar />
      
      {/* Main Content Area - Responsive padding adjusted for the floating burger button */}
      <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          
          <DataTable 
            title="HALLS" 
            data={halls} 
            type="hall"
            onAdd={() => setIsHallModalOpen(true)} 
          />
          
          <DataTable 
            title="ROOMS" 
            data={rooms} 
            type="room"
            onAdd={() => setIsRoomModalOpen(true)} 
          />

        </div>
      </div>

      {/* --- HALL MODAL --- */}
      <Modal isOpen={isHallModalOpen} onClose={() => setIsHallModalOpen(false)} title="Add A New Hall">
        <div className="space-y-4">
          <div><label className="block text-[#8B0000] font-bold mb-1">Hall Name</label><input className="w-full border p-2 rounded" /></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Capacity</label><input className="w-full border p-2 rounded" /></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Type</label><select className="w-full border p-2 rounded"><option>A/C</option><option>Non A/C</option></select></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Extra Hour (Optional)</label><input className="w-full border p-2 rounded" /></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Amount</label><input className="w-full border p-2 rounded" /></div>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded text-center text-gray-400">📷 Upload Image</div>
        </div>
      </Modal>

      {/* --- ROOM MODAL --- */}
      <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title="Add A New Room">
        <div className="space-y-4">
          <div><label className="block text-[#8B0000] font-bold mb-1">Room Name</label><input className="w-full border p-2 rounded" /></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Capacity</label><input className="w-full border p-2 rounded" /></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Type</label><select className="w-full border p-2 rounded"><option>A/C</option><option>Non A/C</option></select></div>
          <div><label className="block text-[#8B0000] font-bold mb-1">Amount</label><input className="w-full border p-2 rounded" /></div>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded text-center text-gray-400">📷 Upload Image</div>
        </div>
      </Modal>
    </div>
  );
};

export default AddHallsRooms;