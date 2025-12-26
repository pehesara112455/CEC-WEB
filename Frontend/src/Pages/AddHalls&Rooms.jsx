import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./../Components/AdminNav.jsx";

//DATA TABLE COMPONENT 
const DataTable = ({ title, data, onAdd, type, onSearch, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleSearchClick = () => {
    setCurrentPage(1); 
    onSearch({ name: searchTerm, type: filterType });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#8B0000] uppercase tracking-wider">{title}</h2>
        <button 
          onClick={onAdd} 
          className="bg-[#8B0000] text-white px-6 py-2 rounded-md font-bold hover:bg-red-800 transition-all shadow-md active:scale-95"
        >
          ADD NEW
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${title.toLowerCase()} by name...`}
          className="flex-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#8B0000]/20 outline-none"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#8B0000]/20 outline-none"
        >
          <option value="All">All Types</option>
          <option value="A/C">A/C</option>
          <option value="Non A/C">Non A/C</option>
        </select>
        <button 
          onClick={handleSearchClick} 
          className="bg-[#8B0000] text-white p-2.5 rounded-md hover:bg-red-800 transition-all shadow-md px-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#8B0000] text-[#8B0000] font-bold">
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Capacity</th>
              <th className="py-3 px-2">Type</th>
              <th className="py-3 px-2">Extra Hrs</th>
              <th className="py-3 px-2 text-center">Image</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2 font-medium">{item.name}</td>
                  <td className="py-4 px-2 text-gray-600">{item.capacity}</td>
                  <td className="py-4 px-2 text-[#8B0000] font-semibold">{item.type}</td>
                  <td className="py-4 px-2 text-gray-600">{item.extraHour || "-"}</td>
                  <td className="py-4 px-2 text-center text-blue-500 italic underline cursor-pointer hover:text-blue-700">image</td>
                  <td className="py-4 px-2 font-semibold">Rs.{item.amount}</td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex justify-center gap-4 text-xl">
                      <button className="text-orange-500 hover:scale-125 transition-transform" title="Edit">✏️</button>
                      <button 
                        onClick={() => onDelete(type === 'hall' ? 'halls' : 'rooms', item.id)} 
                        className="text-red-500 hover:scale-125 transition-transform" 
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-20 text-center text-gray-400 italic">No matching items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  currentPage === i + 1 
                  ? "bg-[#8B0000] text-white shadow-lg scale-110" 
                  : "text-gray-400 hover:text-[#8B0000] hover:bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// MODAL COMPONENT
const Modal = ({ isOpen, onClose, title, onConfirm, children, onClear }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-110 
                      animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl">&times;</button>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-[#8B0000] text-center mb-6 uppercase tracking-tight">{title}</h3>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1">{children}</div>
          <div className="flex gap-4 mt-8">
            <button onClick={onClear} className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-lg active:scale-95 shadow">Clear</button>
            <button onClick={onConfirm} className="flex-1 bg-[#8B0000] text-white font-bold py-2.5 rounded-lg active:scale-95 shadow">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

//MAIN PAGE COMPONENT
const AddHallsRooms = () => {
  const [halls, setHalls] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hallFilter, setHallFilter] = useState({ name: "", type: "All" });
  const [roomFilter, setRoomFilter] = useState({ name: "", type: "All" });
  
  const [isHallModalOpen, setIsHallModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const initialForm = { name: "", capacity: "", type: "Non A/C", amount: "", extraHour: "" };
  const [formData, setFormData] = useState(initialForm);

  const sortData = (data) => {
    return data.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  };

  const fetchData = async () => {
    try {
      const hRes = await axios.get("http://localhost:5000/api/get-items/halls");
      const rRes = await axios.get("http://localhost:5000/api/get-items/rooms");
      setHalls(sortData(hRes.data));
      setRooms(sortData(rRes.data));
    } catch (err) { console.error("Error fetching data:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // DATA VALIDATION LOGIC
  const validateForm = (collectionName) => {
    const { name, capacity, amount } = formData;

    //Check for empty fields (except extraHour)
    if (!name.trim() || !capacity || !amount) {
      alert("Please fill in all required fields (Name, Capacity, and Amount).");
      return false;
    }

    //Check for unique name
    const currentList = collectionName === 'halls' ? halls : rooms;
    const isNameExists = currentList.some(
      item => item.name.toLowerCase() === name.toLowerCase().trim()
    );

    if (isNameExists) {
      alert(`A ${collectionName.slice(0, -1)} with the name "${name}" already exists. Please use a unique name.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (collectionName) => {
    // Run Validation
    if (!validateForm(collectionName)) return;

    try {
      await axios.post("http://localhost:5000/api/add-item", { ...formData, collectionType: collectionName });
      setFormData(initialForm);
      collectionName === 'halls' ? setIsHallModalOpen(false) : setIsRoomModalOpen(false);
      fetchData(); 
      alert(`${collectionName.toUpperCase()} added successfully!`);
    } catch (err) { alert("Error adding item."); }
  };

  const handleDelete = async (collection, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/delete-item/${collection}/${id}`);
        fetchData(); 
      } catch (err) { alert("Delete failed."); }
    }
  };

  const applyFilters = (dataList, filter) => {
    return dataList.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(filter.name.toLowerCase());
      const typeMatch = filter.type === "All" || item.type === filter.type;
      return nameMatch && typeMatch;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#FDF2F2]">
      <NavBar />
      <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <DataTable 
            title="HALLS" 
            data={applyFilters(halls, hallFilter)} 
            type="hall"
            onSearch={setHallFilter}
            onDelete={handleDelete}
            onAdd={() => { setFormData(initialForm); setIsHallModalOpen(true); }} 
          />
          <DataTable 
            title="ROOMS" 
            data={applyFilters(rooms, roomFilter)} 
            type="room"
            onSearch={setRoomFilter}
            onDelete={handleDelete}
            onAdd={() => { setFormData(initialForm); setIsRoomModalOpen(true); }} 
          />
        </div>
      </div>

      {/* HALL MODAL */}
      <Modal 
        isOpen={isHallModalOpen} onClose={() => setIsHallModalOpen(false)} 
        title="Add A New Hall" onConfirm={() => handleSubmit('halls')} 
        onClear={() => setFormData(initialForm)}
      >
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Hall Name *</label>
          <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20" />
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Capacity *</label>
          <input name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Type *</label>
          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none">
            <option value="Non A/C">Non A/C</option>
            <option value="A/C">A/C</option>
          </select>
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Extra Hour (Optional)</label>
          <input name="extraHour" value={formData.extraHour} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Amount *</label>
          <input name="amount" type="number" value={formData.amount} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none" />
        </div>
      </Modal>

      {/* ROOM MODAL */}
      <Modal 
        isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} 
        title="Add A New Room" onConfirm={() => handleSubmit('rooms')} 
        onClear={() => setFormData(initialForm)}
      >
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Room Name *</label>
          <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#8B0000]/20" />
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Capacity *</label>
          <input name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Type *</label>
          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none">
            <option value="Non A/C">Non A/C</option>
            <option value="A/C">A/C</option>
          </select>
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Extra Hour (Optional)</label>
          <input name="extraHour" value={formData.extraHour} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-[#8B0000] font-bold mb-1">Amount *</label>
          <input name="amount" type="number" value={formData.amount} onChange={handleInputChange} className="w-full border p-2 rounded-lg outline-none" />
        </div>
      </Modal>
    </div>
  );
};

export default AddHallsRooms;