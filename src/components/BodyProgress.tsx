
import React, { useState } from 'react';
import { Clock, TrendingUp, Weight, Ruler } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { showActionToast } from '@/utils/toast-utils';

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
  const [measurements, setMeasurements] = useState<ProgressRecord[]>(progressHistory);
  const [currentProgress] = useState<ProgressRecord>(measurements[measurements.length - 1]);
  const previousProgress = measurements[measurements.length - 2];
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: ''
  });
  
  // Calculate changes
  const weightChange = currentProgress.weight - previousProgress.weight;
  const bodyFatChange = currentProgress.bodyFatPercentage - previousProgress.bodyFatPercentage;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMeasurement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMeasurement = () => {
    // Validate inputs
    if (!newMeasurement.weight || !newMeasurement.bodyFat || 
        !newMeasurement.chest || !newMeasurement.waist || 
        !newMeasurement.hips || !newMeasurement.arms) {
      showActionToast("Please fill in all measurement fields");
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const newRecord: ProgressRecord = {
      date: formattedDate,
      weight: parseFloat(newMeasurement.weight),
      bodyFatPercentage: parseFloat(newMeasurement.bodyFat),
      measurements: {
        chest: parseFloat(newMeasurement.chest),
        waist: parseFloat(newMeasurement.waist),
        hips: parseFloat(newMeasurement.hips),
        arms: parseFloat(newMeasurement.arms)
      }
    };

    setMeasurements(prev => [...prev, newRecord]);
    showActionToast("New measurement added successfully");
    setShowAddMeasurement(false);
    
    // Reset form
    setNewMeasurement({
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      hips: '',
      arms: ''
    });
  };
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Body Progress</h2>
        <button 
          className="text-sm font-medium text-fitness-primary"
          onClick={() => showActionToast("Viewing all body progress history")}
        >
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
      
      <button 
        className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium"
        onClick={() => setShowAddMeasurement(true)}
      >
        Add New Measurement
      </button>

      <Dialog open={showAddMeasurement} onOpenChange={setShowAddMeasurement}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Measurement</DialogTitle>
            <DialogDescription>
              Enter your current body measurements to track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
              <Input 
                id="weight" 
                name="weight" 
                type="number" 
                placeholder="e.g. 75.5"
                value={newMeasurement.weight}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bodyFat" className="text-sm font-medium">Body Fat (%)</label>
              <Input 
                id="bodyFat" 
                name="bodyFat" 
                type="number" 
                placeholder="e.g. 20.5"
                value={newMeasurement.bodyFat}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="chest" className="text-sm font-medium">Chest (cm)</label>
              <Input 
                id="chest" 
                name="chest" 
                type="number" 
                placeholder="e.g. 95"
                value={newMeasurement.chest}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="waist" className="text-sm font-medium">Waist (cm)</label>
              <Input 
                id="waist" 
                name="waist" 
                type="number" 
                placeholder="e.g. 80"
                value={newMeasurement.waist}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hips" className="text-sm font-medium">Hips (cm)</label>
              <Input 
                id="hips" 
                name="hips" 
                type="number" 
                placeholder="e.g. 97"
                value={newMeasurement.hips}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="arms" className="text-sm font-medium">Arms (cm)</label>
              <Input 
                id="arms" 
                name="arms" 
                type="number" 
                placeholder="e.g. 33"
                value={newMeasurement.arms}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              onClick={() => setShowAddMeasurement(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-fitness-primary text-white rounded-lg font-medium"
              onClick={handleAddMeasurement}
            >
              Save Measurement
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BodyProgress;
