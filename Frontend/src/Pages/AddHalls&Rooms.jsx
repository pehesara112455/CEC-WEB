import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import NavBar from "./../Components/AdminNav.jsx";

// DATA TABLE COMPONENT
const DataTable = ({ title, data, onAdd, type, onSearch, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleFilterChange = (newSearchTerm, newFilterType) => {
    setCurrentPage(1);
    onSearch({ name: newSearchTerm, type: newFilterType });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#8B0000] uppercase tracking-wider">{title}</h2>
        <button onClick={onAdd} className="bg-[#8B0000] text-white px-6 py-2 rounded-md font-bold hover:bg-red-800 transition-all shadow-md active:scale-95">
          ADD NEW
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-end">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            handleFilterChange(searchTerm, e.target.value);
          }}
          className="w-full md:w-48 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition-all text-gray-600 font-medium"
        >
          <option value="All">All Types</option>
          <option value="A/C">A/C</option>
          <option value="Non A/C">Non A/C</option>
        </select>

        <div className="relative group w-full md:w-72">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilterChange(e.target.value, filterType);
            }}
            className="w-full pl-5 pr-10 py-2 rounded-md border border-gray-300 text-gray-600 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition-all font-medium"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
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
                  <td className="py-4 px-2 font-bold text-gray-800">{item.name}</td>
                  <td className="py-4 px-2 text-gray-600 font-medium">{item.capacity}</td>
                  <td className="py-4 px-2 text-[#8B0000] font-bold">{item.type}</td>
                  <td className="py-4 px-2 text-gray-600 font-medium">{item.extraHour || "-"}</td>
                  <td className="py-4 px-2 text-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mx-auto shadow-sm border border-gray-200" />
                    ) : (
                      <span className="text-gray-400 italic text-sm">No Image</span>
                    )}
                  </td>
                  <td className="py-4 px-2 font-black text-gray-800">Rs.{Number(item.amount).toLocaleString()}</td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex justify-center gap-4 text-xl">
                      <button onClick={() => onEdit(item, type)} className="text-orange-500 hover:scale-125 transition-transform" title="Edit">✏️</button>
                      <button onClick={() => onDelete(type === "hall" ? "halls" : "rooms", item.id)} className="text-red-500 hover:scale-125 transition-transform" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-20 text-center text-gray-400 font-medium italic">No matching items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CUSTOM PAGINATION UI */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-gray-100 pt-6">
          <span className="text-sm font-bold text-gray-400 tracking-wide">
            Page {currentPage} of {totalPages}
          </span>
          
          <div className="flex gap-2">
            {/* Previous Page Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Numbered Page Buttons */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-md font-bold text-sm transition-all duration-200 shadow-sm ${
                  currentPage === i + 1 
                    ? "bg-[#D31225] text-white" 
                    : "bg-[#8E8E8E] text-white hover:bg-gray-500"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// MODAL COMPONENT
const Modal = ({ isOpen, onClose, title, onConfirm, children, onClear, submitText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-[110] animate-in zoom-in-95 slide-in-from-bottom-8 fade-in duration-500 ease-out">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl">&times;</button>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-[#8B0000] text-center mb-6 uppercase tracking-tight">{title}</h3>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1">{children}</div>
          <div className="flex gap-4 mt-8">
            <button onClick={onClear} className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow">Clear</button>
            <button onClick={onConfirm} className="flex-1 bg-[#8B0000] text-white font-bold py-2.5 rounded-lg hover:bg-red-800 active:scale-95 transition-all shadow">{submitText || "Submit"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN COMPONENT
const AddHallsRooms = () => {
  const [halls, setHalls] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hallFilter, setHallFilter] = useState({ name: "", type: "All" });
  const [roomFilter, setRoomFilter] = useState({ name: "", type: "All" });

  const [isHallModalOpen, setIsHallModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // SIDEBAR STATE FOR NAVBAR
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const initialForm = { name: "", capacity: "", type: "Non A/C", amount: "", extraHour: "", image: null };
  const [formData, setFormData] = useState(initialForm);

  const sortData = (data) => data.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));

  const fetchData = async () => {
    try {
      const hRes = await axiosInstance.get("/api/halls-rooms/get-items/halls");
      const rRes = await axiosInstance.get("/api/halls-rooms/get-items/rooms");
      setHalls(sortData(hRes.data));
      setRooms(sortData(rRes.data));
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (collectionName) => {
    const { name, capacity, amount, image } = formData;
    
    if (!name.trim() || !capacity || !amount || (!image && !isEditMode)) {
      alert("Please fill in all required fields (Name, Capacity, Amount, and Image).");
      return false;
    }

    const currentList = collectionName === "halls" ? halls : rooms;
    const isNameExists = currentList.some(
      (item) => item.name.toLowerCase() === name.toLowerCase().trim() && item.id !== editId
    );

    if (isNameExists) {
      alert(`A ${collectionName.slice(0, -1)} with the name "${name}" already exists.`);
      return false;
    }

    return true;
  };

  const handleEdit = (item, type) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      name: item.name,
      capacity: item.capacity,
      type: item.type,
      amount: item.amount,
      extraHour: item.extraHour || "",
      image: null,
      existingImage: item.image 
    });
    type === "hall" ? setIsHallModalOpen(true) : setIsRoomModalOpen(true);
  };

  const handleSubmit = async (collectionName) => {
    if (!validateForm(collectionName)) return;

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) submitData.append(key, formData[key]);
      });
      submitData.append("collectionType", collectionName);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditMode) {
        await axiosInstance.put(`/api/halls-rooms/update-item/${collectionName}/${editId}`, submitData, config);
      } else {
        await axiosInstance.post("/api/halls-rooms/add-item", submitData, config);
      }

      setFormData(initialForm);
      setIsEditMode(false);
      setEditId(null);
      collectionName === "halls" ? setIsHallModalOpen(false) : setIsRoomModalOpen(false);
      fetchData();
      alert(`${collectionName.toUpperCase()} ${isEditMode ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Error ${isEditMode ? "updating" : "adding"} item.`);
    }
  };

  const handleDelete = async (collection, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/api/halls-rooms/delete-item/${collection}/${id}`);
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

  const renderModalFields = () => (
    <>
      <div>
        <label className="block text-[#8B0000] font-bold mb-1">Name *</label>
        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium" />
      </div>
      <div>
        <label className="block text-[#8B0000] font-bold mb-1">Capacity *</label>
        <input name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium" />
      </div>
      <div>
        <label className="block text-[#8B0000] font-bold mb-1">Type *</label>
        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium bg-white">
          <option value="A/C">A/C</option>
          <option value="Non A/C">Non A/C</option>
        </select>
      </div>
      <div>
        <label className="block text-[#8B0000] font-bold mb-1">Extra Hour (Optional)</label>
        <input name="extraHour" type="text" value={formData.extraHour} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium" />
      </div>
      <div>
        <label className="block text-[#8B0000] font-bold mb-1">Amount *</label>
        <input name="amount" type="number" value={formData.amount} onChange={handleInputChange} className="w-full border-2 border-gray-300 p-2.5 rounded-lg outline-none focus:border-[#8B0000] transition-colors font-medium" />
      </div>
      <div>
        <label className="block text-[#8B0000] font-bold mb-1">Upload Image *</label>
        <input name="image" type="file" accept="image/*" onChange={handleInputChange} className="w-full border-2 border-gray-300 p-2 rounded-lg outline-none cursor-pointer focus:border-[#8B0000] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-[#8B0000] hover:file:bg-red-100" />
        {formData.image ? (
          <p className="text-gray-600 mt-2 text-sm font-bold text-green-600">New Image Selected: {formData.image.name}</p>
        ) : formData.existingImage ? (
          <img src={formData.existingImage} alt="Current" className="w-24 h-24 object-cover rounded-md mt-3 border-2 border-gray-200 shadow-sm" />
        ) : null}
      </div>
    </>
  );

  return (
    // FIX: Main container set to h-screen and overflow-hidden for correct sidebar interaction
    <div className="flex bg-[#FDF2F2] h-screen overflow-hidden">
      
      {/* FIX: Passed sidebar state to NavBar */}
      <NavBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* FIX: Main content area now scrolls independently */}
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300 min-w-0">
        <div className="max-w-6xl mx-auto">
          <DataTable
            title="HALLS"
            data={applyFilters(halls, hallFilter)}
            type="hall"
            onSearch={setHallFilter}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAdd={() => { setIsEditMode(false); setEditId(null); setFormData(initialForm); setIsHallModalOpen(true); }}
          />
          <DataTable
            title="ROOMS"
            data={applyFilters(rooms, roomFilter)}
            type="room"
            onSearch={setRoomFilter}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAdd={() => { setIsEditMode(false); setEditId(null); setFormData(initialForm); setIsRoomModalOpen(true); }}
          />
        </div>
      </div>

      <Modal
        isOpen={isHallModalOpen} onClose={() => setIsHallModalOpen(false)}
        title={isEditMode ? "Edit Hall" : "Add A New Hall"}
        onConfirm={() => handleSubmit("halls")}
        onClear={() => setFormData(initialForm)}
        submitText={isEditMode ? "Update" : "Submit"}
      >
        {renderModalFields()}
      </Modal>

      <Modal
        isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)}
        title={isEditMode ? "Edit Room" : "Add A New Room"}
        onConfirm={() => handleSubmit("rooms")}
        onClear={() => setFormData(initialForm)}
        submitText={isEditMode ? "Update" : "Submit"}
      >
         {renderModalFields()}
      </Modal>
    </div>
  );
};

export default AddHallsRooms;