import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance'; // Use your custom instance instead of 'axios'
import { Search, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ReservationTable = ({ openAddRes, onEdit }) => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      // Changed to use API instance and updated path to match server.js naming
      const response = await API.get('/get-all-reservations');
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (displayId) => {
    try {
      // API instance handles the token automatically
      const response = await API.get(`/get-invoice-data/${displayId}`);
      const data = response.data;
      
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(127, 29, 29);
      doc.text("INVOICE / RESERVATION", 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`ID: ${data.displayId || "N/A"}`, 14, 35);
      doc.text(`Client: ${data.CompanyName || "N/A"}`, 14, 42);
      doc.text(`Contact: ${data.Contact || "N/A"}`, 14, 49);
      doc.text(`Date: ${data.DateFrom || "N/A"} to ${data.DateTo || "N/A"}`, 14, 56);

      let currentY = 65;

      if (data.Rooms && data.Rooms.length > 0) {
        doc.text("ROOM DETAILS", 14, currentY);
        doc.autoTable({
          startY: currentY + 2,
          head: [['Room Name', 'Check-In', 'Amount']],
          body: data.Rooms.map(r => [r.RoomName, r.DateFrom, r.Amount]),
          theme: 'striped'
        });
        currentY = doc.lastAutoTable.finalY + 10;
      }

      doc.setFontSize(14);
      doc.text(`TOTAL AMOUNT: Rs. ${Number(data.TotalAmount || 0).toLocaleString()}`, 14, currentY + 10);
      doc.text(`ADVANCE PAID: Rs. ${Number(data.Advance || 0).toLocaleString()}`, 14, currentY + 18);
      
      doc.save(`Invoice_${displayId}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Error generating PDF. Check authorization or server.");
    }
  };

  const handleFieldUpdate = async (displayId, field, value) => {
    setReservations(prev => 
      prev.map(item => item.displayId === displayId ? { ...item, [field]: value } : item)
    );
    try {
      await API.patch(`/update-reservation/${displayId}`, { [field]: value });
    } catch (error) {
      alert("Failed to sync.");
      fetchReservations();
    }
  };

  const deleteRow = async (id) => {
    if (window.confirm(`Delete ${id}?`)) {
      try {
        await API.delete(`/delete-reservation/${id}`);
        setReservations(prev => prev.filter(item => item.displayId !== id));
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  // ... (Filtering and Return JSX remain the same)
  const filteredData = reservations.filter(item => {
    const matchesSearch = 
      (item.CompanyName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (item.displayId || "").includes(searchTerm);
    const matchesStatus = statusFilter === "All" || item.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full bg-white p-8 rounded-sm min-h-screen flex flex-col font-sans text-gray-800">
      <div className="flex justify-between items-start mb-10">
        <h1 className="text-2xl font-black text-red-900 tracking-tight">RESERVATIONS</h1>
        <button onClick={openAddRes} className="bg-red-900 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-red-800 shadow-sm text-sm">
          <Plus size={18} /> ADD NEW
        </button>
      </div>

      <div className="flex justify-end items-center gap-6 mb-6">
        <div className="relative">
          <select 
            className="appearance-none border-b-2 border-red-900 pr-8 pl-2 py-1 outline-none text-sm font-medium bg-transparent cursor-pointer"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-red-900 pointer-events-none" />
        </div>

        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Search ID or Company..." 
            className="border border-gray-300 rounded-md pl-3 pr-10 py-1.5 text-sm focus:ring-1 focus:ring-red-900 w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-0 bg-red-900 p-2 rounded-r-md">
            <Search size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow border-t-2 border-red-100 border-dashed">
        {loading ? (
          <div className="text-center py-20 font-bold text-red-900 animate-pulse">Loading Reservations...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[13px] font-bold text-gray-800 border-b">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Client Name</th>
                <th className="py-4 px-2">Date</th>
                <th className="py-4 px-2 text-center">Advance</th>
                <th className="py-4 px-2 text-center">Total</th>
                <th className="py-4 px-2 text-center">Status</th>
                <th className="py-4 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {filteredData.map((item, index) => (
                <tr key={item.displayId} className={`${index % 2 === 0 ? "bg-red-50/50" : "bg-white"} hover:bg-red-100/50`}>
                  <td className="py-3 px-2 font-medium">{item.displayId}</td>
                  <td className="py-3 px-2 font-semibold">{item.CompanyName}</td>
                  <td className="py-3 px-2 text-gray-500 italic">{item.DateFrom}</td>
                  <td className="py-3 px-2 text-center">
                    <input 
                      type="number" 
                      value={item.Advance || 0}
                      onChange={(e) => handleFieldUpdate(item.displayId, "Advance", e.target.value)}
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-center"
                    />
                  </td>
                  <td className="py-3 px-2 text-center font-bold">{Number(item.TotalAmount || 0).toLocaleString()}</td>
                  <td className="py-3 px-2 text-center">
                    <select 
                      value={item.Status || "Pending"}
                      onChange={(e) => handleFieldUpdate(item.displayId, "Status", e.target.value)}
                      className={`border rounded-lg px-2 py-1 text-[11px] font-bold uppercase ${
                        item.Status === 'Paid' ? 'bg-green-100 text-green-700 border-green-500' : 'bg-yellow-50 text-yellow-700 border-yellow-500'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => onEdit(item)} className="text-gray-600 hover:text-blue-600"><Pencil size={18} /></button>
                      <button onClick={() => deleteRow(item.displayId)} className="text-gray-600 hover:text-red-600"><Trash2 size={18} /></button>
                      <button 
                        onClick={() => generatePDF(item.displayId)}
                        className="bg-[#D48D3B] text-white px-3 py-1 rounded text-[11px] font-bold hover:bg-[#c27d2f]"
                      >
                        VIEW
                      </button>
                    </div>
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