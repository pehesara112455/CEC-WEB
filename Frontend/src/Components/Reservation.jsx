import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const ReservationTable = ({ openAddRes, onEdit }) => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-all-reservations');
      setReservations(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldUpdate = async (displayId, field, value) => {
    // Immediate UI update for "Advance" and "Status" dropdowns
    setReservations(prev => prev.map(item => item.displayId === displayId ? { ...item, [field]: value } : item));
    try {
      await axios.patch(`http://localhost:5000/update-reservation/${displayId}`, { [field]: value });
    } catch (error) {
      alert("Sync failed.");
    }
  };

  const deleteRow = async (id) => {
    if (window.confirm(`Are you sure you want to delete ${id}?`)) {
      try {
        await axios.delete(`http://localhost:5000/delete-reservation/${id}`);
        setReservations(prev => prev.filter(item => item.displayId !== id));
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  const filteredData = reservations.filter(item =>
    (item.CompanyName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (item.displayId || "").includes(searchTerm)
  );

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-900">RESERVATIONS</h1>
        <div className="flex gap-4">
          <input type="text" placeholder="Search..." className="border rounded px-3 py-1.5" onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={openAddRes} className="bg-red-900 text-white px-5 py-2 rounded font-bold flex items-center gap-2">
            <Plus size={18}/> ADD NEW
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        {loading ? <div className="text-center py-20 font-bold">Loading...</div> : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-bold border-b bg-gray-50">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Client Name</th>
                <th className="py-4 px-2">Advance (LKR)</th>
                <th className="py-4 px-2">Total</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-2 font-medium">{item.displayId}</td>
                  <td className="py-4 px-2">{item.CompanyName}</td>
                  <td className="py-4 px-2">
                    <input 
                      type="number" 
                      value={item.Advance || 0} 
                      onChange={(e) => handleFieldUpdate(item.displayId, "Advance", e.target.value)} 
                      className="w-24 border rounded px-2" 
                    />
                  </td>
                  <td className="py-4 px-2 font-bold">LKR {Number(item.TotalAmount || 0).toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <select 
                      value={item.Status || "Pending"} 
                      onChange={(e) => handleFieldUpdate(item.displayId, "Status", e.target.value)} 
                      className="border rounded px-2 py-1 text-xs font-bold uppercase"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="py-4 px-2 flex justify-center gap-4">
                    {/* TRIGGER EDIT IN PARENT */}
                    <button onClick={() => onEdit(item)} className="text-blue-600 hover:scale-110"><Pencil size={18}/></button>
                    <button onClick={() => deleteRow(item.displayId)} className="text-red-600 hover:scale-110"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReservationTable;