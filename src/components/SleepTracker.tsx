
import React, { useState, useEffect } from 'react';
import { Clock, Moon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { showActionToast } from '@/utils/toast-utils';

const SleepTracker = () => {
  const [sleepHours, setSleepHours] = useState(() => {
    const savedSleepHours = localStorage.getItem('sleepHours');
    return savedSleepHours ? parseFloat(savedSleepHours) : 0;
  });
  
  const [sleepGoal, setSleepGoal] = useState(() => {
    const savedSleepGoal = localStorage.getItem('sleepGoal');
    return savedSleepGoal ? parseInt(savedSleepGoal) : 8;
  });
  
  // Save sleep hours to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sleepHours', sleepHours.toString());
  }, [sleepHours]);
  
  // Save sleep goal to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sleepGoal', sleepGoal.toString());
  }, [sleepGoal]);
  
  const handleSleepInput = (hours: number) => {
    // Ensure sleep hours is between 0 and 24
    const newHours = Math.min(Math.max(hours, 0), 24);
    setSleepHours(newHours);
    showActionToast(`Sleep logged: ${newHours} hours`);
  };
  
  const sleepProgress = (sleepHours / sleepGoal) * 100;
  
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };
  
  return (
    <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-full mr-3">
            <Moon className="text-indigo-500" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Sleep Tracker</h2>
            <p className="text-xs text-gray-500">Track your rest</p>
          </div>
        </div>
        <div className="text-xl font-bold text-indigo-600">
          {formatHours(sleepHours)}
        </div>
      </div>
      
      <div className="mb-4">
        <Progress value={sleepProgress} className="h-2 bg-indigo-100" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0h</span>
          <span>{sleepGoal}h goal</span>
        </div>
      </div>
      
      <div className="bg-white p-3 rounded-xl mb-3">
        <div className="mb-2">
          <label htmlFor="sleep-hours" className="text-sm font-medium">
            Hours slept last night
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            id="sleep-hours"
            value={Math.floor(sleepHours)}
            onChange={(e) => {
              const hours = parseInt(e.target.value) || 0;
              const minutes = (sleepHours % 1) * 60;
              handleSleepInput(hours + minutes / 60);
            }}
            min="0"
            max="23"
            className="w-20 p-2 border border-gray-200 rounded-lg text-center"
          />
          <span className="flex items-center">hours</span>
          <input
            type="number" 
            value={Math.round((sleepHours % 1) * 60)}
            onChange={(e) => {
              const minutes = parseInt(e.target.value) || 0;
              const hours = Math.floor(sleepHours);
              handleSleepInput(hours + minutes / 60);
            }}
            min="0"
            max="59"
            className="w-20 p-2 border border-gray-200 rounded-lg text-center"
          />
          <span className="flex items-center">minutes</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleSleepInput(6)}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg text-sm transition-colors"
        >
          6 hours
        </button>
        <button
          onClick={() => handleSleepInput(7.5)}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg text-sm transition-colors"
        >
          7.5 hours
        </button>
        <button
          onClick={() => handleSleepInput(9)}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg text-sm transition-colors"
        >
          9 hours
        </button>
      </div>
    </div>
  );
};

export default SleepTracker;
