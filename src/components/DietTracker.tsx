
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
    },
    {
      id: 7,
      name: 'Masala Dosa',
      calories: 235,
      prepTime: '30 min',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Thin crispy rice and lentil crepe filled with spiced potato filling, served with coconut chutney and sambar.',
      ingredients: ['Rice flour', 'Urad dal', 'Potatoes', 'Mustard seeds', 'Curry leaves', 'Turmeric', 'Green chilies', 'Onions'],
      nutritionalInfo: {
        protein: 6,
        carbs: 45,
        fats: 4,
        fiber: 3
      }
    },
    {
      id: 8,
      name: 'Poha',
      calories: 170,
      prepTime: '15 min',
      image: 'https://www.cookwithmanali.com/wp-content/uploads/2014/08/Poha-Recipe-1014x1536.jpg',
      description: 'Flattened rice flakes tempered with mustard seeds, curry leaves, and mild spices, topped with fresh coriander and lemon juice.',
      ingredients: ['Flattened rice (poha)', 'Mustard seeds', 'Curry leaves', 'Onions', 'Green chilies', 'Turmeric', 'Lemon', 'Coriander'],
      nutritionalInfo: {
        protein: 4,
        carbs: 35,
        fats: 2,
        fiber: 2
      }
    },
    {
      id: 15,
      name: 'Idli Sambar',
      calories: 220,
      prepTime: '40 min',
      image: 'https://i0.wp.com/cookingwithpree.com/wp-content/uploads/2020/11/tiffin-sambar-instant-pot-1.jpg?w=1830&ssl=1',
      description: 'Soft, steamed rice cakes served with spicy lentil soup and coconut chutney. A South Indian breakfast staple.',
      ingredients: ['Rice', 'Urad dal', 'Fenugreek seeds', 'Toor dal', 'Mixed vegetables', 'Tamarind', 'Sambar powder', 'Coconut'],
      nutritionalInfo: {
        protein: 8,
        carbs: 40,
        fats: 3,
        fiber: 5
      }
    },
    {
      id: 16,
      name: 'Aloo Paratha',
      calories: 340,
      prepTime: '25 min',
      image: 'https://images.unsplash.com/photo-1683533761804-5fc12be0f684?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Whole wheat flatbread stuffed with spiced potato filling, typically served with yogurt and pickle. Popular North Indian breakfast.',
      ingredients: ['Whole wheat flour', 'Potatoes', 'Green chilies', 'Cumin', 'Coriander powder', 'Garam masala', 'Ghee', 'Yogurt'],
      nutritionalInfo: {
        protein: 7,
        carbs: 55,
        fats: 12,
        fiber: 4
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
    },
    {
      id: 9,
      name: 'Rajma Chawal',
      calories: 350,
      prepTime: '45 min',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
      description: 'Protein-rich kidney bean curry cooked with aromatic spices, served with steamed rice.',
      ingredients: ['Kidney beans', 'Onions', 'Tomatoes', 'Garlic', 'Ginger', 'Garam masala', 'Cumin', 'Rice'],
      nutritionalInfo: {
        protein: 15,
        carbs: 60,
        fats: 5,
        fiber: 15
      }
    },
    {
      id: 10,
      name: 'Paneer Tikka Wrap',
      calories: 420,
      prepTime: '30 min',
      image: 'https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-6.jpg',
      description: 'Tandoori-style grilled cottage cheese with vegetables wrapped in a whole wheat roti.',
      ingredients: ['Paneer', 'Bell peppers', 'Onions', 'Yogurt', 'Tandoori masala', 'Whole wheat roti', 'Mint chutney'],
      nutritionalInfo: {
        protein: 20,
        carbs: 40,
        fats: 18,
        fiber: 6
      }
    },
    {
      id: 17,
      name: 'Bisi Bele Bath',
      calories: 380,
      prepTime: '50 min',
      image: 'https://kannanskitchen.com/wp-content/uploads/2022/10/DSC_2152.jpg',
      description: 'Spicy rice dish with lentils, vegetables and aromatic spices from Karnataka, South India. Rich in protein and fiber.',
      ingredients: ['Rice', 'Toor dal', 'Mixed vegetables', 'Tamarind', 'Bisi Bele Bath powder', 'Ghee', 'Cashews', 'Curry leaves'],
      nutritionalInfo: {
        protein: 12,
        carbs: 65,
        fats: 9,
        fiber: 8
      }
    },
    {
      id: 18,
      name: 'Chole Bhature',
      calories: 650,
      prepTime: '60 min',
      image: 'https://images.unsplash.com/photo-1596522869169-95231d2b6864?q=80&w=2737&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: 'Spicy chickpea curry served with deep-fried bread. A beloved North Indian specialty perfect for special occasions.',
      ingredients: ['Chickpeas', 'Onions', 'Tomatoes', 'Ginger-garlic paste', 'Chole masala', 'All-purpose flour', 'Yogurt', 'Oil'],
      nutritionalInfo: {
        protein: 18,
        carbs: 90,
        fats: 25,
        fiber: 14
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
    },
    {
      id: 11,
      name: 'Dal Tadka with Roti',
      calories: 320,
      prepTime: '35 min',
      image: 'https://myfoodstory.com/wp-content/uploads/2016/09/Dhaba-Dal-Tadka-2.jpg',
      description: 'Yellow lentils tempered with cumin, garlic, and dried red chilies, served with whole wheat flatbread.',
      ingredients: ['Yellow lentils', 'Cumin seeds', 'Garlic', 'Dried red chilies', 'Turmeric', 'Ghee', 'Whole wheat flour', 'Coriander'],
      nutritionalInfo: {
        protein: 14,
        carbs: 50,
        fats: 7,
        fiber: 12
      }
    },
    {
      id: 12,
      name: 'Vegetable Biryani',
      calories: 380,
      prepTime: '60 min',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop',
      description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices, garnished with fried onions.',
      ingredients: ['Basmati rice', 'Mixed vegetables', 'Biryani masala', 'Saffron', 'Mint leaves', 'Fried onions', 'Yogurt', 'Ghee'],
      nutritionalInfo: {
        protein: 9,
        carbs: 65,
        fats: 10,
        fiber: 7
      }
    },
    {
      id: 19,
      name: 'Avial with Kerala Rice',
      calories: 340,
      prepTime: '40 min',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop',
      description: 'Traditional Kerala-style mixed vegetable curry in coconut yogurt sauce, served with red rice.',
      ingredients: ['Mixed vegetables', 'Coconut', 'Yogurt', 'Curry leaves', 'Green chilies', 'Cumin', 'Coconut oil', 'Kerala red rice'],
      nutritionalInfo: {
        protein: 8,
        carbs: 55,
        fats: 12,
        fiber: 9
      }
    },
    {
      id: 20,
      name: 'Butter Chicken with Naan',
      calories: 750,
      prepTime: '55 min',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop',
      description: 'Tender chicken pieces in rich, creamy tomato sauce, served with buttery naan bread. A North Indian restaurant favorite.',
      ingredients: ['Chicken', 'Tomatoes', 'Butter', 'Cream', 'Kashmiri red chili powder', 'Garam masala', 'Fenugreek leaves', 'All-purpose flour'],
      nutritionalInfo: {
        protein: 35,
        carbs: 60,
        fats: 40,
        fiber: 3
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
    },
    {
      id: 13,
      name: 'Samosa',
      calories: 180,
      prepTime: '45 min',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
      description: 'Crispy pastry filled with spiced potatoes and peas, served with mint and tamarind chutneys.',
      ingredients: ['All-purpose flour', 'Potatoes', 'Peas', 'Cumin seeds', 'Garam masala', 'Green chilies', 'Mint chutney', 'Tamarind chutney'],
      nutritionalInfo: {
        protein: 3,
        carbs: 25,
        fats: 8,
        fiber: 2
      }
    },
    {
      id: 14,
      name: 'Masala Chai with Mathri',
      calories: 160,
      prepTime: '15 min',
      image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=800&auto=format&fit=crop',
      description: 'Spiced Indian tea served with savory flaky biscuits.',
      ingredients: ['Black tea', 'Milk', 'Cardamom', 'Ginger', 'Cloves', 'All-purpose flour', 'Carom seeds', 'Black pepper'],
      nutritionalInfo: {
        protein: 4,
        carbs: 22,
        fats: 7,
        fiber: 1
      }
    },
    {
      id: 21,
      name: 'Medu Vada',
      calories: 180,
      prepTime: '30 min',
      image: 'https://cookwithdi.com/wp-content/uploads/2024/10/IMG_1462photo-full-1170x840.jpg',
      description: 'Crispy South Indian savory donuts made from urad dal, served with coconut chutney and sambar.',
      ingredients: ['Urad dal', 'Green chilies', 'Ginger', 'Curry leaves', 'Asafoetida', 'Coconut', 'Black pepper', 'Oil for frying'],
      nutritionalInfo: {
        protein: 6,
        carbs: 20,
        fats: 10,
        fiber: 3
      }
    },
    {
      id: 22,
      name: 'Aloo Tikki',
      calories: 210,
      prepTime: '25 min',
      image: 'https://sinfullyspicy.com/wp-content/uploads/2023/03/3-1.jpg',
      description: 'Spiced potato patties pan-fried until golden and crispy, topped with tangy chutneys and yogurt. A popular North Indian street food.',
      ingredients: ['Potatoes', 'Bread crumbs', 'Green peas', 'Cumin powder', 'Chaat masala', 'Coriander leaves', 'Green chutney', 'Tamarind chutney'],
      nutritionalInfo: {
        protein: 4,
        carbs: 30,
        fats: 9,
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
