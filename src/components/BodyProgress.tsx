
import React, { useState } from 'react';
import { Clock, TrendingUp, Weight, Ruler } from 'lucide-react';

interface ProgressRecord {
  date: string;
  weight: number;
  bodyFatPercentage: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
  };
}

const progressHistory: ProgressRecord[] = [
  {
    date: '2023-10-01',
    weight: 75.5,
    bodyFatPercentage: 22,
    measurements: {
      chest: 95,
      waist: 82,
      hips: 98,
      arms: 32
    }
  },
  {
    date: '2023-10-15',
    weight: 74.8,
    bodyFatPercentage: 21.5,
    measurements: {
      chest: 94.5,
      waist: 81,
      hips: 97.5,
      arms: 32.5
    }
  },
  {
    date: '2023-11-01',
    weight: 74.0,
    bodyFatPercentage: 20.8,
    measurements: {
      chest: 94,
      waist: 80,
      hips: 97,
      arms: 33
    }
  }
];

const BodyProgress: React.FC = () => {
  const [currentProgress] = useState<ProgressRecord>(progressHistory[progressHistory.length - 1]);
  const previousProgress = progressHistory[progressHistory.length - 2];
  
  // Calculate changes
  const weightChange = currentProgress.weight - previousProgress.weight;
  const bodyFatChange = currentProgress.bodyFatPercentage - previousProgress.bodyFatPercentage;
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Body Progress</h2>
        <button className="text-sm font-medium text-fitness-primary">
          See All
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-fitness-gray-light p-3 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-fitness-gray">Weight</span>
            <Weight size={16} className="text-fitness-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-lg font-semibold">{currentProgress.weight} kg</span>
            <span className={`text-xs ${weightChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {weightChange <= 0 ? '↓' : '↑'} {Math.abs(weightChange).toFixed(1)}
            </span>
          </div>
        </div>
        
        <div className="bg-fitness-gray-light p-3 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-fitness-gray">Body Fat</span>
            <TrendingUp size={16} className="text-fitness-secondary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-lg font-semibold">{currentProgress.bodyFatPercentage}%</span>
            <span className={`text-xs ${bodyFatChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bodyFatChange <= 0 ? '↓' : '↑'} {Math.abs(bodyFatChange).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-fitness-gray-light p-3 rounded-xl mb-4">
        <h3 className="text-sm font-medium mb-2">Measurements</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-fitness-gray">Chest</span>
            <span className="font-medium">{currentProgress.measurements.chest} cm</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-fitness-gray">Waist</span>
            <span className="font-medium">{currentProgress.measurements.waist} cm</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-fitness-gray">Hips</span>
            <span className="font-medium">{currentProgress.measurements.hips} cm</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-fitness-gray">Arms</span>
            <span className="font-medium">{currentProgress.measurements.arms} cm</span>
          </div>
        </div>
      </div>
      
      <button className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium">
        Add New Measurement
      </button>
    </div>
  );
};

export default BodyProgress;
