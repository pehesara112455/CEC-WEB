// src/utils/InvoiceGenerator.jsx
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from 'axios';

export const generateInvoicePDF = async (displayId) => {
  try {
    // 1. Fetch the combined data from your backend
    const response = await axios.get(`http://localhost:5000/get-invoice-data/${displayId}`);
    const data = response.data;

    const doc = new jsPDF();
    const deepRed = [139, 0, 0]; // Your brand color

    // 2. Add Invoice Title
    doc.setFontSize(22);
    doc.setTextColor(deepRed[0], deepRed[1], deepRed[2]);
    doc.text("INVOICE / RESERVATION SUMMARY", 105, 20, { align: "center" });

    // 3. Client & Reservation Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice ID: ${data.displayId}`, 14, 40);
    doc.text(`Company Name: ${data.CompanyName}`, 14, 48);
    doc.text(`Contact No: ${data.Contact}`, 14, 56);
    doc.text(`Duration: ${data.DateFrom} to ${data.DateTo}`, 14, 64);

    let currentY = 75;

    // 4. Rooms & Halls Table
    if (data.Rooms && data.Rooms.length > 0) {
      doc.text("Rooms & Halls:", 14, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [['Room Name', 'Dates', 'Amount (LKR)']],
        body: data.Rooms.map(r => [
          r.RoomName, 
          `${r.DateFrom} - ${r.DateTo}`, 
          Number(r.Amount).toLocaleString()
        ]),
        headStyles: { fillColor: deepRed },
        theme: 'grid'
      });
      currentY = doc.lastAutoTable.finalY + 15;
    }

    // 5. Meals Selection Table
    if (data.Meals && data.Meals.length > 0) {
      doc.text("Meals Selection:", 14, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [['Meal Type', 'Qty', 'Unit Price', 'Total']],
        body: data.Meals.map(m => [
          m.MealName, 
          m.Quantity, 
          Number(m.Amount).toLocaleString(), 
          (Number(m.Quantity) * Number(m.Amount)).toLocaleString()
        ]),
        headStyles: { fillColor: deepRed },
        theme: 'striped'
      });
      currentY = doc.lastAutoTable.finalY + 15;
    }

    // 6. Additional Services Table
    if (data.Others && data.Others.length > 0) {
      doc.text("Additional Services:", 14, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [['Service', 'Notes', 'Amount (LKR)']],
        body: data.Others.map(o => [
          o.ItemName, 
          o.Description || '-', 
          Number(o.Amount).toLocaleString()
        ]),
        headStyles: { fillColor: deepRed },
        theme: 'grid'
      });
      currentY = doc.lastAutoTable.finalY + 15;
    }

    // 7. Final Payment Summary (Bottom Right)
    const summaryX = 130;
    doc.setFontSize(13);
    doc.text(`Total Amount: LKR ${Number(data.TotalAmount || 0).toLocaleString()}`, summaryX, currentY + 10);
    doc.text(`Advance Paid: LKR ${Number(data.Advance || 0).toLocaleString()}`, summaryX, currentY + 18);
    
    doc.setFont("helvetica", "bold");
    const balance = Number(data.TotalAmount) - Number(data.Advance || 0);
    doc.text(`Balance Due: LKR ${balance.toLocaleString()}`, summaryX, currentY + 26);

    // 8. Trigger Download
    doc.save(`Invoice_${displayId}.pdf`);

  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Error: Could not generate the invoice. Please check your connection.");
  }
};