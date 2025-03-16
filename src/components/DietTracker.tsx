
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, Flame } from 'lucide-react';
import { sendDietReminder } from '@/utils/toast-utils';

interface MealItem {
  id: number;
  name: string;
  calories: number;
  prepTime: string;
  image: string;
}

const meals: Record<string, MealItem[]> = {
  breakfast: [
    {
      id: 1,
      name: 'Avocado Toast',
      calories: 350,
      prepTime: '15 min',
      image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Dish 02',
      calories: 200,
      prepTime: '10 min',
      image: 'https://images.unsplash.com/photo-1543339318-b43f4f85bac4?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  lunch: [
    {
      id: 3,
      name: 'Dish 03',
      calories: 634,
      prepTime: '40 min',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Dish 04',
      calories: 1238,
      prepTime: '60 min',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  dinner: [
    {
      id: 5,
      name: 'Grilled Salmon',
      calories: 450,
      prepTime: '25 min',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  snacks: [
    {
      id: 6,
      name: 'Greek Yogurt',
      calories: 150,
      prepTime: '5 min',
      image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?q=80&w=2070&auto=format&fit=crop'
    }
  ]
};

const DietTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lunch');

  const handleMealReminderClick = (mealType: string, mealName: string) => {
    sendDietReminder("manumohan.ai21@gmail.com", `${mealType}: ${mealName}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-fitness-dark">Diet</h2>
        <button 
          className="bg-fitness-primary text-white rounded-full px-6 py-2 font-medium"
          onClick={() => handleMealReminderClick(activeTab, "All meals")}
        >
          Tracker
        </button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4 bg-transparent">
          <TabsTrigger 
            value="breakfast" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-fitness-dark data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-fitness-primary rounded-none"
          >
            Breakfast
          </TabsTrigger>
          <TabsTrigger 
            value="lunch" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-fitness-dark data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-fitness-primary rounded-none"
          >
            Lunch
          </TabsTrigger>
          <TabsTrigger 
            value="dinner" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-fitness-dark data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-fitness-primary rounded-none"
          >
            Dinner
          </TabsTrigger>
          <TabsTrigger 
            value="snacks" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-fitness-dark data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-fitness-primary rounded-none"
          >
            Snacks
          </TabsTrigger>
        </TabsList>
        
        {Object.keys(meals).map((mealType) => (
          <TabsContent key={mealType} value={mealType} className="space-y-4">
            {meals[mealType].map((meal) => (
              <div key={meal.id} className="rounded-2xl overflow-hidden">
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-fitness-gray">
                      <Clock size={14} />
                      <span className="text-sm">{meal.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-fitness-secondary">
                      <Flame size={14} />
                      <span className="text-sm">{meal.calories} kCal</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DietTracker;
