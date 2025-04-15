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
import { Activity } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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

const CaloriePredictor: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [calories, setCalories] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.gender) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select your gender"
      });
      return false;
    }

    const numericFields = {
      age: "Age",
      height: "Height",
      weight: "Weight",
      duration: "Exercise Duration",
      heartRate: "Heart Rate",
      bodyTemp: "Body Temperature"
    };

    for (const [field, label] of Object.entries(numericFields)) {
      const value = parseFloat(formData[field as keyof FormData]);
      if (isNaN(value) || value <= 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Please enter a valid ${label}`
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const apiUrl = 'https://nutrition-tracker-z35m.onrender.com/predict';
      console.log("Sending request to:", apiUrl);
      
      const requestData = {
        gender: formData.gender,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        duration: parseInt(formData.duration),
        heartRate: parseInt(formData.heartRate),
        bodyTemp: parseFloat(formData.bodyTemp)
      };
      
      console.log("Request data:", JSON.stringify(requestData));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to predict calories');
      }

      const data = await response.json();
      setCalories(Math.round(data.calories_burnt));
      toast({
        title: "Success!",
        description: "Calories burnt calculated successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate calories burnt. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 p-6">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-fitness-primary" />
          Calorie Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-fitness-primary" />
              Gender
            </label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-fitness-primary" />
              Age
            </label>
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
            <label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="w-4 h-4 text-fitness-primary" />
              Height (cm)
            </label>
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
            <label className="text-sm font-medium flex items-center gap-2">
              <Weight className="w-4 h-4 text-fitness-primary" />
              Weight (kg)
            </label>
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
              <Activity className="w-4 h-4 text-fitness-primary" />
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
              <Heart className="w-4 h-4 text-fitness-primary" />
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
              <Thermometer className="w-4 h-4 text-fitness-primary" />
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
          className={cn(
            "w-full bg-fitness-primary hover:bg-fitness-primary/90",
            "transition-all duration-300 transform hover:scale-[1.02]"
          )}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Calories Burnt"}
        </Button>

        {calories !== null && (
          <div className={cn(
            "mt-4 p-6 rounded-xl text-center",
            "bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10",
            "transform transition-all duration-300"
          )}>
            <p className="text-lg font-semibold text-gray-700">
              Estimated calories burnt:
            </p>
            <p className="text-4xl font-bold text-fitness-primary mt-2">
              {calories} kcal
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaloriePredictor;
