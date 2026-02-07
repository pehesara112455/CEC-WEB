import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';

const AddReservationStage2 = ({ onBack, onNext, savedData }) => {
  // Master State for Stage 2 items
  const [allData, setAllData] = useState({
    Meals: [],
    Others: [],
  });

  // Temporary State for Meal inputs
  const [mealData, setMealData] = useState({
    MealName: '',
    Quantity: 1,
    Description: '',
    Amount: '' // This acts as Price Per Meal
  });

  // Temporary State for Other inputs
  const [otherData, setOtherData] = useState({
    ItemName: '',
    Amount: '',
    Description: ''
  });

  // --- CALCULATIONS START ---

  // 1. Calculate total from Stage 1 (Rooms/Halls)
  const totalRoomsCost = savedData?.Rooms?.reduce((sum, room) => sum + Number(room.Amount || 0), 0) || 0;

  // 2. Calculate totals for Stage 2 (Meals)
  const totalMealsCost = allData.Meals.reduce((sum, item) => sum + Number(item.Total || 0), 0);

  // 3. Calculate totals for Stage 2 (Others)
  const totalOthersCost = allData.Others.reduce((sum, item) => sum + Number(item.Amount || 0), 0);

  // 4. Final Grand Total
  const grandTotal = totalRoomsCost + totalMealsCost + totalOthersCost;

  // --- CALCULATIONS END ---

  // HANDLERS
  const mealHandel = (e) => {
    const { name, value } = e.target;
    const onlyNumber = value.replace(/[^0-9]/g, '');
    
    if (name === 'Amount' || name === 'Quantity') {
      setMealData({ ...mealData, [name]: onlyNumber });
    } else {
      setMealData({ ...mealData, [name]: value });
    }
  };

  const otherHandel = (e) => {
    const { name, value } = e.target;
    if (name === 'Amount') {
      const onlyNumber = value.replace(/[^0-9]/g, '');
      setOtherData({ ...otherData, [name]: onlyNumber });
    } else {
      setOtherData({ ...otherData, [name]: value });
    }
  };

  // ADD FUNCTIONS
  const addMeal = () => {
    if (!mealData.MealName || !mealData.Amount) return alert("Please select a meal and enter amount");
    
    const totalForThisMeal = Number(mealData.Quantity) * Number(mealData.Amount);
    
    setAllData({
      ...allData,
      Meals: [...allData.Meals, { ...mealData, Total: totalForThisMeal }]
    });
    setMealData({ MealName: '', Quantity: 1, Description: '', Amount: '' });
  };

  const addOthers = () => {
    if (!otherData.ItemName || !otherData.Amount) return alert("Please enter an item name and amount");
    setAllData({
      ...allData,
      Others: [...allData.Others, otherData]
    });
    setOtherData({ ItemName: '', Amount: '', Description: '' });
  };

  // REMOVE FUNCTIONS
  const removeMeal = (index) => {
    setAllData({ ...allData, Meals: allData.Meals.filter((_, i) => i !== index) });
  };

  const removeOther = (index) => {
    setAllData({ ...allData, Others: allData.Others.filter((_, i) => i !== index) });
  };

 const handelConfirm = () => {
  // We create a single object that contains everything
  const finalReservationData = {
    ...savedData,          // Spread operator: adds CompanyName, Contact, Rooms, etc.
    Meals: allData.Meals,  // Adds the meals array from this stage
    Others: allData.Others, // Adds the others array from this stage
    TotalAmount: grandTotal // This is the key line to bring the total to the table
  };

  // Send the complete data back to the parent
  onNext(finalReservationData);
};

  return (
    <div className='flex w-full min-h-screen bg-gray-50 p-4'>
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans text-gray-800 border border-gray-100">
        
        {/* SECTION 1: MEALS */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-red-900 uppercase tracking-wide underline decoration-red-200">Meals Selection</h2>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Meal Total</p>
              <p className="text-2xl font-black text-red-900">LKR {totalMealsCost.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-4 bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Meal Type</label>
              <div className="relative flex-grow">
                <select name='MealName' value={mealData.MealName} onChange={mealHandel} className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none pr-10 bg-white">
                  <option value="">Select Meal</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Refreshments">Refreshments</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Quantity</label>
              <input name='Quantity' value={mealData.Quantity} onChange={mealHandel} type="number" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Price/Unit</label>
              <input name='Amount' value={mealData.Amount} onChange={mealHandel} type="text" placeholder="LKR" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Description</label>
              <input name='Description' value={mealData.Description} onChange={mealHandel} placeholder="Ex: No spicy" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button onClick={addMeal} className="bg-red-900 text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-red-800 transition-all shadow-md active:scale-95">
                <Plus className="w-5 h-5" /> <span className="font-bold">Add Meal</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 mt-6">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr className="text-gray-900 font-bold text-sm uppercase">
                  <th className="py-3 px-4">Meal</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Qty x Rate</th>
                  <th className="py-3 px-4 text-red-900">Total</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {allData.Meals.map((meal, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 font-semibold">{meal.MealName}</td>
                    <td className="py-3 px-4 text-gray-600 italic text-sm">{meal.Description || '-'}</td>
                    <td className="py-3 px-4 text-center">{meal.Quantity} x {Number(meal.Amount).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-red-900">LKR {meal.Total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <X onClick={() => removeMeal(index)} className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="h-1 bg-red-900 rounded-full mb-10 opacity-20"></div>

        {/* SECTION 2: OTHER ITEMS */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-red-900 uppercase tracking-wide underline decoration-red-200">Additional Services</h2>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Others Total</p>
              <p className="text-2xl font-black text-red-900">LKR {totalOthersCost.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6 bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Service/Item</label>
              <input name='ItemName' value={otherData.ItemName} onChange={otherHandel} placeholder="Ex: Projector" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Cost (LKR)</label>
              <input name='Amount' value={otherData.Amount} onChange={otherHandel} type="text" className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="flex items-center gap-4 md:col-span-2">
              <label className="w-32 font-semibold">Note</label>
              <input name='Description' value={otherData.Description} onChange={otherHandel} placeholder="Add any specific details here..." className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={addOthers} className="bg-red-900 text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-red-800 shadow-md transition-all active:scale-95">
                <Plus className="w-5 h-5" /> <span className="font-bold">Add Item</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr className="text-gray-900 font-bold text-sm uppercase">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-red-900">Amount</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {allData.Others.map((item, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100">
                    <td className="py-3 px-4 font-semibold">{item.ItemName}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{item.Description || '-'}</td>
                    <td className="py-3 px-4 font-bold text-red-900">LKR {Number(item.Amount).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <X onClick={() => removeOther(index)} className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FINAL TOTAL SUMMARY BOX */}
        <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-50">
                    <p className="text-xs text-red-700 uppercase font-bold">Rooms & Halls</p>
                    <p className="text-xl font-bold text-gray-800">LKR {totalRoomsCost.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-50">
                    <p className="text-xs text-red-700 uppercase font-bold">Meals</p>
                    <p className="text-xl font-bold text-gray-800">LKR {totalMealsCost.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-50">
                    <p className="text-xs text-red-700 uppercase font-bold">Additional Services</p>
                    <p className="text-xl font-bold text-gray-800">LKR {totalOthersCost.toLocaleString()}</p>
                </div>
            </div>

            <div className="h-px bg-red-200 mb-6"></div>

            <div className="flex justify-between items-center px-2">
                <div>
                    <h3 className="text-red-900 font-black uppercase text-xl">Grand Total</h3>
                    <p className="text-sm text-red-700 font-medium">Final amount for the entire reservation</p>
                </div>
                <div className="text-right">
                    <span className="text-5xl font-black text-red-900 underline decoration-double decoration-red-300">
                        LKR {grandTotal.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-12 flex flex-wrap justify-end gap-4">
          <button onClick={onBack} className="px-10 py-3 rounded-xl font-bold border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all">Back</button>
          <button onClick={handelConfirm} className="bg-red-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-800 shadow-lg transition-all active:scale-95">
            Confirm & Save Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReservationStage2;