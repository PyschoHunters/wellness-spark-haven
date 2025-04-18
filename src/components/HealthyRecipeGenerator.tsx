
import React, { useState, useEffect } from 'react';
import { X, ChefHat, Loader2, Utensils, Timer, Users, ArrowLeft, Plus, AlertCircle, BookOpen, Bookmark, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showActionToast } from '@/utils/toast-utils';
import { supabase } from '@/integrations/supabase/client';

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
  const [error, setError] = useState<string | null>(null);
  const [popularIngredients] = useState([
    'Chicken', 'Eggs', 'Spinach', 'Tofu', 'Quinoa', 'Avocado', 'Sweet Potato',
    'Salmon', 'Brown Rice', 'Broccoli', 'Lentils', 'Greek Yogurt'
  ]);

  // Clear any error when component opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
    setCurrentIngredient('');
  };

  const handleQuickAdd = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length < 2) {
      showActionToast("Please add at least 2 ingredients");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: `Generate a healthy recipe using these ingredients: ${ingredients.join(', ')}. 
          The recipe MUST be provided ONLY as a valid JSON object with NO additional text or markdown formatting.
          Include title, description, cooking time, servings (2-4), detailed ingredients list with measurements, numbered instructions, and nutritional information (calories, protein, carbs, fats).
          
          Format exactly as this JSON structure with no other text:
          {
            "title": "Recipe Title",
            "description": "Brief description",
            "cookingTime": "30 min",
            "servings": 4,
            "ingredients": ["1 cup ingredient 1", "2 tbsp ingredient 2"],
            "instructions": ["Step 1 instruction", "Step 2 instruction"],
            "nutritionalInfo": {
              "calories": 350,
              "protein": "15g",
              "carbs": "30g",
              "fats": "12g"
            }
          }`,
          type: 'nutrition'
        }
      });

      if (supabaseError) {
        console.error('Error from Supabase:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (!data || !data.recommendation) {
        console.error('Invalid response from Gemini API:', data);
        throw new Error('Received invalid response from the AI service');
      }

      console.log('Raw recommendation:', data.recommendation);
      
      try {
        const parsedRecipe = JSON.parse(data.recommendation);
        
        // Validate the required fields exist
        if (!parsedRecipe.title || !parsedRecipe.instructions || !parsedRecipe.nutritionalInfo) {
          throw new Error('Generated recipe is missing required fields');
        }
        
        setRecipe(parsedRecipe);
        showActionToast("Recipe generated successfully!");
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError, data.recommendation);
        throw new Error('Failed to parse recipe data. The AI response was not in the expected format.');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe. Please try again.');
      showActionToast('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
            aria-label="Close recipe generator"
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
            <div className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Utensils className="mr-2 text-fitness-primary" size={18} />
                What ingredients do you have?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Enter the ingredients you have available, and we'll create a delicious healthy recipe for you!
              </p>
              
              <div className="flex gap-2 mb-5">
                <Input
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  placeholder="Enter an ingredient..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                  className="flex-1 border-fitness-primary/20 focus-visible:ring-fitness-primary"
                />
                <Button 
                  onClick={handleAddIngredient}
                  variant="outline"
                  size="icon"
                  className="hover:bg-fitness-primary/10 border-fitness-primary/20"
                >
                  <Plus size={20} />
                </Button>
                
                {ingredients.length > 0 && (
                  <Button 
                    onClick={handleClearIngredients}
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-50 border-red-200 text-red-500"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
              
              {/* Popular ingredients quick add */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Popular ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {popularIngredients.map((ingredient, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAdd(ingredient)}
                      className="text-xs bg-white px-3 py-1.5 rounded-full border border-fitness-primary/20 hover:bg-fitness-primary/5 transition-colors"
                    >
                      + {ingredient}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your ingredients list:</h3>
              {ingredients.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">No ingredients added yet</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-fitness-primary/10 text-fitness-primary px-3 py-1 rounded-full flex items-center gap-2 animate-fade-up shadow-sm"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-sm">{ingredient}</span>
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="hover:bg-fitness-primary/20 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Generation Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerateRecipe}
              className="w-full bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white shadow-lg hover:opacity-90 transition-opacity"
              disabled={isLoading || ingredients.length < 2}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Generate Healthy Recipe
                </>
              )}
            </Button>
          </div>

          {recipe && (
            <div className="mt-8 space-y-6 animate-fade-up">
              <div className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-semibold">{recipe.title}</h3>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Heart size={18} className="text-fitness-secondary" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Bookmark size={18} className="text-fitness-primary" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{recipe.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <Timer className="w-5 h-5 mx-auto mb-1 text-fitness-primary" />
                    <p className="text-sm font-medium">{recipe.cookingTime}</p>
                    <p className="text-xs text-gray-500">Cook Time</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <Users className="w-5 h-5 mx-auto mb-1 text-fitness-primary" />
                    <p className="text-sm font-medium">{recipe.servings} servings</p>
                    <p className="text-xs text-gray-500">Yield</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-center shadow-sm">
                    <ChefHat className="w-5 h-5 mx-auto mb-1 text-fitness-primary" />
                    <p className="text-sm font-medium">{recipe.nutritionalInfo.calories}</p>
                    <p className="text-xs text-gray-500">Calories</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Utensils className="mr-2 h-4 w-4 text-fitness-primary" />
                    Ingredients
                  </h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-fitness-primary mr-2 mt-2"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <h4 className="font-medium mb-2 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-fitness-primary" />
                    Instructions
                  </h4>
                  <ol className="list-decimal list-inside space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700 pl-1">
                        <span className="ml-2">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-medium mb-2 flex items-center">
                    <ChefHat className="mr-2 h-4 w-4 text-fitness-primary" />
                    Nutritional Information
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-fitness-primary/5 p-2 rounded-lg text-center">
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.calories}</p>
                      <p className="text-xs text-gray-500">Calories</p>
                    </div>
                    <div className="bg-fitness-primary/5 p-2 rounded-lg text-center">
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.protein}</p>
                      <p className="text-xs text-gray-500">Protein</p>
                    </div>
                    <div className="bg-fitness-primary/5 p-2 rounded-lg text-center">
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.carbs}</p>
                      <p className="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div className="bg-fitness-primary/5 p-2 rounded-lg text-center">
                      <p className="text-sm font-medium">{recipe.nutritionalInfo.fats}</p>
                      <p className="text-xs text-gray-500">Fats</p>
                    </div>
                  </div>
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
