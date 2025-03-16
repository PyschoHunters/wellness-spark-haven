
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, Flame, X } from 'lucide-react';
import { sendDietReminder, showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

interface MealItem {
  id: number;
  name: string;
  calories: number;
  prepTime: string;
  image: string;
  description: string;
  ingredients: string[];
  nutritionalInfo: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

const meals: Record<string, MealItem[]> = {
  breakfast: [
    {
      id: 1,
      name: 'Avocado Toast',
      calories: 350,
      prepTime: '15 min',
      image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=2070&auto=format&fit=crop',
      description: 'Creamy avocado spread on whole grain toast topped with cherry tomatoes, microgreens, and a sprinkle of red pepper flakes.',
      ingredients: ['Whole grain bread', 'Ripe avocado', 'Cherry tomatoes', 'Microgreens', 'Red pepper flakes', 'Olive oil', 'Salt and pepper'],
      nutritionalInfo: {
        protein: 8,
        carbs: 35,
        fats: 21,
        fiber: 9
      }
    },
    {
      id: 2,
      name: 'Protein Smoothie Bowl',
      calories: 200,
      prepTime: '10 min',
      image: 'https://images.unsplash.com/photo-1543339318-b43f4f85bac4?q=80&w=2070&auto=format&fit=crop',
      description: 'Protein-packed smoothie bowl with fresh seasonal fruits, chia seeds and a sprinkle of granola for added texture.',
      ingredients: ['Greek yogurt', 'Protein powder', 'Banana', 'Mixed berries', 'Chia seeds', 'Granola', 'Honey'],
      nutritionalInfo: {
        protein: 20,
        carbs: 25,
        fats: 5,
        fiber: 6
      }
    }
  ],
  lunch: [
    {
      id: 3,
      name: 'Rainbow Salad Bowl',
      calories: 634,
      prepTime: '40 min',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
      description: 'Colorful, nutrient-dense salad with a variety of vegetables, lean protein, and a tangy vinaigrette dressing.',
      ingredients: ['Mixed greens', 'Grilled chicken', 'Cherry tomatoes', 'Cucumber', 'Bell peppers', 'Avocado', 'Quinoa', 'Olive oil', 'Lemon juice'],
      nutritionalInfo: {
        protein: 38,
        carbs: 45,
        fats: 28,
        fiber: 12
      }
    },
    {
      id: 4,
      name: 'Mediterranean Bowl',
      calories: 1238,
      prepTime: '60 min',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=2070&auto=format&fit=crop',
      description: 'Mediterranean-inspired bowl with falafel, hummus, tabbouleh, and warm pita bread.',
      ingredients: ['Falafel', 'Hummus', 'Tabbouleh', 'Pita bread', 'Cucumber', 'Tomatoes', 'Olive oil', 'Tahini sauce'],
      nutritionalInfo: {
        protein: 32,
        carbs: 125,
        fats: 58,
        fiber: 22
      }
    }
  ],
  dinner: [
    {
      id: 5,
      name: 'Grilled Salmon',
      calories: 450,
      prepTime: '25 min',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop',
      description: 'Herb-crusted grilled salmon fillet served with roasted vegetables and quinoa.',
      ingredients: ['Salmon fillet', 'Mixed herbs', 'Lemon', 'Garlic', 'Olive oil', 'Broccoli', 'Bell peppers', 'Quinoa'],
      nutritionalInfo: {
        protein: 40,
        carbs: 30,
        fats: 25,
        fiber: 8
      }
    }
  ],
  snacks: [
    {
      id: 6,
      name: 'Greek Yogurt',
      calories: 150,
      prepTime: '5 min',
      image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?q=80&w=2070&auto=format&fit=crop',
      description: 'Creamy Greek yogurt topped with honey, mixed berries, and a sprinkle of granola.',
      ingredients: ['Greek yogurt', 'Honey', 'Mixed berries', 'Granola'],
      nutritionalInfo: {
        protein: 15,
        carbs: 20,
        fats: 5,
        fiber: 3
      }
    }
  ]
};

const DietTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lunch');
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [showMealDetail, setShowMealDetail] = useState(false);

  const handleMealReminderClick = (mealType: string, mealName: string) => {
    sendDietReminder("manumohan.ai21@gmail.com", `${mealType}: ${mealName}`);
  };

  const handleMealClick = (meal: MealItem) => {
    setSelectedMeal(meal);
    setShowMealDetail(true);
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
              <div 
                key={meal.id} 
                className="rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleMealClick(meal)}
              >
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    // Fallback image if the original fails to load
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop';
                  }}
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

      <Dialog open={showMealDetail} onOpenChange={setShowMealDetail}>
        <DialogContent className="max-w-md">
          <DialogClose className="absolute right-4 top-4">
            <X size={18} className="text-gray-500" />
          </DialogClose>
          {selectedMeal && (
            <>
              <div className="mb-4 -mt-2 -mx-4">
                <img 
                  src={selectedMeal.image} 
                  alt={selectedMeal.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback image if the original fails to load
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop';
                  }}
                />
              </div>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedMeal.name}</DialogTitle>
                <div className="flex items-center gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{selectedMeal.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-fitness-secondary">
                    <Flame size={14} />
                    <span>{selectedMeal.calories} kCal</span>
                  </div>
                </div>
              </DialogHeader>
              <DialogDescription className="mt-4 text-sm text-gray-700">
                {selectedMeal.description}
              </DialogDescription>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Nutritional Information</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-fitness-gray-light rounded-lg p-2">
                    <p className="text-xs text-gray-500">Protein</p>
                    <p className="font-medium text-sm">{selectedMeal.nutritionalInfo.protein}g</p>
                  </div>
                  <div className="bg-fitness-gray-light rounded-lg p-2">
                    <p className="text-xs text-gray-500">Carbs</p>
                    <p className="font-medium text-sm">{selectedMeal.nutritionalInfo.carbs}g</p>
                  </div>
                  <div className="bg-fitness-gray-light rounded-lg p-2">
                    <p className="text-xs text-gray-500">Fats</p>
                    <p className="font-medium text-sm">{selectedMeal.nutritionalInfo.fats}g</p>
                  </div>
                  <div className="bg-fitness-gray-light rounded-lg p-2">
                    <p className="text-xs text-gray-500">Fiber</p>
                    <p className="font-medium text-sm">{selectedMeal.nutritionalInfo.fiber}g</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Ingredients</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="w-full mt-6 bg-fitness-primary text-white py-2 rounded-xl font-medium"
                onClick={() => {
                  showActionToast(`Added ${selectedMeal.name} to your meal plan`);
                  setShowMealDetail(false);
                }}
              >
                Add to Meal Plan
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietTracker;
