import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';

const AddReservationStage2 = ({ onBack, onNext }) => {
  // Master State
  const [allData, setAllData] = useState({
    Meals: [],
    Others: [],
  });

  // Temporary State for Meal inputs
  const [mealData, setMealData] = useState({
    MealName: '',
    Quantity: '',
    Description: '',
    Amount: ''
  });

  // Temporary State for Other inputs
  const [otherData, setOtherData] = useState({
    ItemName: '',
    Amount: '',
    Description: ''
  });

  const mealHandel = (e) => {
    const { name, value } = e.target;
    setMealData({ ...mealData, [name]: value });
  };

  const otherHandel = (e) => {
    const { name, value } = e.target;
    setOtherData({ ...otherData, [name]: value });
  };

  const addMeal = () => {
    if (!mealData.MealName) return alert("Please select a meal");
    setAllData({
      ...allData,
      Meals: [...allData.Meals, mealData]
    });
    setMealData({ MealName: '', Quantity: '', Description: '', Amount: '' });
  };

  const addOthers = () => {
    if (!otherData.ItemName) return alert("Please enter an item name");
    setAllData({
      ...allData,
      Others: [...allData.Others, otherData]
    });
    setOtherData({ ItemName: '', Amount: '', Description: '' });
  };

  const handelConfirm = () => {
    onNext(allData);
  };

  return (
    <div className='flex w-full'>
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans text-gray-800">
        
        {/* SECTION 1: MEALS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Meals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-4">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Meal</label>
              <div className="relative flex-grow">
                <select 
                  name='MealName'
                  value={mealData.MealName || ''}
                  onChange={mealHandel}
                  className="w-full appearance-none border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none">
                  <option value="">Select Meal</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Quantity</label>
              <input
                name='Quantity'
                value={mealData.Quantity || ''}
                onChange={mealHandel}
                type="number" 
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className="w-32 font-semibold mt-2">Description</label>
              <textarea 
                name='Description'
                value={mealData.Description || ''}
                onChange={mealHandel}
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 h-24 focus:border-red-900 outline-none resize-none"></textarea>
            </div>

            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <label className="w-32 font-semibold">Amount</label>
                <input
                  name='Amount'
                  value={mealData.Amount || ''}
                  onChange={mealHandel}
                  type="text" 
                  className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={addMeal} className="bg-red-900 text-white p-2 rounded-full hover:bg-red-800 transition-transform hover:scale-110 shadow-md">
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
                {allData.Meals.map((meal, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#F8F1F1]" : "bg-white"}>
                    <td className="py-3 px-4">{meal.MealName}</td>
                    <td className="py-3 px-4">{meal.Description}</td>
                    <td className="py-3 px-4 text-center">{meal.Quantity}</td>
                    <td className="py-3 px-4">{meal.Amount}</td>
                    <td className="py-3 px-4 text-right">
                      <X className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="h-1.5 bg-red-900 rounded-full mb-10"></div>

        {/* SECTION 2: OTHER ITEMS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-red-900 mb-8 uppercase tracking-wide">Other Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Item</label>
              <input
                name='ItemName'
                value={otherData.ItemName || ''}
                onChange={otherHandel}
                placeholder="Ex: Decorations"
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Amount</label>
              <input
                name='Amount'
                value={otherData.Amount || ''}
                onChange={otherHandel}
                type="text" 
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" 
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 font-semibold">Description</label>
              <input
                name='Description'
                value={otherData.Description || ''}
                onChange={otherHandel}
                type="text" 
                className="flex-grow border-2 border-gray-400 rounded-lg px-3 py-2 focus:border-red-900 outline-none" 
              />
            </div>
            <div className="flex justify-end">
              <button onClick={addOthers} className="bg-red-900 text-white p-2 rounded-full hover:bg-red-800 transition-transform hover:scale-110 shadow-md">
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
                {allData.Others.map((item, index) => (
                  <tr key={index} className="bg-[#F8F1F1] border-b border-gray-100">
                    <td className="py-3 px-4">{item.ItemName}</td>
                    <td className="py-3 px-4">{item.Description}</td>
                    <td className="py-3 px-4">{item.Amount}</td>
                    <td className="py-3 px-4 text-right">
                      <X className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="mt-16 flex flex-wrap justify-end gap-4">
          <button onClick={onBack} className="bg-gray-500 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-gray-600">Back</button>
          <button onClick={handelConfirm} className="bg-red-900 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-red-800">Confirm Reservation</button>
        </div>
      </div>
    </div>
  );
};

export default AddReservationStage2;