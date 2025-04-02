
import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { showActionToast } from '@/utils/toast-utils';

const WaterTracker = () => {
  const [waterIntake, setWaterIntake] = useState(() => {
    const savedWaterIntake = localStorage.getItem('waterIntake');
    return savedWaterIntake ? parseInt(savedWaterIntake) : 0;
  });
  
  const [waterGoal, setWaterGoal] = useState(() => {
    const savedWaterGoal = localStorage.getItem('waterGoal');
    return savedWaterGoal ? parseInt(savedWaterGoal) : 2000;
  });
  
  // Save water intake to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake.toString());
  }, [waterIntake]);
  
  // Save water goal to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('waterGoal', waterGoal.toString());
  }, [waterGoal]);
  
  const addWater = (amount: number) => {
    const newAmount = Math.min(waterIntake + amount, 5000);
    setWaterIntake(newAmount);
    showActionToast(`Added ${amount}ml of water`);
  };
  
  const removeWater = (amount: number) => {
    const newAmount = Math.max(waterIntake - amount, 0);
    setWaterIntake(newAmount);
    showActionToast(`Removed ${amount}ml of water`);
  };
  
  const waterProgress = (waterIntake / waterGoal) * 100;

  return (
    <div className="bg-blue-50 rounded-2xl p-4 shadow-sm animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Droplet className="text-blue-500" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Water Tracker</h2>
            <p className="text-xs text-gray-500">Stay hydrated</p>
          </div>
        </div>
        <div className="text-xl font-bold text-blue-600">
          {waterIntake} <span className="text-sm font-medium">ml</span>
        </div>
      </div>
      
      <div className="mb-3">
        <Progress value={waterProgress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 ml</span>
          <span>{waterGoal} ml</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-3 mb-3">
        <button
          onClick={() => addWater(250)}
          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
        >
          <Plus size={14} /> 250ml
        </button>
        <button
          onClick={() => addWater(500)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
        >
          <Plus size={14} /> 500ml
        </button>
      </div>
      
      <div className="flex justify-between gap-3">
        <button
          onClick={() => removeWater(250)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
        >
          <Minus size={14} /> 250ml
        </button>
        <button
          onClick={() => setWaterIntake(0)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
