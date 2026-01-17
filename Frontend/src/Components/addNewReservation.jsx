import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, PlusCircle } from 'lucide-react';
import axios from 'axios';
import AddNewClient from './AddNewClient'; 

const AddReservation = ({ onNext, savedData }) => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [dbRooms, setDbRooms] = useState([]); 
  const [occupiedRooms, setOccupiedRooms] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    CompanyName: savedData?.CompanyName || '',
    Contact: savedData?.Contact || '',
    DateFrom: savedData?.DateFrom || '',
    DateTo: savedData?.DateTo || '',
    Rooms: savedData?.Rooms || []
  });

  const [roomsData, setRoomsData] = useState({
    RoomName: '',
    DateFrom: '',
    DateTo: '',
    PricePerDay: 0,
    Amount: 0
  });

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-all-clients');
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // --- UPDATED FETCH LOGIC ---
  useEffect(() => {
    const fetchAllAccommodations = async () => {
      try {
        // Fetch both Rooms and Halls simultaneously
        const [roomsRes, hallsRes] = await Promise.all([
          axios.get('http://localhost:5000/get-all-rooms'),
          axios.get('http://localhost:5000/get-all-halls')
        ]);

        const rooms = Array.isArray(roomsRes.data) ? roomsRes.data : [];
        const halls = Array.isArray(hallsRes.data) ? hallsRes.data : [];

        // Combine them into one array for the dropdown
        setDbRooms([...rooms, ...halls]);
      } catch (error) {
        console.error("Failed to load accommodations:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllAccommodations();
    fetchClients();
  }, []);

  // ... (Availability effect and Math logic remain the same)
  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.DateFrom && formData.DateTo) {
        try {
          const response = await axios.get('http://localhost:5000/check-availability', {
            params: { startDate: formData.DateFrom, endDate: formData.DateTo }
          });
          setOccupiedRooms(response.data); 
        } catch (error) {
          console.error("Availability Check Failed:", error.message);
        }
      }
    };
    checkAvailability();
  }, [formData.DateFrom, formData.DateTo]);

  const calculateTotal = (price, start, end) => {
    if (!price || !start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return days > 0 ? days * price : 0;
  };

  const grandTotal = formData.Rooms.reduce((sum, room) => sum + (Number(room.Amount) || 0), 0);

  const addRoomsInputs = (e) => {
    const { name, value } = e.target;
    setRoomsData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'RoomName') {
        const roomInfo = dbRooms.find(r => r.name === value);
        // Matching 'amount' field from your Firestore Halls screenshot
        updated.PricePerDay = roomInfo ? roomInfo.amount : 0;
      }
      updated.Amount = calculateTotal(
        updated.PricePerDay, 
        updated.DateFrom || formData.DateFrom, 
        updated.DateTo || formData.DateTo
      );
      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Contact") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRooms = () => {
    if (!roomsData.RoomName || roomsData.Amount <= 0) {
      return alert("Please select a room/hall and set valid dates.");
    }
    setFormData(prev => ({
      ...prev,
      Rooms: [...(prev.Rooms || []), { ...roomsData }]
    }));
    setRoomsData({ RoomName: '', DateFrom: '', DateTo: '', PricePerDay: 0, Amount: 0 });
  };

  const removeRoom = (index) => {
    setFormData(prev => ({
      ...prev,
      Rooms: prev.Rooms.filter((_, i) => i !== index)
    }));
  };

  const availableOptions = dbRooms.filter(room => !occupiedRooms.includes(room.name));

  return (
    <div className='flex w-full min-h-screen bg-gray-50 relative'>
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans border border-gray-100 m-4">
        
        {/* CLIENT DETAILS SECTION */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Company Name</label>
              <div className="flex-grow flex items-center gap-2">
                <select 
                  name="CompanyName" 
                  value={formData.CompanyName} 
                  onChange={handleChange} 
                  className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none bg-white cursor-pointer"
                >
                  <option value="">Select a Company</option>
                  {clients.map((client) => (
                    <option key={client.clientId} value={client.companyName}>
                      {client.companyName}
                    </option>
                  ))}
                </select>
                <button 
                  type="button"
                  onClick={() => setIsClientModalOpen(true)} 
                  className="text-gray-800 hover:text-red-900 transition-colors"
                  title="Add New Client"
                >
                  <PlusCircle size={28} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <label className="w-36 text-gray-700 font-semibold">Contact</label>
               <input type="text" name="Contact" value={formData.Contact} onChange={handleChange} placeholder="07XXXXXXXX" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
             </div>
             <div className="flex items-center gap-4">
               <label className="w-36 text-gray-700 font-semibold">Overall - From</label>
               <input type="date" name="DateFrom" value={formData.DateFrom} onChange={handleChange} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
             </div>
             <div className="flex items-center gap-4">
               <label className="w-36 text-gray-700 font-semibold">Overall - To</label>
               <input type="date" name="DateTo" value={formData.DateTo} min={formData.DateFrom} onChange={handleChange} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
             </div>
          </div>
        </section>

        <div className="h-1 bg-red-900 rounded-full mb-10"></div>

        {/* ROOM & HALL SELECTION SECTION */}
        <section>
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Rooms and Halls</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
             <div className="flex items-center gap-4">
               <label className="w-36 text-gray-700 font-semibold">Room / Hall</label>
               <div className="relative flex-grow">
                 <select name='RoomName' value={roomsData.RoomName} onChange={addRoomsInputs} disabled={isLoading || !formData.DateFrom} className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none pr-10">
                   <option value="">{isLoading ? "Fetching..." : !formData.DateFrom ? "Set Overall Dates First" : "Select Room or Hall"}</option>
                   {availableOptions.map(option => (
                     <option key={option.name} value={option.name}>
                         {option.name} (LKR {option.amount?.toLocaleString()})
                     </option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
               </div>
             </div>
             <div className="flex items-center gap-4">
               <label className="w-44 text-red-900 font-bold uppercase text-sm italic">Est. Total</label>
               <div className="text-2xl font-black text-red-900">
                 LKR {(roomsData.Amount || 0).toLocaleString()}
               </div>
             </div>
             <div className="flex items-center gap-4">
               <label className="w-36 text-gray-700 font-semibold">Date From</label>
               <input type="date" name='DateFrom' value={roomsData.DateFrom} min={formData.DateFrom} max={formData.DateTo} onChange={addRoomsInputs} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
             </div>
             <div className="flex items-center gap-4">
               <label className="w-36 text-gray-700 font-semibold">Date To</label>
               <input type="date" name='DateTo' value={roomsData.DateTo} min={roomsData.DateFrom || formData.DateFrom} max={formData.DateTo} onChange={addRoomsInputs} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
             </div>
           </div>
           {/* Table and Modal logic remain exactly as you provided */}
           <div className="flex justify-end mb-8">
             <button onClick={addRooms} className="bg-red-900 text-white p-2.5 rounded-full hover:bg-red-800 shadow-md transition-transform hover:scale-110">
               <Plus className="w-6 h-6 stroke-[3px]" />
             </button>
           </div>
           <div className="overflow-hidden rounded-lg border border-gray-200">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-gray-900 uppercase text-xs">
                 <tr className="font-bold border-b-2 border-gray-100">
                   <th className="py-3 px-4">Room/ Hall</th>
                   <th className="py-3 px-4 text-center">Daily Rate</th>
                   <th className="py-3 px-4">Period</th>
                   <th className="py-3 px-4 text-red-900">Total Amount</th>
                   <th className="py-3 px-4"></th>
                 </tr>
               </thead>
               <tbody>
                 {formData.Rooms.map((room, index) => (
                   <tr key={index} className={index % 2 === 0 ? "bg-[#F8F1F1]" : "bg-white"}>
                     <td className="py-3 px-4 font-semibold">{room.RoomName}</td>
                     <td className="py-3 px-4 text-center">LKR {(room.PricePerDay || 0).toLocaleString()}</td>
                     <td className="py-3 px-4 text-gray-600 italic">{room.DateFrom || formData.DateFrom} to {room.DateTo || formData.DateTo}</td>
                     <td className="py-3 px-4 font-bold text-red-900">LKR {(room.Amount || 0).toLocaleString()}</td>
                     <td className="py-3 px-4 text-right">
                       <X onClick={() => removeRoom(index)} className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-600" />
                     </td>
                   </tr>
                 ))}
               </tbody>
               {formData.Rooms.length > 0 && (
                 <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                   <tr>
                     <td colSpan="3" className="py-4 px-4 text-right font-bold text-gray-700 uppercase text-sm">Total Cost:</td>
                     <td className="py-4 px-4 font-black text-xl text-red-900">LKR {grandTotal.toLocaleString()}</td>
                     <td></td>
                   </tr>
                 </tfoot>
               )}
             </table>
           </div>
        </section>

        <div className="mt-12 flex justify-end">
          <button 
            onClick={() => onNext({ ...formData, TotalRoomAmount: grandTotal })} 
            className="bg-red-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-800 shadow-lg transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      </div>

      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsClientModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-900 transition-colors z-10"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <AddNewClient onSuccess={() => {
              setIsClientModalOpen(false);
              fetchClients();
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReservation;