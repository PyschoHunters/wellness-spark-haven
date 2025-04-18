
import React, { useState } from 'react';
import { X, ChefHat, Loader2, Utensils, Timer, Users, ArrowLeft, Plus, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showActionToast } from '@/utils/toast-utils';

interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  };
}

const HealthyRecipeGenerator = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length < 2) {
      showActionToast("Please add at least 2 ingredients");
      return;
    }

    setIsLoading(true);
    // Simulate API call - In a real app, this would call your backend
    setTimeout(() => {
      const mockRecipe: Recipe = {
        title: "Healthy Mediterranean Quinoa Bowl",
        description: "A nutritious and delicious bowl packed with proteins and fresh vegetables.",
        cookingTime: "25 minutes",
        servings: 2,
        ingredients: ingredients,
        instructions: [
          "Cook quinoa according to package instructions",
          "Chop all vegetables into bite-sized pieces",
          "Mix ingredients in a large bowl",
          "Add olive oil and season to taste",
          "Garnish with fresh herbs"
        ],
        nutritionalInfo: {
          calories: 420,
          protein: "15g",
          carbs: "45g",
          fats: "12g"
        }
      };
      setRecipe(mockRecipe);
      setIsLoading(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ChefHat className="text-fitness-primary" />
            Healthy Recipe Generator
          </h2>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>

        <div className="p-6">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What ingredients do you have?
            </label>
            <div className="flex gap-2 mb-4">
              <Input
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Enter an ingredient..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                className="flex-1"
              />
              <Button 
                onClick={handleAddIngredient}
                variant="outline"
                size="icon"
              >
                <Plus size={20} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="bg-fitness-primary/10 text-fitness-primary px-3 py-1 rounded-full flex items-center gap-2 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span>{ingredient}</span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="hover:bg-fitness-primary/20 rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerateRecipe}
            className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
            disabled={isLoading || ingredients.length < 2}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Utensils className="mr-2 h-4 w-4" />
            )}
            Generate Healthy Recipe
          </Button>

          {recipe && (
            <div className="mt-8 space-y-6 animate-fade-up">
              <div className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 p-6 rounded-2xl">
                <h3 className="text-2xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-3 rounded-xl text-center">
                    <Timer className="w-5 h-5 mx-auto mb-1 text-fitness-primary" />
                    <p className="text-sm font-medium">{recipe.cookingTime}</p>
                    <p className="text-xs text-gray-500">Cook Time</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-fitness-primary" />
                    <p className="text-sm font-medium">{recipe.servings} servings</p>
                    <p className="text-xs text-gray-500">Yield</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-center">
                    <ChefHat className="w-5 h-5 mx-auto mb-1 text-fitness-primary" />
                    <p className="text-sm font-medium">{recipe.nutritionalInfo.calories}</p>
                    <p className="text-xs text-gray-500">Calories</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4">
                  <h4 className="font-medium mb-2">Nutritional Information</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.protein}</p>
                      <p className="text-xs text-gray-500">Protein</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.carbs}</p>
                      <p className="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.fats}</p>
                      <p className="text-xs text-gray-500">Fats</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4">
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-600">{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthyRecipeGenerator;
