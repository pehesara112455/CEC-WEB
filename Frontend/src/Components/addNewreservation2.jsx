import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import NavBar from './AdminNav';

const AddReservationStage2 = () => {
  // Sample state to handle dynamic table rows
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast Buffet', desc: 'Full English', qty: 20, total: 5000 },
    { id: 2, name: '', desc: '', qty: '', total: '' }, // Empty row for visual effect
  ]);

  return (
    <div className='flex w-full'>
        <NavBar/>
        <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans text-gray-800">
      
      {/* SECTION 1: MEALS */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Meals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-4">
          {/* Meal Selection */}
          <div className="flex items-center gap-4">
            <label className="w-32 font-semibold">Meal</label>
            <div className="relative flex-grow">
              <select className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none">
                <option value=""></option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="w-32 font-semibold">Quantity</label>
            <input type="number" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
          </div>

          {/* Description - Large Text Area */}
          <div className="flex items-start gap-4">
            <label className="w-32 font-semibold mt-2">Description</label>
            <textarea className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 h-24 focus:border-red-900 outline-none resize-none"></textarea>
          </div>

          {/* Amount and Add Button */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Amount</label>
              <input type="text" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-red-900 text-white p-2 rounded-full hover:bg-red-800 transition-transform hover:scale-110 shadow-md">
                <Plus className="w-6 h-6 stroke-[3px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Meals Summary Table */}
        <div className="overflow-hidden rounded-lg mt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-900 font-bold border-b-2 border-gray-100">
                <th className="py-3 px-4">Meal</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, index) => (
                <tr key={meal.id} className={index % 2 === 0 ? "bg-[#F8F1F1]" : "bg-white"}>
                  <td className="py-3 px-4 h-12">{meal.name}</td>
                  <td className="py-3 px-4">{meal.desc}</td>
                  <td className="py-3 px-4 text-center">{meal.qty}</td>
                  <td className="py-3 px-4">{meal.total}</td>
                  <td className="py-3 px-4 text-right">
                    <X className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Red Divider */}
      <div className="h-1.5 bg-red-900 rounded-full mb-10"></div>

      {/* SECTION 2: OTHER ITEMS */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Other Items</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="w-32 font-semibold">Item</label>
            <div className="relative flex-grow">
              <select className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none">
                <option value=""></option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 font-semibold">Amount</label>
            <input type="text" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 font-semibold">Description</label>
            <input type="text" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
          </div>

          <div className="flex justify-end">
             <button className="bg-red-900 text-white p-2 rounded-full hover:bg-red-800 transition-transform hover:scale-110 shadow-md">
                <Plus className="w-6 h-6 stroke-[3px]" />
              </button>
          </div>
        </div>

        {/* Other Items Table */}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-900 font-bold border-b-2 border-gray-100">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#F8F1F1] h-12">
                <td className="py-3 px-4"></td><td className="py-3 px-4"></td><td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-right"><X className="w-6 h-6 text-gray-800" /></td>
              </tr>
              <tr className="bg-white h-12">
                <td className="py-3 px-4"></td><td className="py-3 px-4"></td><td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-right"><X className="w-6 h-6 text-gray-800" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER ACTIONS */}
      <div className="mt-16 flex flex-wrap justify-end gap-4">
        <button className="bg-gray-500 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-gray-600 transition-colors min-w-[120px]">
          Back
        </button>
        <button className="bg-[#C16D00] text-white px-10 py-2.5 rounded-xl font-bold hover:bg-[#A35C00] transition-colors min-w-[120px]">
          Calculate
        </button>
        <button className="bg-red-900 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-red-800 transition-colors min-w-[120px]">
          Confirm Reservation
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default AddReservationStage2;