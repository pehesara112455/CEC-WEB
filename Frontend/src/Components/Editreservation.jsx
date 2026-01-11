import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import axios from 'axios';

const EditReservation = ({ onNext, onCancel, savedData }) => {
  // 1. MASTER STATE: Initialize with empty Rooms array to be filled by fetch
  const [formData, setFormData] = useState({
    CompanyName: savedData?.CompanyName || '',
    Contact: savedData?.Contact || '',
    DateFrom: savedData?.DateFrom || '',
    DateTo: savedData?.DateTo || '',
    Rooms: [], 
    displayId: savedData?.displayId || ''
  });

  const [roomsData, setRoomsData] = useState({
    RoomName: '', DateFrom: '', DateTo: '', PricePerDay: 0, Amount: 0
  });

  const [dbRooms, setDbRooms] = useState([]); 
  const [occupiedRooms, setOccupiedRooms] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // FETCH EFFECT 1: Load all room types for the dropdown
  useEffect(() => {
    const fetchRoomPrices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-all-rooms');
        setDbRooms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load room prices:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomPrices();
  }, []);

  // NEW FETCH EFFECT 2: Fetch existing rooms from the Firestore subcollection
  useEffect(() => {
    const fetchExistingRooms = async () => {
      if (savedData?.displayId) {
        try {
          // You must have this route in your backend to query the subcollection
          const response = await axios.get(`http://localhost:5000/get-reservation-rooms/${savedData.displayId}`);
          setFormData(prev => ({
            ...prev,
            Rooms: response.data || [] // Fills the table with saved rooms from DB
          }));
        } catch (error) {
          console.error("Error fetching sub-collection rooms:", error);
        }
      }
    };
    fetchExistingRooms();
  }, [savedData?.displayId]);

  // AVAILABILITY EFFECT (Remains same)
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

  const addRoomsInputs = (e) => {
    const { name, value } = e.target;
    setRoomsData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'RoomName') {
        const roomInfo = dbRooms.find(r => r.name === value);
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
      return alert("Please select a room and set valid dates.");
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
    <div className='flex w-full min-h-screen bg-gray-50'>
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans border border-gray-100 m-4">
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-red-900 uppercase tracking-wide">Edit Reservation: {formData.displayId}</h2>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Stage 1 of 2</span>
        </div>

        {/* CLIENT DETAILS SECTION */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Company Name</label>
              <input type="text" name="CompanyName" value={formData.CompanyName} onChange={handleChange} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Contact</label>
              <input type="text" name="Contact" value={formData.Contact} onChange={handleChange} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Overall - From</label>
              <input type="date" name="DateFrom" value={formData.DateFrom} onChange={handleChange} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Overall - To</label>
              <input type="date" name="DateTo" value={formData.DateTo} min={formData.DateFrom} onChange={handleChange} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
          </div>
        </section>

        <div className="h-1 bg-red-900 rounded-full mb-10 opacity-20"></div>

        {/* ROOM SELECTION SECTION */}
        <section>
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Rooms and Halls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6 bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Room / Hall</label>
              <div className="relative flex-grow">
                <select name='RoomName' value={roomsData.RoomName} onChange={addRoomsInputs} disabled={isLoading || !formData.DateFrom} className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none pr-10 bg-white text-sm">
                  <option value="">{isLoading ? "Fetching..." : !formData.DateFrom ? "Set Overall Dates First" : "Select Available Room"}</option>
                  {availableOptions.map(room => (
                    <option key={room.name} value={room.name}>{room.name} (LKR {room.amount?.toLocaleString()})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-44 text-red-900 font-bold uppercase text-xs italic">Est. Room Total</label>
              <div className="text-xl font-black text-red-900">LKR {(roomsData.Amount || 0).toLocaleString()}</div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Room Date From</label>
              <input type="date" name='DateFrom' value={roomsData.DateFrom} min={formData.DateFrom} max={formData.DateTo} onChange={addRoomsInputs} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none text-sm" />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold text-sm">Room Date To</label>
              <input type="date" name='DateTo' value={roomsData.DateTo} min={roomsData.DateFrom || formData.DateFrom} max={formData.DateTo} onChange={addRoomsInputs} className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none text-sm" />
            </div>

            <div className="md:col-span-2 flex justify-end">
                <button onClick={addRooms} className="bg-red-900 text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-red-800 shadow-md transition-all active:scale-95">
                  <Plus size={18} /> <span className="font-bold text-sm">Add Room</span>
                </button>
            </div>
          </div>

          {/* TABLE DISPLAY */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
                <tr className="font-bold border-b-2 border-gray-200">
                  <th className="py-3 px-4">Room/ Hall</th>
                  <th className="py-3 px-4 text-center">Daily Rate</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-red-900">Total Amount</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {formData.Rooms.map((room, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 font-semibold text-sm">{room.RoomName}</td>
                    <td className="py-3 px-4 text-center text-sm">LKR {(room.PricePerDay || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600 italic text-xs">{room.DateFrom || formData.DateFrom} to {room.DateTo || formData.DateTo}</td>
                    <td className="py-3 px-4 font-bold text-red-900 text-sm">LKR {(room.Amount || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <X onClick={() => removeRoom(index)} className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-12 flex justify-end gap-4">
          <button onClick={onCancel} className="px-10 py-3 rounded-xl font-bold border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all">Cancel</button>
          <button onClick={() => onNext(formData)} className="bg-red-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-800 shadow-lg transition-all active:scale-95">Next: Edit Meals & Services</button>
        </div>
      </div>
    </div>
  );
};

export default EditReservation;