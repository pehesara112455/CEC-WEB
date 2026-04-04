import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import axiosInstance from '../api/axiosInstance'; 

const EditReservationStage2 = ({ onBack, onNext, savedData }) => {
  const [allData, setAllData] = useState({
    Meals: [],
    Others: [],
  });

  // FETCH EXISTING SUB-COLLECTIONS
  useEffect(() => {
    const fetchSubCollections = async () => {
      if (savedData?.displayId) {
        try {
          const mealsRes = await axiosInstance.get(`/reservations/get-reservation-meals/${savedData.displayId}`);
          const othersRes = await axiosInstance.get(`/reservations/get-reservation-others/${savedData.displayId}`);
          
          setAllData({
            Meals: (mealsRes.data || []).map(m => ({
                ...m,
                Total: Number(m.Quantity || 0) * Number(m.Amount || 0)
            })),
            Others: othersRes.data || [],
          });
        } catch (error) {
          console.error("Error loading sub-collections:", error);
        }
      }
    };
    fetchSubCollections();
  }, [savedData?.displayId]);

  const [mealData, setMealData] = useState({ MealName: '', Quantity: 1, Description: '', Amount: '' });
  const [otherData, setOtherData] = useState({ ItemName: '', Amount: '', Description: '' });

  // --- DYNAMIC CALCULATIONS ---
  const totalRoomsCost = savedData?.Rooms?.reduce((sum, room) => sum + Number(room.Amount || 0), 0) || 0;
  const totalMealsCost = allData.Meals.reduce((sum, item) => sum + (Number(item.Total) || 0), 0);
  const totalOthersCost = allData.Others.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
  const grandTotal = totalRoomsCost + totalMealsCost + totalOthersCost;

  // HANDLERS
  const mealHandel = (e) => {
    const { name, value } = e.target;
    if (name === 'Amount' || name === 'Quantity') {
      setMealData({ ...mealData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setMealData({ ...mealData, [name]: value });
    }
  };

  const otherHandel = (e) => {
    const { name, value } = e.target;
    if (name === 'Amount') {
      setOtherData({ ...otherData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setOtherData({ ...otherData, [name]: value });
    }
  };

  // ADD / REMOVE FUNCTIONS
  const addMeal = () => {
    if (!mealData.MealName || !mealData.Amount) return alert("Select meal and unit price");
    const rowTotal = Number(mealData.Quantity) * Number(mealData.Amount);
    setAllData({ 
        ...allData, 
        Meals: [...allData.Meals, { ...mealData, Total: rowTotal }] 
    });
    setMealData({ MealName: '', Quantity: 1, Description: '', Amount: '' });
  };

  const addOthers = () => {
    if (!otherData.ItemName || !otherData.Amount) return alert("Enter service name and cost");
    setAllData({ 
        ...allData, 
        Others: [...allData.Others, { ...otherData }] 
    });
    setOtherData({ ItemName: '', Amount: '', Description: '' });
  };

  const removeMeal = (index) => {
    setAllData({ ...allData, Meals: allData.Meals.filter((_, i) => i !== index) });
  };

  const removeOther = (index) => {
    setAllData({ ...allData, Others: allData.Others.filter((_, i) => i !== index) });
  };

  // FINAL SUBMISSION
  const handelConfirm = () => {
    const finalReservationData = {
      ...savedData,
      Meals: allData.Meals,   
      Others: allData.Others, 
      TotalAmount: grandTotal 
    };
    onNext(finalReservationData);
  };

  return (
    <div className='flex w-full min-h-screen bg-gray-50 p-4'>
      <div className="w-full mx-auto bg-white p-10 rounded-xl shadow-lg font-sans text-gray-800 border border-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-2xl font-bold text-red-900 uppercase tracking-tight">Edit Meals & Services</h2>
                <p className="text-sm text-gray-500 font-medium italic">Modifying Reservation: {savedData?.displayId}</p>
            </div>
            <div className="bg-red-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                Stage 2 of 2
            </div>
        </div>

        {/* SECTION 1: MEALS */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-red-900 uppercase tracking-wide underline decoration-red-200">Meals Selection</h2>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Meal Total</p>
              <p className="text-2xl font-black text-red-900">LKR {totalMealsCost.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Meal Type</label>
              <div className="relative">
                <select name='MealName' value={mealData.MealName} onChange={mealHandel} className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 bg-white appearance-none transition-all">
                  <option value="">-- Choose Meal --</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Refreshments">Refreshments</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Quantity</label>
              <input name='Quantity' value={mealData.Quantity} onChange={mealHandel} type="number" className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Unit Price (LKR)</label>
              <input name='Amount' value={mealData.Amount} onChange={mealHandel} type="text" placeholder="Price per person" className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Special Notes</label>
              <input name='Description' value={mealData.Description} onChange={mealHandel} placeholder="Ex: Low sugar" className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 transition-all" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={addMeal} className="bg-red-900 text-white flex items-center gap-2 px-8 py-3 rounded-xl hover:bg-red-800 transition-all shadow-lg active:scale-95">
                <Plus size={20} className="stroke-[3px]" /> <span className="font-bold uppercase text-sm">Add Meal</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-[10px] font-black uppercase text-gray-600 tracking-widest border-b">
                <tr>
                    <th className="py-4 px-6">Meal Name</th>
                    <th className="py-4 px-6 text-center">Calculation (Qty x Rate)</th>
                    <th className="py-4 px-6 text-red-900">Total Price</th>
                    <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allData.Meals.map((meal, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-gray-700">{meal.MealName}</td>
                    <td className="py-4 px-6 text-gray-500 font-medium text-center">{meal.Quantity} x LKR {Number(meal.Amount).toLocaleString()}</td>
                    <td className="py-4 px-6 font-black text-red-900">LKR {meal.Total?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                        <X onClick={() => removeMeal(index)} className="cursor-pointer text-gray-300 hover:text-red-600 transition-colors w-5 h-5 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Dynamic Footer for Meals */}
              {allData.Meals.length > 0 && (
                <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="2" className="py-4 px-6 text-right font-bold text-gray-700 uppercase text-sm">Total Meals Cost:</td>
                    <td className="py-4 px-6 font-black text-xl text-red-900">LKR {totalMealsCost.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* SECTION 2: ADDITIONAL SERVICES (Others) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-red-900 uppercase tracking-wide underline decoration-red-200">Additional Services</h2>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">Others Total</p>
              <p className="text-2xl font-black text-red-900">LKR {totalOthersCost.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Service/Item Name</label>
              <input name='ItemName' value={otherData.ItemName} onChange={otherHandel} placeholder="Ex: LCD Projector" className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 bg-white" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Cost (LKR)</label>
              <input name='Amount' value={otherData.Amount} onChange={otherHandel} type="text" className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 bg-white" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">Specific Description</label>
              <input name='Description' value={otherData.Description} onChange={otherHandel} className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-900 bg-white" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={addOthers} className="bg-red-900 text-white flex items-center gap-2 px-8 py-3 rounded-xl hover:bg-red-800 transition-all shadow-lg">
                <Plus size={20} className="stroke-[3px]" /> <span className="font-bold uppercase text-sm">Add Service</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-[10px] font-black uppercase text-gray-600 tracking-widest border-b">
                <tr><th className="py-4 px-6">Service Type</th><th className="py-4 px-6">Notes</th><th className="py-4 px-6 text-red-900">Amount</th><th className="py-4 px-6"></th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allData.Others.map((item, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100">
                    <td className="py-4 px-6 font-bold text-gray-700">{item.ItemName}</td>
                    <td className="py-4 px-6 text-gray-500 italic font-medium">{item.Description || '--'}</td>
                    <td className="py-4 px-6 font-black text-red-900">LKR {Number(item.Amount).toLocaleString()}</td>
                    <td className="py-4 px-6 text-right"><X onClick={() => removeOther(index)} className="cursor-pointer text-gray-300 hover:text-red-600 transition-colors w-5 h-5 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
              {/* Dynamic Footer for Others */}
              {allData.Others.length > 0 && (
                <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="2" className="py-4 px-6 text-right font-bold text-gray-700 uppercase text-sm">Total Services Cost:</td>
                    <td className="py-4 px-6 font-black text-xl text-red-900">LKR {totalOthersCost.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
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
                    <h3 className="text-red-900 font-black uppercase text-xl">Updated Grand Total</h3>
                    <p className="text-sm text-red-700 font-medium">Final amount for the entire reservation</p>
                </div>
                <div className="text-right">
                    <span className="text-5xl font-black text-red-900 underline decoration-double decoration-red-300">
                        LKR {grandTotal.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="mt-12 flex flex-wrap justify-end gap-6">
          <button onClick={onBack} className="px-12 py-3.5 rounded-2xl font-bold border-2 border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all active:scale-95">Go Back</button>
          <button onClick={handelConfirm} className="bg-red-900 text-white px-12 py-3.5 rounded-2xl font-bold hover:bg-red-800 shadow-2xl transition-all active:scale-95 flex items-center gap-2">
            Confirm & Save Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReservationStage2;