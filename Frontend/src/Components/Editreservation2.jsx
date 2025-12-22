import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import NavBar from './AdminNav';

const EditReservationStage2 = () => {
  // Mock data representing existing items in the reservation
  const [meals, setMeals] = useState([
    { id: 1, meal: 'Breakfast Buffet', description: 'Standard Menu', qty: 50, total: '25,000.00' },
    { id: 2, meal: 'Lunch Set A', description: 'Vegetarian Option', qty: 50, total: '45,000.00' },
    { id: 3, meal: 'Evening Tea', description: 'With snacks', qty: 50, total: '15,000.00' },
  ]);

  const [otherItems, setOtherItems] = useState([
    { id: 1, item: 'Projector', description: 'HD Projector and Screen', total: '5,000.00' },
    { id: 2, item: 'Sound System', description: 'Basic setup with 2 mics', total: '8,000.00' },
    { id: 3, item: 'Decorations', description: 'Table centerpieces', total: '12,000.00' },
  ]);

  // Reusable Table Row Component for consistency
  const TableRow = ({ children, index }) => (
    <tr className={`border-b border-gray-50 ${index % 2 === 0 ? "bg-[#F8F1F1]" : "bg-white"}`}>
      {children}
      <td className="py-3 px-2">
        <div className="flex items-center justify-end gap-3">
          <button className="text-gray-800 hover:text-blue-600 transition-colors">
            <Pencil className="w-5 h-5" />
          </button>
          <button className="text-gray-800 hover:text-red-600 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className='flex w-full'>
        <NavBar/>
        <div className="w-full mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg font-sans text-gray-800 border border-gray-100">
      
      {/* SECTION 1: MEALS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#8B0000] uppercase tracking-wide">MEALS</h2>
          <button className="bg-[#8B0000] text-white px-8 py-2 rounded-lg font-bold hover:bg-red-900 transition-colors shadow-sm">
            Add
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-900 font-bold border-b-2 border-gray-100">
                <th className="py-3 px-2 w-1/4">Meal</th>
                <th className="py-3 px-2 w-1/4">Description</th>
                <th className="py-3 px-2 w-1/6 text-center">Qty</th>
                <th className="py-3 px-2 w-1/6 text-right">Total Amount</th>
                <th className="py-3 px-2 w-1/12"></th>
              </tr>
            </thead>
            <tbody>
              {meals.map((item, index) => (
                <TableRow key={item.id} index={index}>
                  <td className="py-3 px-2 font-medium">{item.meal}</td>
                  <td className="py-3 px-2 text-gray-600">{item.description}</td>
                  <td className="py-3 px-2 text-center">{item.qty}</td>
                  <td className="py-3 px-2 text-right font-semibold">{item.total}</td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Thick Red Divider */}
      <div className="h-1.5 bg-[#8B0000] mb-12"></div>

      {/* SECTION 2: OTHER ITEMS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#8B0000] uppercase tracking-wide">OTHER ITEMS</h2>
          <button className="bg-[#8B0000] text-white px-8 py-2 rounded-lg font-bold hover:bg-red-900 transition-colors shadow-sm">
            Add
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-900 font-bold border-b-2 border-gray-100">
                <th className="py-3 px-2 w-1/4">Item</th>
                <th className="py-3 px-2 w-2/4">Description</th>
                <th className="py-3 px-2 w-1/6 text-right">Total Amount</th>
                <th className="py-3 px-2 w-1/12"></th>
              </tr>
            </thead>
            <tbody>
              {otherItems.map((item, index) => (
                <TableRow key={item.id} index={index}>
                  <td className="py-3 px-2 font-medium">{item.item}</td>
                  <td className="py-3 px-2 text-gray-600">{item.description}</td>
                  <td className="py-3 px-2 text-right font-semibold">{item.total}</td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER ACTIONS */}
      <div className="mt-16 flex flex-wrap justify-end gap-4 pt-6 border-t border-gray-50">
        <button className="bg-gray-500 text-white px-10 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors shadow-sm">
          Back
        </button>
        <button className="bg-[#C16D00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#A35C00] transition-colors shadow-sm">
          Calculate
        </button>
        <button className="bg-[#8B0000] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-900 transition-colors shadow-sm">
          Update Reservation
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default EditReservationStage2;