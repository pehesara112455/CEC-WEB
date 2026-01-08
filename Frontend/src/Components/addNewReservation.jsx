import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import axios from 'axios';

const AddReservation = ({ onNext, savedData }) => {
  // MASTER STATE: Maintains the primary reservation data
  const [formData, setFormData] = useState({
    CompanyName: savedData?.CompanyName || '',
    Contact: savedData?.Contact || '',
    DateFrom: savedData?.DateFrom || '',
    DateTo: savedData?.DateTo || '',
    Rooms: savedData?.Rooms || []
  });

  // LOCAL STATE: Temporary storage for room input fields
  const [roomsData, setRoomsData] = useState({
    RoomName: '',
    DateFrom: '',
    DateTo: ''
  });

  // AVAILABILITY STATE: Tracks occupied rooms from the backend and master inventory
  const [allRooms] = useState(["Main Hall", "Luxury Room", "Conference Room B"]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  /**
   * SIDE EFFECT: Fetches occupied rooms whenever the main date range changes.
   * This ensures the availability list is always synchronized with the selected dates.
   */
  useEffect(() => {
    const checkAvailability = async () => {
      // Only proceed if both dates are selected
      if (formData.DateFrom && formData.DateTo) {
        setIsLoadingAvailability(true);
        try {
          const response = await axios.get('http://localhost:5000/check-availability', {
            params: { 
              startDate: formData.DateFrom, 
              endDate: formData.DateTo 
            }
          });
          setOccupiedRooms(response.data);
        } catch (error) {
          console.error("Availability Check Failed:", error.message);
        } finally {
          setIsLoadingAvailability(false);
        }
      }
    };

    checkAvailability();
  }, [formData.DateFrom, formData.DateTo]);

  /**
   * DATA TRANSFORMATION: Filters the master room list against occupied results.
   */
  const availableOptions = allRooms.filter(room => !occupiedRooms.includes(room));

  /**
   * Validates and processes top-level client detail changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Contact") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Handles local state updates for the room addition form.
   */
  const addRoomsInputs = (e) => {
    const { name, value } = e.target;
    setRoomsData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Commits the temporary room data to the master Rooms array.
   */
  const addRooms = () => {
    if (!roomsData.RoomName) return alert("Please select a room.");
    
    setFormData(prev => ({
      ...prev,
      Rooms: [...(prev.Rooms || []), roomsData]
    }));

    setRoomsData({ RoomName: '', DateFrom: '', DateTo: '' });
  };

  /**
   * Transition to the next stage of the reservation process.
   */
  const handelNext = () => {
    if (formData.Rooms.length === 0) {
      alert("Please add at least one room before proceeding.");
      return;
    }
    onNext(formData);
  };

  return (
    <div className='flex w-full min-h-screen bg-gray-50'>
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans border border-gray-100 m-4">
        
        {/* SECTION 1: CLIENT DETAILS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Company Name</label>
              <input 
                type="text" 
                name="CompanyName" 
                value={formData.CompanyName} 
                onChange={handleChange}
                placeholder="Enter Company Name"
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 transition-colors" 
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Contact</label>
              <input 
                type="text" 
                name="Contact" 
                value={formData.Contact} 
                onChange={handleChange}
                placeholder="Phone number"
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 transition-colors" 
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Date - From</label>
              <input 
                type="date" 
                name="DateFrom" 
                value={formData.DateFrom} 
                onChange={handleChange}
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" 
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Date - To</label>
              <input 
                type="date" 
                name="DateTo" 
                value={formData.DateTo} 
                min={formData.DateFrom}
                onChange={handleChange}
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" 
              />
            </div>
          </div>
        </section>

        <div className="h-1 bg-red-900 rounded-full mb-10"></div>

        {/* SECTION 2: ROOMS AND HALLS */}
        <section>
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Rooms and Halls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Room / Hall</label>
              <div className="relative flex-grow">
                <select 
                  name='RoomName' 
                  value={roomsData.RoomName}
                  onChange={addRoomsInputs}
                  disabled={!formData.DateFrom || !formData.DateTo || isLoadingAvailability}
                  className={`w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900 pr-10 ${!formData.DateFrom ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                  <option value="">{isLoadingAvailability ? 'Checking availability...' : 'Select Available Room'}</option>
                  {availableOptions.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Room Date Selection stays within the range of main dates */}
            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Date From</label>
              <input 
                type="date" 
                name='DateFrom' 
                value={roomsData.DateFrom} 
                min={formData.DateFrom}
                max={formData.DateTo}
                onChange={addRoomsInputs}
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" 
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-36 text-gray-700 font-semibold">Date To</label>
              <input 
                type="date" 
                name='DateTo' 
                value={roomsData.DateTo} 
                min={roomsData.DateFrom || formData.DateFrom}
                max={formData.DateTo}
                onChange={addRoomsInputs}
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-red-900" 
              />
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <button onClick={addRooms} className="bg-red-900 text-white p-2.5 rounded-full hover:bg-red-800 shadow-md transition-transform hover:scale-110">
              <Plus className="w-6 h-6 stroke-[3px]" />
            </button>
          </div>

          {/* DYNAMIC ROOMS TABLE */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-gray-900 font-bold border-b-2 border-gray-100">
                  <th className="py-3 px-4">Room/ Hall</th>
                  <th className="py-3 px-4">From</th>
                  <th className="py-3 px-4">To</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {formData.Rooms.map((room, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#F8F1F1]" : "bg-white"}>
                    <td className="py-3 px-4">{room.RoomName}</td>
                    <td className="py-3 px-4">{room.DateFrom}</td>
                    <td className="py-3 px-4">{room.DateTo}</td>
                    <td className="py-3 px-4 text-right">
                      <X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-12 flex justify-end">
          <button onClick={handelNext} className="bg-red-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-800 shadow-lg transition-all active:scale-95">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReservation;