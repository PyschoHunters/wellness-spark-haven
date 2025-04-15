
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Heart, Thermometer } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  duration: string;
  heartRate: string;
  bodyTemp: string;
}

const initialFormData: FormData = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  duration: '',
  heartRate: '',
  bodyTemp: ''
};

const NutritionTracker: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [calories, setCalories] = useState<number | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // For now, we'll use a simplified calculation as a placeholder
    // In a real implementation, this would call an API endpoint with the ML model
    const baseMetabolicRate = parseFloat(formData.weight) * 10;
    const activityFactor = parseFloat(formData.duration) / 30;
    const estimatedCalories = Math.round(baseMetabolicRate * activityFactor);
    
    setCalories(estimatedCalories);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Nutrition Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <Input
              type="number"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              min="0"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Height (cm)</label>
            <Input
              type="number"
              placeholder="Enter height"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              min="0"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weight (kg)</label>
            <Input
              type="number"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              min="0"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Exercise Duration (minutes)
            </label>
            <Input
              type="number"
              placeholder="Enter duration"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              min="0"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Heart Rate (bpm)
            </label>
            <Input
              type="number"
              placeholder="Enter heart rate"
              value={formData.heartRate}
              onChange={(e) => handleInputChange('heartRate', e.target.value)}
              min="0"
              className="w-full"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Body Temperature (°C)
            </label>
            <Input
              type="number"
              placeholder="Enter body temperature"
              value={formData.bodyTemp}
              onChange={(e) => handleInputChange('bodyTemp', e.target.value)}
              step="0.1"
              min="35"
              max="42"
              className="w-full"
            />
          </div>
        </div>

        <Button 
          className="w-full bg-fitness-primary hover:bg-fitness-primary/90" 
          onClick={handleSubmit}
        >
          Calculate Calories Burned
        </Button>

        {calories !== null && (
          <div className={cn(
            "mt-4 p-4 rounded-lg text-center",
            "bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10"
          )}>
            <p className="text-lg font-semibold">
              Estimated calories burned:
            </p>
            <p className="text-3xl font-bold text-fitness-primary">
              {calories} kcal
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionTracker;
